import React from 'react';

type BadgeType = 'status' | 'priority' | 'payment';

interface StatusBadgeProps {
  type: BadgeType;
  value: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ type, value }) => {
  let bgColor = '#f1f5f9';
  let color = '#64748b';

  if (type === 'status') {
    switch (value) {
      case 'New':
        bgColor = '#f1f5f9'; color = '#64748b'; break;
      case 'Documents Pending':
      case 'Action Required':
        bgColor = '#fef3c7'; color = '#f59e0b'; break;
      case 'Verification':
      case 'Gov Verification':
      case 'Under Review':
        bgColor = '#eff6ff'; color = '#3b82f6'; break;
      case 'Site Inspection':
      case 'Submitted':
        bgColor = '#e0f2fe'; color = '#0ea5e9'; break;
      case 'Approval Pending':
        bgColor = '#fef08a'; color = '#eab308'; break;
      case 'Approved':
      case 'Completed':
        bgColor = 'rgba(34, 160, 107, 0.1)'; color = 'var(--success-green)'; break;
      case 'Rejected':
        bgColor = '#fee2e2'; color = '#ef4444'; break;
      default:
        break;
    }
  } else if (type === 'priority') {
    switch (value.toLowerCase()) {
      case 'high':
        bgColor = '#fee2e2'; color = '#ef4444'; break;
      case 'medium':
        bgColor = '#fef3c7'; color = '#f59e0b'; break;
      case 'low':
        bgColor = 'rgba(34, 160, 107, 0.1)'; color = 'var(--success-green)'; break;
    }
  } else if (type === 'payment') {
    switch (value.toLowerCase()) {
      case 'paid':
        bgColor = 'rgba(34, 160, 107, 0.1)'; color = 'var(--success-green)'; break;
      case 'partial':
      case 'pending':
        bgColor = '#fef3c7'; color = '#f59e0b'; break;
      case 'overdue':
        bgColor = '#fee2e2'; color = '#ef4444'; break;
    }
  }

  return (
    <span style={{ 
      padding: '0.25rem 0.75rem', 
      borderRadius: '1rem', 
      backgroundColor: bgColor, 
      color: color, 
      fontSize: '0.75rem', 
      fontWeight: 600,
      display: 'inline-flex',
      alignItems: 'center',
      whiteSpace: 'nowrap'
    }}>
      {value}
    </span>
  );
};

export default StatusBadge;
