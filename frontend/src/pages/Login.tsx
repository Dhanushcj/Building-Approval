import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Admin login
    if (email === 'admin@test.com' || email === 'admin') {
      if (password === 'admin123') {
        localStorage.setItem('loggedInUser', 'Admin');
        navigate('/admin');
        return;
      } else {
        toast.error('Invalid admin password');
        return;
      }
    }


    // Dynamic Staff Login
    const savedStaff = localStorage.getItem('staffMembers');
    if (savedStaff) {
      const staffList = JSON.parse(savedStaff);
      const staff = staffList.find((s: any) => s.mobile === email || s.email === email);
      
      if (staff) {
        if (staff.password === password) {
          localStorage.setItem('loggedInUser', staff.name);
          navigate('/employee');
          return;
        } else {
          toast.error('Invalid password');
          return;
        }
      }
    }

    toast.success('User not found. Please check your credentials.');
  };

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)' }}>
      {/* Left Column - Illustration/Branding */}
      <div style={{ 
        flex: 1.2, 
        backgroundColor: 'var(--primary-dark)',
        backgroundImage: `linear-gradient(to bottom, rgba(18, 55, 42, 0.85), rgba(11, 36, 27, 0.95)), url('/assets/modern_architecture_login.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'none', 
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '4rem',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }} className="desktop-only">
        
        {/* Decorative background glows */}
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(201, 106, 74, 0.2) 0%, transparent 70%)' }}></div>
        <div style={{ position: 'absolute', bottom: '20%', left: '-5%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(201, 106, 74, 0.15) 0%, transparent 70%)' }}></div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '4rem' }}>
            <div style={{ backgroundColor: 'var(--accent)', padding: '0.5rem', borderRadius: '0.5rem' }}>
              <Building2 size={24} color="white" />
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '0.05em' }}>BUILD APPROVE</span>
          </div>

          <h1 style={{ fontSize: '3rem', fontWeight: 700, lineHeight: 1.2, marginBottom: '1.5rem', fontFamily: 'var(--font-heading)' }}>
            Streamline your <br/><span style={{ color: 'var(--accent)' }}>approval workflow.</span>
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'rgba(255, 255, 255, 0.8)', maxWidth: '450px', lineHeight: 1.6 }}>
            Access applications, manage documents, and coordinate with your team in one unified workspace designed for modern construction management.
          </p>
        </div>

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '2rem' }}>
          <div className="hover-effect" style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.05)', 
            backdropFilter: 'blur(12px)', 
            border: '1px solid rgba(255, 255, 255, 0.1)', 
            padding: '1.5rem', 
            borderRadius: '1rem',
            flex: 1,
            transition: 'transform 0.3s ease, background-color 0.3s ease'
          }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--accent)', marginBottom: '0.25rem', fontFamily: 'var(--font-heading)' }}>40%</div>
            <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.5 }}>Faster Application<br/>Processing Time</div>
          </div>
          
          <div className="hover-effect" style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.05)', 
            backdropFilter: 'blur(12px)', 
            border: '1px solid rgba(255, 255, 255, 0.1)', 
            padding: '1.5rem', 
            borderRadius: '1rem',
            flex: 1,
            transition: 'transform 0.3s ease, background-color 0.3s ease'
          }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'white', marginBottom: '0.25rem', fontFamily: 'var(--font-heading)' }}>10k+</div>
            <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.5 }}>Projects Approved<br/>Successfully</div>
          </div>
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '2rem' 
      }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--primary)' }}>
              <Building2 size={40} />
            </div>
            <h2 className="heading-2" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Welcome Back</h2>
            <p className="text-secondary">Sign in to continue to BuildApprove</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email / Mobile Number</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Enter your email or mobile"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', fontSize: '0.875rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-dark)', fontWeight: 500 }}>
                <input type="checkbox" style={{ accentColor: 'var(--primary)' }} /> Remember me
              </label>
              <a href="#" style={{ color: 'var(--primary)', fontWeight: 500 }}>Forgot Password?</a>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.875rem' }}>
              Login &rarr;
            </button>
            
          </form>
          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
            <a href="/" style={{ color: 'var(--text-secondary)' }}>&larr; Back to Website</a>
          </div>
        </div>
      </div>
      
      <style>{`
        @media (min-width: 1024px) {
          .desktop-only { display: flex !important; }
        }
      `}</style>
    </div>
  );
};

export default Login;
