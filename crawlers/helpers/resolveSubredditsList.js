// Quebra a string de subreddits de input separadas
// por ';' em um array de (nomes) subreddits.
const resolveSubredditsList = (text) => {
  // Se não receber uma string, retorna array vazio.
  if (typeof text !== 'string') {
    return [];
  }
  return text
    .split(';')
    // Remove algum subreddit mal informado da lista.
    .filter(subreddit => subreddit.trim());
};

module.exports = resolveSubredditsList;
