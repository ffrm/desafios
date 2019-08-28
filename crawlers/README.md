# Crawlers
Implementa uma solução para o desafio de Crawlers proposto.
Este módulo está dividido entre os seguintes arquivos:

- ```reddit-crawler``` - Web scraper para consultar as threads dos subreddits listados utilizando o Selenium webdriver.
- ```telegram-robot``` - Conecta ao robô do Telegram e aguarda pelo comando ```/NadaPraFazer```, busca a lista de threads utilizando o crawler e retorna as threads encontradas no chat.
- ```cli``` - CLI simples que exibe como texto formatado todos os resultados de threads através do crawler.

## Test
O script de teste irá executar o teste de integração aonde utilizando o ```reddit-crawler``` diretamente.
```bash
npm run test
```

## Lint
```bash
npm run lint
```

## CLI
Para o resultado da ```primeira etapa deste teste```, podemos listar os subreddits diretamente pela CLI. Esta simples CLI irá criar uma instância do ```reddit-crawler``` e a utilizará diretamente. A lista de threads encontradas serão apresentadas na tela como texto(formatado).
```bash
npm run cli AskReddit;worldnews

# ou caso tenha o chromedriver instalado e setado na máquina:
./cli.js AskReddit;worldnews
```

## Telegram
Para a visualização dos resultados da ```segunda etapa deste teste``` teremos que criar e configurar um novo robô do Telegram e iniciar uma instância deste robô.

### Criando e configurando um novo robô

- Instalar o aplicativo Telegram
- Buscar pelo chat "BotFather"
- Digitar o comando ```/newbot```
- Entrar nome e username para o bot
- Copiar o token do bot exibido no fim da criação
- Criar ou editar o arquivo ```.env``` nesta pasta e setar a chave ```TELEGRAM_BOT_TOKEN``` com o valor copiado no passo anterior

- [Iniciar o robô](#iniciando-o-robô)
- Abrir o chat com o bot criado e digitar ```/NadaPraFazer + lista de subreddits separados por ;```

### Iniciando o robô
Para utilizar o robô previamente criado devemos inicializar o serviço de bot do arquivo ```telegram-bot```. O serviço do robô utilizará o ```reddit-crawler``` para buscar todas as threads dos subreddits inseridos. O robô pode ser iniciado das seguintes formas:

#### Manual
O robô pode ser iniciado de forma manual através do script ```bot```:
```bash
npm run bot
```

#### Docker 🐳
A solução Docker proposta utiliza o ```docker-compose``` para subir dois serviços. O primeiro serviço se refere ao robô propriamente dito e o segundo serviço se refere ao server do Selenium (executado na porta 4444) disponível para Docker. Desta forma, o driver do selenium será criado utilizando este segundo serviço. Para iniciar o robô, basta executar:
```bash
docker-compose build && docker-compose up
```
