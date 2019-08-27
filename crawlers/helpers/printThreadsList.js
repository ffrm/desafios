const printThreadsList = (threads) => {
  console.log(
    threads
      .map(({
        title,
        votes,
        subreddit,
        comments,
        thread,
      }) => `${title}\n${subreddit} - ${votes}\nComment: ${comments}\nSee more: ${thread}`)
      .join('\n\n')
  );
};

module.exports = printThreadsList;
