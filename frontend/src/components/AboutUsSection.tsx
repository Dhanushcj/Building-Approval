import React from 'react';
import { Shield, Target } from 'lucide-react';

const AboutUsSection: React.FC = () => {
  return (
    <section id="about" className="section" style={{ backgroundColor: '#ffffff', padding: '6rem 0' }}>
      <div className="container" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '4rem', flexWrap: 'wrap' }}>
        
        {/* Left Side: Image / Visuals */}
        <div style={{ flex: '1 1 400px', position: 'relative' }}>
          <div style={{ position: 'relative', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <img 
              src="/assets/Client.jpeg" 
              alt="Building Approvals and Architecture" 
              style={{ width: '100%', height: 'auto', maxHeight: '500px', display: 'block', objectFit: 'contain', backgroundColor: '#f8fafc' }} 
            />
            {/* Experience Badge overlay */}
            <div style={{ position: 'absolute', bottom: '1.5rem', right: '1.5rem', backgroundColor: 'var(--primary)', color: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1 }}>10+</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Years Experience</span>
            </div>
          </div>
          {/* Decorative background element */}
          <div style={{ position: 'absolute', top: '-1.5rem', left: '-1.5rem', width: '30%', height: '30%', border: '4px solid var(--accent)', borderRadius: '0.5rem', zIndex: -1 }}></div>
        </div>

        {/* Right Side: Content */}
        <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'inline-block', backgroundColor: 'rgba(11, 99, 206, 0.1)', color: 'var(--primary)', padding: '0.5rem 1rem', borderRadius: '2rem', fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', width: 'fit-content' }}>
            About Us
          </div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary-dark)', lineHeight: 1.2, margin: 0 }}>
            Your Trusted Partner for <span style={{ color: 'var(--accent)' }}>Building Approvals</span>
          </h2>
          <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
            At <strong>C.B. Building Approvals</strong>, we simplify the complex world of government paperwork and municipal regulations. We act as your dedicated liaison, ensuring your building projects proceed without legal or administrative roadblocks.
          </p>
          <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
            Whether it's securing a building plan, finalizing layout approvals, or procuring Patta and FMB documents, our team of experts handles every detail with precision and speed, allowing you to focus purely on your construction.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: '50%' }}>
                <Shield size={24} color="var(--primary)" />
              </div>
              <div>
                <h4 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--primary-dark)', margin: '0 0 0.25rem 0' }}>100% Guaranteed Compliance</h4>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.5 }}>Every approval is meticulously processed to meet all local and state regulations.</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: '50%' }}>
                <Target size={24} color="var(--primary)" />
              </div>
              <div>
                <h4 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--primary-dark)', margin: '0 0 0.25rem 0' }}>End-to-End Solutions</h4>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.5 }}>From initial document verification to the final government seal, we handle it all.</p>
              </div>
            </div>
            
          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutUsSection;
