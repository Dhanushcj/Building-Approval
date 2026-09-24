import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Eye, FileCheck, CheckCircle2 } from 'lucide-react';

const TrackingSection: React.FC = () => {
  const [appNumber, setAppNumber] = useState('');
  const navigate = useNavigate();

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (appNumber.trim()) {
      // Mock navigation to track application with query param
      navigate(`/track-application?id=${appNumber}`);
    }
  };

  return (
    <section className="section section-bg-light">
      <div className="container">
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            
            {/* Form Side */}
            <div style={{ flex: '1 1 400px', padding: '3rem' }}>
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'inline-flex', backgroundColor: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: '50%', color: 'var(--primary-blue)', marginBottom: '1rem' }}>
                  <Search size={28} />
                </div>
                <h2 className="heading-2">Track Your Application Status</h2>
                <p className="text-lead" style={{ fontSize: '1rem' }}>Enter your application number to check the latest status of your approval application.</p>
              </div>

              <form onSubmit={handleTrack}>
                <div className="form-group" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. BPA-2026-4387" 
                    value={appNumber}
                    onChange={(e) => setAppNumber(e.target.value)}
                    required
                    style={{ flex: '1 1 200px' }}
                  />
                  <button type="submit" className="btn-primary" style={{ whiteSpace: 'nowrap' }}>
                    Track Status &rarr;
                  </button>
                </div>
                <div style={{ marginTop: '0.5rem' }}>
                  <a href="#" style={{ fontSize: '0.875rem' }}>Need help with your application?</a>
                </div>
              </form>

              <div style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.875rem' }}>
                  <Eye size={18} color="var(--primary-blue)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>View current application status</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.875rem' }}>
                  <FileCheck size={18} color="var(--primary-blue)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>View document updates</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.875rem' }}>
                  <Search size={18} color="var(--primary-blue)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>Check processing stage</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.875rem' }}>
                  <Bell size={18} color="var(--primary-blue)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>Receive important notifications</span>
                </div>
              </div>
            </div>

            {/* Visual Side */}
            <div style={{ 
              flex: '1 1 400px', 
              padding: '3rem', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundImage: 'linear-gradient(rgba(11, 99, 206, 0.85), rgba(11, 99, 206, 0.85)), url("/track_application_bg.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}>
              <div style={{ 
                width: '100%', 
                maxWidth: '300px', 
                aspectRatio: '1', 
                backgroundColor: 'rgba(255,255,255,0.1)', 
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                <div style={{ 
                  backgroundColor: 'var(--white)', 
                  padding: '1.5rem', 
                  borderRadius: 'var(--border-radius-md)', 
                  boxShadow: 'var(--shadow-lg)',
                  width: '80%'
                }}>
                  <div style={{ height: '8px', backgroundColor: 'var(--bg-secondary)', borderRadius: '4px', width: '40%', marginBottom: '1rem' }}></div>
                  <div style={{ height: '8px', backgroundColor: 'var(--bg-secondary)', borderRadius: '4px', width: '80%', marginBottom: '0.5rem' }}></div>
                  <div style={{ height: '8px', backgroundColor: 'var(--bg-secondary)', borderRadius: '4px', width: '60%', marginBottom: '2rem' }}></div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(34, 160, 107, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       <CheckCircle2 color="var(--success-green)" size={24} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--success-green)' }}>APPROVED</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Just now</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default TrackingSection;
