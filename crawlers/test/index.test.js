const { expect } = require('chai');

describe('Crawlers', () => {
  it('deve retornar ao menos uma hot thread para o subreddit "worldnews"', () => {
    expect(true).to.deep.include({ subreddit: 'worldnews' });
  });
});