import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, FileText,
  CreditCard, PhoneCall, BarChart3,
  UserCog, Settings, LogOut, CheckSquare, Users
} from 'lucide-react';


const menuItems = [
  { title: 'Dashboard', icon: <LayoutDashboard size={20} strokeWidth={1.5} />, path: '/admin' },
  { title: 'Customer Leads', icon: <Users size={20} strokeWidth={1.5} />, path: '/admin/leads' },
  { title: 'Enquiries', icon: <PhoneCall size={20} strokeWidth={1.5} />, path: '/admin/enquiries' },
  { title: 'Applications', icon: <FileText size={20} strokeWidth={1.5} />, path: '/admin/applications' },
  { title: 'Payments', icon: <CreditCard size={20} strokeWidth={1.5} />, path: '/admin/payments' },
  { title: 'Quotations', icon: <FileText size={20} strokeWidth={1.5} />, path: '/admin/quotations' },
  { title: 'Attendance', icon: <CheckSquare size={20} strokeWidth={1.5} />, path: '/admin/attendance' },
  { title: 'Reports', icon: <BarChart3 size={20} strokeWidth={1.5} />, path: '/admin/reports' },
  { title: 'Maintenance', icon: <Settings size={20} strokeWidth={1.5} />, path: '/admin/maintenance/logs', 
    subItems: [
      { title: 'Revert', path: '/admin/maintenance/revert' },
      { title: 'View', path: '/admin/maintenance/view' },
      { title: 'Logs', path: '/admin/maintenance/logs' },
    ]
  },
  { title: 'Staff & Users', icon: <UserCog size={20} strokeWidth={1.5} />, path: '/admin/staff' },
  { title: 'Settings', icon: <Settings size={20} strokeWidth={1.5} />, path: '/admin/settings' },
];

import { useLocation } from 'react-router-dom';

interface AdminSidebarProps {
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const [maintenanceOpen, setMaintenanceOpen] = React.useState(location.pathname.includes('/admin/maintenance'));
  
  React.useEffect(() => {
    if (location.pathname.includes('/admin/maintenance')) {
      setMaintenanceOpen(true);
    }
  }, [location.pathname]);
  return (
    <aside className={`admin-sidebar sidebar-container ${isOpen ? 'sidebar-open' : ''}`} style={{ backgroundColor: 'var(--sidebar-bg)' }}>
      {/* Logo Area */}
      <div style={{ padding: '2rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '4px', padding: '2px', display: 'flex' }}>
            <img src="/assets/logo.jpeg" alt="C.B. Building Approvals Logo" style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
          </div>
          <div className="sidebar-logo-text">
            <div style={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '0.02em', color: 'var(--bg-surface)', fontFamily: 'var(--font-heading)', lineHeight: 1.1 }}>
              C.B. BUILDING<br />APPROVALS
            </div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav style={{ flex: 1, padding: '1.5rem 0', overflowY: 'auto', overflowX: 'hidden' }}>
        <div className="sidebar-main-menu-text" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 1.5rem', marginBottom: '0.75rem' }}>Main Menu</div>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.25rem', padding: 0, margin: 0 }}>
          {menuItems.map((item, index) => (
            <li key={index}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {item.subItems ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '0.75rem 1.5rem',
                      color: maintenanceOpen ? 'var(--bg-surface)' : 'rgba(255,255,255,0.6)',
                      backgroundColor: maintenanceOpen ? 'rgba(255,255,255,0.05)' : 'transparent',
                      borderLeft: maintenanceOpen ? '4px solid var(--accent)' : '4px solid transparent',
                      cursor: 'pointer',
                      fontSize: '0.9375rem',
                      fontWeight: maintenanceOpen ? 600 : 500,
                      transition: 'all 0.2s'
                    }}
                    onClick={() => setMaintenanceOpen(!maintenanceOpen)}
                  >
                    <span style={{ color: maintenanceOpen ? 'var(--accent)' : 'rgba(255,255,255,0.5)', minWidth: '20px' }}>
                      {item.icon}
                    </span>
                    <span className="sidebar-text">{item.title}</span>
                  </div>
                ) : (
                  <NavLink
                    to={item.path}
                    end={item.path === '/admin'}
                    style={({ isActive }) => ({
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '0.75rem 1.5rem',
                      color: isActive ? 'var(--bg-surface)' : 'rgba(255,255,255,0.6)',
                      backgroundColor: isActive ? 'rgba(255,255,255,0.05)' : 'transparent',
                      borderLeft: isActive ? '4px solid var(--accent)' : '4px solid transparent',
                      textDecoration: 'none',
                      fontSize: '0.9375rem',
                      fontWeight: isActive ? 600 : 500,
                      transition: 'all 0.2s'
                    })}
                    onClick={() => setIsOpen && setIsOpen(false)}
                  >
                    {({ isActive }) => (
                      <>
                        <span style={{ color: isActive ? 'var(--accent)' : 'rgba(255,255,255,0.5)', minWidth: '20px' }}>
                          {item.icon}
                        </span>
                        <span className="sidebar-text">{item.title}</span>
                      </>
                    )}
                  </NavLink>
                )}
                {/* Sub Menu Items */}
                {item.subItems && maintenanceOpen && (
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0, backgroundColor: 'rgba(0,0,0,0.2)' }}>
                    {item.subItems.map((sub, subIndex) => (
                      <li key={subIndex}>
                        <NavLink
                          to={sub.path}
                          style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0.6rem 1.5rem 0.6rem 3.5rem',
                            color: isActive ? 'var(--bg-surface)' : 'rgba(255,255,255,0.5)',
                            textDecoration: 'none',
                            fontSize: '0.875rem',
                            fontWeight: isActive ? 600 : 400,
                            borderLeft: isActive ? '4px solid var(--accent)' : '4px solid transparent',
                            transition: 'all 0.2s'
                          })}
                          onClick={() => setIsOpen && setIsOpen(false)}
                        >
                          <span className="sidebar-text">{sub.title}</span>
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ul>
      </nav>

      {/* Profile Area */}
      <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
        <div style={{ minWidth: '40px', width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--accent)', color: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
          AD
        </div>
        <div className="sidebar-profile-info" style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--bg-surface)' }}>Admin User</div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--success-green)' }}></div>
            Administrator
          </div>
        </div>
        <button
          onClick={() => window.location.href = '/login'}
          style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', padding: '0.5rem', borderRadius: 'var(--border-radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
          title="Logout"
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--error-red)'; e.currentTarget.style.backgroundColor = 'rgba(185, 74, 72, 0.1)' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; e.currentTarget.style.backgroundColor = 'transparent' }}
        >
          <LogOut size={18} />
        </button>
      </div>

      {/* Custom Scrollbar Styles for the sidebar */}
      <style>{`
        .admin-sidebar nav::-webkit-scrollbar {
          width: 4px;
        }
        .admin-sidebar nav::-webkit-scrollbar-track {
          background: transparent;
        }
        .admin-sidebar nav::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 4px;
        }
      `}</style>
    </aside>
  );
};

export default AdminSidebar;
