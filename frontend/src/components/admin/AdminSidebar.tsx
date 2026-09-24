import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, FileText, Building, 
  CreditCard, PhoneCall, Bell, BarChart3, 
  UserCog, Settings, LogOut, UserCheck
} from 'lucide-react';

const menuItems = [
  { title: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin' },
  { title: 'Customer Leads', icon: <UserCog size={20} />, path: '/admin/leads' },
  { title: 'Applications', icon: <FileText size={20} />, path: '/admin/applications' },
  { title: 'Payments', icon: <CreditCard size={20} />, path: '/admin/payments' },
  { title: 'Enquiries', icon: <PhoneCall size={20} />, path: '/admin/followups' },
  { title: 'Attendance', icon: <UserCheck size={20} />, path: '/admin/attendance' },
  { title: 'Reports', icon: <BarChart3 size={20} />, path: '/admin/reports' },
  { title: 'Staff & Users', icon: <UserCog size={20} />, path: '/admin/staff' },
  { title: 'Settings', icon: <Settings size={20} />, path: '/admin/settings' },
];

const AdminSidebar: React.FC = () => {
  return (
    <aside className="admin-sidebar" style={{
      width: '260px',
      backgroundColor: 'var(--sidebar-bg, var(--dark-navy))',
      color: 'var(--sidebar-text, var(--white))',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 100,
    }}>
      {/* Logo Area */}
      <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Building color="var(--primary-blue)" size={28} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.125rem', letterSpacing: '0.05em' }}>BUILD APPROVAL ERP</div>
            <div style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase' }}>Government Approval Mgmt</div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav style={{ flex: 1, padding: '1rem 0', overflowY: 'auto' }}>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.25rem', padding: 0, margin: 0 }}>
          {menuItems.map((item, index) => (
            <li key={index}>
              <NavLink 
                to={item.path} 
                end={item.path === '/admin'}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.75rem 1.5rem',
                  color: isActive ? 'var(--white)' : 'var(--sidebar-text, #cbd5e1)',
                  backgroundColor: isActive ? 'rgba(11, 99, 206, 0.2)' : 'transparent',
                  borderLeft: isActive ? '4px solid var(--primary-blue)' : '4px solid transparent',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 500,
                  transition: 'all 0.2s'
                })}
              >
                {({ isActive }) => (
                  <>
                    <span style={{ color: isActive ? 'var(--primary-blue)' : 'var(--sidebar-icon, #94a3b8)' }}>
                      {item.icon}
                    </span>
                    {item.title}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Profile Area */}
      <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
          AD
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Admin</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--success-green)' }}></div>
            Administrator
          </div>
        </div>
        <button 
          onClick={() => window.location.href = '/login'}
          style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0.5rem', borderRadius: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
          title="Logout"
          onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--sidebar-icon, #94a3b8)'; e.currentTarget.style.backgroundColor = 'transparent' }}
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
