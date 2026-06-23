const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

let messages = [
  { id: 1, text: "Hola desde la API", author: "Sistema", timestamp: new Date().toISOString() }
];
let nextId = 2;

app.get('/api/messages', (req, res) => {
  res.json({ success: true, messages });
});

app.post('/api/messages', (req, res) => {
  const { text, author } = req.body;
  if (!text || !author) {
    return res.status(400).json({ success: false, error: 'text and author are required' });
  }
  const message = { id: nextId++, text, author, timestamp: new Date().toISOString() };
  messages.push(message);
  res.status(201).json({ success: true, message });
});

app.delete('/api/messages/:id', (req, res) => {
  const id = parseInt(req.params.id);
  messages = messages.filter(m => m.id !== id);
  res.json({ success: true });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime().toFixed(1) + 's' });
});

app.listen(PORT, () => {
  console.log('API activa en el puerto ' + PORT);
});
