import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 4000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/job_portal',
  jwtSecret: process.env.JWT_SECRET || 'supersecret',
  jobFeedUrl: process.env.JOB_FEED_URL || '',
  cronSchedule: process.env.CRON_SCHEDULE || '0 * * * *' // hourly by default
};
