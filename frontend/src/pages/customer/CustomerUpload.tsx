import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Upload, CheckCircle2, FileText, ShieldCheck, AlertCircle, X, HelpCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const CustomerUpload: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Track uploaded documents
  const [documents, setDocuments] = useState<any[]>([
    { id: 'aadhar', name: 'Aadhar Card (Front & Back)', fileName: null, status: 'Missing' },
    { id: 'pan', name: 'PAN Card', fileName: null, status: 'Missing' },
    { id: 'sale_deed', name: 'Sale Deed / Title Deed', fileName: null, status: 'Missing' },
    { id: 'tax_receipt', name: 'Latest Property Tax Receipt', fileName: null, status: 'Missing' },
    { id: 'patta', name: 'Patta Document', fileName: null, status: 'Missing' },
    { id: 'ec', name: 'Encumbrance Certificate (EC)', fileName: null, status: 'Missing' }
  ]);

  useEffect(() => {
    const loadDocs = () => {
      const savedDocs = localStorage.getItem(`customerDocs_${id}`);
      if (savedDocs) {
        setDocuments(JSON.parse(savedDocs));
      }
      const submitted = localStorage.getItem(`customerSubmitted_${id}`);
      if (submitted) {
        setIsSubmitted(true);
      }
    };
    
    loadDocs();
    window.addEventListener('storage', loadDocs);
    return () => window.removeEventListener('storage', loadDocs);
  }, [id]);
  
  const [activeUploadId, setActiveUploadId] = useState<string | null>(null);

  const triggerUpload = (docId: string) => {
    const doc = documents.find(d => d.id === docId);
    if (isSubmitted && doc?.status !== 'Needs Reupload') return;
    setActiveUploadId(docId);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && activeUploadId) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const fileData = event.target?.result as string;
        setDocuments(docs => {
          const newDocs = docs.map(doc => 
            doc.id === activeUploadId ? { 
              ...doc, 
              fileName: file.name,
              fileData: fileData,
              status: isSubmitted ? doc.status : 'Pending',
              uploadedBy: 'Customer',
              date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
            } : doc
          );
          try {
            localStorage.setItem(`customerDocs_${id}`, JSON.stringify(newDocs));
            window.dispatchEvent(new Event('storage'));
          } catch (error) {
            toast.success('File is too large to store in local storage. Please try a smaller file.');
            console.error('Storage error:', error);
          }
          return newDocs;
        });
      };
      
      reader.readAsDataURL(file);
    }
    setActiveUploadId(null);
  };

  const handleReuploadSubmit = () => {
    const newDocs = documents.map(doc => {
      if (doc.status === 'Needs Reupload' && doc.fileName) {
        return { ...doc, status: 'Pending' };
      }
      return doc;
    });
    setDocuments(newDocs);
    localStorage.setItem(`customerDocs_${id}`, JSON.stringify(newDocs));
    window.dispatchEvent(new Event('storage'));
  };

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleSubmit = () => {
    // Check if at least one document is uploaded
    const hasUploads = documents.some(doc => doc.fileName !== null);
    if (!hasUploads) {
      toast.success("Please upload at least one document before submitting.");
      return;
    }
    
    setShowConfirmModal(true);
  };

  const confirmSubmission = () => {
    setShowConfirmModal(false);
    setIsSubmitted(true);
    
    // Save to localStorage so admin side can pick it up
    localStorage.setItem(`customerSubmitted_${id}`, 'true');
    localStorage.setItem(`customerDocs_${id}`, JSON.stringify(documents));
    window.dispatchEvent(new Event('storage'));
  };

  const [viewingDoc, setViewingDoc] = useState<{name: string, fileData?: string} | null>(null);



  const handleView = (doc: any) => {
    setViewingDoc({ name: doc.name, fileData: doc.fileData });
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--primary)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building size={24} color="white" />
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-dark)', margin: 0, letterSpacing: '-0.025em' }}>
              BuildApprove
            </h1>
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>Secure Document Portal</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Application Reference: <strong style={{ color: 'var(--primary-dark)' }}>{id}</strong></p>
        </div>

        {isSubmitted && documents.some(d => d.status === 'Needs Reupload') && (
          <div style={{ backgroundColor: 'rgba(214, 167, 86, 0.1)', border: '1px solid var(--warning-gold)', borderRadius: '0.75rem', padding: '1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <AlertCircle size={24} color="var(--warning-gold)" style={{ flexShrink: 0 }} />
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--primary-dark)', margin: '0 0 0.25rem 0' }}>Action Required: Reupload Documents</h3>
              <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.875rem' }}>Some of your documents need to be reuploaded. Please check the list below and provide the corrected files.</p>
            </div>
          </div>
        )}

        {isSubmitted && !documents.some(d => d.status === 'Needs Reupload') && (
          <div style={{ backgroundColor: 'rgba(34, 160, 107, 0.1)', border: '1px solid var(--success-green)', borderRadius: '0.75rem', padding: '1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <ShieldCheck size={24} color="var(--success-green)" style={{ flexShrink: 0 }} />
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--primary-dark)', margin: '0 0 0.25rem 0' }}>Documents Submitted Successfully</h3>
              <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.875rem' }}>Your documents have been securely transmitted to our agency. You can no longer upload or modify files, but you may view or download your submitted documents below.</p>
            </div>
          </div>
        )}

        {!isSubmitted && (
          <div style={{ backgroundColor: 'rgba(18, 55, 42, 0.05)', border: '1px solid rgba(11, 99, 206, 0.2)', borderRadius: '0.75rem', padding: '1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <AlertCircle size={24} color="var(--primary)" style={{ flexShrink: 0 }} />
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--primary-dark)', margin: '0 0 0.25rem 0' }}>Action Required</h3>
              <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.875rem' }}>Please upload the requested documents below. Once all documents are uploaded, click the Submit button at the bottom of the page. <strong>Note: You cannot modify files after submission.</strong></p>
            </div>
          </div>
        )}

        {/* Upload List */}
        <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden', marginBottom: '2rem' }}>
          {documents.filter(doc => !['building_plan', 'site_inspection_report', 'govt_approval'].includes(doc.id)).map((doc, index, array) => (
            <div key={doc.id} style={{ padding: '1.5rem', borderBottom: index < array.length - 1 ? '1px solid var(--border-color)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '0.5rem', backgroundColor: doc.status === 'Needs Reupload' ? 'rgba(214, 167, 86, 0.1)' : (doc.fileName || doc.file) ? 'rgba(34, 160, 107, 0.1)' : 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: doc.status === 'Needs Reupload' ? 'var(--warning-gold)' : (doc.fileName || doc.file) ? 'var(--success-green)' : 'var(--text-secondary)' }}>
                  {(doc.fileName || doc.file) && doc.status !== 'Needs Reupload' ? <CheckCircle2 size={24} /> : <FileText size={24} />}
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--primary-dark)', margin: '0 0 0.25rem 0' }}>{doc.name}</h4>
                  <p style={{ fontSize: '0.875rem', color: doc.status === 'Needs Reupload' ? 'var(--warning-gold)' : (doc.fileName || doc.file) ? 'var(--success-green)' : 'var(--text-secondary)', margin: 0 }}>
                    {doc.status === 'Needs Reupload' ? 'Reupload Requested' : (doc.fileName || doc.file) ? `Uploaded: ${doc.fileName || doc.file}` : 'Pending Upload'}
                  </p>
                </div>
              </div>
              
              <div>
                {isSubmitted && doc.status !== 'Needs Reupload' ? (
                  doc.fileName || doc.file ? (
                    <button onClick={() => handleView(doc)} style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', color: 'var(--primary-dark)', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FileText size={16} /> View
                    </button>
                  ) : (
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Not Provided</span>
                  )
                ) : (
                  <button 
                    onClick={() => triggerUpload(doc.id)}
                    style={{ 
                      padding: '0.5rem 1rem', 
                      borderRadius: '0.5rem', 
                      border: doc.fileName || doc.file ? '1px solid var(--border-color)' : 'none', 
                      backgroundColor: doc.fileName || doc.file ? 'var(--bg-surface)' : 'var(--primary)', 
                      color: doc.fileName || doc.file ? 'var(--primary-dark)' : 'var(--bg-surface)', 
                      fontSize: '0.875rem', 
                      fontWeight: 500, 
                      cursor: 'pointer',
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem' 
                    }}
                  >
                    <Upload size={16} /> {doc.status === 'Needs Reupload' ? 'Reupload' : doc.fileName || doc.file ? 'Change File' : 'Upload'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Hidden File Input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          onChange={handleFileChange}
        />

        {/* Submit Button */}
        {!isSubmitted && (
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              onClick={handleSubmit}
              className="btn-primary" 
              style={{ padding: '1rem 2rem', fontSize: '1rem', fontWeight: 600, borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <ShieldCheck size={20} /> Submit All Documents
            </button>
          </div>
        )}

        {/* Submit Reuploads Button */}
        {isSubmitted && documents.some(d => d.status === 'Needs Reupload') && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button 
              onClick={handleReuploadSubmit}
              className="btn-primary" 
              style={{ padding: '1rem 2rem', fontSize: '1rem', fontWeight: 600, borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--warning-gold)', borderColor: 'var(--warning-gold)' }}
            >
              <ShieldCheck size={20} /> Submit Reuploaded Documents
            </button>
          </div>
        )}

      </div>
      
      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '0.75rem', width: '100%', maxWidth: '480px', padding: '2rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', position: 'relative' }}>
            <button onClick={() => setShowConfirmModal(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
              <X size={20} />
            </button>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(214, 167, 86, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--warning-gold)', flexShrink: 0 }}>
                <HelpCircle size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: '0.25rem' }}>Confirm Submission</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>Are you sure you want to submit your documents now?</p>
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', border: '1px solid var(--border-color)', fontSize: '0.875rem', color: 'var(--primary-dark)' }}>
              <strong>Important:</strong> You will not be able to change, delete, or upload more documents after submitting. Please verify all files are correct.
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button onClick={() => setShowConfirmModal(false)} style={{ padding: '0.75rem 1.25rem', borderRadius: '0.5rem', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--primary-dark)', fontWeight: 500, cursor: 'pointer', fontSize: '0.875rem' }}>
                Cancel
              </button>
              <button onClick={confirmSubmission} className="btn-primary" style={{ padding: '0.75rem 1.25rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                Yes, Submit Documents
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
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No file data available. Note: This file might have been uploaded before the image preview feature was added. Please reupload it to view.</div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

// Dummy building icon for customer view
const Building = ({ size, color }: { size: number, color: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
    <path d="M9 22v-4h6v4"></path>
    <path d="M8 6h.01"></path>
    <path d="M16 6h.01"></path>
    <path d="M12 6h.01"></path>
    <path d="M12 10h.01"></path>
    <path d="M12 14h.01"></path>
    <path d="M16 10h.01"></path>
    <path d="M16 14h.01"></path>
    <path d="M8 10h.01"></path>
    <path d="M8 14h.01"></path>
  </svg>
);

export default CustomerUpload;
