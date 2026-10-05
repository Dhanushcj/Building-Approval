import React from 'react';
import { Search, Bell, ChevronDown, Home, ClipboardList } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const AdminTopbar: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {/* Second row: Tools (Grid Menu, Search, Profile) */}
      <header className="topbar-container" style={{ 
        backgroundColor: '#fff', 
        borderBottom: '1px solid var(--border-color)', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '0 1.5rem', 
        height: '48px',
        position: 'relative'
      }}>
        
        {/* Left side empty for spacing or future use */}
        <div></div>

        {/* Right side: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {/* Search */}
          <div className="hidden-mobile" style={{ position: 'relative', width: '250px' }}>
            <div style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
              <Search size={14} />
            </div>
            <input 
              type="text" 
              placeholder="Search applications, customers..." 
              style={{
                width: '100%', padding: '0.35rem 1rem 0.35rem 1.8rem', borderRadius: '2rem',
                border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)',
                fontSize: '0.8rem', outline: 'none', color: 'var(--text-primary)', transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
            />
          </div>

          {/* Quick Actions & Notifications */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', color: 'var(--text-secondary)' }}>
            <NavLink to="/admin" style={({isActive}) => ({ color: isActive ? 'var(--primary)' : 'inherit', display: 'flex', alignItems: 'center' })} title="Home">
              <Home size={18} strokeWidth={1.5} />
            </NavLink>
            <NavLink to="/admin/reports" style={({isActive}) => ({ color: isActive ? 'var(--primary)' : 'inherit', display: 'flex', alignItems: 'center' })} title="Reports Tray">
              <ClipboardList size={18} strokeWidth={1.5} />
            </NavLink>
            <div style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <Bell size={18} strokeWidth={1.5} />
              <div style={{ position: 'absolute', top: '-1px', right: '-1px', width: '7px', height: '7px', borderRadius: '50%', backgroundColor: 'var(--accent)', border: '1.5px solid #fff' }}></div>
            </div>
          </div>

          {/* Profile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', paddingLeft: '1rem', borderLeft: '1px solid var(--border-color)' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.75rem', fontFamily: 'var(--font-heading)' }}>
              AD
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-dark)', fontFamily: 'var(--font-heading)', lineHeight: 1 }}>Admin User</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Administrator</div>
            </div>
            <ChevronDown size={14} color="var(--text-secondary)" />
          </div>
        </div>
      </header>
    </div>
  );
};

export default AdminTopbar;
