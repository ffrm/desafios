// Exporta a classe IdwallFormatter que possui apenas o método format.
// Neste método ocorre a limitação das linhas do texto em um determinado
// comprimento (setado no parâmetro limit) e a justificação das linhas do
// passo anterior.
// Nota: As etapas do método format poderiam ser divididas em funções puras.
// Por exemplo, a redução do array de palavras em linhas limitadas ao
// dado comprimento poderia ser refatorada dentro da seguinte função:
// const wrapText = (text, limit) => text.split(...).reduce(...);
// E a tranformação do array de linhas em linhas justificadas poderia
// ser refatorada dentro da seguinte função:
// const justifyText = (lines, limit) => lines.map(...);

class IdwallFormatter {
  /* eslint-disable class-methods-use-this */
  format(input = '', limit = 40, justify = false) {
    let text = input;
    if (typeof text !== 'string') {
      // Se texto não for do tipo string e nem puder ser parseado
      // para string, então retorna string vazia como default.
      if (typeof text.toString() !== 'function') {
        return '';
      }
      text = text.toString();
    }
    return text
      // Quebra o texto em palavras.
      .split(/\s|\n/)
      // Reduz a lista de palavras em um subconjunto
      // de palavras, representando as linhas limitadas ao
      // tamanho de caracteres do 'limit'.
      .reduce((lines, word) => {
        // Se for uma palavra vazia, significa que essa
        // palavra representa uma quebra de linha e portanto adiciona a quebra
        // de linha na lista e adiciona uma próxima linha em branco imediatamente.
        if (/^$/.test(word)) {
          return lines.concat(['\n', '']);
        }
        // Detecta a última string de linha da redução (retira da lista se existente).
        let line = lines.length ? lines.pop() : '';
        // Se adicionar a palavra atual na última linha resultar
        // em uma linha maior do que permitida, então salva de volta
        // a última linha dentro da redução e cria uma nova linha apenas
        // com a palavra atual.
        if (line.length + word.length >= limit) {
          lines.push(line);
          line = word;
        } else {
          // Se o comprimento da linha atual com a nova palavra ainda for
          // menor do que o limite, daí então concatena a nova palavra na
          // última linha (com um espaçamento entre as palavras).
          line += line.trim() ? ` ${word}` : word;
        }
        // Recoloca a última linha processada na redução.
        lines.push(line);
        // Retorna a lista de linhas.
        return lines;
      }, [])
      // Justifica cada linha da redução quando a variável
      // 'justify' for verdadeira.
      .map((line) => {
        // Se não deve justificar, retorna imediatamente a mesma linha,
        // ou se a linha for uma simples quebra de linha.
        if (!justify || /\n/.test(line)) {
          return line;
        }
        // Calcula a quantidade de caracteres faltantes para alcançar
        // o tamanho do limite de linha.
        let missing = limit - line.length;
        // E caso não tiver caracter para adicionar, retorna a linha original.
        if (!missing) return line;
        // Quebra linha em array de palavras e enquanto tiver espaços
        // faltantes para adicionar irá alocar novos espaços entre as
        // palavras da linha.
        const words = line.split(/\s/);
        // Quando a linha tiver apenas uma palavra(sem espaços)
        // deve retornar o texto alinhado a direita com todos os
        // espaços faltantes à esquerda.
        if (words.length === 1) {
          let pad = '';
          for (let i = 0; i < missing; i += 1) pad += ' ';
          return pad + line;
        }
        const lastIndex = words.length - 1;
        let index = 0;
        while (missing) {
          if (index === lastIndex) {
            index = 0;
          }
          words[index] += ' ';
          index += 1;
          missing -= 1;
        }
        // Por fim, retorna todas as palavras concatenadas por espaços,
        // garantindo que os espaçamentos que eram necessários estaram dentro
        // de cada palavra do array.
        return words.join(' ');
      })
      // Remove linhas que contenham quebra de linha setadas anteriormente,
      // pois as linhas já serão reconcatenadas com quebra.
      .map((line) => line.replace(/^\n$/, ''))
      // Concatena todas as linhas para texto novamente.
      .join('\n')
      // Adiciona linha extra ao fim do texto.
      .concat('\n');
  }
}

module.exports = IdwallFormatter;
