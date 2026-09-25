import React, { useState, useEffect, useRef } from 'react';
import { Palette, CheckCircle, RefreshCcw, Moon, Sun, Camera } from 'lucide-react';

const ColorInput = ({ label, value, onChangeKey, desc, handleChange }: { label: string, value: string, onChangeKey: string, desc?: string, handleChange: (key: string, value: string) => void }) => (
  <div style={{ marginBottom: '1.5rem' }}>
    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>{label}</label>
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <input 
        type="color" 
        value={value} 
        onChange={(e) => handleChange(onChangeKey, e.target.value)}
        style={{ width: '50px', height: '50px', padding: '0', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' }}
      />
      <input 
        type="text" 
        value={value} 
        onChange={(e) => handleChange(onChangeKey, e.target.value)}
        style={{ padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '0.375rem', fontSize: '0.875rem' }}
      />
    </div>
    {desc && <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>{desc}</p>}
  </div>
);

const Settings: React.FC = () => {
  const [colors, setColors] = useState({
    primary: '#12372A',
    secondary: '#C96A4A'
  });
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedColorsStr = localStorage.getItem('themeColors');
    if (savedColorsStr) {
      setColors(JSON.parse(savedColorsStr));
    }
    const savedMode = localStorage.getItem('themeMode');
    if (savedMode === 'dark') {
      setThemeMode('dark');
    }
    const savedPic = localStorage.getItem('profilePicture');
    if (savedPic) {
      setProfilePic(savedPic);
    }
    
    // Cleanup to revert preview if not saved
    return () => {
      const actualMode = localStorage.getItem('themeMode') || 'light';
      if (actualMode === 'dark') {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    };
  }, []);

  const handleChange = (key: keyof typeof colors, value: string) => {
    setColors(prev => ({ ...prev, [key]: value }));
  };

  const handleModeChange = (mode: 'light' | 'dark') => {
    setThemeMode(mode);
    if (mode === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  const handlePicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveSettings = () => {
    localStorage.setItem('themeColors', JSON.stringify(colors));
    localStorage.setItem('themeColor', colors.primary);
    localStorage.setItem('themeMode', themeMode);
    if (profilePic) {
      localStorage.setItem('profilePicture', profilePic);
    }
    
    document.documentElement.style.setProperty('--primary', colors.primary);
    document.documentElement.style.setProperty('--primary-dark', colors.primary);
    document.documentElement.style.setProperty('--accent', colors.secondary);
    
    if (themeMode === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    
    // Dispatch event so topbar can update profile pic immediately
    window.dispatchEvent(new Event('profileUpdated'));
  };

  const resetDefault = () => {
    const defaultColors = {
      primary: '#12372A',
      secondary: '#C96A4A'
    };
    setColors(defaultColors);
    setThemeMode('light');
    
    localStorage.setItem('themeColors', JSON.stringify(defaultColors));
    localStorage.setItem('themeColor', defaultColors.primary);
    localStorage.setItem('themeMode', 'light');
    
    document.documentElement.style.setProperty('--primary', defaultColors.primary);
    document.documentElement.style.setProperty('--primary-dark', defaultColors.primary);
    document.documentElement.style.setProperty('--accent', defaultColors.secondary);
    
    document.body.classList.remove('dark-mode');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>Application Settings</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Customize the appearance and profile settings.</p>
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--bg-surface)', padding: '2rem', borderRadius: '0.75rem', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        
        {/* Profile Settings */}
        <div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Camera size={20} color="var(--primary)" /> Profile Picture
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--bg-secondary)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--border-color)' }}>
              {profilePic ? (
                <img src={profilePic} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ color: 'var(--text-muted)', fontSize: '2rem', fontWeight: 600 }}>A</span>
              )}
            </div>
            <div>
              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef}
                onChange={handlePicUpload}
                style={{ display: 'none' }}
              />
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn-secondary"
                style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
              >
                Upload Picture
              </button>
            </div>
          </div>
        </div>

        {/* Theme Settings */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Palette size={20} color="var(--primary)" /> Theme Customization
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>Brand Colors</h4>
              <ColorInput label="Primary Theme Color" value={colors.primary} onChangeKey="primary" desc="Changes the main green color." handleChange={(k, v) => handleChange(k as any, v)} />
              <ColorInput label="Secondary Color" value={colors.secondary} onChangeKey="secondary" desc="Changes the accent/terracotta color." handleChange={(k, v) => handleChange(k as any, v)} />
            </div>
            
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>Appearance Mode</h4>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  type="button"
                  onClick={() => handleModeChange('light')}
                  style={{ 
                    flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', 
                    border: themeMode === 'light' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                    borderRadius: '0.5rem', backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', cursor: 'pointer'
                  }}
                >
                  <Sun size={24} color={themeMode === 'light' ? 'var(--primary)' : 'var(--text-muted)'} />
                  <span style={{ fontWeight: themeMode === 'light' ? 600 : 400 }}>Light Mode</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleModeChange('dark')}
                  style={{ 
                    flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', 
                    border: themeMode === 'dark' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                    borderRadius: '0.5rem', backgroundColor: '#1C2420', color: 'white', cursor: 'pointer'
                  }}
                >
                  <Moon size={24} color={themeMode === 'dark' ? 'var(--primary)' : 'var(--text-muted)'} />
                  <span style={{ fontWeight: themeMode === 'dark' ? 600 : 400 }}>Dark Mode</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          <button 
            onClick={saveSettings}
            className="btn-primary"
            style={{ borderRadius: '0.375rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
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
