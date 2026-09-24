import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, PlayCircle, FileText, Building2 } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="section" style={{ paddingTop: '4rem', paddingBottom: '6rem', overflow: 'hidden' }}>
      <div className="container" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '4rem', flexWrap: 'wrap' }}>
        
        {/* Left Content */}
        <div style={{ flex: '1 1 500px' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            backgroundColor: 'var(--bg-secondary)', 
            color: 'var(--primary-blue)', 
            padding: '0.5rem 1rem', 
            borderRadius: '2rem', 
            fontSize: '0.875rem', 
            fontWeight: 600,
            marginBottom: '1.5rem'
          }}>
            <ShieldCheck size={18} />
            Government Approval Assistance
          </div>
          
          <h1 className="heading-1" style={{ marginBottom: '1.5rem', color: 'var(--dark-navy)' }}>
            Get Your <span style={{ color: 'var(--primary-blue)' }}>Building Approvals</span>, Hassle-Free
          </h1>
          
          <p className="text-lead" style={{ marginBottom: '2rem', maxWidth: '540px' }}>
            We help individuals, builders and developers manage their building approval requirements with professional guidance, document support and application tracking.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2.5rem' }}>
            {['Plan Approval', 'Building Permission', 'Occupancy Certificate', 'Local Body Approvals', 'End-to-End Support'].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--dark-navy)', fontWeight: 500 }}>
                <CheckCircle2 size={20} style={{ color: 'var(--primary-blue)' }} />
                {item}
              </div>
            ))}
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/apply" className="btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
              Apply Now &rarr;
            </Link>
            <button className="btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.125rem', border: 'none', backgroundColor: 'transparent', boxShadow: 'none' }}>
              <PlayCircle size={22} style={{ color: 'var(--primary-blue)' }} />
              Watch How It Works
            </button>
          </div>
        </div>

        {/* Right Visual */}
        <div style={{ flex: '1 1 500px', position: 'relative' }}>
          <div style={{ 
            position: 'relative', 
            width: '100%', 
            paddingBottom: '80%', 
            backgroundColor: 'var(--bg-secondary)', 
            borderRadius: 'var(--border-radius-lg)',
            overflow: 'hidden'
          }}>
            {/* Mock building visual (placeholder) */}
            <img src="/hero_building.jpg" alt="Building Approval Concept" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />

            {/* Floating Card 1 */}
            <div className="card" style={{ 
              position: 'absolute', 
              top: '10%', 
              right: '-5%', 
              width: '280px', 
              padding: '1.25rem',
              zIndex: 10
            }}>
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '0.5rem', borderRadius: '0.5rem', color: 'var(--primary-blue)' }}>
                  <FileText size={20} />
                </div>
                <div>
                  <h4 style={{ fontWeight: 600, fontSize: '0.875rem' }}>Building Plan Approval</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Application No: BPA-2026-4387</p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem' }}>
                  <CheckCircle2 size={16} color="var(--success-green)" /> Application Submitted
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem' }}>
                  <CheckCircle2 size={16} color="var(--success-green)" /> Document Verification
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--primary-blue)' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '4px solid var(--primary-blue)', boxSizing: 'border-box' }}></div> Approval Processing
                </div>
              </div>
            </div>

            {/* Floating Card 2 */}
            <div className="card" style={{ 
              position: 'absolute', 
              bottom: '15%', 
              left: '-5%', 
              padding: '1rem 1.25rem',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <div style={{ backgroundColor: 'rgba(34, 160, 107, 0.1)', padding: '0.75rem', borderRadius: '50%', color: 'var(--success-green)' }}>
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 style={{ fontWeight: 600, fontSize: '0.875rem' }}>Approval Process</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Fast • Secure • Transparent</p>
              </div>
            </div>
            
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
