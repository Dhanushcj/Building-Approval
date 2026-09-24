import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { monthlyRevenueData } from '../../data/mockData';

const MonthlyOverview: React.FC = () => {
  return (
    <div className="card" style={{ flex: 1, padding: 0, overflow: 'hidden', minWidth: '400px' }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--dark-navy)' }}>Monthly Revenue Overview</h3>
        <select style={{ padding: '0.25rem 0.5rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', fontSize: '0.75rem', outline: 'none' }}>
          <option>This Year</option>
          <option>Last Year</option>
        </select>
      </div>
      <div style={{ padding: '1.5rem', height: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={monthlyRevenueData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} tickFormatter={(value) => `₹${value / 1000}k`} />
            <Tooltip 
              cursor={{ fill: 'var(--bg-secondary)' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="collected" name="Collected" fill="var(--primary-blue)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="pending" name="Pending" fill="#94a3b8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlyOverview;
