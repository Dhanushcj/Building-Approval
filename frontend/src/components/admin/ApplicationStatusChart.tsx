import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { getApplicationStatus } from '../../utils/statusHelper';

const STATUS_COLORS: Record<string, string> = {
  'New':                '#94a3b8',
  'Documents Pending':  '#f59e0b',
  'Action Required':    '#fb923c',
  'Verification':       '#3b82f6',
  'Under Review':       '#6366f1',
  'Submitted':          '#0ea5e9',
  'Gov Verification':   '#0B63CE',
  'Site Inspection':    '#eab308',
  'Approved':           '#22A06B',
  'Rejected':           '#ef4444',
};

const getChartData = () => {
  const stored = localStorage.getItem('recentApplications');
  const apps: any[] = stored ? JSON.parse(stored) : [];

  const buckets: Record<string, number> = {};
  apps.forEach(app => {
    const status = getApplicationStatus(app.id, app.status);
    buckets[status] = (buckets[status] || 0) + 1;
  });

  return Object.entries(buckets)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value, color: STATUS_COLORS[name] || '#94a3b8' }));
};

const ApplicationStatusChart: React.FC = () => {
  const [data, setData] = useState(getChartData());

  useEffect(() => {
    const update = () => setData(getChartData());
    update();
    window.addEventListener('storage', update);
    return () => window.removeEventListener('storage', update);
  }, []);

  const total = data.reduce((sum, d) => sum + d.value, 0);

  // Fallback for empty state (pie needs at least one non-zero value to render)
  const chartData = data.length > 0 ? data : [{ name: 'No Data', value: 1, color: '#e2e8f0' }];

  return (
    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--dark-navy)' }}>Application Status Overview</h3>
      </div>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center', flex: 1 }}>
        {/* Chart */}
        <div style={{ flex: '1 1 200px', height: '250px', position: 'relative' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: 'var(--dark-navy)', fontWeight: 600 }}
                formatter={(value: any, name: string) => [value, name]}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Inner Text */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--dark-navy)' }}>{total}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Total</div>
          </div>
        </div>

        {/* Legend */}
        <div style={{ flex: '1 1 200px', display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem', maxHeight: '250px', overflowY: 'auto', paddingRight: '0.5rem' }}>
          {data.length === 0 ? (
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textAlign: 'center', padding: '2rem 0' }}>
              No applications yet
            </div>
          ) : (
            data.map((item, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: item.color, flexShrink: 0 }}></div>
                  <span style={{ color: 'var(--text-secondary)' }}>{item.name}</span>
                </div>
                <span style={{ fontWeight: 600, color: 'var(--dark-navy)' }}>{item.value}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationStatusChart;
