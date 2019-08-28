const fs = require('fs');
const path = require('path');
const { expect } = require('chai');
const IdwallFormatter = require('../');

const readFile = (file) => fs.readFileSync(file).toString();

const inputText = readFile(path.resolve(__dirname, 'input.txt'));
const expectedOutput1 = readFile(path.resolve(__dirname, 'output', 'wrapped.txt'));
const expectedOutput2 = readFile(path.resolve(__dirname, 'output', 'justified.txt'));

const idwallFormatter = new IdwallFormatter();

describe('Manipulação de strings', () => {
  it('deve limitar o comprimento de cada linha do texto em 40 caracteres', () => {
    expect(idwallFormatter.format(inputText, 40)).to.equal(expectedOutput1);
  });

  it('deve justificar o texto com comprimento de 40 caracteres por linha', () => {
    expect(idwallFormatter.format(inputText, 40, true)).to.equal(expectedOutput2);
  });

  it('deve retornar texto vazio quando testado com um valor não string', () => {
    expect(idwallFormatter.format(10, 4, true)).to.equal('');
  });

  it('deve retornar o texto justificado a direita quando apenas uma palavra', () => {
    expect(idwallFormatter.format('a', 3, true)).to.equal('  a\n');
  });
});
