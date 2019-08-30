require('dotenv').config();
const Telegraf = require('telegraf');
const RedditCrawler = require('./reddit-crawler');
const formatThread = require('./helpers/formatThread');

const { log } = console;

const redditCrawler = new RedditCrawler();

const { TELEGRAM_BOT_TOKEN: telegramBotToken } = process.env;

if (!telegramBotToken) {
  throw new Error(`Token para o bot Telegram não encontrado.
Verifique se a variável TELEGRAM_BOT_TOKEN está setada no PATH ou no arquivo .env`);
}

// Cria uma instância do bot.
const bot = new Telegraf(telegramBotToken);

log(`Telegram Bot iniciado.
Envie o comando /NadaPraFazer com os nomes de subreddits separados por ";" no Telegram`);

const BOT_WELCOME_MESSAGE = 'Seja bem vindo! 👋';
const BOT_ERROR_MESSAGE = 'Desculpa, não consegui obter as threads 😢';
const BOT_COULD_NOT_DETECT_SUBREEDDITS_MESSAGE = 'Desculpa, mas não entendi quais subreddits listar 🤔. Tente novamente';
const BOT_SEARCHING_THREADS_MESSAGE = 'Buscando threads, por favor aguarde...';
const BOT_EMPTY_THREAD_LIST_MESSAGE = 'Infelizmente nenhuma thread foi encontrada 😐. Tente novamente';

const handleBotCommand = async ({ message, reply }) => {
  const { text } = message;
  // Remove o comando do início do texto da mensagem recebida.
  // Por padrão, quando utilizamos o método 'command' do telegraf
  // ele retorna o nome do comando no início do texto.
  const subreddits = text.replace(/^\/nadaprafazer\s?/i, '');
  // Se a string de subreddits estiver vazia reponde com mensagem
  // de "não conseguiu entender os subreddits".
  if (!subreddits) {
    return reply(BOT_COULD_NOT_DETECT_SUBREEDDITS_MESSAGE);
  }
  // Envia mensagem de espera enquanto inicia a listagem.
  reply(BOT_SEARCHING_THREADS_MESSAGE);
  log(`Listando subreddits "${subreddits}"`);
  try {
    // Busca a lista de threads no crawler.
    const threads = await redditCrawler.getSubredditsHotThreads(subreddits);
    // Loga o número de threads encontradas.
    log(`${threads.length} thread(s) encontrada(s)`);
    // Caso as threads listadas e filtradas retornem uma lista vazia,
    // response com mensagem de "nenhuma thread encontrada".
    if (!threads || !threads.length) {
      return reply(BOT_EMPTY_THREAD_LIST_MESSAGE);
    }
    // Para cada thread listada:
    // - Formata a thread para texto
    // - Responde o chat com a thread listada
    threads
      .map((thread) => formatThread(thread))
      .forEach((thread) => reply(thread));
  } catch (exception) {
    // Caso ocorra falha no processo responde com mensagem
    // de erro genérica.
    log(exception);
    reply(BOT_ERROR_MESSAGE);
  }
  return null;
};

bot
  // Quando algum usuário entrar no chat do bot e executar
  // o commando /start o bot responde com uma mensagem de boas-vindas.
  .start(({ reply }) => reply(BOT_WELCOME_MESSAGE))
  // Trata o recebimento do comando /NadaPraFazer.
  .command('NadaPraFazer', handleBotCommand)
  // Inicia o bot.
  .launch();

// Antes que o processo node finalize, destrói o crawler.
process.on('exit', async () => redditCrawler.destroy());

module.exports = bot;
