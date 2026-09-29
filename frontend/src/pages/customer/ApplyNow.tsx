import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, User, Phone, Mail, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const ApplyNow: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: 'Residential',
    location: '',
    notes: '',
    propertyDetails: ''
  });

  const [files, setFiles] = useState<{ [key: string]: { data: string; name: string } }>({});

  const documentsList = [
    { id: 'sale_deed', label: 'Sale Deed *', accept: 'image/*,application/pdf' },
    { id: 'patta', label: 'Patta *', accept: 'image/*,application/pdf' },
    { id: 'fmb', label: 'FMB *', accept: 'image/*,application/pdf' },
    { id: 'pan', label: 'Pancard *', accept: 'image/*,application/pdf' },
    { id: 'aadhar', label: 'Aadhar Card *', accept: 'image/*,application/pdf' },
    { id: 'photo', label: 'Photo (Passport Size) *', accept: 'image/*' },
    { id: 'signature', label: 'Signature *', accept: 'image/*' },
    { id: 'building_plan', label: 'Building Plan *', accept: 'image/*,application/pdf' }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit for local storage
        toast.error('File size should be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setFiles(prev => ({
          ...prev,
          [type]: {
            data: event.target?.result as string,
            name: file.name
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if all required files are uploaded
    for (const doc of documentsList) {
      if (!files[doc.id]) {
        toast.error(`Please upload ${doc.label.replace(' *', '')}`);
        return;
      }
    }
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://building-approval.onrender.com/api';
      
      const payload = {
        ...formData,
        type: 'Lead',
        files
      };

      const response = await fetch(`${apiUrl}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      toast.success('Thank you! Your application details have been submitted. Our team will contact you shortly.');
      navigate('/');
    } catch (error) {
      toast.error('Failed to submit application. Uploaded files might be too large.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '4rem 1rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'var(--bg-surface)', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
        
        {/* Header */}
        <div style={{ backgroundColor: 'var(--primary-dark)', padding: '2rem', textAlign: 'center', color: 'var(--bg-surface)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '50%', marginBottom: '1rem' }}>
            <Building2 size={32} color="var(--primary)" />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>Apply Now</h1>
          <p style={{ color: '#cbd5e1', margin: 0 }}>Fill in your details and upload all required documents below.</p>
        </div>

        {/* Form */}
        <div style={{ padding: '2rem' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>Full Name *</label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                    <User size={18} />
                  </div>
                  <input 
                    type="text" 
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', fontSize: '0.875rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                    <Mail size={18} />
                  </div>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', fontSize: '0.875rem' }}
                  />
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>Phone Number *</label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                    <Phone size={18} />
                  </div>
                  <input 
                    type="tel" 
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', fontSize: '0.875rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>Project Type</label>
                <select 
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', fontSize: '0.875rem', backgroundColor: 'white' }}
                >
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Industrial">Industrial</option>
                  <option value="Institutional">Institutional</option>
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>Location *</label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                    <MapPin size={18} />
                  </div>
                  <input 
                    type="text" 
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="City / Area"
                    style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', fontSize: '0.875rem' }}
                  />
                </div>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>Property Details *</label>
              <textarea 
                name="propertyDetails"
                required
                value={formData.propertyDetails}
                onChange={handleChange}
                placeholder="Enter survey number, plot area, address, etc."
                rows={3}
                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', fontSize: '0.875rem', resize: 'vertical' }}
              />
            </div>

            <div style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--primary-dark)', borderBottom: '2px solid var(--bg-secondary)', paddingBottom: '0.5rem' }}>Required Documents</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Please upload clear copies of the following documents to process your application.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
              {documentsList.map((doc) => (
                <div key={doc.id}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={doc.label}>{doc.label}</label>
                  <div style={{ padding: '1rem 0.5rem', border: '1px dashed var(--border-color)', borderRadius: '0.5rem', backgroundColor: files[doc.id] ? 'rgba(34, 160, 107, 0.1)' : 'var(--bg-secondary)', textAlign: 'center', borderColor: files[doc.id] ? 'var(--success-green)' : 'var(--border-color)' }}>
                    <input type="file" accept={doc.accept} onChange={(e) => handleFileUpload(e, doc.id)} style={{ display: 'none' }} id={`upload-${doc.id}`} />
                    <label htmlFor={`upload-${doc.id}`} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.875rem', color: files[doc.id] ? 'var(--success-green)' : 'var(--primary)', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                        {files[doc.id]?.name || 'Click to browse'}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Max size 2MB</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>Additional Notes (Optional)</label>
              <textarea 
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any specific requirements or details..."
                rows={3}
                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', fontSize: '0.875rem', resize: 'vertical' }}
              />
            </div>

            <button type="submit" className="btn-primary" style={{ padding: '1rem', fontSize: '1rem', fontWeight: 600, marginTop: '1rem' }}>
              Submit Application
            </button>
            <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              By submitting this form, you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplyNow;
