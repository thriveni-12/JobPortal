import axios from 'axios';
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export function getToken(){ return localStorage.getItem('token') || ''; }
export function setToken(t){ localStorage.setItem('token', t); }
export function clearToken(){ localStorage.removeItem('token'); }

const client = axios.create({ baseURL: BASE });
client.interceptors.request.use((cfg)=>{
  const t = getToken(); if (t) cfg.headers['Authorization'] = 'Bearer ' + t;
  return cfg;
});

export const api = {
  register: (payload)=> client.post('/api/auth/register', payload).then(r=>r.data),
  login: (payload)=> client.post('/api/auth/login', payload).then(r=>r.data),
  listJobs: ()=> client.get('/api/jobs').then(r=>r.data),
  apply: (jobId, formData)=> client.post(`/api/applications/${jobId}`, formData, { headers:{'Content-Type':'multipart/form-data'} }).then(r=>r.data),
  myApplications: ()=> client.get('/api/applications/my').then(r=>r.data),
};
