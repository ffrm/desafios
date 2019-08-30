#!/usr/bin/env node
const args = require('yargs').argv;
const RedditCrawler = require('./reddit-crawler');
const printThreadsList = require('./helpers/printThreadsList');

const log = console.log;

// Obtém os argumentos da linha de comando que não
// possuem alias atrelado. Esta string encontrada representa
// a lista de subreddits que devem ser listados.
const { _: unamedArgs } = args;
// Unamed args irá retornar os argumentos em formato de array,
// portanto devemos obter apenas o primeiro argumento que representa
// o texto de subreddits de fato.
const [subreddits] = unamedArgs;

// Cria uma instância do crawler.
const redditCrawler = new RedditCrawler();

// Alias para a função de destruir o crawler. Irá ser
// executada abaixo sempre depois de encontrar e listar
// todas as threads.
const destroyCrawler = async () => redditCrawler.destroy();

redditCrawler
  .getSubredditsHotThreads(subreddits)
  // Printa as threads no terminal.
  .then(printThreadsList)
  .then(destroyCrawler)
  .catch((exception) => {
    log(exception);
    destroyCrawler();
  });
