TV Popular 
url - (https://tvstremingpopular2-3861e9c6feb3.herokuapp.com/)
---

# Reprodutor de Vídeos com Streaming de Canais IPTV

Este sistema é um reprodutor de vídeos com funcionalidades de streaming, focado na exibição de canais IPTV em uma interface de cards. Ele foi desenvolvido com base em bibliotecas como `video.js` para reprodução de vídeos e HLS (HTTP Live Streaming), além de outras tecnologias para criação de uma interface interativa e responsiva.

## Funcionalidades Principais

### 1. Reprodutor de Vídeos
- O sistema utiliza a biblioteca `video.js` para o reprodutor de vídeo, que oferece suporte para streaming de HLS.
- O arquivo `channelRenderer.js` é responsável por configurar o reprodutor de vídeo, com opções como desativar a inicialização de vídeos em baixa qualidade.

### 2. Interface de Usuário (UI)
- A interface exibe uma lista de canais IPTV na forma de **cards**, cada um contendo uma imagem e informações do canal.
- Os cards são criados dinamicamente por meio da função `createChannelCard(channel)`, que gera um card para cada canal com base nos dados fornecidos.
- Cada card possui um design responsivo, com efeitos de hover (animação ao passar o mouse) e estilização CSS para adaptabilidade em diferentes dispositivos.

### 3. Paginação
- A navegação entre canais é feita com um sistema de paginação, que permite carregar e exibir canais por grupos.
- As variáveis `currentPage`, `itemsPerPage` e `totalPages` controlam a página atual, a quantidade de itens por página e o total de páginas, respectivamente.
- Os botões de “Próxima Página” e “Página Anterior” permitem navegar pelos canais de forma dinâmica, sem recarregar a página inteira.

### 4. Upload de Arquivos
- O sistema inclui uma funcionalidade de upload, onde os usuários podem enviar arquivos (como listas de canais) para o servidor através de um formulário.
- O script `upload.js` gerencia esse processo, utilizando `fetch` para enviar o arquivo via POST, e exibe mensagens de sucesso ou erro dependendo da resposta do servidor.

### 5. Status Online/Offline
- O sistema monitora o status de conectividade do usuário (online ou offline) para garantir uma experiência adequada em situações de conexão instável.

## Estrutura dos Arquivos
- **index.html**: Arquivo principal da página, contendo a estrutura básica da interface e referências aos scripts e estilos.
- **channelRenderer.js**: Script responsável pela configuração do reprodutor de vídeo e pela renderização dos canais na interface.
- **upload.js**: Script para gerenciar o envio de arquivos via formulário.
- **style.css**: Arquivo de estilos CSS para o design e responsividade da interface.

Como Utilizar
1. Clonar o Repositório

Faça o clone do repositório para o seu ambiente local:

bash - git clone https://github.com/felipe6061/tvpopular.github.io.git

2. Acessar o Diretório do Projeto

Navegue até o diretório do projeto clonado:

bash - cd tvpopular.github.io

3. Instalar as Dependências

Instale as dependências do projeto para garantir o funcionamento correto:

bash - npm install

4. Executar o Servidor

Inicie o servidor Node.js com o seguinte comando:

bash - npm start

5. Acessar o Sistema

Abra o navegador e acesse o seguinte endereço para visualizar o sistema funcionando:

http://localhost:3000

6. Realizar Upload de Arquivo

Para fazer o upload de um arquivo:

    Acesse o sistema via navegador.
    Clique no botão de upload.
    Selecione o arquivo desejado (ex: um arquivo M3U).
    Aguarde a confirmação do envio e verifique os dados inseridos.

## Requisitos
- Um navegador moderno com suporte para HTML5 e JavaScript.
- Conexão à internet para streaming de canais IPTV.

## Tecnologias Utilizadas
- **HTML5** para a estrutura da página.
- **CSS3** para estilização e responsividade.
- **JavaScript (ES6+)** para funcionalidades dinâmicas.
- **video.js** para o reprodutor de vídeo com suporte a HLS.
- **Fetch API** para o envio de arquivos ao servidor.

## Contribuição
Se desejar contribuir para este projeto, sinta-se à vontade para abrir um pull request ou relatar problemas na aba de issues.

Contato

Para mais informações, você pode entrar em contato com os desenvolvedores:

    Felipe de Matos - felipe60061@estudante.ifb.edu.br
    João Pedro - joao56418@estudante.ifb.edu.br

Muito obrigado!




