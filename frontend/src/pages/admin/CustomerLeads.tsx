import React, { useState, useEffect } from 'react';
import { Users, Search, Phone, Mail, FileText, CheckCircle, FilePlus, XCircle, X } from 'lucide-react';

const CustomerLeads: React.FC = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [rejectingLeadId, setRejectingLeadId] = useState<string | null>(null);
  const [rejectionRemarks, setRejectionRemarks] = useState('');
  const [viewingLead, setViewingLead] = useState<any | null>(null);

  useEffect(() => {
    // Load leads from local storage (simulated DB)
    const loadLeads = () => {
      const storedLeads = localStorage.getItem('customerLeads');
      if (storedLeads) {
        setLeads(JSON.parse(storedLeads));
      } else {
        // Mock data
        setLeads([
          { id: 'L-2041', name: 'Raj Kumar', phone: '9876543210', email: 'raj@example.com', projectType: 'Residential', location: 'Chennai', date: '24 Sep 2026', status: 'New', notes: 'Looking to construct 2 floors.' },
          { id: 'L-3921', name: 'Priya Sharma', phone: '8765432109', email: 'priya@example.com', projectType: 'Commercial', location: 'Coimbatore', date: '23 Sep 2026', status: 'Contacted', notes: 'Needs approval for a shop.' }
        ]);
      }
    };
    
    loadLeads();
    
    // Setup event listener to catch updates from the ApplyNow form
    window.addEventListener('storage', loadLeads);
    return () => window.removeEventListener('storage', loadLeads);
  }, []);

  const markAsContacted = (id: string) => {
    const updatedLeads = leads.map(lead => lead.id === id ? { ...lead, status: 'Contacted' } : lead);
    setLeads(updatedLeads);
    localStorage.setItem('customerLeads', JSON.stringify(updatedLeads));
  };

  const handleReject = () => {
    if (!rejectingLeadId || !rejectionRemarks.trim()) return;
    const updatedLeads = leads.map(lead => lead.id === rejectingLeadId ? { ...lead, status: 'Rejected', rejectionRemarks } : lead);
    setLeads(updatedLeads);
    localStorage.setItem('customerLeads', JSON.stringify(updatedLeads));
    setRejectingLeadId(null);
    setRejectionRemarks('');
  };

  const handleCreateApplication = (lead: any) => {
    // 1. Mark lead as Application Created
    const updatedLeads = leads.map(l => l.id === lead.id ? { ...l, status: 'Application Created' } : l);
    setLeads(updatedLeads);
    localStorage.setItem('customerLeads', JSON.stringify(updatedLeads));

    // 2. Create Application
    const newAppId = `BPA-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const storedApps = localStorage.getItem('recentApplications');
    const recentApps = storedApps ? JSON.parse(storedApps) : [];
    
    const newApp = {
      id: newAppId,
      customer: lead.name,
      mobile: lead.phone,
      type: lead.projectType,
      appType: 'Building Approval',
      location: lead.location,
      status: 'New',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      staff: 'Unassigned',
      leadId: lead.id
    };
    
    localStorage.setItem('recentApplications', JSON.stringify([newApp, ...recentApps]));
    
    // Trigger storage event so other tabs/components update
    window.dispatchEvent(new Event('storage'));
    
    alert(`Application ${newAppId} created successfully!`);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--dark-navy)', margin: '0 0 0.5rem 0' }}>Customer Leads</h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>View and manage customer application requests.</p>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Search leads..." 
              style={{ width: '100%', padding: '0.625rem 1rem 0.625rem 2.5rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', fontSize: '0.875rem' }}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Lead ID</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Customer</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Contact Info</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Project Details</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Date</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Status</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead, index) => (
                <tr key={index} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary-blue)' }}>{lead.id}</td>
                  <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--dark-navy)', fontWeight: 500 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                        <Users size={16} />
                      </div>
                      {lead.name}
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Phone size={14} /> {lead.phone}</div>
                      {lead.email && <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Mail size={14} /> {lead.email}</div>}
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    <div style={{ fontWeight: 500, color: 'var(--dark-navy)' }}>{lead.projectType}</div>
                    <div>{lead.location}</div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{lead.date}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '1rem', 
                      backgroundColor: lead.status === 'New' ? '#fee2e2' : lead.status === 'Rejected' ? '#f3f4f6' : lead.status === 'Application Created' ? '#e0e7ff' : 'rgba(34, 160, 107, 0.1)', 
                      color: lead.status === 'New' ? '#ef4444' : lead.status === 'Rejected' ? '#6b7280' : lead.status === 'Application Created' ? '#4f46e5' : 'var(--success-green)', 
                      fontSize: '0.75rem', 
                      fontWeight: 600 
                    }}>
                      {lead.status}
                    </span>
                    {lead.rejectionRemarks && (
                      <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#ef4444' }}>
                        <strong>Remark:</strong> {lead.rejectionRemarks}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    {lead.status === 'New' && (
                      <button 
                        onClick={() => markAsContacted(lead.id)}
                        style={{ padding: '0.4rem 0.75rem', borderRadius: '0.25rem', backgroundColor: 'var(--primary-blue)', color: 'white', border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                      >
                        <CheckCircle size={14} /> Mark Contacted
                      </button>
                    )}
                    {lead.status === 'Contacted' && (
                      <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
                        <button 
                          onClick={() => setViewingLead(lead)}
                          style={{ padding: '0.4rem 0.75rem', borderRadius: '0.25rem', backgroundColor: 'var(--bg-secondary)', color: 'var(--dark-navy)', border: '1px solid var(--border-color)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                        >
                          <FileText size={14} /> View Details
                        </button>
                        <button 
                          onClick={() => handleCreateApplication(lead)}
                          style={{ padding: '0.4rem 0.75rem', borderRadius: '0.25rem', backgroundColor: 'var(--success-green)', color: 'white', border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                        >
                          <FilePlus size={14} /> Create App
                        </button>
                        <button 
                          onClick={() => setRejectingLeadId(lead.id)}
                          style={{ padding: '0.4rem 0.75rem', borderRadius: '0.25rem', backgroundColor: '#ef4444', color: 'white', border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                        >
                          <XCircle size={14} /> Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: '3rem 1.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    <FileText size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                    <p>No customer leads found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {rejectingLeadId && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: 'var(--white)', borderRadius: '0.75rem', width: '100%', maxWidth: '400px', padding: '1.5rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', position: 'relative' }}>
            <button onClick={() => { setRejectingLeadId(null); setRejectionRemarks(''); }} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
              <X size={20} />
            </button>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--dark-navy)', marginBottom: '1rem' }}>Reject Application</h3>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--dark-navy)', marginBottom: '0.5rem' }}>Rejection Remarks *</label>
              <textarea 
                value={rejectionRemarks}
                onChange={(e) => setRejectionRemarks(e.target.value)}
                placeholder="Please enter the reason for rejection..."
                rows={3}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', fontSize: '0.875rem', resize: 'vertical' }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button onClick={() => { setRejectingLeadId(null); setRejectionRemarks(''); }} style={{ padding: '0.6rem 1rem', borderRadius: '0.5rem', backgroundColor: 'var(--white)', border: '1px solid var(--border-color)', color: 'var(--dark-navy)', fontWeight: 500, cursor: 'pointer', fontSize: '0.875rem' }}>
                Cancel
              </button>
              <button 
                onClick={handleReject}
                disabled={!rejectionRemarks.trim()}
                style={{ padding: '0.6rem 1rem', borderRadius: '0.5rem', backgroundColor: '#ef4444', color: 'white', border: 'none', fontWeight: 500, cursor: rejectionRemarks.trim() ? 'pointer' : 'not-allowed', fontSize: '0.875rem', opacity: rejectionRemarks.trim() ? 1 : 0.6 }}
              >
                Reject Lead
              </button>
            </div>
          </div>
        </div>
      )}

      {viewingLead && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: 'var(--white)', borderRadius: '0.75rem', width: '100%', maxWidth: '600px', padding: '1.5rem', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
            <button onClick={() => setViewingLead(null)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
              <X size={20} />
            </button>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--dark-navy)', marginBottom: '1.5rem' }}>Lead Details - {viewingLead.id}</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <strong style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Customer Name</strong>
                <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{viewingLead.name}</div>
              </div>
              <div>
                <strong style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Project Type</strong>
                <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{viewingLead.projectType}</div>
              </div>
              <div>
                <strong style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Phone Number</strong>
                <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{viewingLead.phone}</div>
              </div>
              <div>
                <strong style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Location</strong>
                <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{viewingLead.location}</div>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <strong style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Property Details</strong>
                <div style={{ fontSize: '0.875rem', padding: '0.75rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '0.5rem', marginTop: '0.25rem', whiteSpace: 'pre-wrap' }}>{viewingLead.propertyDetails || 'No additional property details provided.'}</div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--dark-navy)', marginBottom: '1rem' }}>Uploaded Documents</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '0.5rem' }}>
                  <div>
                    <strong style={{ fontSize: '0.875rem' }}>Aadhar Card</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{viewingLead.aadharFileName || 'Not uploaded'}</div>
                  </div>
                  {viewingLead.aadharFile && (
                    <a href={viewingLead.aadharFile} download={viewingLead.aadharFileName || 'aadhar'} style={{ padding: '0.4rem 1rem', backgroundColor: 'var(--primary-blue)', color: 'white', borderRadius: '0.25rem', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 600 }}>Download</a>
                  )}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '0.5rem' }}>
                  <div>
                    <strong style={{ fontSize: '0.875rem' }}>Building Photo (GPS)</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{viewingLead.buildingPhotoName || 'Not uploaded'}</div>
                  </div>
                  {viewingLead.buildingPhoto && (
                    <a href={viewingLead.buildingPhoto} download={viewingLead.buildingPhotoName || 'building_photo'} style={{ padding: '0.4rem 1rem', backgroundColor: 'var(--primary-blue)', color: 'white', borderRadius: '0.25rem', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 600 }}>Download</a>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setViewingLead(null)} style={{ padding: '0.6rem 1.5rem', borderRadius: '0.5rem', backgroundColor: 'var(--dark-navy)', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerLeads;
