import express from 'express';
import authCookieMiddleware from '../middlewares/authCookieMiddleware.js';
import { sseConnect, sendMessage } from '../controllers/messageController.js';

const router = express.Router();

router.get('/stream', authCookieMiddleware, sseConnect);
router.post('/', authCookieMiddleware, sendMessage);

export default router;
