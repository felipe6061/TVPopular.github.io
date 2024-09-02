import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import pkg from 'iptv-playlist-parser';
import multer from 'multer';
import cors from 'cors';

const { parse } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do multer para armazenamento temporário de arquivos
const upload = multer({ dest: 'uploads/' });

// Configuração para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public'))); // Garante que a pasta pública está acessível

// Configuração do CORS
app.use(cors());

// Rota para upload de arquivos
app.post('/upload', upload.single('playlist'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('Nenhum arquivo foi carregado.');
  }

  const filePath = path.join(__dirname, 'uploads', req.file.filename);
  
  // Processa o arquivo, por exemplo, lendo o conteúdo
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Erro ao ler o arquivo.');
    }

    // Faça o parsing do arquivo aqui
    try {
      const channels = parse(data);
      res.json(channels); // Envia a lista de canais como resposta
    } catch (error) {
      res.status(500).send('Erro ao processar o arquivo.');
    }
  });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
