import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Plus, Info, Pencil, ArrowUpDown, Search, FileText } from 'lucide-react';
import StatusBadge from '../../components/admin/StatusBadge';
import { recentApplications } from '../../data/mockData';


const ApplicationsList: React.FC = () => {
  const [applications, setApplications] = React.useState(recentApplications);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterOn, setFilterOn] = React.useState('select');
  const [subFilter, setSubFilter] = React.useState('select');
  const location = useLocation();
  const navigate = useNavigate();
  
  const isMaintenanceLogs = location.pathname.includes('/maintenance/logs');
  const isMaintenanceView = location.pathname.includes('/maintenance/view');
  const isMaintenanceRevert = location.pathname.includes('/maintenance/revert');
  const isMainList = !isMaintenanceLogs && !isMaintenanceView && !isMaintenanceRevert;

  React.useEffect(() => {
    const fetchCases = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'https://building-approval.onrender.com/api';
        const res = await fetch(`${apiUrl}/cases`);
        if (res.ok) {
          const casesData = await res.json();
          let mappedApps = casesData.map((c: any) => ({
            id: c.application_number || c.id,
            mongoId: c.id,
            customer: c.property?.owner_name || 'Unknown',
            mobile: c.property?.owner_phone || '',
            location: c.property?.jurisdiction || c.property?.village || '',
            type: 'Building',
            appType: c.approval_type,
            status: c.status,
            staff: c.assigned_staff?.name || 'Unassigned',
            date: new Date(c.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            days: (() => {
                 if (!c.created_at) return 0;
                 const start = new Date(c.created_at).getTime();
                 const isCompleted = ['Rejected', 'Approved'].includes(c.status);
                 const end = isCompleted && c.updated_at ? new Date(c.updated_at).getTime() : new Date().getTime();
                 return Math.ceil(Math.max(0, end - start) / (1000 * 60 * 60 * 24));
            })()
          }));
          
          const localCasesStr = localStorage.getItem('mock_saved_cases');
          if (localCasesStr) {
            const localCases = JSON.parse(localCasesStr);
            const mappedLocal = localCases.map((c: any) => ({
              id: c.application_number || c.id,
              mongoId: c.id,
              customer: c.property?.owner_name || 'Unknown',
              mobile: c.property?.owner_phone || '',
              location: c.property?.jurisdiction || c.property?.village || '',
              type: 'Building',
              appType: c.approval_type,
              status: c.status,
              staff: c.assigned_staff?.name || 'Unassigned',
              date: new Date(c.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
              days: 0
            }));
            mappedApps = [...mappedLocal, ...mappedApps];
          }
          
          setApplications(mappedApps);
        } else {
          const localCasesStr = localStorage.getItem('mock_saved_cases');
          if (localCasesStr) {
            const localCases = JSON.parse(localCasesStr);
            const mappedLocal = localCases.map((c: any) => ({
              id: c.application_number || c.id,
              mongoId: c.id,
              customer: c.property?.owner_name || 'Unknown',
              mobile: c.property?.owner_phone || '',
              location: c.property?.jurisdiction || c.property?.village || '',
              type: 'Building',
              appType: c.approval_type,
              status: c.status,
              staff: c.assigned_staff?.name || 'Unassigned',
              date: new Date(c.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
              days: 0
            }));
            setApplications(mappedLocal);
          } else {
            setApplications([]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch cases:", err);
        const localCasesStr = localStorage.getItem('mock_saved_cases');
        if (localCasesStr) {
          const localCases = JSON.parse(localCasesStr);
          const mappedLocal = localCases.map((c: any) => ({
            id: c.application_number || c.id,
            mongoId: c.id,
            customer: c.property?.owner_name || 'Unknown',
            mobile: c.property?.owner_phone || '',
            location: c.property?.jurisdiction || c.property?.village || '',
            type: 'Building',
            appType: c.approval_type,
            status: c.status,
            staff: c.assigned_staff?.name || 'Unassigned',
            date: new Date(c.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            days: 0
          }));
          setApplications(mappedLocal);
        } else {
          setApplications([]);
        }
      }
    };
    
    fetchCases();
    // Refresh periodically if desired or just once on mount
    const interval = setInterval(fetchCases, 10000);
    return () => clearInterval(interval);
  }, []);

  const filteredApplications = applications.filter(app => {
    const matchesSearch = searchTerm === '' || 
      app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.appType || '').toLowerCase().includes(searchTerm.toLowerCase());

    let matchesFilter = true;
    if (filterOn === 'Product' && subFilter !== 'select') {
      matchesFilter = (app.appType || '').toLowerCase().includes(subFilter.toLowerCase());
    } else if (filterOn === 'Status' && subFilter !== 'select') {
      matchesFilter = app.status.toLowerCase() === subFilter.toLowerCase();
    }

    let matchesMaintenance = true;
    const isCompleted = ['Approved', 'Rejected', 'Completed', 'COMPLETED'].includes(app.status) || (app.status && typeof app.status === 'string' && app.status.toUpperCase() === 'COMPLETED');
    
    if (isMainList) {
      matchesMaintenance = !isCompleted; // Hide completed in main list
    } else if (isMaintenanceLogs) {
      matchesMaintenance = isCompleted; // Only show completed in logs
    }
    // view and revert show all, so matchesMaintenance stays true

    return matchesSearch && matchesFilter && matchesMaintenance;
  });

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-dark)', margin: 0 }}>
          {isMaintenanceLogs ? 'Maintenance Logs' : 
           isMaintenanceView ? 'Maintenance View' : 
           isMaintenanceRevert ? 'Maintenance Revert' : 'Applications'}
        </h1>
        {isMainList && (
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem' }} onClick={() => navigate('/admin/applications/new')}>
            <Plus size={18} /> New Application
          </button>
        )}
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '1rem' }}>Proposal Process</h2>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Filter On:</label>
                <select 
                  value={filterOn} 
                  onChange={(e) => { setFilterOn(e.target.value); setSubFilter('select'); }}
                  style={{ padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid var(--border-color)', minWidth: '150px', backgroundColor: 'var(--bg-surface)' }}
                >
                  <option value="select">select</option>
                  <option value="Product">Product</option>
                  <option value="Status">Status</option>
                </select>
              </div>
              
              {filterOn !== 'select' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Select {filterOn}:</label>
                  <select 
                    value={subFilter} 
                    onChange={(e) => setSubFilter(e.target.value)}
                    style={{ padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid var(--border-color)', minWidth: '150px', backgroundColor: 'var(--bg-surface)' }}
                  >
                    <option value="select">select</option>
                    {filterOn === 'Product' && (
                      <>
                        <option value="Building Approval">Building Approval</option>
                        <option value="Plan Approval">Plan Approval</option>
                        <option value="Occupancy Cert">Occupancy Cert</option>
                        <option value="Regularisation">Regularisation</option>
                      </>
                    )}
                    {filterOn === 'Status' && (
                      <>
                        <option value="New">New</option>
                        <option value="Documents Pending">Documents Pending</option>
                        <option value="Verification">Verification</option>
                        <option value="Submitted">Submitted</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                      </>
                    )}
                  </select>
                </div>
              )}
            </div>
          </div>
          <div style={{ position: 'relative', width: '300px', alignSelf: 'flex-end' }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', top: '50%', right: '1rem', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Search any Values.." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '0.625rem 2.5rem 0.625rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', fontSize: '0.875rem', backgroundColor: 'transparent' }}
            />
          </div>
        </div>
        
        <div style={{ padding: '0 1.5rem 1rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary-dark)' }}>
          Total {filteredApplications.length} Records
        </div>

        <div className="table-responsive">
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#1e3a8a', borderBottom: '1px solid var(--border-color)' }}>
                {isMaintenanceRevert ? (
                  <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: 'white' }}>Revert</th>
                ) : (
                  <>
                    {!isMaintenanceView && !isMaintenanceLogs && (
                      <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: 'white' }}>Edit</th>
                    )}
                    <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: 'white' }}>View</th>
                  </>
                )}
                <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: 'white', cursor: 'pointer' }}><div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>Proposal No <ArrowUpDown size={12} style={{ opacity: 0.7 }} /></div></th>
                <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: 'white', cursor: 'pointer' }}><div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>Customer Name <ArrowUpDown size={12} style={{ opacity: 0.7 }} /></div></th>
                <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: 'white', cursor: 'pointer' }}><div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>Mobile Number <ArrowUpDown size={12} style={{ opacity: 0.7 }} /></div></th>
                <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: 'white', cursor: 'pointer' }}><div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>Current Status <ArrowUpDown size={12} style={{ opacity: 0.7 }} /></div></th>
                <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: 'white', cursor: 'pointer' }}><div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>Proposal Date <ArrowUpDown size={12} style={{ opacity: 0.7 }} /></div></th>
                <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: 'white', cursor: 'pointer' }}><div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>Product <ArrowUpDown size={12} style={{ opacity: 0.7 }} /></div></th>
                <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: 'white', cursor: 'pointer' }}><div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>Source <ArrowUpDown size={12} style={{ opacity: 0.7 }} /></div></th>
                <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: 'white', cursor: 'pointer' }}><div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>No of Days <ArrowUpDown size={12} style={{ opacity: 0.7 }} /></div></th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.length > 0 ? (
                filteredApplications.map((app, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.2s' }}>
                    {isMaintenanceRevert ? (
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <button 
                          onClick={async () => {
                            if (window.confirm('Are you sure you want to revert this application to Documents Pending?')) {
                              try {
                                const localCasesStr = localStorage.getItem('mock_saved_cases');
                                if (localCasesStr) {
                                  const localCases = JSON.parse(localCasesStr);
                                  const cIndex = localCases.findIndex((c: any) => c.id === app.id || c.application_number === app.id);
                                  if (cIndex !== -1) {
                                    localCases[cIndex].status = 'Documents Pending';
                                    localStorage.setItem('mock_saved_cases', JSON.stringify(localCases));
                                    window.dispatchEvent(new Event('storage'));
                                    alert('Application reverted to Documents Pending.');
                                  }
                                }
                              } catch(e) {}
                            }
                          }}
                          style={{ padding: '0.4rem 0.8rem', borderRadius: '0.25rem', backgroundColor: '#ef4444', border: 'none', color: 'white', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}
                        >
                          Revert
                        </button>
                      </td>
                    ) : (
                      <>
                        {!isMaintenanceView && !isMaintenanceLogs && (
                          <td style={{ padding: '0.75rem 1rem' }}>
                            <button 
                              onClick={() => navigate(`/admin/applications/${app.id}?edit=true`)}
                              style={{ padding: '0.4rem', borderRadius: '0.25rem', backgroundColor: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}
                              title="Edit Application"
                            >
                              <Pencil size={16} />
                            </button>
                          </td>
                        )}
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <button 
                            onClick={() => navigate(`/admin/applications/${app.id}`)}
                            style={{ padding: '0.4rem', borderRadius: '0.25rem', backgroundColor: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}
                            title="View Details"
                          >
                            <Info size={16} />
                          </button>
                        </td>
                      </>
                    )}
                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Link to={`/admin/applications/${app.id}`} style={{ fontWeight: 600, color: 'var(--primary)', textDecoration: 'none' }}>
                          {app.id}
                        </Link>
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary-dark)' }}>{app.customer}</div>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{app.mobile || '—'}</div>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <StatusBadge type="status" value={app.status} />
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      {app.date}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{app.type} - {app.appType}</div>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{app.source || 'Web'}</div>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary-dark)' }}>
                      {app.days !== undefined ? `${app.days} ${app.days === 1 ? 'day' : 'days'}` : '—'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} style={{ padding: '4rem 2rem', textAlign: 'center' }}>
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
