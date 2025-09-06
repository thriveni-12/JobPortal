import { useState } from 'react';
import { api, setToken } from '../api.js';
import { Link, useNavigate } from 'react-router-dom';

export default function Register(){
  const nav = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  async function onSubmit(e){ e.preventDefault(); setErr('');
    try{
      const r = await api.register({ name, email, password });
      setToken(r.token);
      nav('/');
    }catch(e){ setErr(e.response?.data?.error || 'Register failed'); }
  }
  return (
    <div className="card" style={{maxWidth:480, margin:'40px auto'}}>
      <h2>Create your account ✨</h2>
      <form className="form" onSubmit={onSubmit}>
        <input placeholder="Full Name" value={name} onChange={e=>setName(e.target.value)}/>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}/>
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)}/>
        {err && <div style={{color:'crimson'}}>{err}</div>}
        <button className="btn">Register</button>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  )
}
