import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import multer from 'multer'; 
import pkg from 'iptv-playlist-parser';
import mariadb from 'mariadb';

const app = express();
const PORT = process.env.PORT || 3000;

const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: '11223344',
  database: 'tvpopular',
  connectionLimit: 5
});

async function connectDB() {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log('Conectado ao MariaDB!');
    const rows = await conn.query('SELECT 1 as val');
    console.log(rows);
    conn.release();
  } catch (err) {
    console.error('Erro ao conectar ao MariaDB:', err);
  }
}
connectDB();

const { parse } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const playlistPath = path.join(__dirname, 'data', 'index.all.m3u');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'data');
  },
  filename: (req, file, cb) => {
    cb(null, 'index.all.m3u');
  }
});
const upload = multer({ storage });

app.post('/upload', upload.single('playlist'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Nenhum arquivo enviado.' });
  }

  // Ler o arquivo e inserir dados na tabela
  fs.readFile(path.join(__dirname, 'data', 'index.all.m3u'), 'utf8', async (err, data) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Erro ao ler o arquivo de playlist.' });
    }

    try {
      const playlist = parse(data);
      const channels = playlist.items.map(item => ({
        name: item.name
      }));

      let conn;
      try {
        conn = await pool.getConnection();
        await conn.beginTransaction();
        
        // Limpar a tabela antes de inserir novos dados
        await conn.query('DELETE FROM canais');
        
        // Inserir novos dados
        const insertPromises = channels.map(channel => {
          return conn.query('INSERT INTO canais (name) VALUES (?)', [channel.name]);
        });
        await Promise.all(insertPromises);
        
        await conn.commit();
        conn.release();
        res.json({ success: true, message: 'Arquivo M3U carregado e dados inseridos com sucesso!' });
      } catch (dbError) {
        if (conn) await conn.rollback();
        console.error('Erro ao inserir dados na tabela:', dbError);
        res.status(500).json({ success: false, message: 'Erro ao inserir dados na tabela.' });
      }
    } catch (parseError) {
      console.error('Erro ao parsear a playlist:', parseError);
      res.status(500).json({ success: false, message: 'Erro ao parsear a playlist.' });
    }
  });
});

app.use(express.static('public'));

app.get('/api/canais', async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const perPage = parseInt(req.query.perPage, 10) || 10;

  fs.readFile(playlistPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Erro ao ler o arquivo de playlist:', err);
      res.status(500).json({ error: 'Erro ao ler o arquivo de playlist' });
      return;
    }

    try {
      const playlist = parse(data);
      const channels = playlist.items.map(item => ({
        id: item.id,
        name: item.name,
        streamUrl: item.url,
        image: item.tvg.logo || 'placeholder.jpg',
        group: item.group?.title || 'Sem grupo'
      }));

      const paginatedChannels = channels.slice((page - 1) * perPage, page * perPage);
      res.json({ channels: paginatedChannels, totalChannels: channels.length });
    } catch (parseError) {
      console.error('Erro ao parsear a playlist:', parseError);
      res.status(500).json({ error: 'Erro ao parsear a playlist' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
