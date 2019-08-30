// Esta classe facilita a criação e destruição do crawler
// antes que o processo node seja fechado. Este processo
// de destruição se baseia na destruição do driver selenium criado.
const RedditCrawler = require('./reddit-crawler');

let crawler;

const createCrawler = () => {
  if (!crawler) {
    crawler = new RedditCrawler();
  }
  return crawler;
};

const destroyCrawler = async () => crawler && crawler.destroy();
const exit = () => process.exit();

process
  .on('exit', destroyCrawler)
  .on('SIGINT', exit)
  .on('SIGUSR1', exit)
  .on('SIGUSR2', exit)
  .on('uncaughtException', exit);

module.exports = createCrawler;