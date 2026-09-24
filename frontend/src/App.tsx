import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar'; 
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import TrackApplication from './pages/TrackApplication';
import AdminLayout from './layouts/AdminLayout';
import ApplicationsList from './pages/admin/ApplicationsList';
import ApplicationDetail from './pages/admin/ApplicationDetail';
import NewApplication from './pages/admin/NewApplication';
import CustomersList from './pages/admin/CustomersList';
import StaffList from './pages/admin/StaffList';
import CustomerUpload from './pages/customer/CustomerUpload';
import EmployeeLayout from './layouts/EmployeeLayout';
import MyApplications from './pages/employee/MyApplications';
// EmployeeApplicationDetail removed, using ApplicationDetail for both
import ApplyNow from './pages/customer/ApplyNow';
import CustomerLeads from './pages/admin/CustomerLeads';
import AttendanceList from './pages/admin/AttendanceList';
import EmployeeAttendance from './pages/employee/EmployeeAttendance';
import FollowUpsList from './pages/admin/FollowUpsList';

function App() {
  useEffect(() => {
    // Background task: Auto-assign unassigned follow-ups after 10 minutes
    const interval = setInterval(() => {
      const storedFollowUps = localStorage.getItem('followUps');
      if (!storedFollowUps) return;
      
      const followUps = JSON.parse(storedFollowUps);
      let changed = false;
      const now = Date.now();
      
      const staffSaved = localStorage.getItem('staffMembers');
      const staffList = staffSaved ? JSON.parse(staffSaved).filter((s: any) => s.status === 'Active') : [];
      if (staffList.length === 0) return;

      const assignedCounts: Record<string, number> = {};
      staffList.forEach((s: any) => assignedCounts[s.name] = 0);
      followUps.forEach((f: any) => {
        if (f.assignedTo && assignedCounts[f.assignedTo] !== undefined) {
          assignedCounts[f.assignedTo]++;
        }
      });

      const bestStaff = Object.keys(assignedCounts).reduce((a, b) => assignedCounts[a] < assignedCounts[b] ? a : b, staffList[0].name);

      followUps.forEach((f: any) => {
        if (f.status === 'unassigned' && (now - f.timestamp > 10 * 60 * 1000)) {
          f.status = 'followup';
          f.assignedTo = bestStaff;
          changed = true;
        }
      });

      if (changed) {
        localStorage.setItem('followUps', JSON.stringify(followUps));
        window.dispatchEvent(new Event('storage'));
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);
  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Main Website Routes with Navbar & Footer */}
          <Route path="/*" element={
            <>
              <Navbar />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/track-application" element={<TrackApplication />} />
                </Routes>
              </main>
              <Footer />
            </>
          } />
          
          {/* Standalone Layouts */}
          <Route path="/upload/:id" element={<CustomerUpload />} />
          <Route path="/apply" element={<ApplyNow />} />
          <Route path="/login" element={<Login />} />
          {/* Admin Layout */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            
            {/* Applications Module */}
            <Route path="applications" element={<ApplicationsList />} />
            <Route path="applications/new" element={<NewApplication />} />
            <Route path="applications/:id" element={<ApplicationDetail />} />
            
            {/* Customers Module */}
            <Route path="customers" element={<CustomersList />} />
            <Route path="leads" element={<CustomerLeads />} />
            
            {/* Staff Module */}
            <Route path="staff" element={<StaffList />} />
            <Route path="attendance" element={<AttendanceList />} />
            
            {/* Fallbacks for other routes */}
            <Route path="properties/*" element={<div style={{padding:'2rem'}}><h2>Properties Module</h2><p>Coming soon...</p></div>} />
            <Route path="documents/*" element={<div style={{padding:'2rem'}}><h2>Documents Module</h2><p>Coming soon...</p></div>} />
            <Route path="workflow/*" element={<div style={{padding:'2rem'}}><h2>Workflow Module</h2><p>Coming soon...</p></div>} />
            <Route path="payments/*" element={<div style={{padding:'2rem'}}><h2>Payments Module</h2><p>Coming soon...</p></div>} />
            <Route path="submissions/*" element={<div style={{padding:'2rem'}}><h2>Submissions Module</h2><p>Coming soon...</p></div>} />
            <Route path="tasks/*" element={<div style={{padding:'2rem'}}><h2>Tasks Module</h2><p>Coming soon...</p></div>} />
            <Route path="followups" element={<FollowUpsList />} />
            <Route path="reports/*" element={<div style={{padding:'2rem'}}><h2>Reports Module</h2><p>Coming soon...</p></div>} />
            <Route path="settings/*" element={<div style={{padding:'2rem'}}><h2>Settings Module</h2><p>Coming soon...</p></div>} />
          </Route>
          {/* Employee Layout */}
          <Route path="/employee" element={<EmployeeLayout />}>
            <Route index element={<EmployeeDashboard />} />
            
            {/* Application Module */}
            <Route path="applications" element={<MyApplications />} />
            <Route path="applications/new" element={<NewApplication />} />
            <Route path="applications/:id" element={<ApplicationDetail />} />
            
            {/* Fallbacks for other routes */}
            <Route path="attendance" element={<EmployeeAttendance />} />
            <Route path="followups" element={<FollowUpsList />} />
            <Route path="profile/*" element={<div style={{padding:'2rem'}}><h2>Profile</h2><p>Coming soon...</p></div>} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
