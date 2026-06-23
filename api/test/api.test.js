const request = require('supertest');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let messages = [
  { id: 1, text: "Hola desde la API", author: "Sistema", timestamp: new Date().toISOString() }
];
let nextId = 2;

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime().toFixed(1) + 's' });
});

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

describe('API - Health', () => {
  test('GET /api/health responde con status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('API - Mensajes', () => {
  test('GET /api/messages retorna lista de mensajes', async () => {
    const res = await request(app).get('/api/messages');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.messages)).toBe(true);
  });

  test('POST /api/messages crea un mensaje nuevo', async () => {
    const res = await request(app)
      .post('/api/messages')
      .send({ text: 'Mensaje de prueba', author: 'Tester' });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message.text).toBe('Mensaje de prueba');
    expect(res.body.message.author).toBe('Tester');
  });

  test('POST /api/messages falla si faltan campos', async () => {
    const res = await request(app)
      .post('/api/messages')
      .send({ text: 'Solo texto, sin autor' });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('DELETE /api/messages/:id elimina un mensaje', async () => {
    const res = await request(app).delete('/api/messages/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
