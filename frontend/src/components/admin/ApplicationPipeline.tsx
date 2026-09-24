import React, { useState, useEffect } from 'react';
import { FilePlus, FileText, CheckCircle, Send, Eye, Stamp } from 'lucide-react';
import { getApplicationStatus } from '../../utils/statusHelper';

const getPipelineCounts = () => {
  const stored = localStorage.getItem('recentApplications');
  const apps: any[] = stored ? JSON.parse(stored) : [];

  const counts = { New: 0, Documents: 0, Verification: 0, Submitted: 0, Inspection: 0, Approval: 0 };

  apps.forEach(app => {
    const status = getApplicationStatus(app.id, app.status);
    if (status === 'New') counts.New++;
    else if (['Documents Pending', 'Action Required'].includes(status)) counts.Documents++;
    else if (['Verification', 'Under Review'].includes(status)) counts.Verification++;
    else if (['Submitted', 'Gov Verification'].includes(status)) counts.Submitted++;
    else if (status === 'Site Inspection') counts.Inspection++;
    else if (status === 'Approved') counts.Approval++;
  });

  return counts;
};

const ApplicationPipeline: React.FC = () => {
  const [counts, setCounts] = useState(getPipelineCounts());

  useEffect(() => {
    const update = () => setCounts(getPipelineCounts());
    update();
    window.addEventListener('storage', update);
    return () => window.removeEventListener('storage', update);
  }, []);

  const pipelineStages = [
    { name: 'New',          count: counts.New,          icon: <FilePlus size={24} />,   color: '#94a3b8',                bgColor: '#f1f5f9' },
    { name: 'Documents',    count: counts.Documents,    icon: <FileText size={24} />,   color: '#f59e0b',                bgColor: '#fef3c7' },
    { name: 'Verification', count: counts.Verification, icon: <CheckCircle size={24} />,color: '#3b82f6',                bgColor: '#eff6ff' },
    { name: 'Submitted',    count: counts.Submitted,    icon: <Send size={24} />,        color: '#0ea5e9',                bgColor: '#e0f2fe' },
    { name: 'Inspection',   count: counts.Inspection,   icon: <Eye size={24} />,         color: '#eab308',                bgColor: '#fef08a' },
    { name: 'Approval',     count: counts.Approval,     icon: <Stamp size={24} />,       color: 'var(--success-green)',   bgColor: 'rgba(34, 160, 107, 0.1)' },
  ];

  return (
    <div className="card" style={{ marginBottom: '2rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--dark-navy)', marginBottom: '0.25rem' }}>Application Pipeline</h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Current stage distribution of all active applications.</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem' }}>
        {pipelineStages.map((stage, index) => (
          <React.Fragment key={index}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '100px' }}>
              <div style={{ 
                width: '64px', height: '64px', borderRadius: '16px', 
                backgroundColor: stage.bgColor, color: stage.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem',
                boxShadow: stage.count > 0 ? `0 4px 12px ${stage.color}33` : 'none',
                transition: 'box-shadow 0.3s',
              }}>
                {stage.icon}
              </div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--dark-navy)', marginBottom: '0.25rem' }}>{stage.name}</div>
              <div style={{ 
                fontSize: '1.25rem', fontWeight: 700, 
                color: stage.count > 0 ? stage.color : 'var(--text-secondary)' 
              }}>{stage.count}</div>
            </div>
            
            {index < pipelineStages.length - 1 && (
              <div style={{ flex: 1, minWidth: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--border-color)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ApplicationPipeline;
