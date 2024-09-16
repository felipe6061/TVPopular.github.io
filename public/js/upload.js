// upload.js
const form = document.getElementById('uploadForm');
const input = document.getElementById('fileInput');

form.addEventListener('submit', function(event) {
  event.preventDefault();

  const formData = new FormData();
  formData.append('playlist', input.files[0]);

  fetch('/upload', {
    method: 'POST',
    body: formData,
  })
  .then(response => {
    if (!response.ok) {
      return response.json().then(error => {
        throw new Error(error.message || 'Erro desconhecido ao carregar o arquivo.');
      });
    }
    return response.json();
  })
  .then(data => {
    alert(data.message || 'Arquivo carregado com sucesso.');
  })
  .catch(error => {
    alert(`Falha no upload: ${error.message}`);
    console.error('Erro no upload:', error);
  });
});
