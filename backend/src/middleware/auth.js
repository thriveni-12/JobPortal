import jwt from 'jsonwebtoken';
import { config } from '../config.js';

// Middleware to check JWT token
export const authMiddleware = (req, res, next) => {
  const hdr = req.headers.authorization || '';
  const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret);
    req.user = payload; // attach user info to request
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
