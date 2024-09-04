self.onmessage = async function(event) {
    const { channels, currentPage, channelsPerPage } = event.data;
  
    const checkChannelStatus = (channel) => {
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
    };
  
    // Verificar o status de todos os canais
    const channelStatusPromises = channels.map(checkChannelStatus);
    const channelStatusResults = await Promise.all(channelStatusPromises);
  
    // Filtrar canais que estão online
    const validChannels = channelStatusResults.filter(channel => channel.status);
  
    // Calcular a paginação
    const startIndex = (currentPage - 1) * channelsPerPage;
    const endIndex = startIndex + channelsPerPage;
    const paginatedChannels = validChannels.slice(startIndex, endIndex);
  
    // Enviar os canais paginados de volta para o script principal
    self.postMessage({ results: paginatedChannels, totalPages: Math.ceil(validChannels.length / channelsPerPage) });
  };
  