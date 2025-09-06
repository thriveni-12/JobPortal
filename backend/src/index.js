import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config.js';
import authRoutes from './routes/auth.js';
import jobRoutes from './routes/jobs.js';
import applicationRoutes from './routes/applications.js'; // ✅ renamed for clarity
import { seedJobs } from './seed.js';
import cron from 'node-cron';
import fetch from 'node-fetch';
import { Job } from './models/Job.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// ✅ Static uploads folder for resumes
app.use('/uploads', express.static(path.join(__dirname, '../uploads/resumes')));

// ✅ Routes
app.get('/', (req, res) => res.json({ ok: true, service: 'job-portal-backend' }));
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);

// ✅ Mongo + Server
mongoose.connect(config.mongoUri).then(async () => {
  console.log('Connected to MongoDB');
  await seedJobs();

  // Background fetch of external job openings
  if (config.jobFeedUrl) {
    cron.schedule(config.cronSchedule, async () => {
      try {
        console.log('[CRON] Fetching external jobs...');
        const r = await fetch(config.jobFeedUrl);
        const data = await r.json();
        const items = Array.isArray(data.jobs) ? data.jobs : (Array.isArray(data) ? data : []);
        const sanitized = items.slice(0, 20).map(j => ({
          title: j.title || 'External Job',
          company: j.company_name || j.company || 'Unknown',
          location: j.candidate_required_location || j.location || 'Remote',
          description: j.description || 'N/A',
          externalId: String(j.id || j.job_id || j.slug || Math.random())
        }));

        for (const j of sanitized) {
          const exists = await Job.findOne({ externalId: j.externalId });
          if (!exists) {
            await Job.create(j);
          }
        }
        console.log(`[CRON] Upserted ${sanitized.length} jobs (deduped by externalId)`);
      } catch (e) {
        console.error('[CRON] Failed to fetch jobs', e.message);
      }
    });
  }

  app.listen(config.port, () => {
    console.log(`Backend running on http://localhost:${config.port}`);
  });
}).catch(err => {
  console.error('Mongo connection error', err);
  process.exit(1);
});
