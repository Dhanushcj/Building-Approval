import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Edit, FileText, CheckCircle2, User, Building, 
  MapPin, Clock, Upload, MoreVertical, Link as LinkIcon, Download, X, Copy, Mail
} from 'lucide-react';
import StatusBadge from '../../components/admin/StatusBadge';
import { recentApplications } from '../../data/mockData';
import JSZip from 'jszip';
import toast from 'react-hot-toast';

const ApplicationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem('loggedInUser') === 'Admin';
  const [activeTab, setActiveTab] = useState('overview');
  const [govtTrackingNumber, setGovtTrackingNumber] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejected, setIsRejected] = useState(false);
  const [rejectionNote, setRejectionNote] = useState('');
  const [appReceipt, setAppReceipt] = useState('');           // base64 data
  const [receiptFileName, setReceiptFileName] = useState('');  // display name
  const [assignedStaff, setAssignedStaff] = useState('');
  const receiptInputRef = useRef<HTMLInputElement>(null);

  type DocumentItem = { id: string, name: string, uploadedBy: string, date: string, status: string, file: any, fileData?: string };
  const [documents, setDocuments] = useState<DocumentItem[]>([
    { id: 'aadhar', name: 'Aadhar Card (Front & Back)', uploadedBy: '-', date: '-', status: 'Missing', file: null },
    { id: 'pan', name: 'PAN Card', uploadedBy: '-', date: '-', status: 'Missing', file: null },
    { id: 'sale_deed', name: 'Sale Deed / Title Deed', uploadedBy: '-', date: '-', status: 'Missing', file: null },
    { id: 'tax_receipt', name: 'Latest Property Tax Receipt', uploadedBy: '-', date: '-', status: 'Missing', file: null },
    { id: 'patta', name: 'Patta Document', uploadedBy: '-', date: '-', status: 'Missing', file: null },
    { id: 'ec', name: 'Encumbrance Certificate (EC)', uploadedBy: '-', date: '-', status: 'Missing', file: null },
    { id: 'building_plan', name: 'Building Plan', uploadedBy: '-', date: '-', status: 'Missing', file: null },
    { id: 'site_inspection_report', name: 'Site Inspection Report', uploadedBy: '-', date: '-', status: 'Missing', file: null },
    { id: 'govt_approval', name: 'Government Approval (Final)', uploadedBy: '-', date: '-', status: 'Missing', file: null }
  ]);

  useEffect(() => {
    const loadCustomerDocs = () => {
      const stored = localStorage.getItem(`customerDocs_${id}`);
      if (stored) {
        const customerDocs = JSON.parse(stored);
        
        setDocuments(prevDocs => {
          const updatedDocs = prevDocs.map(adminDoc => {
            const match = customerDocs.find((d: any) => d.id === adminDoc.id);
            if (match) {
              return {
                ...adminDoc,
                uploadedBy: match.uploadedBy || 'Customer',
                date: match.date || adminDoc.date,
                status: match.status,
                file: match.fileName || match.file,
                fileData: match.fileData || adminDoc.fileData
              };
            }
            return adminDoc;
          });
          
          // Preserve custom admin docs
          const customDocs = customerDocs.filter((d: any) => d.id.startsWith('custom_') && !updatedDocs.find(ud => ud.id === d.id));
          return [...updatedDocs, ...customDocs];
        });
      }
    };
    
    loadCustomerDocs();
    window.addEventListener('storage', loadCustomerDocs);

    // Load persisted state
    const savedTracking = localStorage.getItem(`tracking_${id}`);
    if (savedTracking) setGovtTrackingNumber(savedTracking);
    
    const savedReceipt = localStorage.getItem(`receipt_${id}`);
    if (savedReceipt) {
      try {
        const parsed = JSON.parse(savedReceipt);
        setAppReceipt(parsed.data || '');
        setReceiptFileName(parsed.name || '');
      } catch {
        // legacy plain string
        setAppReceipt(savedReceipt);
      }
    }

    const savedStaff = localStorage.getItem(`assignedStaff_${id}`);
    // Normalize: treat 'Unassigned' as empty string so dropdown shows placeholder option
    const normalizedSavedStaff = savedStaff && savedStaff !== 'Unassigned' ? savedStaff : '';
    // Also fall back to the staff saved on the application itself
    const appStaff = recentApplications.find(a => a.id === id)?.staff || '';
    const normalizedAppStaff = appStaff === 'Unassigned' ? '' : appStaff;
    setAssignedStaff(normalizedSavedStaff || normalizedAppStaff);
    
    const savedRejection = localStorage.getItem(`rejection_${id}`);
    if (savedRejection) {
      try {
        const { isRejected, rejectionNote } = JSON.parse(savedRejection);
        setIsRejected(isRejected);
        setRejectionNote(rejectionNote);
      } catch (e) {}
    }

    return () => window.removeEventListener('storage', loadCustomerDocs);
  }, [id]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [workflowStages, setWorkflowStages] = useState([
    { stage: 'Application Created', date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }), staff: 'Admin', status: 'Current' },
    { stage: 'Customer Documents Received', date: '-', staff: '-', status: 'Pending' },
    { stage: 'Document Verification', date: '-', staff: '-', status: 'Pending' },
    { stage: 'Application Prepared', date: '-', staff: '-', status: 'Pending' },
    { stage: 'Government Submission', date: '-', staff: '-', status: 'Pending' },
    { stage: 'Site Inspection', date: '-', staff: '-', status: 'Pending' },
    { stage: 'Government Verification', date: '-', staff: '-', status: 'Pending' },
    { stage: 'Approval', date: '-', staff: '-', status: 'Pending' }
  ]);

  useEffect(() => {
    setWorkflowStages(prevStages => {
      let changed = false;
      const newStages = JSON.parse(JSON.stringify(prevStages));
      const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      
      if (newStages[0].status === 'Current') {
        newStages[0].status = 'Completed';
        newStages[1].status = 'Current';
        newStages[1].date = 'Current Phase';
        changed = true;
      }

      const customerDocIds = ['aadhar', 'pan', 'sale_deed', 'tax_receipt', 'patta', 'ec'];
      const customerDocs = documents.filter(d => customerDocIds.includes(d.id));
      const allCustomerDocsReceived = customerDocs.every(d => d.status !== 'Missing');
      
      if (allCustomerDocsReceived && newStages[1].status === 'Current') {
        newStages[1].status = 'Completed';
        newStages[1].date = today;
        newStages[2].status = 'Current';
        newStages[2].date = 'Current Phase';
        changed = true;
      }

      const allCustomerDocsVerified = customerDocs.every(d => d.status === 'Verified');
      
      if (allCustomerDocsVerified && newStages[2].status === 'Current') {
        newStages[2].status = 'Completed';
        newStages[2].date = today;
        newStages[3].status = 'Current';
        newStages[3].date = 'Current Phase';
        changed = true;
      }

      const buildingPlan = documents.find(d => d.id === 'building_plan');
      const buildingPlanUploaded = buildingPlan && buildingPlan.status !== 'Missing';
      
      if (allCustomerDocsVerified && buildingPlanUploaded && newStages[3].status === 'Current') {
        newStages[3].status = 'Completed';
        newStages[3].date = today;
        newStages[4].status = 'Current';
        newStages[4].date = 'Current Phase';
        changed = true;
      }
      if (govtTrackingNumber && newStages[4].status === 'Current') {
        newStages[4].status = 'Completed';
        newStages[4].date = today;
        newStages[5].status = 'Current';
        newStages[5].date = 'Current Phase';
        changed = true;
      }

      const siteInspection = documents.find(d => d.id === 'site_inspection_report');
      const siteInspectionUploaded = siteInspection && siteInspection.status !== 'Missing';
      
      if (govtTrackingNumber && siteInspectionUploaded && newStages[5].status === 'Current') {
        newStages[5].status = 'Completed';
        newStages[5].date = today;
        newStages[6].status = 'Current';
        newStages[6].date = 'Current Phase';
        changed = true;
      }

      const govtApproval = documents.find(d => d.id === 'govt_approval');
      const govtApprovalUploaded = govtApproval && govtApproval.status !== 'Missing';
      
      if (govtTrackingNumber && siteInspectionUploaded && govtApprovalUploaded && newStages[6].status === 'Current') {
        newStages[6].status = 'Completed';
        newStages[6].date = today;
        newStages[7].status = 'Completed'; // Automatically complete the Approval stage
        newStages[7].date = today;
        changed = true;

        // Auto-update application status to 'Approved'
        const appIdx = recentApplications.findIndex(a => a.id === id);
        if (appIdx !== -1 && recentApplications[appIdx].status !== 'Approved') {
          recentApplications[appIdx].status = 'Approved';
          localStorage.setItem('recentApplications', JSON.stringify(recentApplications));
          window.dispatchEvent(new Event('storage'));
        }
      }

      return changed ? newStages : prevStages;
    });
  }, [documents, govtTrackingNumber]);

  const [uploadingDocIndex, setUploadingDocIndex] = useState<number | null>(null);

  const handleUploadClick = (index: number) => {
    setUploadingDocIndex(index);
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('caseId', id || 'BA-2026-00124');
      
      let docType = 'other';
      if (uploadingDocIndex !== null) {
        docType = documents[uploadingDocIndex].id;
      }
      formData.append('document_type', docType);

      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'https://building-approval.onrender.com/api';
        const response = await fetch(`${apiUrl}/documents/upload`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const data = await response.json();
        const fileUrl = data.url;

        if (uploadingDocIndex !== null) {
          const newDocs = [...documents];
          newDocs[uploadingDocIndex] = {
            ...newDocs[uploadingDocIndex],
            uploadedBy: 'Admin',
            date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            status: 'Pending',
            file: file.name,
            fileData: fileUrl
          };
          setDocuments(newDocs);
          setUploadingDocIndex(null);
          if (id) {
            localStorage.setItem(`customerDocs_${id}`, JSON.stringify(newDocs));
            window.dispatchEvent(new Event('storage'));
          }
        } else {
          const newDoc = {
            id: `custom_${Date.now()}`,
            name: file.name,
            uploadedBy: 'Admin',
            date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            status: 'Pending',
            file: file.name,
            fileData: fileUrl
          };
          const newDocs = [...documents, newDoc];
          setDocuments(newDocs);
          if (id) {
            localStorage.setItem(`customerDocs_${id}`, JSON.stringify(newDocs));
            window.dispatchEvent(new Event('storage'));
          }
        }
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Failed to upload document to Cloudinary via backend.");
      }
    }
  };

  const updateDocumentStatus = (index: number, newStatus: string) => {
    const newDocs = [...documents];
    newDocs[index].status = newStatus;
    setDocuments(newDocs);
    if (id) {
      try {
        localStorage.setItem(`customerDocs_${id}`, JSON.stringify(newDocs));
        window.dispatchEvent(new Event('storage'));
      } catch (e) {
        toast.success("Storage limit exceeded.");
      }
    }
  };

  const [showShareModal, setShowShareModal] = useState(false);
  const shareLink = `${window.location.origin}/upload/${id || 'BA-2026-00124'}`;

  const handleShareLink = () => {
    setShowShareModal(true);
  };

  const [isEmailingLink, setIsEmailingLink] = useState(false);
  const handleEmailShareLink = async () => {
    if (!app.email) {
      toast.success('No email address available for this customer.');
      return;
    }
    
    setIsEmailingLink(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://building-approval.onrender.com/api';
      const response = await fetch(`${apiUrl}/notifications/upload-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: app.email, name: app.customer, uploadLink: shareLink })
      });
      
      if (!response.ok) throw new Error('Failed to send email');
      toast.success('Upload link successfully emailed to the customer!');
      setShowShareModal(false);
    } catch (error) {
      console.error('Error sending link via email:', error);
      toast.error('Failed to send email. Please try copying the link instead.');
    } finally {
      setIsEmailingLink(false);
    }
  };



  const [viewingDoc, setViewingDoc] = useState<{name: string, fileData?: string} | null>(null);

  const handleDownload = (doc: any) => {
    if (doc.fileData) {
      const element = document.createElement("a");
      element.href = doc.fileData;
      let ext = '.txt';
      if (doc.fileData.startsWith('data:image/jpeg')) ext = '.jpg';
      else if (doc.fileData.startsWith('data:image/png')) ext = '.png';
      else if (doc.fileData.startsWith('data:application/pdf')) ext = '.pdf';
      
      const safeName = (doc.fileName || doc.name).replace(/\s+/g, '_').toLowerCase();
      element.download = safeName.endsWith(ext) ? safeName : `${safeName}${ext}`;
      
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } else {
      toast.success('File data is not available for download.');
    }
  };

  const handleView = (doc: any) => {
    setViewingDoc({ name: doc.name, fileData: doc.fileData });
  };

  const handleDownloadAll = async () => {
    const zip = new JSZip();
    const folder = zip.folder(`Application_${id}_Documents`);
    
    let hasFiles = false;
    documents.forEach(doc => {
      if (doc.fileData && doc.status !== 'Missing') {
        const base64Data = doc.fileData.split(',')[1];
        let ext = '.txt';
        if (doc.fileData.startsWith('data:image/jpeg')) ext = '.jpg';
        else if (doc.fileData.startsWith('data:image/png')) ext = '.png';
        else if (doc.fileData.startsWith('data:application/pdf')) ext = '.pdf';
        
        const safeName = (doc.file || doc.name).replace(/\s+/g, '_').toLowerCase();
        const fileName = safeName.endsWith(ext) ? safeName : `${safeName}${ext}`;
        
        folder?.file(fileName, base64Data, { base64: true });
        hasFiles = true;
      }
    });

    if (!hasFiles) {
      toast.success("No documents available to download.");
      return;
    }

    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Application_${id}_Documents.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [app, setApp] = useState<any>(null);

  useEffect(() => {
    const fetchCase = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'https://building-approval.onrender.com/api';
        const res = await fetch(`${apiUrl}/cases/${id}`);
        if (res.ok) {
          const data = await res.json();
          setApp({
            id: data.application_number || data.id,
            status: data.status,
            priority: 'Medium',
            customer: data.property?.owner_name || 'Unknown',
            mobile: data.property?.owner_phone || '',
            email: data.property?.owner_email || '',
            location: data.property?.village || data.property?.jurisdiction || '',
            address: data.property?.address || '',
            propertyType: data.property?.property_type || 'Residential',
            buildingType: 'Individual Villa',
            surveyNo: data.property?.survey_number || '',
            plotArea: data.property?.plot_area || 'N/A',
            builtUpArea: data.property?.built_up_area || 'N/A',
            floors: data.property?.floors || 'N/A',
            staff: data.assigned_staff?.name || 'Unassigned',
            createdAt: new Date(data.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            updatedAt: new Date(data.updated_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            paymentStatus: 'Pending',
            amount: '₹0',
            appType: data.approval_type
          });
        }
      } catch (err) {
        console.error("Failed to fetch case details:", err);
      }
    };
    fetchCase();
  }, [id]);

  if (!app) return <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading application details...</div>;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <FileText size={16} /> },
    { id: 'documents', label: 'Documents', icon: <Upload size={16} /> }
  ];

  const renderTabContent = () => {
    switch(activeTab) {
      case 'overview':
        return (
          <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            {isRejected && (
              <div style={{ gridColumn: '1 / -1', padding: '1rem', backgroundColor: 'rgba(185, 74, 72, 0.1)', border: '1px solid var(--error-red)', borderRadius: '0.5rem', color: 'var(--error-red)' }}>
                <strong style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}><X size={16} /> Application Rejected</strong>
                <p style={{ margin: 0, fontSize: '0.875rem' }}><strong>Reason:</strong> {rejectionNote || 'No reason provided.'}</p>
              </div>
            )}
            {/* Application Info */}
            <div className="card">
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={18} color="var(--primary)" /> Application Information
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Application Type</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--primary-dark)' }}>{app.appType}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Building Type</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--primary-dark)' }}>{app.buildingType}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Created Date</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--primary-dark)' }}>{app.createdAt}</div>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Assigned Staff</div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <select
                      value={assignedStaff}
                      onChange={e => {
                        const val = e.target.value;
                        setAssignedStaff(val);
                        localStorage.setItem(`assignedStaff_${id}`, val);
                        const appIdx = recentApplications.findIndex(a => a.id === id);
                        if (appIdx !== -1) {
                          recentApplications[appIdx].staff = val || 'Unassigned';
                          localStorage.setItem('recentApplications', JSON.stringify(recentApplications));
                        }
                      }}
                      style={{ padding: '0.375rem 0.75rem', borderRadius: '0.375rem', border: '1px solid var(--border-color)', fontSize: '0.875rem', fontWeight: 500, color: assignedStaff ? 'var(--primary)' : 'var(--text-secondary)', outline: 'none', backgroundColor: 'var(--bg-surface)', cursor: 'pointer', minWidth: '200px' }}
                    >
                      <option value="">— Select Staff —</option>
                      {(() => {
                        const staffSaved = localStorage.getItem('staffMembers');
                        const staffList: any[] = staffSaved ? JSON.parse(staffSaved).filter((s: any) => s.status === 'Active') : [];
                        return staffList.length > 0
                          ? staffList.map((s: any) => <option key={s.id} value={s.name}>{s.name} — {s.role}</option>)
                          : <option value="" disabled>No staff added yet. Add staff in Staff & Users.</option>;
                      })()}
                    </select>
                    {assignedStaff && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--success-green)', fontWeight: 600 }}>✓ Assigned</span>
                    )}
                  </div>
                </div>
                {workflowStages[3].status === 'Completed' && (
                  <div style={{ gridColumn: 'span 2', marginTop: '1rem', padding: '1.25rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '0.75rem', border: '1px dashed var(--primary)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    
                    {/* Govt Tracking Number */}
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>Govt. Tracking Number</div>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <input 
                          type="text" 
                          value={govtTrackingNumber} 
                          onChange={e => setGovtTrackingNumber(e.target.value)} 
                          placeholder="Enter tracking ID..." 
                          style={{ flex: 1, minWidth: 0, padding: '0.5rem 0.75rem', borderRadius: '0.375rem', border: '1px solid var(--border-color)', outline: 'none', fontSize: '0.875rem' }} 
                        />
                        <button 
                          onClick={() => {
                            localStorage.setItem(`tracking_${id}`, govtTrackingNumber);
                            window.dispatchEvent(new Event('storage'));
                          }}
                          className="btn-primary" 
                          style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', borderRadius: '0.375rem', whiteSpace: 'nowrap', flexShrink: 0 }}
                        >
                          Save
                        </button>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.375rem' }}>Entering this will mark Government Submission as Completed.</div>
                    </div>

                    {/* Application Receipt - File Upload */}
                    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>Application Receipt</div>
                      <input
                        type="file"
                        ref={receiptInputRef}
                        accept="image/*,application/pdf"
                        style={{ display: 'none' }}
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = ev => {
                            const data = ev.target?.result as string;
                            setAppReceipt(data);
                            setReceiptFileName(file.name);
                            try {
                              localStorage.setItem(`receipt_${id}`, JSON.stringify({ data, name: file.name }));
                            } catch {
                              toast.success('File too large to store.');
                            }
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                      {appReceipt ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.875rem', backgroundColor: 'white', border: '1px solid var(--border-color)', borderRadius: '0.375rem' }}>
                          <FileText size={18} color="var(--primary)" />
                          <span style={{ flex: 1, fontSize: '0.875rem', color: 'var(--primary-dark)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{receiptFileName || 'Receipt uploaded'}</span>
                          <button
                            onClick={() => {
                              const a = document.createElement('a');
                              a.href = appReceipt;
                              a.download = receiptFileName || 'receipt';
                              a.click();
                            }}
                            style={{ padding: '0.25rem 0.625rem', borderRadius: '0.25rem', border: '1px solid var(--primary)', backgroundColor: 'transparent', color: 'var(--primary)', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}
                          >
                            View
                          </button>
                          <button
                            onClick={() => {
                              setAppReceipt('');
                              setReceiptFileName('');
                              localStorage.removeItem(`receipt_${id}`);
                              if (receiptInputRef.current) receiptInputRef.current.value = '';
                            }}
                            style={{ padding: '0.25rem 0.5rem', borderRadius: '0.25rem', border: 'none', backgroundColor: '#fee2e2', color: 'var(--error-red)', fontSize: '0.75rem', cursor: 'pointer' }}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => receiptInputRef.current?.click()}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', padding: '0.625rem 0.875rem', borderRadius: '0.375rem', border: '2px dashed var(--border-color)', backgroundColor: 'white', color: 'var(--text-secondary)', fontSize: '0.875rem', cursor: 'pointer', justifyContent: 'center', transition: 'border-color 0.2s' }}
                          onMouseOver={e => (e.currentTarget.style.borderColor = 'var(--primary)')}
                          onMouseOut={e => (e.currentTarget.style.borderColor = 'var(--border-color)')}
                        >
                          <Upload size={16} /> Upload Receipt (PDF / Image)
                        </button>
                      )}
                    </div>

                  </div>
                )}
              </div>
            </div>

            {/* Customer Info */}
            <div className="card">
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <User size={18} color="var(--primary)" /> Customer Information
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Name</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--primary-dark)' }}>{app.customer}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Mobile</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--primary-dark)' }}>{app.mobile}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Email</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--primary-dark)' }}>{app.email}</div>
                </div>
              </div>
            </div>

            {/* Property Info */}
            <div className="card">
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Building size={18} color="var(--primary)" /> Property Information
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Address</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--primary-dark)' }}>{app.address}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Survey No</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--primary-dark)' }}>{app.surveyNo}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Plot Area</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--primary-dark)' }}>{app.plotArea}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Built-up Area</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--primary-dark)' }}>{app.builtUpArea}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Floors</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--primary-dark)' }}>{app.floors}</div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'documents':
        return (
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--primary-dark)' }}>Uploaded Documents</h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={handleDownloadAll} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '0.25rem', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', cursor: 'pointer', color: 'var(--primary-dark)' }}>
                  <Download size={16} /> Download All (ZIP)
                </button>
                <button onClick={handleShareLink} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '0.25rem', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', cursor: 'pointer' }}>
                  <LinkIcon size={16} /> Share Upload Link
                </button>
                <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileUpload} />
                <button onClick={() => fileInputRef.current?.click()} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Upload size={16} /> Upload Document
                </button>
              </div>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Document Name</th>
                  <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Uploaded By</th>
                  <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Date</th>
                  <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.filter(doc => 
                  (doc.id !== 'site_inspection_report' || workflowStages[4].status === 'Completed') &&
                  (doc.id !== 'govt_approval' || workflowStages[5].status === 'Completed')
                ).map((doc) => {
                  const actualIdx = documents.findIndex(d => d.id === doc.id);
                  return (
                  <tr key={doc.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--primary-dark)' }}>{doc.name}</td>
                    <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{doc.uploadedBy}</td>
                    <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{doc.date}</td>
                    <td style={{ padding: '1rem' }}><StatusBadge type="status" value={doc.status} /></td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      {doc.status === 'Missing' ? (
                        <button onClick={() => handleUploadClick(actualIdx)} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Upload size={14} /> Upload
                        </button>
                      ) : (
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                          {doc.status === 'Pending' && isAdmin && (
                            <>
                              <button onClick={() => updateDocumentStatus(actualIdx, 'Verified')} style={{ background: 'none', border: 'none', color: 'var(--success-green)', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                                <CheckCircle2 size={14} /> Verify
                              </button>
                              <button onClick={() => updateDocumentStatus(actualIdx, 'Needs Reupload')} style={{ background: 'none', border: 'none', color: 'var(--warning-gold)', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                                <Upload size={14} /> Request Reupload
                              </button>
                            </>
                          )}
                          {doc.status === 'Pending' && !isAdmin && (
                            <span style={{ fontSize: '0.75rem', color: 'var(--warning-gold)', fontWeight: 500 }}>Awaiting Admin Verification</span>
                          )}
                          <button onClick={() => handleView(documents[actualIdx])} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer' }}>View</button>
                          <button onClick={() => handleDownload(doc)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Download size={14} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );

      default:
        return <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Content for {activeTab} goes here.</div>;
    }
  };

  return (
    <div>
      {/* Back Button */}
      <Link to={isAdmin ? "/admin/applications" : "/employee/applications"} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500, marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} /> Back to Applications
      </Link>

      {/* Header */}
      <div className="card" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <h2 className="heading-2" style={{ margin: 0 }}>{app.id}</h2>
            {isRejected ? (
              <span style={{ padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 600, backgroundColor: 'rgba(185, 74, 72, 0.1)', color: 'var(--error-red)' }}>Rejected</span>
            ) : (
              <StatusBadge type="status" value={app.status} />
            )}
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><User size={16} /> {app.customer}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={16} /> {app.location}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={16} /> Updated: {app.updatedAt}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={() => navigate(isAdmin ? '/admin/applications/new' : '/employee/applications/new', { state: { editMode: true, appData: app } })}
            style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer' }}
          >
            <Edit size={16} /> Edit
          </button>
          {!isRejected && (
            <button onClick={() => setShowRejectModal(true)} style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--error-red)', color: 'var(--error-red)', backgroundColor: 'var(--bg-surface)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer' }}>
              <X size={16} /> Reject Application
            </button>
          )}
          <button className="btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Update Status
          </button>
          <button style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', cursor: 'pointer', color: 'var(--text-secondary)' }}>
            <MoreVertical size={16} />
          </button>
        </div>
      </div>
      {/* Workflow Tracker */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.5rem', overflowX: 'auto' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: '1.5rem' }}>Status</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', minWidth: '600px' }}>
          <div style={{ position: 'absolute', top: '12px', left: '12px', right: '12px', height: '2px', backgroundColor: 'var(--border-color)', zIndex: 0 }}></div>
          {workflowStages.map((stage, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, width: '12%', textAlign: 'center' }}>
              <div style={{ 
                width: '24px', 
                height: '24px', 
                borderRadius: '50%', 
                backgroundColor: isRejected && stage.status === 'Current' ? 'var(--error-red)' : stage.status === 'Completed' ? 'var(--success-green)' : stage.status === 'Current' ? 'var(--primary)' : 'var(--bg-surface)',
                border: stage.status === 'Pending' ? '2px solid var(--border-color)' : 'none',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: stage.status === 'Completed' ? 'white' : 'var(--border-color)',
                marginBottom: '0.5rem',
                boxShadow: isRejected && stage.status === 'Current' ? '0 0 0 4px rgba(185, 74, 72, 0.1)' : stage.status === 'Current' ? '0 0 0 4px rgba(18, 55, 42, 0.05)' : 'none'
              }}>
                {stage.status === 'Completed' && <CheckCircle2 size={14} color="white" />}
                {stage.status === 'Current' && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'white' }}></div>}
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: stage.status === 'Pending' ? 400 : 600, color: stage.status === 'Pending' ? 'var(--text-secondary)' : 'var(--primary-dark)' }}>
                {stage.stage}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem', overflowX: 'auto' }}>
        {tabs.map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{ 
              padding: '0.75rem 1.5rem', 
              background: 'none', 
              border: 'none', 
              borderBottom: activeTab === tab.id ? '2px solid var(--primary)' : '2px solid transparent',
              color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: activeTab === tab.id ? 600 : 500,
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s'
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ paddingBottom: '2rem' }}>
        {renderTabContent()}
      </div>

      {/* Share Link Modal */}
      {showShareModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '0.75rem', width: '100%', maxWidth: '480px', padding: '2rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', position: 'relative' }}>
            <button onClick={() => setShowShareModal(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
              <X size={20} />
            </button>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(18, 55, 42, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                <LinkIcon size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: '0.25rem' }}>Share Upload Link</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>Send this link to the customer to upload documents directly.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <input 
                type="text" 
                readOnly 
                value={shareLink} 
                style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', outline: 'none', color: 'var(--primary-dark)', fontSize: '0.875rem' }} 
              />
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(shareLink);
                  setShowShareModal(false);
                }}
                style={{ padding: '0.75rem 1.25rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}
              >
                <Copy size={16} /> Copy
              </button>
              <button 
                onClick={handleEmailShareLink}
                disabled={isEmailingLink}
                className="btn-primary" 
                style={{ padding: '0.75rem 1.25rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: isEmailingLink ? 'not-allowed' : 'pointer', opacity: isEmailingLink ? 0.7 : 1 }}
              >
                <Mail size={16} /> {isEmailingLink ? 'Sending...' : 'Send via Email'}
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowShareModal(false)} style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', backgroundColor: 'transparent', border: 'none', color: 'var(--text-secondary)', fontWeight: 500, cursor: 'pointer', fontSize: '0.875rem' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Reject Modal */}
      {showRejectModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200, backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '0.75rem', width: '100%', maxWidth: '400px', padding: '2rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', position: 'relative' }}>
            <button onClick={() => setShowRejectModal(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
              <X size={20} />
            </button>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: '1rem' }}>Reject Application</h3>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Reason for Rejection</label>
              <textarea 
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter the reason for rejecting this application..."
                style={{ width: '100%', minHeight: '100px', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', outline: 'none', resize: 'vertical' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowRejectModal(false)} style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', backgroundColor: 'var(--bg-secondary)', color: 'var(--primary-dark)', border: 'none', fontWeight: 500, cursor: 'pointer' }}>Cancel</button>
              <button 
                onClick={() => {
                  setIsRejected(true);
                  setRejectionNote(rejectionReason);
                  localStorage.setItem(`rejection_${id}`, JSON.stringify({ isRejected: true, rejectionNote: rejectionReason }));
                  setShowRejectModal(false);
                }} 
                style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', backgroundColor: 'var(--error-red)', color: 'white', border: 'none', fontWeight: 500, cursor: 'pointer' }}
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Document Modal */}
      {viewingDoc && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)', padding: '2rem' }}>
          <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '0.75rem', width: '100%', maxWidth: '800px', height: '80vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--primary-dark)', margin: 0 }}>{viewingDoc.name}</h3>
              <button onClick={() => setViewingDoc(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <X size={20} />
              </button>
            </div>
            <div style={{ flex: 1, backgroundColor: '#f1f5f9', overflow: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
              {viewingDoc.fileData ? (
                viewingDoc.fileData.startsWith('data:image/') ? (
                  <img src={viewingDoc.fileData} alt={viewingDoc.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                ) : viewingDoc.fileData.startsWith('data:application/pdf') ? (
                  <iframe src={viewingDoc.fileData} title={viewingDoc.name} style={{ width: '100%', height: '100%', border: 'none' }} />
                ) : (
                  <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Preview not available for this file type.</div>
                )
              ) : (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No file data available.</div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ApplicationDetail;
