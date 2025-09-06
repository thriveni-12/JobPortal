import { useEffect, useState } from 'react';
import { api } from '../api.js';

export default function MyApplications(){
  const [apps, setApps] = useState([]);
  useEffect(()=>{ api.myApplications().then(setApps).catch(()=>{}); },[]);
  return (
    <div className="card">
      <h2>My Applications</h2>
      <div className="grid">
        {apps.map(a=> (
          <div className="card" key={a._id}>
            <h3>{a.job?.title}</h3>
            <p><strong>{a.job?.company}</strong> — {a.job?.location}</p>
            <p><a href={a.resumePath} target="_blank">View Resume</a></p>
            <p><small>Applied on {new Date(a.createdAt).toLocaleString()}</small></p>
          </div>
        ))}
      </div>
    </div>
  )
}
