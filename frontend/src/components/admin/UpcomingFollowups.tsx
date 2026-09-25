import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import { followUps } from '../../data/mockData';

const UpcomingFollowups: React.FC = () => {
  return (
    <div className="card" style={{ flex: 1, padding: 0, overflow: 'hidden', minWidth: '350px' }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Calendar size={20} color="var(--primary-dark)" strokeWidth={1.5} />
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--primary-dark)', fontFamily: 'var(--font-heading)' }}>Upcoming Enquiries</h3>
        </div>
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', color: 'var(--accent)', fontWeight: 600, transition: 'color 0.2s' }}>
          View All <ArrowRight size={16} />
        </a>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</th>
              <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Task</th>
              <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Application No</th>
              <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Priority</th>
            </tr>
          </thead>
          <tbody>
            {followUps.map((followUp, index) => (
              <tr key={index} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(237, 231, 218, 0.3)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Today, {followUp.time}</td>
                <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--primary-dark)', fontWeight: 600 }}>{followUp.type}</td>
                <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{followUp.app}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ padding: '0.25rem 0.75rem', borderRadius: '1rem', backgroundColor: 'rgba(214, 167, 86, 0.1)', color: 'var(--warning)', fontSize: '0.75rem', fontWeight: 600 }}>Medium</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UpcomingFollowups;
