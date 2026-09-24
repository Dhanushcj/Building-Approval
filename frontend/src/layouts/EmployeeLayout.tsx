import React from 'react';
import { Outlet } from 'react-router-dom';
import EmployeeSidebar from '../components/employee/EmployeeSidebar';
import EmployeeTopbar from '../components/employee/EmployeeTopbar';

const EmployeeLayout: React.FC = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      <EmployeeSidebar />
      <div style={{ flex: 1, marginLeft: '260px', display: 'flex', flexDirection: 'column' }}>
        <EmployeeTopbar />
        <main style={{ flex: 1, padding: '2rem' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default EmployeeLayout;
