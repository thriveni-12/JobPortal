import { Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Jobs from './pages/Jobs.jsx';
import MyApplications from './pages/MyApplications.jsx';
import { getToken, clearToken } from './api.js';

export default function App() {
  const loggedIn = !!getToken();

  return (
    <div className="container">
      {/* ✅ Navigation Bar */}
      <nav className="nav" style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20, padding:'10px 20px', background:'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)', borderRadius:'8px'}}>
        <div className="brand" style={{fontSize:22, fontWeight:'bold', color:'#fff'}}>Job Portal</div>
        
        <div style={{display:'flex', gap:15, alignItems:'center'}}>
          <Link to="/" style={{color:'#fff', textDecoration:'none'}}>Jobs</Link>
          {loggedIn ? (
            <>
              <Link to="/my" style={{color:'#fff', textDecoration:'none'}}>My Applications</Link>
              <button 
                className="btn secondary" 
                style={{background:'#fff', color:'#2575fc', padding:'6px 12px', borderRadius:'6px', border:'none', cursor:'pointer'}}
                onClick={()=>{
                  clearToken(); 
                  location.reload();
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{color:'#fff', textDecoration:'none'}}>Login</Link>
              <Link to="/register" style={{color:'#fff', textDecoration:'none'}}>Register</Link>
            </>
          )}
        </div>
      </nav>

      {/* ✅ Routes */}
      <Routes>
        <Route path="/" element={<Jobs/>}/>
        <Route path="/login" element={loggedIn ? <Navigate to="/"/> : <Login/>}/>
        <Route path="/register" element={loggedIn ? <Navigate to="/"/> : <Register/>}/>
        <Route path="/my" element={loggedIn ? <MyApplications/> : <Navigate to="/login"/>}/>
      </Routes>
    </div>
  );
}
