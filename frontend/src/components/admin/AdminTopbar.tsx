import React from 'react';
import { Search, Bell, ChevronDown, Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface AdminTopbarProps {
  toggleSidebar?: () => void;
}

const AdminTopbar: React.FC<AdminTopbarProps> = ({ toggleSidebar }) => {
  const location = useLocation();
  
  // Create breadcrumb from path
  const pathParts = location.pathname.split('/').filter(Boolean);
  const currentPage = pathParts.length > 1 ? pathParts[1].charAt(0).toUpperCase() + pathParts[1].slice(1) : 'Overview';

  return (
    <header className="topbar-container" style={{ backgroundColor: 'var(--bg-surface)', boxShadow: '0 2px 8px rgba(11, 36, 27, 0.02)' }}>
      {/* Left side: Title & Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {toggleSidebar && (
          <button 
            className="show-mobile"
            style={{ display: 'none', background: 'none', border: 'none', color: 'var(--text-primary)', padding: '0.25rem', cursor: 'pointer' }} 
            onClick={toggleSidebar}
          >
            <Menu size={24} />
          </button>
        )}
        <div>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '0.1rem', fontFamily: 'var(--font-heading)' }}>{currentPage}</h1>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
          Dashboard <span style={{ color: 'var(--border-color)', margin: '0 4px' }}>/</span> <span style={{ color: 'var(--primary-dark)' }}>{currentPage}</span>
        </div>
      </div>
      </div>

      {/* Right side: Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        
        {/* Search */}
        <div className="hidden-mobile" style={{ position: 'relative', width: '300px' }}>
          <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
            <Search size={16} />
          </div>
          <input 
            type="text" 
            placeholder="Search applications, customers, properties..." 
            style={{
              width: '100%',
              padding: '0.5rem 1rem 0.5rem 2.25rem',
              borderRadius: '2rem',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-secondary)',
              fontSize: '0.875rem',
              outline: 'none',
              fontFamily: 'var(--font-family)',
              color: 'var(--text-primary)',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
          />
        </div>

        {/* Notifications */}
        <div style={{ position: 'relative', cursor: 'pointer', color: 'var(--text-secondary)' }}>
          <Bell size={20} strokeWidth={1.5} />
          <div style={{
            position: 'absolute',
            top: '-2px',
            right: '-2px',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: 'var(--accent)',
            border: '2px solid var(--bg-surface)'
          }}></div>
        </div>

        {/* Profile Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', paddingLeft: '1.25rem', borderLeft: '1px solid var(--border-color)' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--bg-surface)', fontWeight: 700, fontSize: '0.875rem', fontFamily: 'var(--font-heading)' }}>
            AD
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary-dark)', fontFamily: 'var(--font-heading)' }}>Admin User</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Administrator</div>
          </div>
          <ChevronDown size={16} color="var(--text-secondary)" />
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;
