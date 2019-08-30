#!/usr/bin/env node
const args = require('yargs').argv;
const createCrawler = require('./createCrawler');
const printThreadsList = require('./helpers/printThreadsList');

const { log } = console;

const redditCrawler = createCrawler();

// Obtém os argumentos da linha de comando que não
// possuem alias atrelado. Esta string encontrada representa
// a lista de subreddits que devem ser listados.
const { _: unamedArgs } = args;
// Unamed args irá retornar os argumentos em formato de array,
// portanto devemos obter apenas o primeiro argumento que representa
// o texto de subreddits de fato.
const [subreddits] = unamedArgs;

const exitWithoutError = () => process.exit(0);
const exitWithError = () => process.exit(1);

redditCrawler
  .getSubredditsHotThreads(subreddits)
  // Printa as threads no terminal.
  .then(printThreadsList)
  .then(exitWithoutError)
  .catch((exception) => {
    log(exception);
    exitWithError();
  });
