import React from 'react';
import { Outlet } from 'react-router-dom';
import EmployeeSidebar from '../components/employee/EmployeeSidebar';
import EmployeeTopbar from '../components/employee/EmployeeTopbar';

const EmployeeLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className="layout-wrapper">
      <EmployeeSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="layout-content">
        <EmployeeTopbar toggleSidebar={() => setIsSidebarOpen(prev => !prev)} />
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

export default EmployeeLayout;
