require('dotenv').config();
const Telegraf = require('telegraf');
const RedditCrawler = require('./reddit-crawler');
const formatThread = require('./helpers/formatThread');

const redditCrawler = new RedditCrawler();

const { TELEGRAM_BOT_TOKEN: telegramBotToken } = process.env;

if (!telegramBotToken) {
  throw new Error(`Token para o bot Telegram não encontrado.
Verifique se a variável TELEGRAM_BOT_TOKEN está setada no PATH ou no arquivo .env`);
}

const bot = new Telegraf(telegramBotToken);

console.log(`Telegram Bot iniciado.
Envie o comando /NadaPraFazer com os nomes de subreddits separados por ";" no Telegram`);

const BOT_WELCOME_MESSAGE = 'Seja bem vindo! 👋';
const BOT_ERROR_MESSAGE = 'Desculpa, não consegui obter as threads 😢';
const BOT_COULD_NOT_DETECT_SUBREEDDITS_MESSAGE = 'Desculpa, mas não entendi quais subreddits listar 🤔. Tente novamente';
const BOT_SEARCHING_THREADS_MESSAGE = 'Buscando threads, por favor aguarde...';
const BOT_EMPTY_THREAD_LIST_MESSAGE = 'Infelizmente nenhuma thread foi encontrada 😐. Tente novamente';

bot
  .start(({ reply }) => reply(BOT_WELCOME_MESSAGE))
  .command('NadaPraFazer', async ({ message, reply }) => {
    const { text } = message;
    const subreddits = text.replace(/^\/NadaPraFazer\s?/i, '');
    if (!subreddits) {
      return reply(BOT_COULD_NOT_DETECT_SUBREEDDITS_MESSAGE);
    }
    reply(BOT_SEARCHING_THREADS_MESSAGE);
    console.log(`Listando subreddits "${subreddits}"…`);
    try {
      const threads = await redditCrawler.getSubredditsHotThreads(subreddits);
      console.log(`${threads.length} thread(s) encontrada(s).`);
      if (!threads || !threads.length) {
        return reply(BOT_EMPTY_THREAD_LIST_MESSAGE);
      }
      threads.map(thread => formatThread(thread)).forEach(thread => reply(thread));
    } catch (exception) {
      console.log(exception);
      reply(BOT_ERROR_MESSAGE);
    }
  })
  .launch();

process.on('exit', async () => await redditCrawler.destroy());