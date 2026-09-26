import React, { useState, useEffect } from 'react';
import { Users, FileText, AlertTriangle, Building, CheckCircle2 } from 'lucide-react';
import { getApplicationStatus } from '../../utils/statusHelper';

const KpiCards: React.FC = () => {
  const [kpi, setKpi] = useState({ total: 0, active: 0, docsPending: 0, govReview: 0, approved: 0 });

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'https://building-approval.onrender.com/api';
        const res = await fetch(`${apiUrl}/cases`);
        if (res.ok) {
          const apps = await res.json();
          const total = apps.length;
          const active = apps.filter((a: any) => !['APPROVED', 'CLOSED'].includes(a.status)).length;
          const docsPending = apps.filter((a: any) => ['DOCUMENT_COLLECTION', 'ACTION_NEEDED', 'INTAKE'].includes(a.status)).length;
          const govReview = apps.filter((a: any) => ['SUBMITTED', 'SCRUTINY', 'INSPECTION_SCHEDULED', 'INSPECTION_DONE'].includes(a.status)).length;
          const approved = apps.filter((a: any) => a.status === 'APPROVED').length;
          setKpi({ total, active, docsPending, govReview, approved });
        }
      } catch (err) {
        console.error("Failed to fetch kpi data:", err);
      }
    };

    fetchCases();
    const interval = setInterval(fetchCases, 10000);
    return () => clearInterval(interval);
  }, []);

  const cards = [
    {
      label: 'Total Applications',
      value: kpi.total,
      sub: kpi.total === 0 ? 'No applications yet' : `${kpi.active} active`,
      iconBg: 'rgba(18, 55, 42, 0.05)',
      iconColor: 'var(--primary-dark)',
      subColor: 'var(--success-green)',
      Icon: Users,
    },
    {
      label: 'Active Applications',
      value: kpi.active,
      sub: kpi.active === 0 ? 'None active' : `${kpi.active} in progress`,
      iconBg: 'rgba(201, 106, 74, 0.1)',
      iconColor: 'var(--accent)',
      subColor: 'var(--accent)',
      Icon: FileText,
    },
    {
      label: 'Pending Documents',
      value: kpi.docsPending,
      sub: kpi.docsPending === 0 ? 'All clear' : 'Waiting for upload',
      iconBg: 'rgba(214, 167, 86, 0.1)',
      iconColor: 'var(--warning)',
      subColor: 'var(--text-secondary)',
      Icon: AlertTriangle,
    },
    {
      label: 'Government Review',
      value: kpi.govReview,
      sub: kpi.govReview === 0 ? 'None submitted' : 'Processing',
      iconBg: 'rgba(11, 36, 27, 0.05)',
      iconColor: 'var(--primary)',
      subColor: 'var(--text-secondary)',
      Icon: Building,
    },
    {
      label: 'Approved',
      value: kpi.approved,
      sub: kpi.approved === 0 ? 'None this month' : 'This month',
      iconBg: 'rgba(67, 104, 80, 0.1)',
      iconColor: 'var(--success-green)',
      subColor: 'var(--success-green)',
      Icon: CheckCircle2,
    },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
      {cards.map(({ label, value, sub, iconBg, iconColor, subColor, Icon }) => (
        <div key={label} className="card kpi-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.5rem', transition: 'transform 0.2s, box-shadow 0.2s' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: iconBg, color: iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon size={26} strokeWidth={1.5} />
          </div>
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>{label}</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary-dark)', fontFamily: 'var(--font-heading)', lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: '0.8125rem', color: subColor, fontWeight: 500, marginTop: '0.25rem' }}>{sub}</div>
          </div>
        </div>
      ))}
      <style>{`
        .kpi-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(11, 36, 27, 0.08);
        }
      `}</style>
    </div>
  );
};

export default KpiCards;
