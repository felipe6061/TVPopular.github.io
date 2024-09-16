Projeto desenvolvido pelos alunos do curso técnico em Desenvolvimento de Sistemas no IFB.
---

# TV Popular

**URL do projeto**: [TV Popular - Heroku](https://tvstremingpopular2-3861e9c6feb3.herokuapp.com/)

---

## 📺 Reprodutor de Vídeos com Streaming de Canais IPTV

Este projeto é um sistema de streaming que permite a exibição de canais IPTV através de uma interface dinâmica e amigável. Utilizando bibliotecas como `video.js` e HLS (HTTP Live Streaming), o sistema entrega uma experiência fluida e responsiva para usuários.

### 🚀 Funcionalidades Principais

#### 1. **Reprodutor de Vídeos**
- Utiliza a biblioteca `video.js` com suporte ao streaming HLS, garantindo reprodução de vídeos em alta qualidade.
- O script `channelRenderer.js` configura o reprodutor, evitando a inicialização de vídeos em baixa qualidade.

#### 2. **Interface de Usuário (UI)**
- Apresenta uma lista de canais IPTV em formato de **cards**, que mostram uma imagem e informações detalhadas sobre cada canal.
- Cards gerados dinamicamente com a função `createChannelCard(channel)`, tornando a interface interativa e customizável.
- Design **responsivo** para diferentes tamanhos de tela, com efeitos de hover e animações CSS.

#### 3. **Paginação Dinâmica**
- Sistema de navegação por **paginação**, permitindo exibir canais em grupos controlados por variáveis como `currentPage` e `itemsPerPage`.
- Controles intuitivos para navegar entre os canais (Próxima/Anterior página).

#### 4. **Upload de Arquivos**
- Função de upload para envio de arquivos, como listas de canais em formato M3U, via formulário.
- Script `upload.js` gerencia o processo de upload e fornece feedback visual ao usuário sobre o status da operação.

#### 5. **Status de Conectividade**
- O sistema monitora o status de conectividade do usuário (online/offline), ajustando a experiência em caso de instabilidade.

---

## 🗂️ Estrutura dos Arquivos

- **index.html**: Estrutura principal da página e ponto de entrada da interface.
- **channelRenderer.js**: Renderiza os canais e configura o reprodutor de vídeo.
- **upload.js**: Gerencia o upload de arquivos de lista de canais.
- **style.css**: Arquivo de estilos para o design e a responsividade.

---

## 📖 Como Utilizar

### 1. Clonar o Repositório

```bash
git clone https://github.com/felipe6061/tvpopular.github.io.git
```

### 2. Acessar o Diretório do Projeto

```bash
cd tvpopular.github.io
```

### 3. Instalar Dependências

Instale as dependências necessárias com o seguinte comando:

```bash
npm install
```

### 4. Executar o Servidor

Para iniciar o servidor, utilize o comando:

```bash
npm start
```

### 5. Acessar o Sistema

Abra seu navegador e vá para `http://localhost:3000` para acessar o sistema.

### 6. Realizar Upload de Arquivos

1. Clique no botão de upload.
2. Selecione o arquivo M3U desejado.
3. Aguarde a confirmação de envio.

---

## 📋 Requisitos

- Navegador moderno com suporte a HTML5 e JavaScript.
- Conexão estável à internet para streaming de IPTV.

---

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura da página.
- **CSS3**: Estilização e design responsivo.
- **JavaScript (ES6+)**: Funcionalidades dinâmicas e interatividade.
- **video.js**: Reprodutor de vídeo com suporte a HLS.
- **Fetch API**: Envio de arquivos ao servidor.

---

## 👥 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir um pull request ou relatar problemas na aba de issues.

---

## ✉️ Contato

Para mais informações, entre em contato com os desenvolvedores:

- **Felipe de Matos**: felipe60061@estudante.ifb.edu.br
- **João Pedro**: joao56418@estudante.ifb.edu.br

---

Muito obrigado por utilizar o TV Popular!

---

### Melhoria Geral:

1. **Estrutura do Conteúdo**: Organizei as informações em seções lógicas e claras, com subtítulos visuais e ícones para facilitar a navegação.
2. **Instruções**: Tornei o processo de configuração mais intuitivo, com comandos em blocos de código.
3. **Visualização**: O uso de ícones e negritos destaca funcionalidades e facilita a leitura rápida.

Essas melhorias tornam o README mais acessível e informativo tanto para desenvolvedores quanto para usuários finais.
