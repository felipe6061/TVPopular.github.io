import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import multer from 'multer';
import cors from 'cors';

// Importando o módulo CommonJS
import pkg from 'iptv-playlist-parser';
const { parse } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do multer para armazenamento temporário de arquivos
const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/x-mpegURL' || file.originalname.endsWith('.m3u')) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo inválido. Apenas arquivos .m3u e .m3u8 são aceitos.'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 } // Limite de tamanho de arquivo de 10MB
});

// Configuração do CORS para permitir todos os domínios
app.use(cors());

// Configuração para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para configurar o cabeçalho CORS manualmente (opcional, se desejar personalizar mais)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Armazena os canais em memória
let channels = [];

// Rota para upload de arquivos
app.post('/upload', upload.single('playlist'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('Nenhum arquivo foi carregado.');
  }

  const filePath = path.join(__dirname, 'uploads', req.file.filename);
  
  // Processa o arquivo
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Erro ao ler o arquivo.');
    }

    if (!data) {
      return res.status(400).send('Arquivo vazio.');
    }

    try {
      channels = parse(data);
      res.json(channels);
    } catch (error) {
      res.status(500).send('Erro ao processar o arquivo.');
    } finally {
      fs.unlink(filePath, (err) => {
        if (err) console.error('Erro ao excluir o arquivo:', err);
      });
    }
  });
});

// Rota para buscar canais com paginação
app.get('/api/canais', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 20;

  const start = (page - 1) * perPage;
  const end = start + perPage;

  const paginatedChannels = channels.slice(start, end);

  res.json({
    channels: paginatedChannels,
    total: channels.length,
    page,
    perPage
  });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
