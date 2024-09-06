document.addEventListener('DOMContentLoaded', () => {
  const player = videojs('my-video', {
    controls: true,
    autoplay: false,
    preload: 'auto',
    html5: {
      hls: {
        overrideNative: true
      }
    }
  });

  let channels = [];
  const channelsPerPage = 20;
  let currentPage = 1;

  // Função para verificar o status do canal
  async function checkChannelStatus(channel) {
    return new Promise((resolve) => {
      const tempVideo = document.createElement('video');
      const tempPlayer = videojs(tempVideo, {
        techOrder: ['html5'],
        html5: {
          hls: {
            overrideNative: true
          }
        }
      });

      tempPlayer.src({ src: channel.streamUrl, type: 'application/vnd.apple.mpegurl' });

      tempPlayer.on('loadedmetadata', () => {
        resolve({ ...channel, status: true });
        tempPlayer.dispose();
      });

      tempPlayer.on('error', () => {
        resolve({ ...channel, status: false });
        tempPlayer.dispose();
      });
    });
  }

  const worker = new Worker('/js/worker.js');

  // Mensagem quando o worker é iniciado
  console.log('Worker created.');

  worker.postMessage({ channels });
  console.log('Message sent to worker.');

  worker.onmessage = (event) => {
    console.log('Message received from worker:', event.data);

    channels = event.data.results.filter(channel => channel.status === true);
    if (channels.length === 0) {
      alert('Nenhum canal online encontrado.');
    }
    renderPage(1); // Renderiza a primeira página
  };

  worker.onerror = (error) => {
    console.error('Worker error:', error.message);
  };

  // Função para lidar com o clique no botão de upload
  document.getElementById('upload-button').addEventListener('click', () => {
    const file = document.getElementById('playlist').files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          channels = parseM3U(event.target.result).filter(channel => channel.status === 'online');
          if (channels.length === 0) {
            alert('Nenhum canal online encontrado no arquivo.');
          }
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
    const paginationNumbers = document.getElementById('pagination-numbers');
    paginationNumbers.innerHTML = '';

    const maxPageNumbers = 15;
    const halfPageNumbers = Math.floor(maxPageNumbers / 2);
    let startPage = Math.max(1, page - halfPageNumbers);
    let endPage = Math.min(totalPages, page + halfPageNumbers);

    if (endPage - startPage + 1 < maxPageNumbers) {
      if (startPage > 1) {
        endPage = Math.min(totalPages, endPage + (maxPageNumbers - (endPage - startPage + 1)));
      } else {
        startPage = Math.max(1, startPage - (maxPageNumbers - (endPage - startPage + 1)));
      }
    }

    if (startPage > 1) {
      paginationNumbers.innerHTML += `<li class="page-item"><button class="page-link" id="page-1">1</button></li>`;
      if (startPage > 2) {
        paginationNumbers.innerHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      const pageItem = document.createElement('li');
      pageItem.classList.add('page-item');
      if (i === page) {
        pageItem.classList.add('active');
      }
      pageItem.innerHTML = `<button class="page-link" id="page-${i}">${i}</button>`;
      paginationNumbers.appendChild(pageItem);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        paginationNumbers.innerHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
      }
      paginationNumbers.innerHTML += `<li class="page-item"><button class="page-link" id="page-${totalPages}">${totalPages}</button></li>`;
    }

    // Atualiza os botões de navegação
    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');

    prevButton.classList.toggle('disabled', page === 1);
    nextButton.classList.toggle('disabled', page === totalPages);

    prevButton.addEventListener('click', () => {
      if (page > 1) {
        renderPage(page - 1);
      }
    });

    nextButton.addEventListener('click', () => {
      if (page < totalPages) {
        renderPage(page + 1);
      }
    });

    // Adiciona event listeners para os botões de página
    document.querySelectorAll('.page-link').forEach(button => {
      button.addEventListener('click', () => {
        const pageNumber = parseInt(button.id.replace('page-', ''));
        if (pageNumber && pageNumber !== page) {
          renderPage(pageNumber);
        }
      });
    });

    // Função para navegação por teclado
    function handleKeyboardNavigation(event) {
      if (event.key === 'ArrowLeft' && page > 1) {
        renderPage(page - 1);
      } else if (event.key === 'ArrowRight' && page < totalPages) {
        renderPage(page + 1);
      }
    }

    // Adiciona evento para navegação por teclado
    document.addEventListener('keydown', handleKeyboardNavigation);
  }

  // Função para reproduzir um canal
  function playChannel(url) {
    player.src({ src: url, type: 'application/vnd.apple.mpegurl' });
    player.play();
  }

  // Inicializa a primeira página
  renderPage(1);
});
