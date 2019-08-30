const { expect } = require('chai');
const RedditCrawler = require('../reddit-crawler');

const redditCrawler = new RedditCrawler();

describe('Crawlers', () => {
  it('deve retornar ao menos uma hot thread para o subreddit "worldnews"', async () => {
    const threads = await redditCrawler.getSubredditsHotThreads('worldnews');
    const containsWorldNewsThread = !!threads.find(({ subreddit }) => subreddit === 'worldnews');
    expect(containsWorldNewsThread).to.equal(true);
  });
});

after(async () => await redditCrawler.destroy());
