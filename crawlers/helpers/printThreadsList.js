const formatThread = require('./formatThread');

const printThreadsList = (threads) => {
  console.log(threads.map(thread => formatThread(thread)).join('\n\n'));
};

module.exports = printThreadsList;
