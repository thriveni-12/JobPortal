import { Job } from './models/Job.js';

export async function seedJobs() {
  const count = await Job.countDocuments();
  if (count > 0) return;
  const base = [
    { title: 'Frontend Developer', company: 'PixelWorks', location: 'Hyderabad', description: 'Build colorful UI with React.' },
    { title: 'Backend Developer', company: 'DataForge', location: 'Bengaluru', description: 'Express + Mongo APIs.' },
    { title: 'Full Stack Intern', company: 'StackLab', location: 'Remote', description: 'MERN intern role.' },
    { title: 'DevOps Intern', company: 'CloudNexus', location: 'Pune', description: 'CI/CD and monitoring.' },
    { title: 'QA Engineer', company: 'BugBusters', location: 'Chennai', description: 'Write tests with Playwright.' },
    { title: 'Mobile App Dev', company: 'AppNation', location: 'Remote', description: 'React Native apps.' },
    { title: 'Data Analyst', company: 'InsightIQ', location: 'Hyderabad', description: 'Dashboards and SQL.' },
    { title: 'ML Engineer', company: 'DeepVision', location: 'Bengaluru', description: 'Model training and serving.' },
    { title: 'Security Analyst', company: 'SafeNet', location: 'Noida', description: 'Pentesting and hardening.' },
    { title: 'WordPress Intern', company: 'WP Studios', location: 'Remote', description: 'Themes and plugins.' },
    { title: 'SRE Intern', company: 'Reliab.ly', location: 'Mumbai', description: 'Uptime and scaling.' },
    { title: 'Product Designer', company: 'DesignHub', location: 'Remote', description: 'Figma to React handoff.' },
    { title: 'SEO Specialist', company: 'Searchly', location: 'Hyderabad', description: 'On-page, off-page SEO.' },
    { title: 'Content Writer', company: 'StoryLine', location: 'Remote', description: 'Tech blogs and docs.' },
    { title: 'Support Engineer', company: 'HelpDesk', location: 'Bengaluru', description: 'Customer success.' }
  ];
  await Job.insertMany(base);
  console.log('Seeded 15 jobs.');
}
