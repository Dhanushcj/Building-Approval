import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Save, User, Building, FileText, Upload } from 'lucide-react';
import { recentApplications } from '../../data/mockData';

const getStaffList = () => {
  const saved = localStorage.getItem('staffMembers');
  return saved ? JSON.parse(saved).filter((s: any) => s.status === 'Active') : [];
};

const NewApplication: React.FC = () => {
  const navigate = useNavigate();
  const staffList = getStaffList();
  
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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerName || !formData.mobile || !formData.propertyType || !formData.location || !formData.appType) {
      alert("Please fill all required fields before saving.");
      return;
    }

    if (editMode && existingApp) {
      const appIdx = recentApplications.findIndex(a => a.id === existingApp.id);
      if (appIdx !== -1) {
        recentApplications[appIdx] = {
          ...recentApplications[appIdx],
          customer: formData.customerName,
          mobile: formData.mobile,
          email: formData.email,
          aadhar: formData.aadhar,
          location: formData.location.charAt(0).toUpperCase() + formData.location.slice(1),
          address: formData.address,
          type: formData.propertyType.charAt(0).toUpperCase() + formData.propertyType.slice(1),
          appType: formData.appType === 'building' ? 'Building Approval' : formData.appType === 'plan' ? 'Plan Approval' : 'Occupancy Cert',
          staff: formData.staff || 'Unassigned',
          surveyNo: formData.surveyNo,
          plotArea: formData.plotArea,
          builtUpArea: formData.builtUpArea,
          floors: formData.floors
        };
        localStorage.setItem('recentApplications', JSON.stringify(recentApplications));
        window.dispatchEvent(new Event('storage'));
        navigate(isEmployee ? `/employee/applications/${existingApp.id}` : `/admin/applications/${existingApp.id}`);
        return;
      }
    }

    const newId = `BA-2026-00${129 + recentApplications.length}`;
    
    // Create new application object and push to mock array
    recentApplications.unshift({
      id: newId,
      customer: formData.customerName,
      mobile: formData.mobile,
      email: formData.email,
      aadhar: formData.aadhar,
      location: formData.location.charAt(0).toUpperCase() + formData.location.slice(1),
      address: formData.address,
      type: formData.propertyType.charAt(0).toUpperCase() + formData.propertyType.slice(1),
      appType: formData.appType === 'building' ? 'Building Approval' : formData.appType === 'plan' ? 'Plan Approval' : 'Occupancy Cert',
      staff: formData.staff || 'Unassigned',
      status: 'New',
      payment: 'Pending',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      surveyNo: formData.surveyNo,
      plotArea: formData.plotArea,
      builtUpArea: formData.builtUpArea,
      floors: formData.floors
    });
    
    // Persist to local storage
    localStorage.setItem('recentApplications', JSON.stringify(recentApplications));

    if (isEmployee) {
      navigate('/employee/applications');
    } else {
      navigate('/admin/applications');
    }
  };

  return (
    <div style={{ paddingBottom: '3rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button 
          onClick={() => isEmployee ? navigate('/employee/applications') : navigate('/admin/applications')}
          style={{ padding: '0.5rem', borderRadius: '0.25rem', backgroundColor: 'var(--white)', border: '1px solid var(--border-color)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <ArrowLeft size={20} color="var(--dark-navy)" />
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
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--dark-navy)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={20} color="var(--primary-blue)" /> Customer Information
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--dark-navy)', marginBottom: '0.5rem' }}>Customer Name *</label>
                <input type="text" value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} placeholder="Enter full name" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.25rem', border: '1px solid var(--border-color)', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--dark-navy)', marginBottom: '0.5rem' }}>Mobile Number *</label>
                <input type="tel" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} placeholder="+91" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.25rem', border: '1px solid var(--border-color)', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--dark-navy)', marginBottom: '0.5rem' }}>Email Address</label>
                <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="Email (Optional)" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.25rem', border: '1px solid var(--border-color)', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--dark-navy)', marginBottom: '0.5rem' }}>Aadhar Number</label>
                <input type="text" value={formData.aadhar} onChange={e => setFormData({...formData, aadhar: e.target.value})} placeholder="Aadhar Number" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.25rem', border: '1px solid var(--border-color)', outline: 'none' }} />
              </div>
              
              <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '0.5rem' }}>
                <div style={{ padding: '1rem', border: '1px dashed var(--border-color)', borderRadius: '0.5rem', textAlign: 'center', backgroundColor: 'var(--bg-secondary)', cursor: 'pointer' }}>
                  <Upload size={20} color="var(--text-secondary)" style={{ marginBottom: '0.5rem' }} />
                  <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--dark-navy)', marginBottom: '0.25rem' }}>Upload Aadhar Card</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Click or drag file</div>
                </div>
                <div style={{ padding: '1rem', border: '1px dashed var(--border-color)', borderRadius: '0.5rem', textAlign: 'center', backgroundColor: 'var(--bg-secondary)', cursor: 'pointer' }}>
                  <Upload size={20} color="var(--text-secondary)" style={{ marginBottom: '0.5rem' }} />
                  <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--dark-navy)', marginBottom: '0.25rem' }}>Upload PAN Card</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Click or drag file</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card" style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--dark-navy)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building size={20} color="var(--primary-blue)" /> Property Details
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--dark-navy)', marginBottom: '0.5rem' }}>Property Type *</label>
                <select value={formData.propertyType} onChange={e => setFormData({...formData, propertyType: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.25rem', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--white)' }}>
                  <option value="">Select Property Type</option>
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="industrial">Industrial</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--dark-navy)', marginBottom: '0.5rem' }}>Location Area *</label>
                <select value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.25rem', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--white)' }}>
                  <option value="">Select Area</option>
                  <option value="hosur">Hosur</option>
                  <option value="krishnagiri">Krishnagiri</option>
                  <option value="shoolagiri">Shoolagiri</option>
                  <option value="other">Other Area</option>
                </select>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--dark-navy)', marginBottom: '0.5rem' }}>Property Address *</label>
                <textarea value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} rows={3} placeholder="Complete property address" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.25rem', border: '1px solid var(--border-color)', outline: 'none', resize: 'vertical' }}></textarea>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--dark-navy)', marginBottom: '0.5rem' }}>Plot Area (Sq.ft)</label>
                <input type="number" value={formData.plotArea} onChange={e => setFormData({...formData, plotArea: e.target.value})} placeholder="0" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.25rem', border: '1px solid var(--border-color)', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--dark-navy)', marginBottom: '0.5rem' }}>Built-up Area (Sq.ft)</label>
                <input type="number" value={formData.builtUpArea} onChange={e => setFormData({...formData, builtUpArea: e.target.value})} placeholder="0" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.25rem', border: '1px solid var(--border-color)', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--dark-navy)', marginBottom: '0.5rem' }}>Survey No.</label>
                <input type="text" value={formData.surveyNo} onChange={e => setFormData({...formData, surveyNo: e.target.value})} placeholder="e.g. 124/3B" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.25rem', border: '1px solid var(--border-color)', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--dark-navy)', marginBottom: '0.5rem' }}>Total Floors</label>
                <input type="text" value={formData.floors} onChange={e => setFormData({...formData, floors: e.target.value})} placeholder="e.g. G+1" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.25rem', border: '1px solid var(--border-color)', outline: 'none' }} />
              </div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--dark-navy)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={20} color="var(--primary-blue)" /> Application Setup
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--dark-navy)', marginBottom: '0.5rem' }}>Application Type *</label>
                <select value={formData.appType} onChange={e => setFormData({...formData, appType: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.25rem', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--white)' }}>
                  <option value="">Select Service</option>
                  <option value="building">Building Approval</option>
                  <option value="plan">Plan Approval</option>
                  <option value="occupancy">Occupancy Certificate</option>
                  <option value="regularisation">Regularisation</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--dark-navy)', marginBottom: '0.5rem' }}>Assign Staff</label>
                {isEmployee ? (
                  <input type="text" value={loggedInUser} disabled style={{ width: '100%', padding: '0.75rem', borderRadius: '0.25rem', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: '#f1f5f9', color: '#64748b' }} />
                ) : (
                  <select value={formData.staff} onChange={e => setFormData({...formData, staff: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.25rem', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--white)' }}>
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
              <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--dark-navy)', marginBottom: '0.25rem' }}>Upload Initial Documents (Optional)</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Drag and drop files here, or click to browse</div>
            </div>
          </div>
        </div>

        {/* Right Side: Summary & Actions */}
        <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card">
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--dark-navy)', marginBottom: '1rem' }}>Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Status:</span>
                <span style={{ fontWeight: 600, color: 'var(--primary-blue)' }}>Draft</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Created By:</span>
                <span style={{ fontWeight: 500, color: 'var(--dark-navy)' }}>{loggedInUser}</span>
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
