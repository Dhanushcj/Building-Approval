import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, ChevronDown, Grid, LayoutDashboard, FileText, CreditCard, PhoneCall, BarChart3, UserCog, Settings, CheckSquare, Users, Receipt, Home, ClipboardList, Wallet, Wrench } from 'lucide-react';
import { useLocation, NavLink } from 'react-router-dom';

const menuCategories = [
  {
    title: 'Sales & Enquiries',
    items: [
      { title: 'Customer Leads', icon: <Users size={18} strokeWidth={1.5} />, path: '/admin/leads' },
      { title: 'Enquiries', icon: <PhoneCall size={18} strokeWidth={1.5} />, path: '/admin/enquiries' },
    ]
  },
  {
    title: 'Operations',
    items: [
      { title: 'Applications', icon: <FileText size={18} strokeWidth={1.5} />, path: '/admin/applications' },
      { title: 'Quotations', icon: <FileText size={18} strokeWidth={1.5} />, path: '/admin/quotations' },
    ]
  },
  {
    title: 'Finance',
    items: [
      { title: 'Payments', icon: <CreditCard size={18} strokeWidth={1.5} />, path: '/admin/payments' },
      { title: 'Receipts', icon: <ClipboardList size={18} strokeWidth={1.5} />, path: '/admin/receipts' },
      { title: 'Expenses', icon: <Receipt size={18} strokeWidth={1.5} />, path: '/admin/expenses' },
      { title: 'Cash Book', icon: <Wallet size={18} strokeWidth={1.5} />, path: '/admin/cashbook' },
    ]
  },
  {
    title: 'Management',
    items: [
      { title: 'Attendance', icon: <CheckSquare size={18} strokeWidth={1.5} />, path: '/admin/attendance' },
      { title: 'Reports', icon: <BarChart3 size={18} strokeWidth={1.5} />, path: '/admin/reports' },
    ]
  },
  {
    title: 'System',
    items: [
      { title: 'Staff & Users', icon: <UserCog size={18} strokeWidth={1.5} />, path: '/admin/staff' },
      { title: 'Settings', icon: <Settings size={18} strokeWidth={1.5} />, path: '/admin/settings' },
    ]
  },
  {
    title: 'Maintenance',
    items: [
      { title: 'View Records', icon: <Wrench size={18} strokeWidth={1.5} />, path: '/admin/maintenance/view' },
      { title: 'System Logs', icon: <Wrench size={18} strokeWidth={1.5} />, path: '/admin/maintenance/logs' },
      { title: 'Revert Actions', icon: <Wrench size={18} strokeWidth={1.5} />, path: '/admin/maintenance/revert' },
    ]
  }
];

const AdminTopbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {/* Top row: Dark Blue Bar (Logo & Company Name) */}
      <div style={{ 
        backgroundColor: 'var(--sidebar-bg, #0f2b5b)', 
        height: '24px', 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 1.5rem',
        color: '#fff' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '4px', padding: '1px', display: 'flex' }}>
            <img src="/assets/logo.jpeg" alt="Logo" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
          </div>
          <div style={{ fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.02em', color: '#fff', fontFamily: 'var(--font-heading)' }}>
            C.B. BUILDING APPROVALS
          </div>
        </div>
      </div>

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
        
        {/* Left side: Grid Menu */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ position: 'relative' }} ref={menuRef}>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{ 
                background: 'transparent', border: 'none', 
                color: 'var(--primary)', cursor: 'pointer', padding: '0', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                borderRadius: '6px', transition: 'all 0.2s',
                width: '32px', height: '32px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px', width: '16px', height: '16px' }}>
                <div style={{ backgroundColor: 'currentColor', borderRadius: '1.5px' }}></div>
                <div style={{ backgroundColor: 'currentColor', borderRadius: '1.5px' }}></div>
                <div style={{ backgroundColor: 'currentColor', borderRadius: '1.5px' }}></div>
                <div style={{ backgroundColor: 'currentColor', borderRadius: '1.5px' }}></div>
              </div>
            </button>
            
            {isMenuOpen && (
              <div style={{ 
                position: 'absolute', top: '100%', left: '-1.5rem', marginTop: '0.5rem', width: '280px', 
                backgroundColor: '#fff', borderRadius: '0 0 8px 0', boxShadow: '0 10px 25px rgba(0,0,0,0.15)', 
                zIndex: 1000, overflow: 'hidden', color: 'var(--text-primary)',
                border: '1px solid var(--border-color)', borderTop: 'none', borderLeft: 'none'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '75vh', overflowY: 'auto', paddingBottom: '0.5rem' }}>
                  {menuCategories.map((category, catIdx) => (
                    <div key={catIdx}>
                      <div style={{ padding: '0.75rem 1.25rem 0.25rem', fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {category.title}
                      </div>
                      {category.items.map((item, idx) => (
                        <NavLink 
                          key={idx} 
                          to={item.path}
                          onClick={() => setIsMenuOpen(false)}
                          style={({ isActive }) => ({
                            display: 'flex', alignItems: 'center', gap: '0.75rem', 
                            padding: '0.6rem 1.25rem', textDecoration: 'none',
                            color: isActive ? 'var(--primary)' : 'var(--text-primary)',
                            backgroundColor: isActive ? 'rgba(23, 37, 84, 0.05)' : 'transparent',
                            borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                            transition: 'all 0.2s'
                          })}
                        >
                          <div style={{ color: 'var(--text-secondary)' }}>
                            {item.icon}
                          </div>
                          <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{item.title}</span>
                        </NavLink>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

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
