import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import Database from 'better-sqlite3';
import cors from 'cors';

const app = express();
const PORT = 3000;
const db = new Database('database.sqlite');

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS content (
    id TEXT PRIMARY KEY,
    value TEXT
  );
  CREATE TABLE IF NOT EXISTS images (
    id TEXT PRIMARY KEY,
    url TEXT
  );
`);

// Seed default content if empty
const seedContent = [
  ['hero_title', "Sylvester's Technology"],
  ['hero_subtitle', "Empowering the next generation of innovators through cutting-edge education and hands-on experience."],
  ['about_text', "Our department is dedicated to providing students with the tools and knowledge they need to excel in the digital age. From robotics to software development, we cover it all."],
  ['contact_email', "tech@sylvesters.edu"],
  ['contact_phone', "+1 (555) 123-4567"]
];

const checkContent = db.prepare('SELECT COUNT(*) as count FROM content').get() as { count: number };
if (checkContent.count === 0) {
  const insert = db.prepare('INSERT INTO content (id, value) VALUES (?, ?)');
  seedContent.forEach(([id, value]) => insert.run(id, value));
}

// Setup Multer for image uploads
const uploadDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadDir));

// API Routes
app.get('/api/content', (req, res) => {
  const content = db.prepare('SELECT * FROM content').all();
  const images = db.prepare('SELECT * FROM images').all();
  res.json({ content, images });
});

app.post('/api/login', (req, res) => {
  const { password } = req.body;
  if (password === '123') {
    res.json({ success: true, token: 'admin-token-xyz' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid password' });
  }
});

app.post('/api/content', (req, res) => {
  const { id, value, token } = req.body;
  if (token !== 'admin-token-xyz') return res.status(403).send('Unauthorized');
  
  const stmt = db.prepare('INSERT OR REPLACE INTO content (id, value) VALUES (?, ?)');
  stmt.run(id, value);
  res.json({ success: true });
});

app.post('/api/upload', upload.single('image'), (req, res) => {
  const { id, token } = req.body;
  if (token !== 'admin-token-xyz') return res.status(403).send('Unauthorized');
  if (!req.file) return res.status(400).send('No file uploaded');

  const url = `/uploads/${req.file.filename}`;
  const stmt = db.prepare('INSERT OR REPLACE INTO images (id, url) VALUES (?, ?)');
  stmt.run(id, url);
  
  res.json({ success: true, url });
});

// Vite middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
