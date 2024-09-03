// Função para lidar com o clique no botão de upload
document.getElementById('upload-button').addEventListener('click', async () => {
  const fileInput = document.getElementById('playlist');
  const file = fileInput.files[0];

  if (file) {
    try {
      const fileContent = await readFileAsText(file);
      const channels = parseM3U(fileContent);

      // Exemplo: Apenas logar os canais no console
      console.log('Canais processados:', channels);

      // Aqui você pode tomar outras ações com os canais processados

    } catch (error) {
      alert('Erro ao processar o arquivo. Verifique o formato do arquivo e tente novamente.');
      console.error('Erro:', error);
    }
  } else {
    alert('Por favor, selecione um arquivo de playlist.');
  }
});

// Função para ler o arquivo como texto
function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
}

// Função para fazer o parsing do conteúdo M3U
function parseM3U(content) {
  const lines = content.split('\n');
  const channels = [];
  let currentChannel = null;

  lines.forEach(line => {
    if (line.startsWith('#EXTINF:')) {
      const parts = line.split(',');
      const name = parts[1].trim();
      currentChannel = { name };
    } else if (line && !line.startsWith('#')) {
      if (currentChannel) {
        currentChannel.streamUrl = line.trim();
        channels.push(currentChannel);
        currentChannel = null;
      }
    }
  });

  return channels;
}

// Função para reproduzir um canal
function playChannel(url) {
  const player = videojs('player');
  player.src({ src: url, type: 'application/x-mpegURL' });
  player.play();
}
