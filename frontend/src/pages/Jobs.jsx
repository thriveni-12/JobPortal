import { useEffect, useState } from 'react';
import { api, getToken } from '../api.js';

export default function Jobs(){
  const [jobs, setJobs] = useState([]);
  const [openJobId, setOpenJobId] = useState(null);
  const [formDataMap, setFormDataMap] = useState({}); 
  const [statusMap, setStatusMap] = useState({}); 

  const storedUser = (() => {
    try { 
      return JSON.parse(localStorage.getItem('user') || 'null'); 
    } catch(e){ 
      return null; 
    }
  })();

  useEffect(()=>{
    api.listJobs().then(setJobs).catch(()=>setJobs([]));
  },[]);

  function openForm(job){
    setFormDataMap(prev => ({
      ...prev,
      [job._id]: prev[job._id] || {
        fullName: storedUser?.name || '',
        email: storedUser?.email || '',
        phone: '',
        coverLetter: ''
      }
    }));
    setStatusMap(prev => ({ ...prev, [job._id]: { msg:'', err:'', loading:false } }));
    setOpenJobId(job._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function updateField(jobId, key, val){
    setFormDataMap(prev => ({ ...prev, [jobId]: { ...(prev[jobId]||{}), [key]: val } }));
  }

  function onFileChange(jobId, file){
    setFormDataMap(prev => ({ 
      ...prev, 
      [jobId]: { ...(prev[jobId]||{}), resume: file, resumeName: file?.name } 
    }));
  }

  async function submitApplication(jobId){
    const st = { ...statusMap[jobId], loading:true, msg:'', err:'' };
    setStatusMap(prev => ({ ...prev, [jobId]: st }));

    if(!getToken()){
      setStatusMap(prev => ({ ...prev, [jobId]: { ...prev[jobId], loading:false, err: 'Please login to apply.' } }));
      return;
    }

    const f = formDataMap[jobId] || {};
    if(!f.fullName || !f.email || !f.phone){
      setStatusMap(prev => ({ ...prev, [jobId]: { ...prev[jobId], loading:false, err: 'Please fill name, email and phone.' } }));
      return;
    }
    if(!f.resume){
      setStatusMap(prev => ({ ...prev, [jobId]: { ...prev[jobId], loading:false, err: 'Please upload a resume.' } }));
      return;
    }

    const fd = new FormData();
    fd.append('fullName', f.fullName);
    fd.append('email', f.email);
    fd.append('phone', f.phone);
    fd.append('coverLetter', f.coverLetter || '');
    fd.append('resume', f.resume);

    try {
      await api.apply(jobId, fd);
      setStatusMap(prev => ({ ...prev, [jobId]: { loading:false, msg: 'Application submitted ✅', err: '' } }));
      setFormDataMap(prev => ({ ...prev, [jobId]: { fullName:'', email:'', phone:'', coverLetter:'', resume:null, resumeName:'' } }));
      setTimeout(()=> setOpenJobId(null), 900);
    } catch (e) {
      const err = e?.response?.data?.error || 'Failed to apply ❌';
      setStatusMap(prev => ({ ...prev, [jobId]: { loading:false, msg:'', err } }));
    }
  }

  return (
    <div>
      <div className="grid">
        {jobs.map(j => {
          const st = statusMap[j._id] || {};
          const f = formDataMap[j._id] || {};
          return (
            <div className="card" key={j._id}>
              {/* Job Info */}
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
                <div>
                  <h3 style={{margin:'4px 0'}}>{j.title}</h3>
                  <p style={{margin:'4px 0', color:'#555'}}><strong>{j.company}</strong></p>
                </div>
                <div style={{textAlign:'right'}}>
                  <div className="pill">{j.location || 'Remote'}</div>
                </div>
              </div>

              <p style={{minHeight:50, color:'#333'}} 
                 dangerouslySetInnerHTML={{
                   __html: (j.description||'').slice(0,280) + 
                          (j.description && j.description.length>280 ? '...' : '')
                 }} 
              />

              <div style={{display:'flex', gap:8}}>
                <button className="btn" onClick={()=> openForm(j)}>Apply</button>
              </div>

              {/* Application Form */}
              {openJobId === j._id && (
                <div style={{marginTop:12, borderTop:'1px dashed #eee', paddingTop:12}}>
                  <h4 style={{marginTop:0}}>Application</h4>
                  <div className="form">
                    <input 
                      placeholder="Full Name" 
                      value={f.fullName || ''} 
                      onChange={e=>updateField(j._id, 'fullName', e.target.value)} 
                    />
                    <input 
                      placeholder="Email" 
                      value={f.email || ''} 
                      onChange={e=>updateField(j._id, 'email', e.target.value)} 
                    />
                    <input 
                      placeholder="Phone" 
                      value={f.phone || ''} 
                      onChange={e=>updateField(j._id, 'phone', e.target.value)} 
                    />
                    <textarea 
                      placeholder="Cover Letter (optional)" 
                      rows={4} 
                      value={f.coverLetter||''} 
                      onChange={e=>updateField(j._id, 'coverLetter', e.target.value)} 
                    />

                    <label style={{display:'block'}}>
                      <input 
                        type="file" 
                        accept=".pdf,.doc,.docx" 
                        style={{display:'none'}} 
                        onChange={e=>onFileChange(j._id, e.target.files?.[0] || null)} 
                        id={`resume-${j._id}`} 
                      />
                      <div style={{display:'flex', gap:8, alignItems:'center'}}>
                        <button 
                          type="button" 
                          className="btn secondary" 
                          onClick={()=> document.getElementById(`resume-${j._id}`).click()}
                        >
                          Upload Resume
                        </button>
                        <div style={{fontSize:14}}>
                          { f.resumeName ? <span>{f.resumeName}</span> : <span style={{color:'#888'}}>No file chosen</span> }
                        </div>
                      </div>
                    </label>

                    { st.msg && <div style={{color:'green'}}>{st.msg}</div> }
                    { st.err && <div style={{color:'crimson'}}>{st.err}</div> }

                    <div style={{display:'flex', gap:8}}>
                      <button className="btn" onClick={()=> submitApplication(j._id)} disabled={st.loading}>
                        { st.loading ? 'Submitting...' : 'Submit' }
                      </button>
                      <button className="btn secondary" onClick={()=> setOpenJobId(null)}>Cancel</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
