import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, User, Phone, Mail, MapPin } from 'lucide-react';

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

  const [aadharFile, setAadharFile] = useState<string | null>(null);
  const [aadharFileName, setAadharFileName] = useState('');
  const [buildingPhoto, setBuildingPhoto] = useState<string | null>(null);
  const [buildingPhotoName, setBuildingPhotoName] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'aadhar' | 'building') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit for local storage
        alert('File size should be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (type === 'aadhar') {
          setAadharFile(event.target?.result as string);
          setAadharFileName(file.name);
        } else {
          setBuildingPhoto(event.target?.result as string);
          setBuildingPhotoName(file.name);
        }
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
    // In a real app, send to backend
    // Here we save to localStorage to show in admin dashboard
    const existingLeads = JSON.parse(localStorage.getItem('customerLeads') || '[]');
    const newLead = {
      id: `L-${Math.floor(1000 + Math.random() * 9000)}`,
      ...formData,
      aadharFile,
      aadharFileName,
      buildingPhoto,
      buildingPhotoName,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'New'
    };
    
    try {
      localStorage.setItem('customerLeads', JSON.stringify([newLead, ...existingLeads]));

      // Send Thanks Email via Backend API
      if (formData.email) {
        try {
          const apiUrl = import.meta.env.VITE_API_URL || 'https://building-approval.onrender.com/api';
          await fetch(`${apiUrl}/notifications/lead-thanks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: formData.email, name: formData.name })
          });
        } catch (mailError) {
          console.error("Failed to send thanks email", mailError);
        }
      }

      alert('Thank you! Your application details have been submitted. Our team will contact you shortly.');
      navigate('/');
    } catch (error) {
      alert('Failed to submit application. Uploaded files might be too large.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '4rem 1rem' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: 'var(--white)', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
        
        {/* Header */}
        <div style={{ backgroundColor: 'var(--dark-navy)', padding: '2rem', textAlign: 'center', color: 'var(--white)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '50%', marginBottom: '1rem' }}>
            <Building2 size={32} color="var(--primary-blue)" />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>Apply Now</h1>
          <p style={{ color: '#cbd5e1', margin: 0 }}>Fill in your details below and our team will get in touch to assist with your building approval.</p>
        </div>

        {/* Form */}
        <div style={{ padding: '2rem' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--dark-navy)', marginBottom: '0.5rem' }}>Full Name *</label>
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--dark-navy)', marginBottom: '0.5rem' }}>Email Address</label>
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
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--dark-navy)', marginBottom: '0.5rem' }}>Phone Number *</label>
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
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--dark-navy)', marginBottom: '0.5rem' }}>Project Type</label>
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
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--dark-navy)', marginBottom: '0.5rem' }}>Location *</label>
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
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--dark-navy)', marginBottom: '0.5rem' }}>Property Details *</label>
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--dark-navy)', marginBottom: '0.5rem' }}>Upload Aadhar *</label>
                <div style={{ padding: '1rem', border: '1px dashed var(--border-color)', borderRadius: '0.5rem', backgroundColor: 'var(--bg-secondary)', textAlign: 'center' }}>
                  <input type="file" accept="image/*,application/pdf" onChange={(e) => handleFileUpload(e, 'aadhar')} style={{ display: 'none' }} id="aadharUpload" required={!aadharFile} />
                  <label htmlFor="aadharUpload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--primary-blue)', fontWeight: 500 }}>{aadharFileName || 'Click to browse'}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Max size 2MB</span>
                  </label>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--dark-navy)', marginBottom: '0.5rem' }}>Building Photo with GPS *</label>
                <div style={{ padding: '1rem', border: '1px dashed var(--border-color)', borderRadius: '0.5rem', backgroundColor: 'var(--bg-secondary)', textAlign: 'center' }}>
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'building')} style={{ display: 'none' }} id="buildingPhotoUpload" required={!buildingPhoto} />
                  <label htmlFor="buildingPhotoUpload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--primary-blue)', fontWeight: 500 }}>{buildingPhotoName || 'Click to browse'}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Max size 2MB</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--dark-navy)', marginBottom: '0.5rem' }}>Additional Notes (Optional)</label>
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
