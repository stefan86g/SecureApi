import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { subscribeRedis } from './services/messageService.js';
import authRoutes from './routes/authRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

const app = express();
subscribeRedis();
// --- Security and Logs
app.use(helmet());
app.use(morgan('dev'));

// --- Allow JSON and cookies
app.use(express.json());
app.use(cookieParser());

// --- CORS for HTTPS + cookies + SSE
app.use(cors({
  origin: 'https://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// --- Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

export default app;
