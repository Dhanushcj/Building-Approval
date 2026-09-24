import React from 'react';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { recentApplications } from '../../data/mockData';
import { getApplicationStatus } from '../../utils/statusHelper';

const RecentApplicationsTable: React.FC = () => {
  const [applications, setApplications] = React.useState(recentApplications);

  React.useEffect(() => {
    const updateStatuses = () => {
      setApplications(prev => prev.map(app => ({
        ...app,
        status: getApplicationStatus(app.id, app.status)
      })));
    };
    
    updateStatuses();
    window.addEventListener('storage', updateStatuses);
    return () => window.removeEventListener('storage', updateStatuses);
  }, []);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Gov Verification':
        return <span style={{ padding: '0.25rem 0.75rem', borderRadius: '1rem', backgroundColor: '#eff6ff', color: '#3b82f6', fontSize: '0.75rem', fontWeight: 600 }}>Under Review</span>;
      case 'Documents Pending':
        return <span style={{ padding: '0.25rem 0.75rem', borderRadius: '1rem', backgroundColor: '#fef3c7', color: '#f59e0b', fontSize: '0.75rem', fontWeight: 600 }}>Awaiting Documents</span>;
      case 'Site Inspection':
        return <span style={{ padding: '0.25rem 0.75rem', borderRadius: '1rem', backgroundColor: '#e0f2fe', color: '#0ea5e9', fontSize: '0.75rem', fontWeight: 600 }}>Site Inspection</span>;
      case 'Approved':
        return <span style={{ padding: '0.25rem 0.75rem', borderRadius: '1rem', backgroundColor: 'rgba(34, 160, 107, 0.1)', color: 'var(--success-green)', fontSize: '0.75rem', fontWeight: 600 }}>Approved</span>;
      default:
        return <span style={{ padding: '0.25rem 0.75rem', borderRadius: '1rem', backgroundColor: '#f1f5f9', color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>{status}</span>;
    }
  };



  return (
    <div className="card" style={{ marginBottom: '2rem', flex: 1, padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertTriangle size={20} color="#ef4444" />
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--dark-navy)' }}>Applications Requiring Attention</h3>
        </div>
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', color: 'var(--primary-blue)', fontWeight: 500 }}>
          View All <ArrowRight size={16} />
        </a>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Application No</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Customer</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Project</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Location</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Current Stage</th>

              <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Last Updated</th>
              <th style={{ padding: '1rem 1.5rem' }}></th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app, index) => (
              <tr key={index} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary-blue)' }}>{app.id}</td>
                <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--dark-navy)' }}>{app.customer}</td>
                <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{app.type} Building</td>
                <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{app.location}</td>
                <td style={{ padding: '1rem 1.5rem' }}>{getStatusBadge(app.status)}</td>

                <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{app.date}</td>
                <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                  <button style={{ background: 'none', border: 'none', color: 'var(--primary-blue)', cursor: 'pointer' }}>
                    <ArrowRight size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentApplicationsTable;
