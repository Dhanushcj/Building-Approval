import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2 } from 'lucide-react';

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
        alert('Invalid admin password');
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
          alert('Invalid password');
          return;
        }
      }
    }

    alert('User not found. Please check your credentials.');
  };

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)' }}>
      {/* Left Column - Illustration/Branding */}
      <div style={{ 
        flex: 1, 
        backgroundColor: 'var(--bg-secondary)', 
        display: 'none', 
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '4rem'
      }} className="desktop-only">
        <div style={{ maxWidth: '400px', textAlign: 'center' }}>
          <div style={{ 
            width: '200px', 
            height: '200px', 
            backgroundColor: 'rgba(11, 99, 206, 0.1)', 
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 3rem auto'
          }}>
            <Building2 size={80} color="var(--primary-blue)" />
          </div>
          <h2 className="heading-2" style={{ marginBottom: '1rem', color: 'var(--dark-navy)' }}>Manage Your Approval Applications</h2>
          <p className="text-lead" style={{ fontSize: '1rem' }}>
            Access your applications, documents, status updates and communication in one place.
          </p>
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
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--primary-blue)' }}>
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
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--dark-navy)', fontWeight: 500 }}>
                <input type="checkbox" style={{ accentColor: 'var(--primary-blue)' }} /> Remember me
              </label>
              <a href="#" style={{ color: 'var(--primary-blue)', fontWeight: 500 }}>Forgot Password?</a>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.875rem' }}>
              Login &rarr;
            </button>
            
            <div style={{ display: 'flex', alignItems: 'center', margin: '2rem 0' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }}></div>
              <span style={{ padding: '0 1rem', fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>OR</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }}></div>
            </div>

            <button type="button" className="btn-secondary" style={{ width: '100%', padding: '0.875rem' }}>
              Continue with Mobile OTP
            </button>
          </form>

          <div style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>New to BuildApprove? </span>
            <a href="#" style={{ color: 'var(--primary-blue)', fontWeight: 600 }}>Create Account</a>
          </div>
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
