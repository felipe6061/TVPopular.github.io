// Variáveis globais para armazenar os canais e o estado da página
let channels = [];
const channelsPerPage = 20;
let currentPage = 1;

// Função para lidar com o clique no botão de upload
document.getElementById('upload-button').addEventListener('click', () => {
  const file = document.getElementById('playlist').files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        channels = parseM3U(event.target.result).filter(channel => channel.status === 'online');
        renderPage(1); // Renderiza a primeira página
      } catch (error) {
        alert('Erro ao processar o arquivo: ' + error.message);
      }
    };
    reader.readAsText(file);
  } else {
    alert('Por favor, selecione um arquivo de playlist.');
  }
});

// Função para fazer o parsing do conteúdo M3U
function parseM3U(content) {
  return content.split('\n').reduce((acc, line) => {
    if (line.startsWith('#EXTINF:')) {
      const [ , rest ] = line.split(',');
      const details = rest.split(' ');
      const name = details[0];
      const logo = line.match(/tvg-logo="([^"]*)"/);
      acc.currentChannel = { 
        name: name.trim(), 
        logo: logo ? logo[1] : '', // Extrai o URL do logo
        status: 'online' 
      };
    } else if (line && !line.startsWith('#')) {
      if (acc.currentChannel) {
        acc.currentChannel.streamUrl = line.trim();
        acc.channels.push(acc.currentChannel);
        acc.currentChannel = null;
      }
    }
    return acc;
  }, { channels: [], currentChannel: null }).channels;
}


// Função para renderizar uma página de canais
function renderPage(page) {
  const channelsContainer = document.getElementById('channels');
  const startIndex = (page - 1) * channelsPerPage;
  const currentChannels = channels.slice(startIndex, startIndex + channelsPerPage);

  channelsContainer.innerHTML = '';
  currentChannels.forEach(channel => channelsContainer.appendChild(createChannelCard(channel)));
  updatePagination(page);
}

// Função para criar um card de canal
function createChannelCard(channel) {
  const channelDiv = document.createElement('div');
  channelDiv.classList.add('channel-item');

  const cardDiv = document.createElement('div');
  cardDiv.classList.add('card-item');

  // Adiciona uma classe de cor aleatória
  const colorClass = `card-color-${Math.floor(Math.random() * 4) + 1}`;
  cardDiv.classList.add(colorClass);

  // Cria o elemento do logo
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('channel-logo');
  if (channel.logo) {
    const logoImg = document.createElement('img');
    logoImg.src = channel.logo;
    logoImg.alt = `${channel.name} logo`;
    logoDiv.appendChild(logoImg);
  } else {
    logoDiv.innerText = 'No Logo';
  }
  
  cardDiv.appendChild(logoDiv);

  const contentDiv = document.createElement('div');
  contentDiv.classList.add('channel-content');
  contentDiv.innerHTML = `<div class="channel-title">${channel.name}</div>`;
  cardDiv.appendChild(contentDiv);

  cardDiv.addEventListener('click', () => playChannel(channel.streamUrl));

  channelDiv.appendChild(cardDiv);
  return channelDiv;
}

// Função para atualizar a paginação
function updatePagination(page) {
  const totalPages = Math.ceil(channels.length / channelsPerPage);

  // Atualiza a paginação na primeira estrutura
  const prevButton = document.getElementById('prev-page');
  const nextButton = document.getElementById('next-page');

  prevButton.classList.toggle('disabled', page === 1);
  nextButton.classList.toggle('disabled', page === totalPages);

  prevButton.onclick = () => {
    if (page > 1) {
      renderPage(page - 1);
    }
  };

  nextButton.onclick = () => {
    if (page < totalPages) {
      renderPage(page + 1);
    }
  };

  // Atualiza a paginação na segunda estrutura
  const prevButtonDup = document.getElementById('prev-page-dup');
  const nextButtonDup = document.getElementById('next-page-dup');

  prevButtonDup.classList.toggle('disabled', page === 1);
  nextButtonDup.classList.toggle('disabled', page === totalPages);

  prevButtonDup.onclick = () => {
    if (page > 1) {
      renderPage(page - 1);
    }
  };

  nextButtonDup.onclick = () => {
    if (page < totalPages) {
      renderPage(page + 1);
    }
  };
}

// Função para reproduzir um canal
function playChannel(url) {
  const player = videojs('player');
  player.src({ src: url, type: 'application/x-mpegURL' });
  player.play();
}

// Inicializa a primeira página
renderPage(1);
