import React from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const AdminTopbar: React.FC = () => {
  const location = useLocation();
  
  // Create breadcrumb from path
  const pathParts = location.pathname.split('/').filter(Boolean);
  const currentPage = pathParts.length > 1 ? pathParts[1].charAt(0).toUpperCase() + pathParts[1].slice(1) : 'Overview';

  return (
    <header style={{
      height: '70px',
      backgroundColor: 'var(--topbar-bg, var(--white))',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 90
    }}>
      {/* Left side: Title & Breadcrumb */}
      <div>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--topbar-text, var(--dark-navy))', marginBottom: '0.1rem' }}>{currentPage}</h1>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          Dashboard / {currentPage}
        </div>
      </div>

      {/* Right side: Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        
        {/* Search */}
        <div style={{ position: 'relative', width: '300px' }}>
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
              outline: 'none'
            }}
          />
        </div>

        {/* Notifications */}
        <div style={{ position: 'relative', cursor: 'pointer', color: 'var(--text-secondary)' }}>
          <Bell size={20} />
          <div style={{
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary-blue)', // using primary blue as accent indicator for documents
            border: '2px solid var(--white)'
          }}></div>
        </div>

        {/* Profile Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', paddingLeft: '1rem', borderLeft: '1px solid var(--border-color)' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--primary-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 600, fontSize: '0.875rem' }}>
            AD
          </div>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--topbar-text, var(--dark-navy))' }}>Admin</div>
          <ChevronDown size={16} color="var(--text-secondary)" />
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;
