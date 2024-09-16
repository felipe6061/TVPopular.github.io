document.addEventListener('DOMContentLoaded', () => {
  const player = videojs('player', {
    html5: {
      hls: {
        enableLowInitialPlaylist: false,
        overrideNative: true,
        useDevicePixelRatio: true
      }
    }
  });

  const channelsContainer = document.getElementById('channels');
  const paginationNumbers = document.getElementById('pagination-numbers');
  const prevPageButton = document.getElementById('prev-page');
  const nextPageButton = document.getElementById('next-page');

  if (!channelsContainer ||!paginationNumbers ||!prevPageButton ||!nextPageButton) {
    console.error('Elementos não encontrados no DOM.');
    return;
  }

  let currentPage = 1;
  const itemsPerPage = 20; // Ajuste conforme necessário para a quantidade desejada
  const totalItems = 7000; // Ajuste conforme necessário
  let totalPages = Math.ceil(totalItems / itemsPerPage);

  // Função para criar um card de canal
  function createChannelCard(channel) {
    const channelDiv = document.createElement('div');
    channelDiv.classList.add('card', 'ag-courses_item');

    const channelImage = document.createElement('img');
    channelImage.src = channel.image || 'placeholder.jpg';
    channelImage.alt = channel.name;
    channelDiv.appendChild(channelImage);

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('content', 'ag-courses-item_link');
    channelDiv.appendChild(contentDiv);

    const titleDiv = document.createElement('div');
    titleDiv.classList.add('title', 'ag-courses-item_title');
    titleDiv.textContent = channel.name;
    contentDiv.appendChild(titleDiv);

    const bgDiv = document.createElement('div');
    bgDiv.classList.add('ag-courses-item_bg');
    contentDiv.appendChild(bgDiv);

    // Adicionar botões de status
    const statusDiv = document.createElement('div');
    statusDiv.classList.add('status');
    statusDiv.textContent = 'Status: Online';
    statusDiv.style.color = 'green'; // Cor padrão para online
    contentDiv.appendChild(statusDiv);

    // Adicionar botões de funcionamento
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');
    contentDiv.appendChild(buttonContainer);

    const onButton = document.createElement('button');
    onButton.textContent = 'On';
    onButton.classList.add('btn', 'btn-success', 'btn-sm','mr-2');
    onButton.addEventListener('click', () => {
      alert(`${channel.name} está funcionando.`);
    });

    const offButton = document.createElement('button');
    offButton.textContent = 'Off';
    offButton.classList.add('btn', 'btn-danger', 'btn-sm');
    offButton.addEventListener('click', () => {
      alert(`${channel.name} não está funcionando.`);
    });

    buttonContainer.appendChild(onButton);
    buttonContainer.appendChild(offButton);

    // Adiciona evento de clique para reproduzir o vídeo
    channelDiv.addEventListener('click', () => {
      if (channel.streamUrl && channel.streamUrl.endsWith('.m3u8')) {
        try {
          player.src({
            src: channel.streamUrl,
            type: 'application/x-mpegURL'
          });
          player.play();
        } catch (error) {
          console.error('Erro ao reproduzir vídeo:', error);
          alert('Erro ao reproduzir vídeo');
        }
      } else {
        alert('URL de stream inválida.');
      }
    });

    return channelDiv; // Retorna apenas o card
  }

  // Função para buscar e renderizar canais
  async function fetchAndRenderChannels(page) {
    try {
      const response = await fetch(`/api/canais?page=${page}&perPage=${itemsPerPage}`);
      if (!response.ok) {
        throw new Error(`Erro ao buscar canais: ${response.status}`);
      }
      const data = await response.json();
      if (!data.channels) {
        throw new Error('A resposta da API não contém a lista de canais.');
      }

      channelsContainer.innerHTML = ''; // Limpa o conteúdo anterior

      // Verificar status e criar cards somente para canais online
      const fetchStatusPromises = data.channels.map(async (channel) => {
        const status = await checkChannelStatus(channel.streamUrl);
        if (status === 'online') {
          const card = createChannelCard(channel);
          channelsContainer.appendChild(card);
        }
      });

      await Promise.all(fetchStatusPromises); // Espera todas as verificações de status serem concluídas
    } catch (error) {
      console.error('Erro ao buscar canais:', error);
      alert('Erro ao buscar canais');
    }
  }

  // Função para verificar o status do canal
  async function checkChannelStatus(url) {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok? 'online' : 'offline';
    } catch (error) {
      console.error('Erro ao verificar status do canal:', error);
      return 'offline';
    }
  }

  // Função para configurar a paginação
  function setupPagination() {
    paginationNumbers.innerHTML = '';

    const maxVisiblePages = 10;
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adicionar botão "Anterior"
    if (currentPage > 1) {
      paginationNumbers.appendChild(createPaginationButton('Anterior', () => {
        currentPage--;
        updatePage();
      }));
    }

    // Adicionar botões de páginas
    for (let i = startPage; i <= endPage; i++) {
      const pageButton = document.createElement('li');
      pageButton.classList.add('page-item');
      if (i === currentPage) {
        pageButton.classList.add('active'); // Destaca a página atual
      }
      pageButton.innerHTML = `<button class="page-link">${i}</button>`;
      pageButton.querySelector('button').addEventListener('click', () => {
        currentPage = i;
        updatePage();
      });
      paginationNumbers.appendChild(pageButton);
    }

    // Adicionar botão "Atualizar"
    const refreshButton = document.getElementById('refresh-button');
    refreshButton.addEventListener('click', () => {
      updatePage();
});


    // Adicionar botão "Próximo"
    if (currentPage < totalPages) {
      paginationNumbers.appendChild(createPaginationButton('Próximo', () => {
        currentPage++;
        updatePage();
      }));
    }
  }

  // Função para criar botões de paginação
  function createPaginationButton(text, onClick) {
    const button = document.createElement('li');
    button.classList.add('page-item');
    button.innerHTML = `<button class="page-link">${text}</button>`;
    button.querySelector('button').addEventListener('click', onClick);
    return button;
  }

  // Atualiza a página com novos dados e configura a paginação
  function updatePage() {
    fetchAndRenderChannels(currentPage);
    setupPagination();
  }









  // Adicionar eventos aos botões de navegação
  prevPageButton.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      updatePage();
    }
  });

  nextPageButton.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      updatePage();
    }
  });

  // Adicionar navegação por teclado
  document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' && currentPage > 1) {
      currentPage--;
      updatePage();
    } else if (event.key === 'ArrowRight' && currentPage < totalPages) {
      currentPage++;
      updatePage();
    }
  });

  // Inicializar a paginação e carregar os canais
  updatePage();
});