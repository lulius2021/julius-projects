const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));

const DATA_DIR = path.join(__dirname, 'store');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

function userFile(password) {
  const hash = crypto.createHash('sha256').update(password).digest('hex').slice(0, 16);
  return path.join(DATA_DIR, `${hash}.json`);
}

// Load data
app.post('/api/load', (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ error: 'no password' });
  const file = userFile(password);
  if (fs.existsSync(file)) {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    return res.json({ ok: true, data });
  }
  return res.json({ ok: true, data: null });
});

// Save data
app.post('/api/save', (req, res) => {
  const { password, data } = req.body;
  if (!password || !data) return res.status(400).json({ error: 'missing fields' });
  const file = userFile(password);
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
  return res.json({ ok: true });
});

// Serve static frontend
app.use(express.static(path.join(__dirname, '..')));

const PORT = process.env.PORT || 3747;
app.listen(PORT, '0.0.0.0', () => console.log(`JP API running on :${PORT}`));
