import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, MapPin, Building } from 'lucide-react';

const StatusPreviewSection: React.FC = () => {
  return (
    <section className="section section-bg-light">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 className="heading-2">Stay Updated at Every Stage</h2>
        </div>

        <div className="card" style={{ maxWidth: '800px', margin: '0 auto', padding: '0', overflow: 'hidden' }}>
          
          <div style={{ padding: '2rem', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--dark-navy)', marginBottom: '0.5rem' }}>BPA-2026-4387</h3>
                <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Building size={16} /> Residential Building
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <MapPin size={16} /> Hosur
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Current Status</div>
                <div style={{ 
                  display: 'inline-block', 
                  backgroundColor: 'rgba(11, 99, 206, 0.1)', 
                  color: 'var(--primary-blue)', 
                  padding: '0.25rem 1rem', 
                  borderRadius: '1rem', 
                  fontWeight: 600,
                  fontSize: '0.875rem'
                }}>
                  Site Inspection
                </div>
              </div>
            </div>
          </div>

          <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
              <span style={{ color: 'var(--dark-navy)' }}>Progress</span>
              <span style={{ color: 'var(--primary-blue)' }}>75%</span>
            </div>
            <div style={{ height: '8px', backgroundColor: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden', marginBottom: '2rem' }}>
              <div style={{ height: '100%', width: '75%', backgroundColor: 'var(--primary-blue)', borderRadius: '4px' }}></div>
            </div>

            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr', maxWidth: '400px' }}>
              
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <CheckCircle2 color="var(--success-green)" size={20} />
                <span style={{ color: 'var(--dark-navy)', fontWeight: 500 }}>Application Submitted</span>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <CheckCircle2 color="var(--success-green)" size={20} />
                <span style={{ color: 'var(--dark-navy)', fontWeight: 500 }}>Document Verification</span>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <CheckCircle2 color="var(--success-green)" size={20} />
                <span style={{ color: 'var(--dark-navy)', fontWeight: 500 }}>Fee/Document Processing</span>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '5px solid var(--primary-blue)' }}></div>
                <span style={{ color: 'var(--primary-blue)', fontWeight: 600 }}>Site Inspection</span>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid var(--border-color)' }}></div>
                <span style={{ color: 'var(--text-secondary)' }}>Approval Processing</span>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid var(--border-color)' }}></div>
                <span style={{ color: 'var(--text-secondary)' }}>Completed</span>
              </div>

            </div>
          </div>
          
          <div style={{ padding: '1.5rem 2rem', backgroundColor: 'var(--bg-secondary)', textAlign: 'center' }}>
             <Link to="/track-application" style={{ fontWeight: 600 }}>View Full Status &rarr;</Link>
          </div>
        </div>

      </div>
    </section>
  );
};

export default StatusPreviewSection;
