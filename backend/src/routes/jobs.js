import { Router } from 'express';
import { Job } from '../models/Job.js';

const router = Router();

router.get('/', async (req, res) => {
  const jobs = await Job.find().sort({ createdAt: -1 }).limit(100);
  res.json(jobs);
});

router.get('/:id', async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ error: 'Not found' });
  res.json(job);
});

export default router;
