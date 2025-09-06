import { Router } from 'express';
import { User } from '../models/User.js';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { config } from '../config.js';

const router = Router();

router.post('/register',
  body('name').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const exists = await User.findOne({ email: req.body.email });
      if (exists) return res.status(400).json({ error: 'Email already registered' });
      const user = await User.create(req.body);
      const token = jwt.sign({ id: user._id, email: user.email }, config.jwtSecret, { expiresIn: '7d' });
      res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

router.post('/login',
  body('email').isEmail(),
  body('password').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) return res.status(400).json({ error: 'Invalid credentials' });
      const ok = await user.comparePassword(req.body.password);
      if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
      const token = jwt.sign({ id: user._id, email: user.email }, config.jwtSecret, { expiresIn: '7d' });
      res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

export default router;
