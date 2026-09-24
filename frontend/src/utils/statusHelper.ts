export const getApplicationStatus = (id: string, defaultStatus: string): string => {
  // Check Rejection
  const savedRejection = localStorage.getItem(`rejection_${id}`);
  if (savedRejection) {
    try {
      if (JSON.parse(savedRejection).isRejected) return 'Rejected';
    } catch (e) {}
  }

  const savedDocs = localStorage.getItem(`customerDocs_${id}`);
  const docs = savedDocs ? JSON.parse(savedDocs) : [];
  
  if (docs.length === 0) return defaultStatus;

  const customerDocIds = ['aadhar', 'pan', 'sale_deed', 'tax_receipt', 'patta', 'ec'];
  const customerDocs = docs.filter((d: any) => customerDocIds.includes(d.id));
  
  // Need Reupload?
  if (customerDocs.some((d: any) => d.status === 'Needs Reupload')) return 'Documents Pending';

  const hasUploadedDocs = customerDocs.some((d: any) => d.fileName || d.file);
  const allCustomerDocsReceived = customerDocs.length > 0 && customerDocs.every((d: any) => d.fileName || d.file || d.status !== 'Missing');
  const allCustomerDocsVerified = customerDocs.length > 0 && customerDocs.every((d: any) => d.status === 'Verified');
  
  const buildingPlan = docs.find((d: any) => d.id === 'building_plan');
  const buildingPlanUploaded = buildingPlan && buildingPlan.status !== 'Missing';
  
  const govtTrackingNumber = localStorage.getItem(`tracking_${id}`);
  
  const siteInspection = docs.find((d: any) => d.id === 'site_inspection_report');
  const siteInspectionUploaded = siteInspection && siteInspection.status !== 'Missing';
  
  const govtApproval = docs.find((d: any) => d.id === 'govt_approval');
  const govtApprovalUploaded = govtApproval && govtApproval.status !== 'Missing';
  
  if (govtApprovalUploaded) return 'Approved';
  if (siteInspectionUploaded && govtTrackingNumber) return 'Site Inspection';
  if (govtTrackingNumber) return 'Gov Verification';
  if (allCustomerDocsVerified && buildingPlanUploaded) return 'Submitted';
  if (allCustomerDocsVerified) return 'Under Review';
  if (allCustomerDocsReceived) return 'Verification';
  if (hasUploadedDocs) return 'Action Required';
  
  return defaultStatus;
};
