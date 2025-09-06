import { useState } from 'react';
import { api, setToken } from '../api.js';
import { Link, useNavigate } from 'react-router-dom';

export default function Login(){
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  async function onSubmit(e){ e.preventDefault(); setErr('');
    try{
      const r = await api.login({ email, password });
      setToken(r.token);
      nav('/');
    }catch(e){ setErr(e.response?.data?.error || 'Login failed'); }
  }
  return (
    <div className="card" style={{maxWidth:420, margin:'40px auto'}}>
      <h2>Welcome back 👋</h2>
      <form className="form" onSubmit={onSubmit}>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}/>
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)}/>
        {err && <div style={{color:'crimson'}}>{err}</div>}
        <button className="btn">Login</button>
      </form>
      <p>New here? <Link to="/register">Create an account</Link></p>
    </div>
  )
}
