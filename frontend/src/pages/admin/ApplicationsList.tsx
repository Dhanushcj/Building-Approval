import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Eye, MoreVertical, FileText, Copy } from 'lucide-react';
import FilterPanel from '../../components/admin/FilterPanel';
import StatusBadge from '../../components/admin/StatusBadge';
import { recentApplications } from '../../data/mockData';
import { getApplicationStatus } from '../../utils/statusHelper';

const ApplicationsList: React.FC = () => {
  const [applications, setApplications] = React.useState(recentApplications);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterValues, setFilterValues] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    const fetchCases = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'https://building-approval.onrender.com/api';
        const res = await fetch(`${apiUrl}/cases`);
        if (res.ok) {
          const casesData = await res.json();
          const mappedApps = casesData.map((c: any) => ({
            id: c.id,
            customer: c.property?.owner_name || 'Unknown',
            mobile: c.property?.owner_phone || '',
            location: c.property?.jurisdiction || c.property?.village || '',
            type: 'Building', // Frontend expects something like 'Residential'
            appType: c.approval_type,
            status: c.status,
            staff: c.assigned_staff?.name || 'Unassigned',
            date: new Date(c.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
          }));
          setApplications(mappedApps);
        } else {
          setApplications([]);
        }
      } catch (err) {
        console.error("Failed to fetch cases:", err);
        setApplications([]);
      }
    };
    
    fetchCases();
    // Refresh periodically if desired or just once on mount
    const interval = setInterval(fetchCases, 10000);
    return () => clearInterval(interval);
  }, []);
  const navigate = useNavigate();

  const filterOptions = [
    { key: 'status', label: 'Status', options: ['New', 'Documents Pending', 'Verification', 'Submitted', 'Approved', 'Rejected'] },
    { key: 'type', label: 'Application Type', options: ['Building Approval', 'Plan Approval', 'Occupancy Cert', 'Regularisation'] },
    { key: 'location', label: 'Location', options: ['Hosur', 'Krishnagiri', 'Shoolagiri'] }
  ];

  const handleFilterChange = (key: string, value: string) => {
    setFilterValues(prev => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilterValues({});
    setSearchTerm('');
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = searchTerm === '' || 
      app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.appType || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !filterValues.status || filterValues.status === '' ||
      app.status.toLowerCase() === filterValues.status.toLowerCase();

    const matchesType = !filterValues.type || filterValues.type === '' ||
      (app.appType || '').toLowerCase().includes(filterValues.type.toLowerCase());

    const matchesLocation = !filterValues.location || filterValues.location === '' ||
      (app.location || '').toLowerCase().includes(filterValues.location.toLowerCase());

    return matchesSearch && matchesStatus && matchesType && matchesLocation;
  });

  const handleExport = () => {
    if (filteredApplications.length === 0) return;
    
    const headers = ['Application ID', 'Customer Name', 'Mobile', 'Property Type', 'Location', 'Current Stage', 'Assigned Staff', 'Last Updated'];
    const csvContent = [
      headers.join(','),
      ...filteredApplications.map(app => [
        app.id,
        `"${app.customer}"`,
        `"${app.mobile || ''}"`,
        `"${app.type} - ${app.appType}"`,
        `"${app.location}"`,
        `"${app.status}"`,
        `"${app.staff || 'Unassigned'}"`,
        `"${app.date}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `applications_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h2 className="heading-2" style={{ marginBottom: '0.25rem' }}>All Applications</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Manage and track all building approval applications.</p>
        </div>
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem' }} onClick={() => navigate('/admin/applications/new')}>
          <Plus size={18} /> New Application
        </button>
      </div>

      <FilterPanel 
        filters={filterOptions} 
        onFilterChange={handleFilterChange} 
        onReset={handleReset} 
        onExport={handleExport} 
        onSearch={setSearchTerm}
      />

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Application ID</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Customer</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Property & Type</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Current Stage</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Assigned Staff</th>

                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Last Updated</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.length > 0 ? (
                filteredApplications.map((app, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.2s' }}>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Link to={`/admin/applications/${app.id}`} style={{ fontWeight: 600, color: 'var(--primary)', textDecoration: 'none' }}>
                          {app.id}
                        </Link>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(app.id);
                            const btn = e.currentTarget;
                            btn.style.color = 'var(--success-green)';
                            setTimeout(() => btn.style.color = 'var(--text-secondary)', 2000);
                          }}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '0.2rem', display: 'flex', transition: 'color 0.2s' }}
                          title="Copy Application ID"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary-dark)' }}>{app.customer}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{app.mobile || '—'}</div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--primary-dark)' }}>{app.location}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{app.type} - {app.appType}</div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <StatusBadge type="status" value={app.status} />
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--primary-dark)' }}>
                      {app.staff && app.staff !== 'Unassigned' ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontWeight: 500 }}>
                          <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--primary)' }}></div>
                          {app.staff}
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-secondary)' }}>Unassigned</span>
                      )}
                    </td>

                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      {app.date}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button 
                          onClick={() => navigate(`/admin/applications/${app.id}`)}
                          style={{ padding: '0.5rem', borderRadius: '0.25rem', backgroundColor: 'var(--bg-secondary)', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button style={{ padding: '0.5rem', borderRadius: '0.25rem', backgroundColor: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                        <FileText size={32} color="var(--text-secondary)" />
                      </div>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>No applications found</h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', maxWidth: '400px', marginBottom: '1.5rem' }}>
                        There are currently no applications matching your criteria. Create a new application to get started.
                      </p>
                      <button className="btn-primary" style={{ padding: '0.75rem 1.5rem' }} onClick={() => navigate('/admin/applications/new')}>
                        Create Application
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          <div>Showing {filteredApplications.length > 0 ? 1 : 0} to {filteredApplications.length} of {filteredApplications.length} entries</div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button style={{ padding: '0.25rem 0.75rem', borderRadius: '0.25rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', cursor: 'pointer' }}>Previous</button>
            <button style={{ padding: '0.25rem 0.75rem', borderRadius: '0.25rem', border: '1px solid var(--primary)', backgroundColor: 'var(--primary)', color: 'white', cursor: 'pointer' }}>1</button>
            <button style={{ padding: '0.25rem 0.75rem', borderRadius: '0.25rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', cursor: 'pointer' }}>2</button>
            <button style={{ padding: '0.25rem 0.75rem', borderRadius: '0.25rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', cursor: 'pointer' }}>3</button>
            <button style={{ padding: '0.25rem 0.75rem', borderRadius: '0.25rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', cursor: 'pointer' }}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationsList;
