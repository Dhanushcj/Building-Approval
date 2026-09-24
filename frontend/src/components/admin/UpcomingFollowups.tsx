import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import { followUps } from '../../data/mockData';

const UpcomingFollowups: React.FC = () => {
  return (
    <div className="card" style={{ flex: 1, padding: 0, overflow: 'hidden', minWidth: '350px' }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={20} color="var(--dark-navy)" />
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--dark-navy)' }}>Upcoming Enquiries</h3>
        </div>
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', color: 'var(--primary-blue)', fontWeight: 500 }}>
          View All <ArrowRight size={16} />
        </a>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Date</th>
              <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Task</th>
              <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Application No</th>
              <th style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Priority</th>
            </tr>
          </thead>
          <tbody>
            {followUps.map((followUp, index) => (
              <tr key={index} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Today, {followUp.time}</td>
                <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--dark-navy)' }}>{followUp.type}</td>
                <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{followUp.app}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ padding: '0.25rem 0.75rem', borderRadius: '1rem', backgroundColor: '#fef3c7', color: '#f59e0b', fontSize: '0.75rem', fontWeight: 600 }}>Medium</span>
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
