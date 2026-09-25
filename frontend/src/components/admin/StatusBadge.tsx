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
        bgColor = '#fef3c7'; color = 'var(--warning-gold)'; break;
      case 'Verification':
      case 'Gov Verification':
      case 'Under Review':
        bgColor = '#eff6ff'; color = 'var(--primary)'; break;
      case 'Site Inspection':
      case 'Submitted':
        bgColor = '#e0f2fe'; color = 'var(--info-green)'; break;
      case 'Approval Pending':
        bgColor = '#fef08a'; color = 'var(--warning-gold)'; break;
      case 'Approved':
      case 'Completed':
        bgColor = 'rgba(34, 160, 107, 0.1)'; color = 'var(--success-green)'; break;
      case 'Rejected':
        bgColor = '#fee2e2'; color = 'var(--error-red)'; break;
      default:
        break;
    }
  } else if (type === 'priority') {
    switch (value.toLowerCase()) {
      case 'high':
        bgColor = '#fee2e2'; color = 'var(--error-red)'; break;
      case 'medium':
        bgColor = '#fef3c7'; color = 'var(--warning-gold)'; break;
      case 'low':
        bgColor = 'rgba(34, 160, 107, 0.1)'; color = 'var(--success-green)'; break;
    }
  } else if (type === 'payment') {
    switch (value.toLowerCase()) {
      case 'paid':
        bgColor = 'rgba(34, 160, 107, 0.1)'; color = 'var(--success-green)'; break;
      case 'partial':
      case 'pending':
        bgColor = '#fef3c7'; color = 'var(--warning-gold)'; break;
      case 'overdue':
        bgColor = '#fee2e2'; color = 'var(--error-red)'; break;
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
