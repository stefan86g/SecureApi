import dotenv from 'dotenv';
import { createServer } from 'https';
import fs from 'fs';
import app from './app.js';
import connectDB from './config/db.js';
import logger from './utils/logger.js';


dotenv.config();
const PORT = process.env.PORT || 4000;

await connectDB();

const options = {
  key: fs.readFileSync('./cert/server.key'),
  cert: fs.readFileSync('./cert/server.crt')
};

createServer(options, app).listen(PORT, () => {
  logger.info(`✅ Secure server running on https://localhost:${PORT}`);
});
