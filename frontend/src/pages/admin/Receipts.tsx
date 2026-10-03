import React, { useState } from 'react';
import { Search, Calendar, Plus, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const DenseField = ({ label, type = 'text', value, onChange, icon, options, readOnly, disabled, extraIcon, onIconClick }: any) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
      <div style={{ width: '160px', flexShrink: 0, fontWeight: 500, color: 'var(--text-secondary)' }}>{label}</div>
      <div style={{ display: 'flex', flex: 1, alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: '4px', backgroundColor: readOnly || disabled ? 'var(--bg-secondary)' : 'white', height: '32px', position: 'relative' }}>
        {options ? (
          <select value={value} onChange={onChange} style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: '0.875rem', padding: '0 8px', height: '100%', color: 'inherit' }} disabled={disabled}>
            {options.map((o: string) => <option key={o} value={o}>{o}</option>)}
          </select>
        ) : (
          <input type={type} value={value} onChange={onChange} readOnly={readOnly} disabled={disabled} style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: '0.875rem', padding: '0 8px', height: '100%', color: 'inherit' }} />
        )}
        {icon && (
          <div onClick={onIconClick} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 8px', cursor: onIconClick ? 'pointer' : 'default', borderLeft: '1px solid var(--border-color)', height: '100%', color: 'var(--primary)' }}>
            {icon}
          </div>
        )}
      </div>
      {extraIcon && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', backgroundColor: '#10b981', color: 'white', borderRadius: '4px', cursor: 'pointer' }}>
          {extraIcon}
        </div>
      )}
    </div>
  );
};

const Receipts: React.FC = () => {
  const [view, setView] = useState<'view' | 'add' | 'disabled'>('disabled');
  const [isAppSearchModalOpen, setIsAppSearchModalOpen] = useState(false);
  const [isReceiptSearchModalOpen, setIsReceiptSearchModalOpen] = useState(false);

  const pendingApplications = [
    { appNo: 'APP-260926-001', customer: 'Bala Krishnan', mobile: '9876543210', service: 'Building Approval', pendingAmount: 25000 },
    { appNo: 'APP-260926-002', customer: 'Suresh Kumar', mobile: '8765432109', service: 'Layout Approval', pendingAmount: 15000 },
    { appNo: 'APP-260926-003', customer: 'Ramesh Singh', mobile: '7654321098', service: 'Building Approval', pendingAmount: 40000 },
  ];
  
  const initialFormState = {
    type: 'Fresh', services: '<Select>', applicationNo: '',
    referenceNo: '', customerName: '', mobileNumber: '',
    executive: 'Admin User',
    receiptMode: 'Select', receiptDate: new Date().toISOString().split('T')[0],
    receiptAmt: '', balance: '',
    typeOfInst: 'Select', instrNo: '', instrAmount: '', instrDate: '',
    instrBankName: '', instrBankBranch: '', payableAt: '', payInSlipType: '',
    thirdPartyRemittance: 'Select', instrBnkAccHoldName: '', instrBnkAccNo: '', glCode: '',
    remittedBy: '', printCount: ''
  };

  const [receipts, setReceipts] = useState<any[]>([
    { id: 'REC-001', date: '25 Sept 2026', customer: 'Ramesh Kumar', amount: 25000, mode: 'Cash', status: 'Confirmed', services: 'Building Approval' }
  ]);
  
  const [formData, setFormData] = useState(initialFormState);

  const generateReceiptHTML = (receipt: any) => {
    return `
      <html>
        <head>
          <title>Receipt - ${receipt.id}</title>
          <style>
            @page { size: A4; margin: 20mm; }
            body { 
              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; 
              color: #000;
              background: #fff;
              margin: 0;
              padding: 0;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .container { 
              max-width: 800px; 
              margin: 0 auto; 
              padding: 40px;
              border: 1px solid #ddd;
            }
            @media print {
              .container { border: none; padding: 0; margin: 0; max-width: 100%; }
            }
            .header {
              display: flex;
              align-items: flex-start;
              justify-content: space-between;
              border-bottom: 2px solid #000;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .logo-section {
              display: flex;
              align-items: center;
              gap: 20px;
            }
            .logo-img {
              width: 70px;
              height: 70px;
              object-fit: contain;
            }
            .company-info h1 {
              margin: 0 0 5px 0;
              font-size: 22px;
              font-weight: bold;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .company-info p {
              margin: 2px 0;
              font-size: 12px;
              color: #444;
            }
            .receipt-meta {
              text-align: right;
            }
            .receipt-title {
              font-size: 28px;
              font-weight: bold;
              text-transform: uppercase;
              letter-spacing: 2px;
              margin: 0 0 15px 0;
            }
            .meta-grid {
              display: grid;
              grid-template-columns: auto auto;
              gap: 8px 15px;
              text-align: left;
            }
            .meta-label {
              font-size: 11px;
              font-weight: bold;
              color: #666;
              text-transform: uppercase;
            }
            .meta-val {
              font-size: 13px;
              font-weight: bold;
            }
            .bill-to {
              margin-bottom: 30px;
              padding: 20px;
              background: #f9f9f9;
              border-left: 4px solid #000;
            }
            .bill-to h3 {
              margin: 0 0 12px 0;
              font-size: 13px;
              text-transform: uppercase;
              color: #555;
            }
            .bill-to p {
              margin: 6px 0;
              font-size: 14px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
            }
            th {
              background: #eee;
              text-align: left;
              padding: 12px;
              font-size: 12px;
              text-transform: uppercase;
              border-bottom: 2px solid #000;
              border-top: 2px solid #000;
            }
            td {
              padding: 15px 12px;
              border-bottom: 1px solid #ccc;
              font-size: 14px;
            }
            .amt-col {
              text-align: right;
            }
            .total-row {
              font-weight: bold;
              font-size: 16px;
            }
            .total-row td {
              border-bottom: 2px solid #000;
              padding-top: 20px;
            }
            .amount-words {
              font-size: 12px;
              font-style: italic;
              color: #555;
              margin-bottom: 60px;
            }
            .signatures {
              display: flex;
              justify-content: space-between;
              margin-top: 60px;
            }
            .sig-block {
              text-align: center;
              width: 250px;
            }
            .sig-line {
              border-bottom: 1px solid #000;
              height: 40px;
              margin-bottom: 8px;
            }
            .sig-label {
              font-size: 11px;
              font-weight: bold;
              text-transform: uppercase;
            }
            .footer {
              margin-top: 50px;
              text-align: center;
              font-size: 11px;
              color: #888;
              border-top: 1px solid #eee;
              padding-top: 15px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo-section">
                <img src="\${window.location.origin}/assets/logo.jpeg" alt="Logo" class="logo-img" onerror="this.style.display='none'" />
                <div class="company-info">
                  <h1>C.B. BUILDING APPROVALS</h1>
                  <p>No. 45, Anna Salai, Chennai, Tamil Nadu - 600002</p>
                  <p>contact@cbapprovals.com | +91 98765 43210</p>
                </div>
              </div>
              <div class="receipt-meta">
                <div class="receipt-title">RECEIPT</div>
                <div class="meta-grid">
                  <div class="meta-label">Receipt No:</div>
                  <div class="meta-val">${receipt.id}</div>
                  <div class="meta-label">Date:</div>
                  <div class="meta-val">${receipt.date}</div>
                </div>
              </div>
            </div>

            <div class="bill-to">
              <h3>Received From</h3>
              <p style="font-size: 18px; font-weight: bold;">${receipt.customer}</p>
              ${receipt.applicationNo ? `<p>Application Ref: <strong>${receipt.applicationNo}</strong></p>` : ''}
              <p>Payment Mode: <strong>${receipt.mode}</strong></p>
            </div>

            <table>
              <thead>
                <tr>
                  <th style="width: 5%;">#</th>
                  <th>Description</th>
                  <th class="amt-col">Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>
                    <strong>Service Fee</strong><br/>
                    <span style="font-size: 12px; color: #555;">${receipt.services && receipt.services !== '<Select>' ? receipt.services : 'General Payment'}</span>
                  </td>
                  <td class="amt-col">${Number(receipt.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                </tr>
                <tr class="total-row">
                  <td colspan="2" style="text-align: right;">Total Amount Received</td>
                  <td class="amt-col">₹${Number(receipt.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                </tr>
              </tbody>
            </table>

            <div class="amount-words">
              * Subject to realization of cheque/demand draft if applicable.
            </div>

            <div class="signatures">
              <div class="sig-block">
                <div class="sig-line"></div>
                <div class="sig-label">Customer Signature</div>
              </div>
              <div class="sig-block">
                <div class="sig-line" style="display: flex; align-items: flex-end; justify-content: center; padding-bottom: 5px; font-family: cursive; font-size: 20px;">C.B. Admin</div>
                <div class="sig-label">Authorized Signatory</div>
              </div>
            </div>
            
            <div class="footer">
              This is a computer-generated receipt.<br/>
              Generated by: ${receipt.executive || 'System'}
            </div>
          </div>
          <script>
            window.onload = function() { 
              setTimeout(function() {
                window.print(); 
                window.close();
              }, 500);
            }
          </script>
        </body>
      </html>
    `;
  };

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.receiptAmt) {
      toast.error('Please enter receipt amount');
      return;
    }
    
    if (window.confirm('Cash and customer details verified?')) {
      const receipt = {
        id: `REC-00${receipts.length + 1}`,
        date: formData.receiptDate || new Date().toLocaleDateString('en-GB'),
        customer: formData.customerName || 'Unknown',
        amount: Number(formData.receiptAmt),
        mode: formData.receiptMode,
        status: 'Confirmed',
        applicationNo: formData.applicationNo,
        services: formData.services
      };

      setReceipts([receipt, ...receipts]);
      toast.success('Payment confirmed! Receipt is ready for print.');
      
      sessionStorage.setItem('print_receipt_data', JSON.stringify(receipt));
      window.open(`/print/receipt/${receipt.id}`, '_blank');

      setView('disabled');
      setFormData(initialFormState);
    }
  };

  const handleReprint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.referenceNo) {
      toast.error('No receipt selected to reprint');
      return;
    }

    const receipt = {
      id: formData.referenceNo,
      date: formData.receiptDate,
      customer: formData.customerName,
      amount: Number(formData.receiptAmt),
      mode: formData.receiptMode,
      applicationNo: formData.applicationNo,
      services: formData.services
    };

    sessionStorage.setItem('print_receipt_data', JSON.stringify(receipt));
    window.open(`/print/receipt/${receipt.id}`, '_blank');
  };

  const handleCancel = (e: React.FormEvent) => {
    e.preventDefault();
    setView('disabled');
    setFormData(initialFormState);
  };

  const handleClear = (e: React.FormEvent) => {
    e.preventDefault();
    setFormData(initialFormState);
  };

  // Form disable logic
  const isFormDisabled = view === 'disabled' || view === 'view';
  const isAppNoDisabled = view === 'disabled' || (view === 'add' && formData.type === 'Fresh') || view === 'view';
  const isBottomHalfDisabled = isFormDisabled || formData.receiptMode === 'Cash';
  const isRefNoSearchEnabled = view === 'view'; // Only enable reference search in view mode

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-dark)', margin: 0 }}>
          {view === 'view' ? 'View/Reprint Receipt' : 'Raise a Receipt'}
        </h1>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            className={`btn-primary ${view === 'add' ? 'active' : ''}`} 
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', backgroundColor: view === 'add' ? 'var(--primary-dark)' : 'var(--primary)' }} 
            onClick={() => { setView('add'); setFormData(initialFormState); }}
          >
            <Plus size={16} /> Add
          </button>
          <button 
            className={`btn-primary ${view === 'view' ? 'active' : ''}`} 
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', backgroundColor: view === 'view' ? 'var(--primary-dark)' : 'var(--primary)' }} 
            onClick={() => { setView('view'); setFormData(initialFormState); }}
          >
            <Eye size={16} /> View
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem 1rem' }}>
            
            <DenseField label="Type" value={formData.type} onChange={(e:any) => setFormData({...formData, type: e.target.value})} options={['Fresh', 'Existing']} disabled={isFormDisabled} />
            <DenseField label="Services" value={formData.services} onChange={(e:any) => setFormData({...formData, services: e.target.value})} options={['<Select>', 'Building Approval', 'Layout Approval', 'Other']} disabled={isFormDisabled} />
            <DenseField label="Application Number" value={formData.applicationNo} onChange={(e:any) => setFormData({...formData, applicationNo: e.target.value})} icon={<Search size={14}/>} disabled={isAppNoDisabled} onIconClick={() => !isAppNoDisabled && setIsAppSearchModalOpen(true)} />
            <DenseField label="Reference No." value={formData.referenceNo} readOnly={true} disabled={!isRefNoSearchEnabled} icon={isRefNoSearchEnabled ? <Search size={14}/> : null} onIconClick={() => isRefNoSearchEnabled && setIsReceiptSearchModalOpen(true)} />

            <DenseField label="Customer Name" value={formData.customerName} onChange={(e:any) => setFormData({...formData, customerName: e.target.value})} disabled={isFormDisabled} />
            <DenseField label="Mobile Number" value={formData.mobileNumber} onChange={(e:any) => setFormData({...formData, mobileNumber: e.target.value})} disabled={isFormDisabled} />
            <DenseField label="Executive" value={formData.executive} readOnly={true} disabled={true} />
            
            {formData.type === 'Existing' ? (
              <DenseField label="Balance Amt." value={formData.balance} readOnly={true} disabled={isFormDisabled} />
            ) : (
              <div></div>
            )}

            <DenseField label="Receipt Mode" value={formData.receiptMode} onChange={(e:any) => setFormData({...formData, receiptMode: e.target.value})} options={['Select', 'Cash', 'Bank', 'UPI']} disabled={isFormDisabled} />
            <DenseField label="Receipt Date" value={formData.receiptDate} readOnly={true} disabled={true} icon={<Calendar size={14}/>} />
            <DenseField label="Receipt Amt." value={formData.receiptAmt} onChange={(e:any) => setFormData({...formData, receiptAmt: e.target.value})} disabled={isFormDisabled} />
            <div></div>
            
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }}></div>

        <div style={{ marginBottom: '1.5rem', opacity: isBottomHalfDisabled ? 0.5 : 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem 1rem' }}>
            
            <DenseField label="Type of Inst." value={formData.typeOfInst} onChange={(e:any) => setFormData({...formData, typeOfInst: e.target.value})} options={['Select', 'Type A', 'Type B']} disabled={isBottomHalfDisabled} />
            <DenseField label="Instr.No" value={formData.instrNo} onChange={(e:any) => setFormData({...formData, instrNo: e.target.value})} disabled={isBottomHalfDisabled} />
            <DenseField label="Instr. Amount" value={formData.instrAmount} onChange={(e:any) => setFormData({...formData, instrAmount: e.target.value})} disabled={isBottomHalfDisabled} />
            <DenseField label="Instr. Date" value={formData.instrDate} onChange={(e:any) => setFormData({...formData, instrDate: e.target.value})} icon={<Calendar size={14}/>} disabled={isBottomHalfDisabled} />

            <DenseField label="Instr. Bank Name" value={formData.instrBankName} onChange={(e:any) => setFormData({...formData, instrBankName: e.target.value})} icon={<Search size={14}/>} disabled={isBottomHalfDisabled} />
            <DenseField label="Instr. Bank Branch" value={formData.instrBankBranch} onChange={(e:any) => setFormData({...formData, instrBankBranch: e.target.value})} disabled={isBottomHalfDisabled} />
            <DenseField label="Payable At" value={formData.payableAt} onChange={(e:any) => setFormData({...formData, payableAt: e.target.value})} disabled={isBottomHalfDisabled} />
            <DenseField label="Pay-in-Slip Type" value={formData.payInSlipType} onChange={(e:any) => setFormData({...formData, payInSlipType: e.target.value})} icon={<Search size={14}/>} disabled={isBottomHalfDisabled} />

            <DenseField label="Third Party Remittance" value={formData.thirdPartyRemittance} onChange={(e:any) => setFormData({...formData, thirdPartyRemittance: e.target.value})} options={['Select', 'Yes', 'No']} disabled={isBottomHalfDisabled} />
            <DenseField label="Instr.Bnk.Acc Hold Name" value={formData.instrBnkAccHoldName} onChange={(e:any) => setFormData({...formData, instrBnkAccHoldName: e.target.value})} disabled={isBottomHalfDisabled} />
            <DenseField label="Instr.Bnk.Acc.No" value={formData.instrBnkAccNo} onChange={(e:any) => setFormData({...formData, instrBnkAccNo: e.target.value})} disabled={isBottomHalfDisabled} />
            <DenseField label="Gl.code" value={formData.glCode} onChange={(e:any) => setFormData({...formData, glCode: e.target.value})} icon={<Search size={14}/>} disabled={isBottomHalfDisabled} />

            <DenseField label="Remitted By" value={formData.remittedBy} onChange={(e:any) => setFormData({...formData, remittedBy: e.target.value})} disabled={isBottomHalfDisabled} />
            <DenseField label="Print Count" value={formData.printCount} onChange={(e:any) => setFormData({...formData, printCount: e.target.value})} disabled={true} />
            <div></div>
            <div></div>
          </div>
        </div>

        {view === 'add' && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={handleConfirm} style={{ backgroundColor: '#f59e0b', color: 'white', border: 'none', padding: '8px 24px', fontSize: '0.875rem', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer' }}>CONFIRM</button>
              <button onClick={handleCancel} style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '8px 24px', fontSize: '0.875rem', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer' }}>CANCEL</button>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={handleClear} style={{ backgroundColor: '#0ea5e9', color: 'white', border: 'none', padding: '8px 24px', fontSize: '0.875rem', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer' }}>CLEAR</button>
            </div>
          </div>
        )}

        {view === 'view' && formData.referenceNo && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <button onClick={handleReprint} style={{ backgroundColor: '#0ea5e9', color: 'white', border: 'none', padding: '8px 32px', fontSize: '0.875rem', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer' }}>REPRINT RECEIPT</button>
          </div>
        )}
      </div>

      {isAppSearchModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
          <div className="card" style={{ width: '100%', maxWidth: '700px', padding: '1.5rem', backgroundColor: 'white', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--primary-dark)', margin: 0 }}>Pending Payment Applications</h3>
              <button onClick={() => setIsAppSearchModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>&times;</button>
            </div>
            <div className="table-responsive">
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>App No.</th>
                    <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Customer</th>
                    <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Service</th>
                    <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Pending Amt</th>
                    <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingApplications.map(app => (
                    <tr key={app.appNo} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary)' }}>{app.appNo}</td>
                      <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem' }}>{app.customer}</td>
                      <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem' }}>{app.service}</td>
                      <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary-dark)' }}>₹{app.pendingAmount.toLocaleString()}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <button 
                          onClick={() => {
                            setFormData({...formData, applicationNo: app.appNo, customerName: app.customer, mobileNumber: app.mobile, services: app.service, balance: app.pendingAmount.toString()});
                            setIsAppSearchModalOpen(false);
                          }}
                          style={{ padding: '0.25rem 0.75rem', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                        >
                          Select
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {isReceiptSearchModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
          <div className="card" style={{ width: '100%', maxWidth: '700px', padding: '1.5rem', backgroundColor: 'white', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--primary-dark)', margin: 0 }}>Select Receipt to View/Reprint</h3>
              <button onClick={() => setIsReceiptSearchModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>&times;</button>
            </div>
            <div className="table-responsive">
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Receipt No.</th>
                    <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Customer</th>
                    <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Date</th>
                    <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Amount</th>
                    <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {receipts.map(rec => (
                    <tr key={rec.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary)' }}>{rec.id}</td>
                      <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem' }}>{rec.customer}</td>
                      <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem' }}>{rec.date}</td>
                      <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary-dark)' }}>₹{rec.amount.toLocaleString()}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <button 
                          onClick={() => {
                            setFormData({
                              ...initialFormState,
                              referenceNo: rec.id,
                              customerName: rec.customer,
                              receiptDate: rec.date,
                              receiptAmt: rec.amount.toString(),
                              receiptMode: rec.mode,
                              applicationNo: rec.applicationNo || '',
                              services: rec.services || '<Select>'
                            });
                            setIsReceiptSearchModalOpen(false);
                          }}
                          style={{ padding: '0.25rem 0.75rem', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', marginRight: '0.5rem' }}
                        >
                          View
                        </button>
                        <button 
                          onClick={() => {
                            sessionStorage.setItem('print_receipt_data', JSON.stringify(rec));
                            window.open(`/print/receipt/${rec.id}`, '_blank');
                          }}
                          style={{ padding: '0.25rem 0.75rem', backgroundColor: 'var(--primary)', color: 'white', border: 'none', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                        >
                          Print
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Receipts;
