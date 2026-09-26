import React, { useState, useEffect } from 'react';
import { Users, Search, Phone, Mail, FileText, CheckCircle, FilePlus, XCircle, X } from 'lucide-react';
import toast from 'react-hot-toast';

const EnquiriesList: React.FC = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [rejectingLeadId, setRejectingLeadId] = useState<string | null>(null);
  const [rejectionRemarks, setRejectionRemarks] = useState('');
  const [viewingLead, setViewingLead] = useState<any | null>(null);

  useEffect(() => {
    const loadLeads = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'https://building-approval.onrender.com/api';
        const res = await fetch(`${apiUrl}/leads`);
        if (res.ok) {
          const data = await res.json();
          const formattedLeads = data
            .filter((lead: any) => lead.type === 'Enquiry')
            .map((lead: any) => ({
              id: lead.id,
              displayId: lead.leadId || lead.id,
              name: lead.name,
              phone: lead.phone,
              email: lead.email || '',
              location: lead.location || '',
              projectType: lead.projectType || 'General Enquiry',
              propertyDetails: lead.propertyDetails || 'General Enquiry via Popup',
              date: new Date(lead.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
              status: lead.status,
              assignedTo: lead.assignedTo || '',
              aadharFile: lead.aadharFile,
              aadharFileName: lead.aadharFileName,
              buildingPhoto: lead.buildingPhoto,
              buildingPhotoName: lead.buildingPhotoName
            }));
          setLeads(formattedLeads);
        } else {
          // Fallback to empty if API fails
          setLeads([]);
        }
      } catch (error) {
        console.error("Failed to fetch leads:", error);
        setLeads([]);
      }
    };
    
    loadLeads();
    
    // Periodically refresh (since localStorage event won't fire across devices)
    const interval = setInterval(loadLeads, 10000);
    return () => clearInterval(interval);
  }, []);

  const markAsContacted = async (id: string) => {
    const updatedLeads = leads.map(lead => lead.id === id ? { ...lead, status: 'Contacted' } : lead);
    setLeads(updatedLeads);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://building-approval.onrender.com/api';
      await fetch(`${apiUrl}/leads/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Contacted' })
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleReject = async () => {
    if (!rejectingLeadId || !rejectionRemarks.trim()) return;
    const updatedLeads = leads.map(lead => lead.id === rejectingLeadId ? { ...lead, status: 'Rejected', rejectionRemarks } : lead);
    setLeads(updatedLeads);
    const id = rejectingLeadId;
    setRejectingLeadId(null);
    setRejectionRemarks('');
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://building-approval.onrender.com/api';
      await fetch(`${apiUrl}/leads/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Rejected' })
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateApplication = async (lead: any) => {
    // 1. Mark lead as Application Created
    const updatedLeads = leads.map(l => l.id === lead.id ? { ...l, status: 'Application Created' } : l);
    setLeads(updatedLeads);
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://building-approval.onrender.com/api';
      
      // Mark lead status
      await fetch(`${apiUrl}/leads/${lead.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Application Created' })
      });

      // 2. Create property
      const propRes = await fetch(`${apiUrl}/properties`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          owner_name: lead.name,
          owner_phone: lead.phone,
          owner_email: lead.email,
          village: lead.location || 'Unknown',
          taluk: 'Unknown',
          survey_number: lead.propertyDetails?.substring(0, 50) || 'Unknown',
          jurisdiction: 'HOSUR_CORPORATION'
        })
      });

      if (!propRes.ok) throw new Error('Failed to create property');
      const property = await propRes.json();

      // 3. Create case
      const caseRes = await fetch(`${apiUrl}/cases`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          property_id: property.id,
          approval_type: 'BUILDING_PLAN',
          status: 'INTAKE'
        })
      });

      if (!caseRes.ok) throw new Error('Failed to create case');
      const newCase = await caseRes.json();

      toast.success(`Application ${newCase.application_number || newCase.id} created successfully!`);
    } catch (e) {
      console.error(e);
      toast.error('Failed to create application');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-dark)', margin: '0 0 0.5rem 0' }}>Enquiries</h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>View and manage customer enquiries and requests.</p>
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
                  <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary)' }}>{lead.displayId}</td>
                  <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--primary-dark)', fontWeight: 500 }}>
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
                    <div style={{ fontWeight: 500, color: 'var(--primary-dark)' }}>{lead.projectType}</div>
                    <div>{lead.location}</div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{lead.date}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '1rem', 
                      backgroundColor: lead.status === 'New' ? '#fee2e2' : lead.status === 'Rejected' ? '#f3f4f6' : lead.status === 'Application Created' ? '#e0e7ff' : 'rgba(34, 160, 107, 0.1)', 
                      color: lead.status === 'New' ? 'var(--error-red)' : lead.status === 'Rejected' ? '#6b7280' : lead.status === 'Application Created' ? '#4f46e5' : 'var(--success-green)', 
                      fontSize: '0.75rem', 
                      fontWeight: 600 
                    }}>
                      {lead.status}
                    </span>
                    {lead.rejectionRemarks && (
                      <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--error-red)' }}>
                        <strong>Remark:</strong> {lead.rejectionRemarks}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    {lead.status === 'New' && (
                      <button 
                        onClick={() => markAsContacted(lead.id)}
                        style={{ padding: '0.4rem 0.75rem', borderRadius: '0.25rem', backgroundColor: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                      >
                        <CheckCircle size={14} /> Mark Contacted
                      </button>
                    )}
                    {lead.status === 'Contacted' && (
                      <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
                        <button 
                          onClick={() => setViewingLead(lead)}
                          style={{ padding: '0.4rem 0.75rem', borderRadius: '0.25rem', backgroundColor: 'var(--bg-secondary)', color: 'var(--primary-dark)', border: '1px solid var(--border-color)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}
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
                          style={{ padding: '0.4rem 0.75rem', borderRadius: '0.25rem', backgroundColor: 'var(--error-red)', color: 'white', border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}
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
                    <p>No enquiries found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {rejectingLeadId && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '0.75rem', width: '100%', maxWidth: '400px', padding: '1.5rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', position: 'relative' }}>
            <button onClick={() => { setRejectingLeadId(null); setRejectionRemarks(''); }} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
              <X size={20} />
            </button>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: '1rem' }}>Reject Application</h3>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>Rejection Remarks *</label>
              <textarea 
                value={rejectionRemarks}
                onChange={(e) => setRejectionRemarks(e.target.value)}
                placeholder="Please enter the reason for rejection..."
                rows={3}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', fontSize: '0.875rem', resize: 'vertical' }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button onClick={() => { setRejectingLeadId(null); setRejectionRemarks(''); }} style={{ padding: '0.6rem 1rem', borderRadius: '0.5rem', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--primary-dark)', fontWeight: 500, cursor: 'pointer', fontSize: '0.875rem' }}>
                Cancel
              </button>
              <button 
                onClick={handleReject}
                disabled={!rejectionRemarks.trim()}
                style={{ padding: '0.6rem 1rem', borderRadius: '0.5rem', backgroundColor: 'var(--error-red)', color: 'white', border: 'none', fontWeight: 500, cursor: rejectionRemarks.trim() ? 'pointer' : 'not-allowed', fontSize: '0.875rem', opacity: rejectionRemarks.trim() ? 1 : 0.6 }}
              >
                Reject Lead
              </button>
            </div>
          </div>
        </div>
      )}

      {viewingLead && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '0.75rem', width: '100%', maxWidth: '600px', padding: '1.5rem', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
            <button onClick={() => setViewingLead(null)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
              <X size={20} />
            </button>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '1.5rem' }}>Enquiry Details - {viewingLead.displayId}</h3>
            
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
              <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: '1rem' }}>Uploaded Documents</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '0.5rem' }}>
                  <div>
                    <strong style={{ fontSize: '0.875rem' }}>Aadhar Card</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{viewingLead.aadharFileName || 'Not uploaded'}</div>
                  </div>
                  {viewingLead.aadharFile && (
                    <a href={viewingLead.aadharFile} download={viewingLead.aadharFileName || 'aadhar'} style={{ padding: '0.4rem 1rem', backgroundColor: 'var(--primary)', color: 'white', borderRadius: '0.25rem', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 600 }}>Download</a>
                  )}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '0.5rem' }}>
                  <div>
                    <strong style={{ fontSize: '0.875rem' }}>Building Photo (GPS)</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{viewingLead.buildingPhotoName || 'Not uploaded'}</div>
                  </div>
                  {viewingLead.buildingPhoto && (
                    <a href={viewingLead.buildingPhoto} download={viewingLead.buildingPhotoName || 'building_photo'} style={{ padding: '0.4rem 1rem', backgroundColor: 'var(--primary)', color: 'white', borderRadius: '0.25rem', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 600 }}>Download</a>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setViewingLead(null)} style={{ padding: '0.6rem 1.5rem', borderRadius: '0.5rem', backgroundColor: 'var(--primary-dark)', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnquiriesList;
