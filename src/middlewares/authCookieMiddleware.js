import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const authCookieMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    console.log('Token from cookie:', token);
    if (!token) return res.status(401).json({ error: 'Unauthorized: no token' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
     console.log('Decoded JWT:', decoded);
    const user = await User.findById(decoded.id).select('-passwordHash');
    if (!user) return res.status(401).json({ error: 'User not found' });

    req.user = user;
    next();
  } catch (err) {
    console.error('SSE auth error:', err.message);
    return res.status(401).json({ error: 'Unauthorized', details: err.message });
  }
};

export default authCookieMiddleware;
