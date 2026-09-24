export const mockKpiData = {
  totalApplications: { value: 0, change: '0%' },
  pendingApplications: { value: 0, change: '0 Urgent' },
  submittedGov: { value: 0, change: 'Processing' },
  approved: { value: 0, change: 'This month' },
  documentsPending: { value: 0, change: 'Waiting' },
  paymentPending: { value: '₹0', change: 'Total outstanding' }
};

export const applicationStatusData = [
  { name: 'New', value: 0, color: '#94a3b8' },
  { name: 'Documents Pending', value: 0, color: '#f59e0b' },
  { name: 'Verification', value: 0, color: '#3b82f6' },
  { name: 'Application Prep', value: 0, color: '#8b5cf6' },
  { name: 'Ready to Submit', value: 0, color: '#6366f1' },
  { name: 'Submitted', value: 0, color: '#0ea5e9' },
  { name: 'Gov Verification', value: 0, color: '#0B63CE' },
  { name: 'Inspection', value: 0, color: '#eab308' },
  { name: 'Approval Processing', value: 0, color: '#f97316' },
  { name: 'Approved', value: 0, color: '#22A06B' },
  { name: 'Rejected', value: 0, color: '#ef4444' }
];

const storedApps = localStorage.getItem('recentApplications');
export const recentApplications: any[] = storedApps ? JSON.parse(storedApps) : [];
export const pendingActions: any[] = [];
export const followUps: any[] = [];
export const recentActivity: any[] = [];

export const monthlyRevenueData = [
  { name: 'Apr', collected: 0, pending: 0, overdue: 0 },
  { name: 'May', collected: 0, pending: 0, overdue: 0 },
  { name: 'Jun', collected: 0, pending: 0, overdue: 0 },
  { name: 'Jul', collected: 0, pending: 0, overdue: 0 },
  { name: 'Aug', collected: 0, pending: 0, overdue: 0 },
  { name: 'Sep', collected: 0, pending: 0, overdue: 0 }
];

export const locationData = [
  { name: 'Hosur', value: 0 },
  { name: 'Krishnagiri', value: 0 },
  { name: 'Shoolagiri', value: 0 },
  { name: 'Other Areas', value: 0 }
];

export const appTypeData = [
  { name: 'Residential', value: 0 },
  { name: 'Commercial', value: 0 },
  { name: 'Industrial', value: 0 },
  { name: 'Layout Approval', value: 0 },
  { name: 'Other', value: 0 }
];

export const staffPerformance = [
  { name: 'Arun', assigned: 0, completed: 0, pending: 0, followups: 0 },
  { name: 'Priya', assigned: 0, completed: 0, pending: 0, followups: 0 },
  { name: 'Raj', assigned: 0, completed: 0, pending: 0, followups: 0 },
  { name: 'Sneha', assigned: 0, completed: 0, pending: 0, followups: 0 }
];
