import React from 'react';
import { Link } from 'react-router-dom';

const CtaSection: React.FC = () => {
  return (
    <section className="section" style={{ backgroundColor: 'var(--dark-navy)', color: 'var(--white)' }}>
      <div className="container" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <h2 className="heading-2" style={{ marginBottom: '1.5rem' }}>
          Need Help With Your Building Approval?
        </h2>
        <p className="text-lead" style={{ color: '#94a3b8', marginBottom: '2.5rem' }}>
          Talk to our team and get guidance for the next step in your application. We're here to make your construction journey smoother.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/apply" className="btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
            Apply Now &rarr;
          </Link>
          <Link to="/track-application" className="btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.125rem', backgroundColor: 'transparent', color: 'var(--white)', borderColor: 'rgba(255,255,255,0.2)' }}>
            Track Application
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
