# Manipulação de Strings
Implementa a solução para o desafio proposto de manipulação de strings. A manipulação deve ocorrer utilizando o método ```format``` da classe IdwallFormatter exportada por este pacote. Toda a explicação da solução está presente no código do script [lib/idwallFormatter.js](https://github.com/ffrm/desafios/blob/master/strings/lib/idwallFormatter.js)

## Usage
```javascript
const IdwallFormatter = require('idwall/strings');
const idwallFormatter = new IdwallFormatter();
idwallFormatter.format('...', 40, true);
```

### Parameters
| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| input | String | '' | Texto a ser processado. |
| limit | Integer | 40 | Comprimento máximo de cada linha do texto. |
| justify | Boolean | false | Se o texto deve ou não ser justificado de acordo com o comprimento setado no parâmetro anterior. |

## Test
```bash
npm run test
```

## Lint
```bash
npm run lint
```