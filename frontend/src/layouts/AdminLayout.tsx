import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminTopbar from '../components/admin/AdminTopbar';

const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className="layout-wrapper">
      <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="layout-content">
        <AdminTopbar toggleSidebar={() => setIsSidebarOpen(prev => !prev)} />
        <main className="main-content-padding" style={{ flex: 1, padding: '2rem' }}>
          <Outlet />
        </main>
      </div>
      
      {/* Mobile Overlay */}
      <div 
        className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`} 
        onClick={() => setIsSidebarOpen(false)}
      ></div>
    </div>
  );
};

export default AdminLayout;
