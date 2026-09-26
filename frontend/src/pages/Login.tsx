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
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--primary-dark)',
      backgroundImage: `linear-gradient(to bottom, rgba(18, 55, 42, 0.75), rgba(11, 36, 27, 0.90)), url('/assets/modern_architecture_login.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      padding: '2rem'
    }}>
      
      {/* Centered Login Form Container */}
      <div style={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
        backdropFilter: 'blur(10px)',
        padding: '2rem 2.5rem',
        borderRadius: '1rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        width: '100%', 
        maxWidth: '380px',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: 'var(--primary)' }}>
            <Building2 size={40} />
          </div>
          <h2 className="heading-2" style={{ fontSize: '1.75rem', marginBottom: '0.25rem', color: 'var(--primary-dark)' }}>Welcome Back</h2>
          <p style={{ color: '#4b5563', fontSize: '0.95rem' }}>Sign in to continue to BuildApprove</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label" style={{ color: 'var(--primary-dark)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem' }}>Email / Mobile</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Enter your email or mobile"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ backgroundColor: 'white', border: '1px solid #d1d5db', padding: '0.6rem 0.75rem', fontSize: '0.9rem' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label" style={{ color: 'var(--primary-dark)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem' }}>Password</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ backgroundColor: 'white', border: '1px solid #d1d5db', padding: '0.6rem 0.75rem', fontSize: '0.9rem' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1rem 0 1.5rem 0', fontSize: '0.8rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-dark)', fontWeight: 500 }}>
              <input type="checkbox" style={{ accentColor: 'var(--primary)', width: '0.9rem', height: '0.9rem' }} /> Remember me
            </label>
            <a href="#" style={{ color: 'var(--primary)', fontWeight: 600 }}>Forgot Password?</a>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', fontWeight: 600 }}>
            Login &rarr;
          </button>
          
        </form>
        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem' }}>
          <a href="/" style={{ color: '#6b7280', fontWeight: 500, textDecoration: 'none' }} className="hover:text-primary">&larr; Back to Website</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
