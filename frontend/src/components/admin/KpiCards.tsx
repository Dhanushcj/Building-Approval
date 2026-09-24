import React, { useState, useEffect } from 'react';
import { Users, FileText, AlertTriangle, Building, CheckCircle2 } from 'lucide-react';
import { getApplicationStatus } from '../../utils/statusHelper';

const getKpiData = () => {
  const stored = localStorage.getItem('recentApplications');
  const apps: any[] = stored ? JSON.parse(stored) : [];

  const withStatuses = apps.map(app => ({
    ...app,
    status: getApplicationStatus(app.id, app.status)
  }));

  const total = withStatuses.length;
  const active = withStatuses.filter(a => !['Approved', 'Rejected'].includes(a.status)).length;
  const docsPending = withStatuses.filter(a => ['Documents Pending', 'Action Required', 'New'].includes(a.status)).length;
  const govReview = withStatuses.filter(a => ['Gov Verification', 'Site Inspection', 'Submitted', 'Under Review'].includes(a.status)).length;
  const approved = withStatuses.filter(a => a.status === 'Approved').length;

  return { total, active, docsPending, govReview, approved };
};

const KpiCards: React.FC = () => {
  const [kpi, setKpi] = useState(getKpiData());

  useEffect(() => {
    const update = () => setKpi(getKpiData());
    update();
    window.addEventListener('storage', update);
    return () => window.removeEventListener('storage', update);
  }, []);

  const cards = [
    {
      label: 'Total Applications',
      value: kpi.total,
      sub: kpi.total === 0 ? 'No applications yet' : `${kpi.active} active`,
      iconBg: 'rgba(11, 99, 206, 0.1)',
      iconColor: 'var(--primary-blue)',
      subColor: 'var(--success-green)',
      Icon: Users,
    },
    {
      label: 'Active Applications',
      value: kpi.active,
      sub: kpi.active === 0 ? 'None active' : `${kpi.active} in progress`,
      iconBg: 'rgba(59, 130, 246, 0.1)',
      iconColor: '#3b82f6',
      subColor: '#f59e0b',
      Icon: FileText,
    },
    {
      label: 'Pending Documents',
      value: kpi.docsPending,
      sub: kpi.docsPending === 0 ? 'All clear' : 'Waiting for upload',
      iconBg: 'rgba(245, 158, 11, 0.1)',
      iconColor: '#f59e0b',
      subColor: 'var(--text-secondary)',
      Icon: AlertTriangle,
    },
    {
      label: 'Government Review',
      value: kpi.govReview,
      sub: kpi.govReview === 0 ? 'None submitted' : 'Processing',
      iconBg: 'rgba(139, 92, 246, 0.1)',
      iconColor: '#8b5cf6',
      subColor: 'var(--text-secondary)',
      Icon: Building,
    },
    {
      label: 'Approved',
      value: kpi.approved,
      sub: kpi.approved === 0 ? 'None this month' : 'This month',
      iconBg: 'rgba(34, 160, 107, 0.1)',
      iconColor: 'var(--success-green)',
      subColor: 'var(--success-green)',
      Icon: CheckCircle2,
    },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
      {cards.map(({ label, value, sub, iconBg, iconColor, subColor, Icon }) => (
        <div key={label} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: iconBg, color: iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{label}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--dark-navy)' }}>{value}</div>
            <div style={{ fontSize: '0.75rem', color: subColor, fontWeight: 500 }}>{sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KpiCards;
