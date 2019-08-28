#!/usr/bin/env node
const args = require('yargs').argv;
const RedditCrawler = require('./reddit-crawler');
const printThreadsList = require('./helpers/printThreadsList');

const { _: unamedArgs } = args;
const [subreddits] = unamedArgs;

const redditCrawler = new RedditCrawler();

const destroyCrawler = async () => redditCrawler.destroy();

redditCrawler
  .getSubredditsHotThreads(subreddits)
  .then(printThreadsList)
  .then(destroyCrawler)
  .catch((exception) => {
    /* eslint-disable no-console */
    console.log(exception);
    destroyCrawler();
  });
