// script.js
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
  const prevPageButton = document.getElementById('prev-page');
  const nextPageButton = document.getElementById('next-page');

  if (!channelsContainer ||!prevPageButton ||!nextPageButton) {
    console.error('Alguns elementos necessários não foram encontrados no DOM.');
    return;
  }

  let currentPage = 1;
  const channelsPerPage = 10;

  function fetchChannels(page) {
    fetch(`/api/canais?page=${page}&perPage=${channelsPerPage}`)
    .then(response => {
        if (!response.ok) {
          throw new Error(`Erro ao buscar canais: ${response.status}`);
        }
        return response.json();
      })
    .then(data => {
        if (!data.channels) {
          throw new Error('A resposta da API não contém a lista de canais.');
        }
        console.log('Dados dos canais:', data.channels);
        channelsContainer.innerHTML = '';

        data.channels.forEach(channel => {
          console.log('Processando canal:', channel);
          const channelDiv = document.createElement('div');
          channelDiv.classList.add('card', 'col-md-4', 'offline');

          const channelImage = document.createElement('img');
          channelImage.src = channel.image || 'placeholder.jpg';
          channelImage.alt = channel.name;
          channelDiv.appendChild(channelImage);

          const contentDiv = document.createElement('div');
          contentDiv.classList.add('content');
          channelDiv.appendChild(contentDiv);

          const titleDiv = document.createElement('div');
          titleDiv.classList.add('title');
          titleDiv.textContent = channel.name;
          contentDiv.appendChild(titleDiv);

          const btnDiv = document.createElement('div');
          btnDiv.classList.add('btn');
          btnDiv.textContent = 'Assistir';
          contentDiv.appendChild(btnDiv);

          const onlineCheckbox = document.createElement('input');
          onlineCheckbox.type = 'checkbox';
          onlineCheckbox.classList.add('online-checkbox');
          onlineCheckbox.checked = channel.isOnline || false;
          contentDiv.appendChild(onlineCheckbox);

          onlineCheckbox.addEventListener('change', function() {
            if (this.checked) {
              channelDiv.classList.add('online');
              channelDiv.classList.remove('offline');
            } else {
              channelDiv.classList.remove('online');
              channelDiv.classList.add('offline');
            }
          });

          btnDiv.addEventListener('click', () => {
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

          channelsContainer.appendChild(channelDiv);
        });

        prevPageButton.style.display = page > 1? 'block' : 'none';
        nextPageButton.style.display = data.channels.length < channelsPerPage? 'none' : 'block';
      })
    .catch(error => {
        console.error('Erro ao buscar canais:', error);
        alert('Erro ao buscar canais');
      });
  }

  fetchChannels(currentPage);

  prevPageButton.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      fetchChannels(currentPage);
    }
  });

  nextPageButton.addEventListener('click', () => {
    currentPage++;
    fetchChannels(currentPage);
  });
});