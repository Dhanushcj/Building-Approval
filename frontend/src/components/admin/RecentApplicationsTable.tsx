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
      case 'Under Review':
        return <span style={{ padding: '0.35rem 0.85rem', borderRadius: '1rem', backgroundColor: 'rgba(11, 36, 27, 0.05)', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 600 }}>Under Review</span>;
      case 'Documents Pending':
      case 'Action Required':
        return <span style={{ padding: '0.35rem 0.85rem', borderRadius: '1rem', backgroundColor: 'rgba(214, 167, 86, 0.1)', color: 'var(--warning)', fontSize: '0.75rem', fontWeight: 600 }}>Awaiting Documents</span>;
      case 'Site Inspection':
        return <span style={{ padding: '0.35rem 0.85rem', borderRadius: '1rem', backgroundColor: 'rgba(201, 106, 74, 0.1)', color: 'var(--accent)', fontSize: '0.75rem', fontWeight: 600 }}>Site Inspection</span>;
      case 'Approved':
        return <span style={{ padding: '0.35rem 0.85rem', borderRadius: '1rem', backgroundColor: 'rgba(47, 125, 90, 0.1)', color: 'var(--success-green)', fontSize: '0.75rem', fontWeight: 600 }}>Approved</span>;
      default:
        return <span style={{ padding: '0.35rem 0.85rem', borderRadius: '1rem', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600 }}>{status}</span>;
    }
  };



  return (
    <div className="card" style={{ marginBottom: '2rem', flex: 1, padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <AlertTriangle size={20} color="var(--accent)" strokeWidth={2} />
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--primary-dark)', fontFamily: 'var(--font-heading)' }}>Applications Requiring Attention</h3>
        </div>
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', color: 'var(--accent)', fontWeight: 600, transition: 'color 0.2s' }}>
          View All <ArrowRight size={16} />
        </a>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Application No</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Customer</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Project</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Location</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Stage</th>

              <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Last Updated</th>
              <th style={{ padding: '1rem 1.5rem' }}></th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app, index) => (
              <tr key={index} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(237, 231, 218, 0.3)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: 700, color: 'var(--accent)' }}>{app.id}</td>
                <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--primary-dark)', fontWeight: 600 }}>{app.customer}</td>
                <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{app.type} Building</td>
                <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{app.location}</td>
                <td style={{ padding: '1rem 1.5rem' }}>{getStatusBadge(app.status)}</td>

                <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{app.date}</td>
                <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                  <button style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: '0.5rem', borderRadius: '50%', transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <ArrowRight size={18} />
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
