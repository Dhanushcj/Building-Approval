import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminTopbar from '../components/admin/AdminTopbar';

const AdminLayout: React.FC = () => {

  return (
    <div className="layout-wrapper" style={{ display: 'block' }}>
      <div className="layout-content" style={{ marginLeft: 0, width: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: '100vh' }}>
          <AdminTopbar />
          <main className="main-content-padding" style={{ flex: 1, padding: '2rem' }}>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
