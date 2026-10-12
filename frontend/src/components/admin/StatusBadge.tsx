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
    const s = value ? value.toUpperCase() : '';
    switch (s) {
      case 'NEW':
      case 'INTAKE':
        bgColor = '#e0f2fe'; color = '#0369a1'; break;
      case 'DOCUMENTS PENDING':
      case 'ACTION REQUIRED':
      case 'DOCUMENT_COLLECTION':
      case 'ACTION_NEEDED':
        bgColor = '#fef3c7'; color = 'var(--warning-gold)'; break;
      case 'VERIFICATION':
      case 'GOV VERIFICATION':
      case 'UNDER REVIEW':
        bgColor = '#eff6ff'; color = 'var(--primary)'; break;
      case 'SITE INSPECTION':
        bgColor = '#ffedd5'; color = 'var(--accent)'; break;
      case 'SUBMITTED':
        bgColor = '#f3e8ff'; color = '#7e22ce'; break;
      case 'APPROVAL PENDING':
        bgColor = '#fef08a'; color = 'var(--warning-gold)'; break;
      case 'APPROVED':
      case 'COMPLETED':
        bgColor = 'rgba(34, 160, 107, 0.1)'; color = 'var(--success-green)'; break;
      case 'REJECTED':
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
