

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';
import { addClient, removeClient, createAndPublishMessage } from '../services/messageService.js';

dotenv.config();

// SSE connection
export const sseConnect = async (req, res) => {
  try {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', 'https://localhost:5173');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.end();

    // Token verification
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ error: 'Unauthorized: no token' });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({ error: 'Unauthorized: invalid token' });
    }

    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ error: 'Unauthorized: user not found' });

    // SSE
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });

    addClient(res);
    console.log(`✅ ${user.username} connected`);

    req.on('close', () => {
      removeClient(res);
      console.log(`❎ ${user.username} disconnected`);
    });

  } catch (err) {
    console.error('SSE connection error:', err);
    res.status(500).json({ error: 'Internal SSE error', details: err.message });
  }
};

// Sending a message
export const sendMessage = async (req, res) => {
  const { text, iv } = req.body;
  if (!text || !iv) return res.status(400).json({ error: 'Message text and IV required' });

  try {
    const sender = req.user.username;
    await createAndPublishMessage({ sender, text, iv });
    res.json({ success: true });
  } catch (err) {
    console.error('Send message error:', err);
    res.status(500).json({ error: 'Message send failed' });
  }
};
