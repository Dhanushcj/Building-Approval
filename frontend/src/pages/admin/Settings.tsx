import React, { useState, useEffect } from 'react';
import { Palette, CheckCircle, RefreshCcw } from 'lucide-react';

const Settings: React.FC = () => {
  const [primaryColor, setPrimaryColor] = useState('#0B63CE');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedColor = localStorage.getItem('themeColor');
    if (savedColor) {
      setPrimaryColor(savedColor);
    }
  }, []);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrimaryColor(e.target.value);
  };

  const saveSettings = () => {
    localStorage.setItem('themeColor', primaryColor);
    document.documentElement.style.setProperty('--primary-blue', primaryColor);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const resetDefault = () => {
    const defaultColor = '#0B63CE';
    setPrimaryColor(defaultColor);
    localStorage.setItem('themeColor', defaultColor);
    document.documentElement.style.setProperty('--primary-blue', defaultColor);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--dark-navy)', marginBottom: '0.5rem' }}>Application Settings</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Customize the appearance and behavior of your ERP system.</p>
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--white)', padding: '2rem', borderRadius: '0.75rem', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)', maxWidth: '600px' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--dark-navy)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Palette size={20} color="var(--primary-blue)" /> Theme Customization
        </h3>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--dark-navy)', marginBottom: '0.5rem' }}>Primary Theme Color</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <input 
              type="color" 
              value={primaryColor} 
              onChange={handleColorChange}
              style={{ width: '50px', height: '50px', padding: '0', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' }}
            />
            <input 
              type="text" 
              value={primaryColor} 
              onChange={handleColorChange}
              style={{ padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '0.375rem', fontSize: '0.875rem' }}
            />
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            This color will be applied to buttons, links, active tabs, and navigation items globally.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          <button 
            onClick={saveSettings}
            style={{ padding: '0.75rem 1.5rem', backgroundColor: 'var(--primary-blue)', color: 'white', border: 'none', borderRadius: '0.375rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            {saved ? <CheckCircle size={18} /> : null} {saved ? 'Saved Successfully' : 'Save Settings'}
          </button>
          
          <button 
            onClick={resetDefault}
            style={{ padding: '0.75rem 1.5rem', backgroundColor: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-color)', borderRadius: '0.375rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <RefreshCcw size={18} /> Reset to Default
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
