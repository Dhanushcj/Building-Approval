import React from 'react';
import { UserCheck, Clock, ShieldCheck, Heart } from 'lucide-react';
import { Building2 } from 'lucide-react';

const WhyChooseUsSection: React.FC = () => {
  return (
    <section className="section">
      <div className="container">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'center' }}>
          
          {/* Left Side: Image/Visual */}
          <div style={{ flex: '1 1 400px', position: 'relative' }}>
            <div style={{ 
              position: 'relative', 
              width: '100%', 
              paddingBottom: '100%', 
              backgroundColor: 'var(--bg-secondary)', 
              borderRadius: 'var(--border-radius-lg)',
              overflow: 'hidden'
            }}>
              <img src="/why_choose_us_building.jpg" alt="Trusted Building Approvals" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
            </div>
            {/* Small floating stat box */}
            <div className="card" style={{ 
              position: 'absolute', 
              bottom: '-20px', 
              left: '20px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem',
              padding: '1rem 1.5rem'
            }}>
              <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: '50%', color: 'var(--primary-blue)' }}>
                <UserCheck size={24} />
              </div>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--dark-navy)' }}>1000+</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Approvals Processed</div>
              </div>
            </div>
          </div>

          {/* Right Side: Content */}
          <div style={{ flex: '1 1 500px' }}>
            <div style={{ color: 'var(--primary-blue)', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
              Why Choose Us
            </div>
            <h2 className="heading-2" style={{ marginBottom: '1.5rem' }}>
              Your Trusted Approval Partner
            </h2>
            <p className="text-lead" style={{ marginBottom: '2.5rem' }}>
              We simplify the administrative side of building approvals by organizing documents, tracking applications and keeping customers informed.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ color: 'var(--primary-blue)', marginTop: '4px' }}>
                  <UserCheck size={24} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--dark-navy)', marginBottom: '0.25rem' }}>Experienced Support</h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Professional assistance throughout the approval process.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ color: 'var(--primary-blue)', marginTop: '4px' }}>
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--dark-navy)', marginBottom: '0.25rem' }}>Transparent Process</h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Clear application status and document tracking.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ color: 'var(--primary-blue)', marginTop: '4px' }}>
                  <Clock size={24} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--dark-navy)', marginBottom: '0.25rem' }}>Faster Coordination</h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Keep application information organized and reduce unnecessary follow-ups.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ color: 'var(--primary-blue)', marginTop: '4px' }}>
                  <Heart size={24} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--dark-navy)', marginBottom: '0.25rem' }}>Customer Focused</h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Keep customers informed from submission to completion.</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
