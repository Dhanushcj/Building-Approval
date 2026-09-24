import React, { useState, useEffect } from 'react';
import { Palette, CheckCircle, RefreshCcw } from 'lucide-react';

const Settings: React.FC = () => {
  const [colors, setColors] = useState({
    primary: '#0B63CE',
    sidebarBg: '#0F2747',
    sidebarText: '#cbd5e1',
    sidebarIcon: '#94a3b8',
    topbarBg: '#FFFFFF',
    topbarText: '#0F2747',
    appBg: '#FFFFFF'
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedColorsStr = localStorage.getItem('themeColors');
    if (savedColorsStr) {
      setColors(JSON.parse(savedColorsStr));
    } else {
      // Check for legacy primary color
      const legacyPrimary = localStorage.getItem('themeColor');
      if (legacyPrimary) {
        setColors(prev => ({ ...prev, primary: legacyPrimary }));
      }
    }
  }, []);

  const handleChange = (key: keyof typeof colors, value: string) => {
    setColors(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    localStorage.setItem('themeColors', JSON.stringify(colors));
    // Also save legacy primary for backwards compatibility in other places just in case
    localStorage.setItem('themeColor', colors.primary);
    
    document.documentElement.style.setProperty('--primary-blue', colors.primary);
    document.documentElement.style.setProperty('--sidebar-bg', colors.sidebarBg);
    document.documentElement.style.setProperty('--sidebar-text', colors.sidebarText);
    document.documentElement.style.setProperty('--sidebar-icon', colors.sidebarIcon);
    document.documentElement.style.setProperty('--topbar-bg', colors.topbarBg);
    document.documentElement.style.setProperty('--topbar-text', colors.topbarText);
    document.documentElement.style.setProperty('--bg-primary', colors.appBg);
    
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const resetDefault = () => {
    const defaultColors = {
      primary: '#0B63CE',
      sidebarBg: '#0F2747',
      sidebarText: '#cbd5e1',
      sidebarIcon: '#94a3b8',
      topbarBg: '#FFFFFF',
      topbarText: '#0F2747',
      appBg: '#FFFFFF'
    };
    setColors(defaultColors);
    localStorage.setItem('themeColors', JSON.stringify(defaultColors));
    localStorage.setItem('themeColor', defaultColors.primary);
    
    document.documentElement.style.setProperty('--primary-blue', defaultColors.primary);
    document.documentElement.style.setProperty('--sidebar-bg', defaultColors.sidebarBg);
    document.documentElement.style.setProperty('--sidebar-text', defaultColors.sidebarText);
    document.documentElement.style.setProperty('--sidebar-icon', defaultColors.sidebarIcon);
    document.documentElement.style.setProperty('--topbar-bg', defaultColors.topbarBg);
    document.documentElement.style.setProperty('--topbar-text', defaultColors.topbarText);
    document.documentElement.style.setProperty('--bg-primary', defaultColors.appBg);
  };

  const ColorInput = ({ label, value, onChangeKey, desc }: { label: string, value: string, onChangeKey: keyof typeof colors, desc?: string }) => (
    <div style={{ marginBottom: '1.5rem' }}>
      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--dark-navy)', marginBottom: '0.5rem' }}>{label}</label>
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

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--dark-navy)', marginBottom: '0.5rem' }}>Application Settings</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Customize the appearance and behavior of your ERP system.</p>
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--white)', padding: '2rem', borderRadius: '0.75rem', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)', maxWidth: '800px' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--dark-navy)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Palette size={20} color="var(--primary-blue)" /> Theme Customization
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>Global & Branding</h4>
            <ColorInput label="Primary Theme Color" value={colors.primary} onChangeKey="primary" desc="Applied to buttons, links, and active states globally." />
            <ColorInput label="Application Background" value={colors.appBg} onChangeKey="appBg" desc="Main background color of the dashboard." />
          </div>
          
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>Sidebar Navigation</h4>
            <ColorInput label="Sidebar Background" value={colors.sidebarBg} onChangeKey="sidebarBg" />
            <ColorInput label="Sidebar Text" value={colors.sidebarText} onChangeKey="sidebarText" />
            <ColorInput label="Sidebar Icons" value={colors.sidebarIcon} onChangeKey="sidebarIcon" />
          </div>

          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>Top Navbar</h4>
            <ColorInput label="Navbar Background" value={colors.topbarBg} onChangeKey="topbarBg" />
            <ColorInput label="Navbar Text & Icons" value={colors.topbarText} onChangeKey="topbarText" />
          </div>
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
