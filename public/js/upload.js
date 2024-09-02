// Função para lidar com o clique no botão de upload
document.getElementById('upload-button').addEventListener('click', () => {
  const fileInput = document.getElementById('playlist');
  const file = fileInput.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      const fileContent = event.target.result;

      // Processa o conteúdo do arquivo (m3u8 ou m3u)
      const channels = parseM3U(fileContent);

      // Não renderiza os canais; apenas faz o processamento
      // Caso precise utilizar canais para outras funcionalidades, você pode fazê-lo aqui

      // Exemplo: Apenas logar os canais no console
      console.log('Canais processados:', channels);
    };

    reader.readAsText(file); // Lê o arquivo como texto
  } else {
    alert('Por favor, selecione um arquivo de playlist.');
  }
});

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
