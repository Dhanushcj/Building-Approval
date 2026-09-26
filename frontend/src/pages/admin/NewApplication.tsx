import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Save, User, Building, FileText, Upload } from 'lucide-react';
import { recentApplications } from '../../data/mockData';
import toast from 'react-hot-toast';



const NewApplication: React.FC = () => {
  const navigate = useNavigate();
  const [staffList, setStaffList] = useState<any[]>([]);

  React.useEffect(() => {
    const fetchStaff = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'https://building-approval.onrender.com/api';
        const res = await fetch(`${apiUrl}/users`);
        if (res.ok) {
          const data = await res.json();
          setStaffList(data.filter((s: any) => s.status === 'Active' && s.role === 'STAFF'));
        }
      } catch (e) {
        console.error('Failed to fetch staff list', e);
      }
    };
    fetchStaff();
  }, []);

  const loggedInUser = localStorage.getItem('loggedInUser') || 'Admin';
  const isEmployee = loggedInUser !== 'Admin';

  const location = useLocation();
  const editMode = location.state?.editMode || false;
  const existingApp = location.state?.appData;

  const [formData, setFormData] = useState({
    customerName: existingApp?.customer || '',
    mobile: existingApp?.mobile || '',
    email: existingApp?.email || '',
    aadhar: existingApp?.aadhar || '',
    propertyType: existingApp?.propertyType?.toLowerCase() || '',
    location: existingApp?.location?.toLowerCase() || '',
    address: existingApp?.address || '',
    appType: existingApp?.appType === 'Building Approval' ? 'building' : existingApp?.appType === 'Plan Approval' ? 'plan' : existingApp?.appType === 'Occupancy Cert' ? 'occupancy' : existingApp?.appType?.toLowerCase() || '',
    surveyNo: existingApp?.surveyNo || '',
    plotArea: existingApp?.plotArea?.replace(' sq.ft', '') || '',
    builtUpArea: existingApp?.builtUpArea?.replace(' sq.ft', '') || '',
    floors: existingApp?.floors || '',
    staff: existingApp?.staff && existingApp.staff !== 'Unassigned' ? existingApp.staff : (isEmployee ? loggedInUser : '')
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerName || !formData.mobile || !formData.propertyType || !formData.location || !formData.appType) {
      toast.error("Please fill all required fields before saving.");
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://building-approval.onrender.com/api';
      
      const payload = {
        approval_type: formData.appType === 'building' ? 'BUILDING_PLAN_APPROVAL' : 
                       formData.appType === 'plan' ? 'LAYOUT_APPROVAL' : 
                       formData.appType === 'occupancy' ? 'COMPLETION_CERTIFICATE' : 'BUILDING_PLAN_APPROVAL',
        status: 'INTAKE',
        property: {
          create: {
            owner_name: formData.customerName,
            owner_phone: formData.mobile,
            owner_email: formData.email || null,
            address: formData.address || 'Not provided',
            village: formData.location.charAt(0).toUpperCase() + formData.location.slice(1),
            taluk: formData.location.charAt(0).toUpperCase() + formData.location.slice(1),
            survey_number: formData.surveyNo || 'N/A',
            jurisdiction: 'DTCP',
            plot_area: formData.plotArea || null,
            built_up_area: formData.builtUpArea || null,
            floors: formData.floors || null,
            property_type: formData.propertyType || null
          }
        }
        
      };

      if (formData.staff) {
        const assignedStaffObj = staffList.find(s => s.name === formData.staff);
        if (assignedStaffObj) {
          (payload as any).assigned_staff_id = assignedStaffObj.id;
        }
      }

      if (editMode && existingApp) {
        toast.error("Editing existing applications via API is not implemented yet.");
        return;
      }

      const res = await fetch(`${apiUrl}/cases`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) {
        throw new Error("Failed to save application");
      }
      
      toast.success("Application created successfully!");
      if (isEmployee) {
        navigate('/employee/applications');
      } else {
        navigate('/admin/applications');
      }
    } catch (err) {
      console.error("Save error:", err);
      toast.error("An error occurred while saving the application.");
    }
  };

  return (
    <div style={{ paddingBottom: '3rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button 
          onClick={() => isEmployee ? navigate('/employee/applications') : navigate('/admin/applications')}
          style={{ padding: '0.5rem', borderRadius: '0.25rem', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <ArrowLeft size={20} color="var(--primary-dark)" />
        </button>
        <div>
          <h2 className="heading-2" style={{ marginBottom: '0.25rem' }}>{editMode ? 'Edit Application' : 'New Application'}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{editMode ? 'Update application details.' : 'Create a new building approval application.'}</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
        {/* Left Side: Form */}
        <div style={{ flex: '1' }}>
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={20} color="var(--primary)" /> Customer Information
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>Customer Name *</label>
                <input type="text" value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} placeholder="Enter full name" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.25rem', border: '1px solid var(--border-color)', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>Mobile Number *</label>
                <input type="tel" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} placeholder="+91" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.25rem', border: '1px solid var(--border-color)', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>Email Address</label>
                <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="Email (Optional)" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.25rem', border: '1px solid var(--border-color)', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>Aadhar Number</label>
                <input type="text" value={formData.aadhar} onChange={e => setFormData({...formData, aadhar: e.target.value})} placeholder="Aadhar Number" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.25rem', border: '1px solid var(--border-color)', outline: 'none' }} />
              </div>
              
              <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '0.5rem' }}>
                <div style={{ padding: '1rem', border: '1px dashed var(--border-color)', borderRadius: '0.5rem', textAlign: 'center', backgroundColor: 'var(--bg-secondary)', cursor: 'pointer' }}>
                  <Upload size={20} color="var(--text-secondary)" style={{ marginBottom: '0.5rem' }} />
                  <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--primary-dark)', marginBottom: '0.25rem' }}>Upload Aadhar Card</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Click or drag file</div>
                </div>
                <div style={{ padding: '1rem', border: '1px dashed var(--border-color)', borderRadius: '0.5rem', textAlign: 'center', backgroundColor: 'var(--bg-secondary)', cursor: 'pointer' }}>
                  <Upload size={20} color="var(--text-secondary)" style={{ marginBottom: '0.5rem' }} />
                  <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--primary-dark)', marginBottom: '0.25rem' }}>Upload PAN Card</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Click or drag file</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card" style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building size={20} color="var(--primary)" /> Property Details
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>Property Type *</label>
                <select value={formData.propertyType} onChange={e => setFormData({...formData, propertyType: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.25rem', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--bg-surface)' }}>
                  <option value="">Select Property Type</option>
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="industrial">Industrial</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>Location Area *</label>
                <select value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.25rem', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--bg-surface)' }}>
                  <option value="">Select Area</option>
                  <option value="hosur">Hosur</option>
                  <option value="krishnagiri">Krishnagiri</option>
                  <option value="shoolagiri">Shoolagiri</option>
                  <option value="other">Other Area</option>
                </select>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>Property Address *</label>
                <textarea value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} rows={3} placeholder="Complete property address" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.25rem', border: '1px solid var(--border-color)', outline: 'none', resize: 'vertical' }}></textarea>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>Plot Area (Sq.ft)</label>
                <input type="number" value={formData.plotArea} onChange={e => setFormData({...formData, plotArea: e.target.value})} placeholder="0" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.25rem', border: '1px solid var(--border-color)', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>Built-up Area (Sq.ft)</label>
                <input type="number" value={formData.builtUpArea} onChange={e => setFormData({...formData, builtUpArea: e.target.value})} placeholder="0" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.25rem', border: '1px solid var(--border-color)', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>Survey No.</label>
                <input type="text" value={formData.surveyNo} onChange={e => setFormData({...formData, surveyNo: e.target.value})} placeholder="e.g. 124/3B" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.25rem', border: '1px solid var(--border-color)', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>Total Floors</label>
                <input type="text" value={formData.floors} onChange={e => setFormData({...formData, floors: e.target.value})} placeholder="e.g. G+1" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.25rem', border: '1px solid var(--border-color)', outline: 'none' }} />
              </div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={20} color="var(--primary)" /> Application Setup
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>Application Type *</label>
                <select value={formData.appType} onChange={e => setFormData({...formData, appType: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.25rem', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--bg-surface)' }}>
                  <option value="">Select Service</option>
                  <option value="building">Building Approval</option>
                  <option value="plan">Plan Approval</option>
                  <option value="occupancy">Occupancy Certificate</option>
                  <option value="regularisation">Regularisation</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>Assign Staff</label>
                {isEmployee ? (
                  <input type="text" value={loggedInUser} disabled style={{ width: '100%', padding: '0.75rem', borderRadius: '0.25rem', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: '#f1f5f9', color: '#64748b' }} />
                ) : (
                  <select value={formData.staff} onChange={e => setFormData({...formData, staff: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.25rem', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--bg-surface)' }}>
                    <option value="">Auto Assign</option>
                    {staffList.length > 0 ? (
                      staffList.map((s: any) => (
                        <option key={s.id} value={s.name}>{s.name} — Staff Member</option>
                      ))
                    ) : (
                      <option value="" disabled>No staff added yet</option>
                    )}
                  </select>
                )}
              </div>
            </div>

            <div style={{ padding: '1.5rem', border: '1px dashed var(--border-color)', borderRadius: '0.5rem', textAlign: 'center', backgroundColor: 'var(--bg-secondary)' }}>
              <Upload size={24} color="var(--text-secondary)" style={{ marginBottom: '0.5rem' }} />
              <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--primary-dark)', marginBottom: '0.25rem' }}>Upload Initial Documents (Optional)</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Drag and drop files here, or click to browse</div>
            </div>
          </div>
        </div>

        {/* Right Side: Summary & Actions */}
        <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card">
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: '1rem' }}>Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Status:</span>
                <span style={{ fontWeight: 600, color: 'var(--primary)' }}>Draft</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Created By:</span>
                <span style={{ fontWeight: 500, color: 'var(--primary-dark)' }}>{loggedInUser}</span>
              </div>
            </div>
            
            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
              <button 
                onClick={handleSave}
                className="btn-primary" 
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem' }}
              >
                <Save size={18} /> Save Application
              </button>
              <button 
                onClick={() => isEmployee ? navigate('/employee/applications') : navigate('/admin/applications')}
                style={{ width: '100%', marginTop: '0.75rem', padding: '0.75rem', borderRadius: '0.25rem', backgroundColor: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontWeight: 500, cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewApplication;
