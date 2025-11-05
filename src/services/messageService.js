import Message from '../models/Message.js';
import { encryptMessage, decryptMessage } from '../utils/crypto.js';
import { pubClient, subClient } from '../config/redis.js';

let clients = [];

export const addClient = (res) => {
  clients.push(res);
};

export const removeClient = (res) => {
  clients = clients.filter(c => c !== res);
};

export const broadcastMessage = (data) => {
  const payload = JSON.stringify({
    sender: data.sender,
    text: data.text,
    createdAt: data.createdAt,
  });

  for (const client of clients) {
    client.write(`data: ${payload}\n\n`);
  }
};

// Create and publish a message
export const createAndPublishMessage = async ({ sender, text, iv }) => {
  const message = await Message.create({ sender, text, iv });

  const payload = JSON.stringify({
    sender: message.sender,
    text: message.text,
    iv: message.iv,
    createdAt: message.createdAt,
  });

  await pubClient.publish('messages', payload);
  return message;
};

// Subscribing to Redis
export const subscribeRedis = () => {
  subClient.subscribe('messages', (err) => {
    if (err) console.error('Redis subscribe error:', err);
  });

  subClient.on('message', (channel, message) => {
    const data = JSON.parse(message);

    let plainText;
    try {
      plainText = decryptMessage(data.text, data.iv);
    } catch (err) {
      console.error('Decrypt error:', err);
      plainText = '[decrypt error]';
    }

    broadcastMessage({
      sender: data.sender,
      text: plainText,
      createdAt: data.createdAt,
    });
  });
};
