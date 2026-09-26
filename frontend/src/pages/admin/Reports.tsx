import React, { useState, useEffect } from 'react';
import { BarChart, Users, FileText, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Reports: React.FC = () => {
  const [reportData, setReportData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'https://building-approval.onrender.com/api';
        
        // Fetch all cases
        const res = await fetch(`${apiUrl}/cases`);
        if (!res.ok) throw new Error('Failed to fetch cases');
        const cases = await res.json();
        
        // Fetch all users (staff)
        const userRes = await fetch(`${apiUrl}/users`);
        if (!userRes.ok) throw new Error('Failed to fetch users');
        const users = await userRes.json();
        
        // Map staff
        const staffMap = new Map();
        users.forEach((u: any) => {
          if (u.role !== 'ADMIN') {
            staffMap.set(u.id, {
              id: u.id,
              name: u.name,
              staffId: u.staffId,
              totalAssigned: 0,
              completed: 0,
              pending: 0,
              rejected: 0
            });
          }
        });
        
        // Aggregate cases
        cases.forEach((c: any) => {
          if (c.assigned_staff_id && staffMap.has(c.assigned_staff_id)) {
            const staffStats = staffMap.get(c.assigned_staff_id);
            staffStats.totalAssigned += 1;
            
            if (c.status === 'APPROVED') {
              staffStats.completed += 1;
            } else if (c.status === 'REJECTED') {
              staffStats.rejected += 1;
            } else {
              staffStats.pending += 1;
            }
          }
        });
        
        setReportData(Array.from(staffMap.values()));
      } catch (err) {
        console.error("Error fetching report data:", err);
        toast.error("Failed to load reports");
      } finally {
        setLoading(false);
      }
    };
    
    fetchReport();
  }, []);

  const handleExport = () => {
    if (reportData.length === 0) {
      toast.error('No data to export');
      return;
    }

    const headers = ['Staff Member', 'Staff ID', 'Total Assigned', 'Pending', 'Approved (Completed)', 'Rejected', 'Completion Rate (%)'];
    const csvContent = [
      headers.join(','),
      ...reportData.map(staff => {
        const rate = staff.totalAssigned > 0 ? Math.round((staff.completed / staff.totalAssigned) * 100) : 0;
        return `"${staff.name}","${staff.staffId}",${staff.totalAssigned},${staff.pending},${staff.completed},${staff.rejected},${rate}`;
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `employee_performance_report_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Report exported successfully');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="heading-2">Reports & Analytics</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Track employee performance and application processing metrics.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem' }}>
          <div style={{ padding: '1rem', borderRadius: '0.75rem', backgroundColor: 'rgba(18, 55, 42, 0.1)', color: 'var(--primary)' }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary-dark)', lineHeight: 1 }}>{reportData.length}</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Total Staff Members</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem' }}>
          <div style={{ padding: '1rem', borderRadius: '0.75rem', backgroundColor: 'rgba(18, 55, 42, 0.1)', color: 'var(--primary)' }}>
            <FileText size={24} />
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary-dark)', lineHeight: 1 }}>
              {reportData.reduce((acc, curr) => acc + curr.totalAssigned, 0)}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Total Applications Assigned</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem' }}>
          <div style={{ padding: '1rem', borderRadius: '0.75rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#10b981', lineHeight: 1 }}>
              {reportData.reduce((acc, curr) => acc + curr.completed, 0)}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Total Applications Approved</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--primary-dark)' }}>Employee Performance Report</h2>
          <button onClick={handleExport} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
            <BarChart size={16} /> Export Data
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading report data...</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
                  <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>STAFF MEMBER</th>
                  <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>TOTAL ASSIGNED</th>
                  <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>PENDING</th>
                  <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>APPROVED (COMPLETED)</th>
                  <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>REJECTED</th>
                  <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>COMPLETION RATE</th>
                </tr>
              </thead>
              <tbody>
                {reportData.length > 0 ? reportData.map(staff => {
                  const completionRate = staff.totalAssigned > 0 
                    ? Math.round((staff.completed / staff.totalAssigned) * 100) 
                    : 0;
                  
                  return (
                    <tr key={staff.id} style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'white' }}>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: 500, color: 'var(--primary-dark)' }}>{staff.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{staff.staffId}</div>
                      </td>
                      <td style={{ padding: '1rem', fontWeight: 500 }}>{staff.totalAssigned}</td>
                      <td style={{ padding: '1rem', color: 'var(--warning-gold)', fontWeight: 500 }}>{staff.pending}</td>
                      <td style={{ padding: '1rem', color: 'var(--success-green)', fontWeight: 500 }}>{staff.completed}</td>
                      <td style={{ padding: '1rem', color: 'var(--error-red)', fontWeight: 500 }}>{staff.rejected}</td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ flex: 1, height: '6px', backgroundColor: 'var(--bg-secondary)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${completionRate}%`, height: '100%', backgroundColor: completionRate > 50 ? 'var(--success-green)' : 'var(--primary)' }} />
                          </div>
                          <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{completionRate}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                      No staff performance data available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
