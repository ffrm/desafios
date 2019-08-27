// Transforma o texto de votos de cada subreddit em valor inteiro.
const parseSubredditVotes = (votes) => {
  if (/k$/.test(votes)) {
    return parseFloat(votes.replace(/k$/, '')) * 1000;
  } else if (!isNaN(votes)) {
    return parseInt(votes);
  }
  return 0;
}

module.exports = parseSubredditVotes;
