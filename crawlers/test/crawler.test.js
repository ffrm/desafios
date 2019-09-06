const { expect } = require('chai');
const createCrawler = require('../createCrawler');

const redditCrawler = createCrawler();

describe('Crawlers', () => {
  it('deve retornar ao menos uma hot thread para o subreddit "AskReddit"', async () => {
    const threads = await redditCrawler.getSubredditsHotThreads('AskReddit');
    const containsAskRedditThreads = !!threads.find(({ subreddit }) => subreddit === 'AskReddit');
    expect(containsAskRedditThreads).to.equal(true);
  });
});
