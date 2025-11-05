import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

export const AES_KEY = Buffer.from(process.env.AES_KEY, 'hex');

export const encryptMessage = (plainText) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', AES_KEY, iv);
  let encrypted = cipher.update(plainText, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return { encrypted, iv: iv.toString('base64') };
};

export const decryptMessage = (encrypted, iv) => {
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    AES_KEY,
    Buffer.from(iv, 'base64')
  );
  let decrypted = decipher.update(encrypted, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

