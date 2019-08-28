const formatThread = ({
  title, votes, subreddit, comments,thread,
}) => {
  return `
    ${title}
    Subreddit: ${subreddit}
    Pontuação: ${votes}
    Comentários: ${comments}
    Veja mais em: ${thread}
  `.replace(/^\s{1,}/gm, '');
};

module.exports = formatThread;
