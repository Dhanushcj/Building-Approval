import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, User, Menu, X, MessageCircle } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showEnquireModal, setShowEnquireModal] = useState(false);
  const [enquiry, setEnquiry] = useState({ name: '', mobile: '', location: '' });

  const handleEnquireSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiry.name || !enquiry.mobile || !enquiry.location) return;

    const stored = localStorage.getItem('followUps');
    const followUps = stored ? JSON.parse(stored) : [];
    
    followUps.push({
      id: `EQ-${Math.floor(1000 + Math.random() * 9000)}`,
      name: enquiry.name,
      mobile: enquiry.mobile,
      location: enquiry.location,
      status: 'unassigned',
      timestamp: Date.now(),
      assignedTo: null,
      notes: ''
    });

    localStorage.setItem('followUps', JSON.stringify(followUps));
    window.dispatchEvent(new Event('storage'));
    
    alert('Thank you! Your enquiry has been submitted. We will contact you soon.');
    setShowEnquireModal(false);
    setEnquiry({ name: '', mobile: '', location: '' });
  };

  return (
    <header style={{ 
      position: 'sticky', 
      top: 0, 
      zIndex: 50, 
      backgroundColor: 'var(--white)',
      borderBottom: '1px solid var(--border-color)',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '80px' }}>
        
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ color: 'var(--primary-blue)' }}>
            <Building2 size={32} strokeWidth={2} />
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1 }}>
              <span style={{ color: 'var(--dark-navy)' }}>Build</span>
              <span style={{ color: 'var(--primary-blue)' }}>Approve</span>
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Your Construction Approval Partner
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav style={{ display: 'none' }} className="desktop-nav">
          <ul style={{ display: 'flex', gap: '2rem', listStyle: 'none' }}>
            <li><Link to="/" style={{ color: 'var(--dark-navy)', fontWeight: 500 }}>Home</Link></li>
            <li><a href="#services" style={{ color: 'var(--dark-navy)', fontWeight: 500 }}>Services</a></li>
            <li><a href="#how-it-works" style={{ color: 'var(--dark-navy)', fontWeight: 500 }}>How It Works</a></li>
            <li><Link to="/track-application" style={{ color: 'var(--dark-navy)', fontWeight: 500 }}>Track Application</Link></li>
            <li><a href="#about" style={{ color: 'var(--dark-navy)', fontWeight: 500 }}>About</a></li>
          </ul>
        </nav>

        {/* Action Buttons */}
        <div style={{ display: 'none', gap: '1rem', alignItems: 'center' }} className="desktop-nav">

          <Link to="/login" className="btn-secondary" style={{ padding: '0.6rem 1.25rem' }}>
            <User size={18} />
            Login
          </Link>
          <Link to="/apply" className="btn-primary" style={{ padding: '0.6rem 1.25rem' }}>
            Apply Now &rarr;
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="mobile-toggle"
          style={{ display: 'none', backgroundColor: 'transparent', color: 'var(--dark-navy)' }} 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

      </div>

      {/* Mobile Navigation Dropdown */}
      {isMenuOpen && (
        <div style={{ 
          position: 'absolute', 
          top: '100%', left: 0, right: 0, 
          backgroundColor: 'var(--white)', 
          borderBottom: '1px solid var(--border-color)',
          padding: '1rem',
          boxShadow: 'var(--shadow-md)'
        }}>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', listStyle: 'none', marginBottom: '1.5rem' }}>
            <li><Link to="/" onClick={() => setIsMenuOpen(false)} style={{ color: 'var(--dark-navy)', fontWeight: 500, display: 'block' }}>Home</Link></li>
            <li><a href="#services" onClick={() => setIsMenuOpen(false)} style={{ color: 'var(--dark-navy)', fontWeight: 500, display: 'block' }}>Services</a></li>
            <li><a href="#how-it-works" onClick={() => setIsMenuOpen(false)} style={{ color: 'var(--dark-navy)', fontWeight: 500, display: 'block' }}>How It Works</a></li>
            <li><Link to="/track-application" onClick={() => setIsMenuOpen(false)} style={{ color: 'var(--dark-navy)', fontWeight: 500, display: 'block' }}>Track Application</Link></li>
            <li><a href="#about" onClick={() => setIsMenuOpen(false)} style={{ color: 'var(--dark-navy)', fontWeight: 500, display: 'block' }}>About</a></li>
          </ul>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link to="/login" onClick={() => setIsMenuOpen(false)} className="btn-secondary" style={{ width: '100%' }}>
              <User size={18} /> Login
            </Link>
            <Link to="/apply" onClick={() => setIsMenuOpen(false)} className="btn-primary" style={{ width: '100%' }}>
              Apply Now &rarr;
            </Link>
          </div>
        </div>
      )}

      {/* Basic responsive styles using a style tag for simplicity in this component */}
      <style>{`
        @media (min-width: 1024px) {
          .desktop-nav { display: flex !important; }
        }
        @media (max-width: 1023px) {
          .mobile-toggle { display: block !important; }
        }
      `}</style>

      {/* Enquire Modal and Floating Button */}
      <button
        onClick={() => setShowEnquireModal(true)}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          zIndex: 999,
          backgroundColor: 'var(--white)',
          border: '2px solid var(--primary-blue)',
          color: 'var(--primary-blue)',
          borderRadius: '0.5rem',
          padding: '0.5rem 1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          boxShadow: 'var(--shadow-md)',
          cursor: 'pointer'
        }}
      >
        <MessageCircle size={24} />
        <div style={{ textAlign: 'left', fontSize: '0.9rem', fontWeight: 600, lineHeight: 1.2 }}>
          Enquire<br/>Now
        </div>
      </button>

      {showEnquireModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: 'var(--white)', borderRadius: '0.75rem', width: '100%', maxWidth: '400px', padding: '1.5rem', position: 'relative', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <button onClick={() => setShowEnquireModal(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
              <X size={20} />
            </button>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--dark-navy)', marginBottom: '0.5rem' }}>Enquire Now</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Enter your details to know about the process.</p>
            
            <form onSubmit={handleEnquireSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--dark-navy)', marginBottom: '0.25rem' }}>Name *</label>
                <input 
                  type="text" 
                  value={enquiry.name} 
                  onChange={e => setEnquiry({...enquiry, name: e.target.value})} 
                  placeholder="Your Name" 
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', outline: 'none' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--dark-navy)', marginBottom: '0.25rem' }}>Mobile Number *</label>
                <input 
                  type="tel" 
                  value={enquiry.mobile} 
                  onChange={e => setEnquiry({...enquiry, mobile: e.target.value})} 
                  placeholder="Your Mobile Number" 
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', outline: 'none' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--dark-navy)', marginBottom: '0.25rem' }}>Location *</label>
                <input 
                  type="text" 
                  value={enquiry.location} 
                  onChange={e => setEnquiry({...enquiry, location: e.target.value})} 
                  placeholder="Your Location" 
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', outline: 'none' }}
                  required
                />
              </div>
              <button type="submit" className="btn-primary" style={{ padding: '0.75rem', width: '100%', marginTop: '0.5rem' }}>
                Submit Enquiry
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
