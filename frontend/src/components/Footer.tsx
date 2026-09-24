import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer style={{ backgroundColor: 'var(--dark-navy)', color: 'var(--white)', paddingTop: '4rem', paddingBottom: '2rem' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
          
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ color: 'var(--white)' }}>
                <Building2 size={32} strokeWidth={2} />
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1 }}>
                  <span style={{ color: 'var(--white)' }}>Build</span>
                  <span style={{ color: 'var(--primary-blue)' }}>Approve</span>
                </div>
              </div>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1.5rem', maxWidth: '300px' }}>
              Your Construction Approval Partner. We help individuals, builders, and developers manage their building approval requirements with professional guidance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.5rem' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li><Link to="/" style={{ color: '#94a3b8' }}>Home</Link></li>
              <li><a href="#services" style={{ color: '#94a3b8' }}>Services</a></li>
              <li><a href="#how-it-works" style={{ color: '#94a3b8' }}>How It Works</a></li>
              <li><Link to="/track-application" style={{ color: '#94a3b8' }}>Track Application</Link></li>
              <li><a href="#about" style={{ color: '#94a3b8' }}>About</a></li>
              <li><Link to="/login" style={{ color: '#94a3b8' }}>Login</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.5rem' }}>Contact Us</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li style={{ display: 'flex', gap: '0.75rem', color: '#94a3b8', alignItems: 'flex-start' }}>
                <MapPin size={20} style={{ color: 'var(--primary-blue)', flexShrink: 0 }} />
                <span>123 Approval Street, Business Hub, Hosur, Tamil Nadu 635109</span>
              </li>
              <li style={{ display: 'flex', gap: '0.75rem', color: '#94a3b8', alignItems: 'center' }}>
                <Phone size={20} style={{ color: 'var(--primary-blue)', flexShrink: 0 }} />
                <span>+91 98765 43210</span>
              </li>
              <li style={{ display: 'flex', gap: '0.75rem', color: '#94a3b8', alignItems: 'center' }}>
                <Mail size={20} style={{ color: 'var(--primary-blue)', flexShrink: 0 }} />
                <span>support@buildapprove.in</span>
              </li>
            </ul>
          </div>
          
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
            &copy; 2026 BuildApprove. All rights reserved.
          </p>
          <div style={{ color: '#94a3b8', fontSize: '0.75rem', maxWidth: '400px', textAlign: 'right' }}>
            Disclaimer: BuildApprove is a private consultancy assisting with application processing and is not affiliated with any government department.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
