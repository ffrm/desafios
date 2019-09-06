const { expect } = require('chai');
const createCrawler = require('../createCrawler');

const redditCrawler = createCrawler();

describe('Crawlers', () => {
  it('deve retornar ao menos uma hot thread para o subreddit "worldnews"', async () => {
    const threads = await redditCrawler.getSubredditsHotThreads('worldnews');
    const containsWorldNewsThread = !!threads.find(({ subreddit }) => subreddit === 'worldnews');
    expect(containsWorldNewsThread).to.equal(true);
  });
});
