import React from 'react';
import { Activity, ArrowRight, FileText, CheckCircle, CreditCard, Play } from 'lucide-react';
import { recentActivity } from '../../data/mockData';

const ActivityTimeline: React.FC = () => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'document': return <FileText size={16} color="var(--primary-blue)" />;
      case 'status': return <Play size={16} color="#f59e0b" />;
      case 'payment': return <CreditCard size={16} color="#3b82f6" />;
      case 'success': return <CheckCircle size={16} color="var(--success-green)" />;
      default: return <Activity size={16} />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'document': return 'rgba(11, 99, 206, 0.1)';
      case 'status': return '#fef3c7';
      case 'payment': return '#eff6ff';
      case 'success': return 'rgba(34, 160, 107, 0.1)';
      default: return 'var(--bg-secondary)';
    }
  };

  return (
    <div className="card" style={{ flex: 1, padding: 0, overflow: 'hidden', minWidth: '350px' }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={20} color="var(--dark-navy)" />
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--dark-navy)' }}>Recent Activities</h3>
        </div>
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', color: 'var(--primary-blue)', fontWeight: 500 }}>
          View All <ArrowRight size={16} />
        </a>
      </div>

      <div style={{ padding: '1.5rem' }}>
        {recentActivity.map((activity, index) => (
          <div key={index} style={{ display: 'flex', gap: '1rem', position: 'relative', paddingBottom: index === recentActivity.length - 1 ? 0 : '1.5rem' }}>
            {/* Vertical Line */}
            {index < recentActivity.length - 1 && (
              <div style={{ position: 'absolute', top: '32px', bottom: 0, left: '15px', width: '2px', backgroundColor: 'var(--border-color)' }}></div>
            )}
            
            <div style={{ zIndex: 1, width: '32px', height: '32px', borderRadius: '50%', backgroundColor: getBgColor(activity.type), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {getIcon(activity.type)}
            </div>
            
            <div style={{ flex: 1, marginTop: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--dark-navy)' }}>{activity.title}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{activity.time}</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>{activity.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityTimeline;
