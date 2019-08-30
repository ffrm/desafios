/* eslint-disable no-underscore-dangle */
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const parseSubredditVotes = require('./helpers/parseSubredditVotes');
const resolveSubredditsList = require('./helpers/resolveSubredditsList');

const { log } = console;

// Salva boolean para saber se processo está sendo ou não
// executado dentro de um container do Docker. Será utilizado
// para criar um novo driver do selenium.
const IS_RUNNING_ON_DOCKER = !!process.env.DOCKER;

const REDDIT_URL = 'https://old.reddit.com';
const SUBREDDIT_URL = `${REDDIT_URL}/r`;
const PAGE_LOAD_MAX_WAIT_TIME = 3000;
const HOT_THREADS_MIN_VOTES = 5000;
const THREAD_SELECTOR = '.thing';
const THREAD_TITLE_SELECTOR = '[data-event-action="title"]';
const THREAD_VOTES_SELECTOR = '.unvoted';
const THREAD_SUBREDDIT_ATTR_NAME = 'data-subreddit';
const THREAD_COMMENTS_URL_SELECTOR = '[data-event-action="comments"]';
const THREAD_URL_SELECTOR = '[data-event-action="title"]';

// Função para concatenar a string de subreddit junto ao domínio e endpoint
// de subreddits do old.reddit.
const resolveSubredditUrl = (subreddit) => `${SUBREDDIT_URL}/${subreddit}`;

// Cria um driver selenium que conectará utilizando o serviço
// Selenium Hub criado pelo Docker.
const createSeleniumDriverForDocker = async () => new Builder()
  .forBrowser('chrome')
  .usingServer('http://selenium:4444/wd/hub')
  .setChromeOptions(new chrome.Options().headless())
  .build();

// Cria um driver selenium que utilizará do chrome direto no host.
// Utilize este método quando este módulo for iniciado pelo node.
// ! Importante: Necessária a instalação do chrome na máquina neste caso.
const createSeleniumDriver = async () => new Builder()
  .forBrowser('chrome')
  .setChromeOptions(new chrome.Options().headless())
  .build();

class RedditCrawler {
  async createDriver() {
    this.driver = IS_RUNNING_ON_DOCKER
      ? await createSeleniumDriverForDocker()
      : await createSeleniumDriver();
  }

  async getDriver() {
    if (!this.driver) {
      log('Criando driver selenium…');
      await this.createDriver();
      log('Driver criado com sucesso!');
    }
    return this.driver;
  }

  async destroy() {
    log('\nDestruíndo crawler…');
    const { driver } = this;
    if (driver) {
      return driver.quit();
    }
    return null;
  }

  // Este método recebe um texto contendo o nome de todos os subreddits
  // que devem ser listados. Os subreddits devem ser separados por ';'
  async getSubredditsHotThreads(subreddits) {
    // Transforma o texto de subreddits em um array de subreddits.
    const subredditsList = resolveSubredditsList(subreddits);
    // Após a listagem das threads as mesmas irão ser resolvidas em um array bidimensional.
    // Aplica um reduce neste array de resultado para retornar o mesmo em apenas uma dimensão.
    const reduceThreadsList = (threads) => threads.reduce((a, b) => a.concat(b), []);
    // Aguarda as promises de todos os subreddits que estão sendo listados e por fim
    // retorna a lista de threads de forma "reduzida".
    return Promise.all(
      subredditsList.map((subreddit) => this._getSubredditHotThreads(subreddit)),
    ).then(reduceThreadsList);
  }

  // Lista todas as threads de um único subreddit.
  // Este método privado deve ser apenas chamado através do método
  // público 'getSubredditsHotThreads' para cada subreddit informado.
  async _getSubredditHotThreads(subreddit) {
    const subredditUrl = resolveSubredditUrl(subreddit);

    log(subreddit, '-', `Listando "${subreddit}" subreddit…`);

    const driver = await this.getDriver();

    const loadPage = async () => {
      log(subreddit, '-', `Carregando: ${subredditUrl}`);
      log(subreddit, '-', 'Aguardando carregamento da página…');
      await driver.get(subredditUrl);
      await driver.wait(until.elementLocated(By.css(THREAD_SELECTOR)), PAGE_LOAD_MAX_WAIT_TIME);
      log(subreddit, '-', 'Página carregada com sucesso!');
    };

    const getThreads = async () => driver.findElements(By.css(THREAD_SELECTOR));

    // Recebe o elemento da thread e o método que deve ser executado em cima do elemento
    // para obter a informação desejada. O último parâmetro pode receber um valor default
    // para eventuais exceptions não quebrarem a listagem de outras propriedades da thread.
    const getThreadProperty = async (thread, method, dflt) => {
      try {
        return method(thread);
      } catch (exception) {
        log(subreddit, '-', exception);
        return dflt || null;
      }
    };

    const getThreadTitle = async (thread) => getThreadProperty(thread, (el) => (
      el.findElement(By.css(THREAD_TITLE_SELECTOR)).getText()
    ), '');

    const getThreadVotes = async (thread) => getThreadProperty(thread, async (el) => {
      const votes = await el.findElement(By.css(THREAD_VOTES_SELECTOR)).getText();
      return parseSubredditVotes(votes);
    }, 0);

    const getThreadSubreddit = async (thread) => getThreadProperty(thread, (el) => (
      el.getAttribute(THREAD_SUBREDDIT_ATTR_NAME)
    ), '');

    const getThreadCommentsUrl = async (thread) => getThreadProperty(thread, (el) => (
      el.findElement(By.css(THREAD_COMMENTS_URL_SELECTOR)).getAttribute('href')
    ), '');

    const getThreadUrl = async (thread) => getThreadProperty(thread, (el) => (
      el.findElement(By.css(THREAD_URL_SELECTOR)).getAttribute('href')
    ), '');

    // Recebe o elemento web que representa o tópico da thread e busca
    // dentro deste elemento todos os demais elementos aonde estão os textos
    // das propriedades da thread.
    // Retornrá um json contendo todas as propriedades da thread pedidas no desafio.
    const describeThread = async (thread) => {
      const title = await getThreadTitle(thread);
      const votes = await getThreadVotes(thread);
      const subredditName = await getThreadSubreddit(thread);
      const commentsUrl = await getThreadCommentsUrl(thread);
      const threadUrl = await getThreadUrl(thread);
      return {
        title,
        votes,
        subreddit: subredditName,
        comments: commentsUrl,
        thread: threadUrl,
      };
    };

    const describeThreadsList = async (threads) => {
      log(subreddit, '-', 'Listando threads…');
      return Promise.all(threads.map((thread) => describeThread(thread)));
    };

    const filterHotThreads = (threads) => (
      threads.filter(({ votes }) => votes >= HOT_THREADS_MIN_VOTES)
    );

    // Aguarda a página do subreddit ser carregada.
    await loadPage();
    // Lista todos os elementos de threads na tela.
    const threadsList = await getThreads();
    // Transforma a lista de elementos que representam as threads
    // em objetos com a propriedades requisitadas de thread.
    const threads = await describeThreadsList(threadsList);
    // Filtra a lista de threads trazendo apenas as que tiverem
    // a propriedade de upvotes maior que o HOT_THREADS_MIN_VOTES.
    const hotThreads = filterHotThreads(threads);
    // Return as threads.
    return hotThreads;
  }
}

module.exports = RedditCrawler;
