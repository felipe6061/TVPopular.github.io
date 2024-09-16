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

## Como Utilizar

1. Clone o repositório para o seu ambiente local:
   ```bash
   git clone https://github.com/usuario/reprodutor-iptv.git
   ```

2. Navegue até o diretório do projeto:
   ```bash
   cd reprodutor-iptv
   ```

3. Abra o arquivo `index.html` em seu navegador para visualizar o sistema funcionando.

4. Para realizar o upload de um arquivo, clique no botão de upload, selecione o arquivo desejado e aguarde a confirmação do envio.

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

