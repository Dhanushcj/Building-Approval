import React, { useState } from 'react';
import { Search, ArrowUpRight, ArrowDownRight, DollarSign, Wallet, Download } from 'lucide-react';
import toast from 'react-hot-toast';

const CashBook: React.FC = () => {
  const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for the cash book ledger
  const openingBalance = 125000;
  
  const transactions = [
    { id: 'REC-001', date: '2026-10-01', particulars: 'Ramesh Kumar - Building Approval', type: 'Receipt', amount: 25000 },
    { id: 'EXP-101', date: '2026-10-01', particulars: 'Office Supplies - Stationary', type: 'Expense', amount: 1500 },
    { id: 'REC-002', date: '2026-10-01', particulars: 'Bala Krishnan - Layout Approval', type: 'Receipt', amount: 10000 },
    { id: 'EXP-102', date: '2026-10-01', particulars: 'Travel Allowance - Field Visit', type: 'Expense', amount: 800 },
  ];

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.particulars.toLowerCase().includes(searchTerm.toLowerCase()) || t.id.toLowerCase().includes(searchTerm.toLowerCase());
    const isAfterFrom = t.date >= fromDate;
    const isBeforeTo = t.date <= toDate;
    return matchesSearch && isAfterFrom && isBeforeTo;
  });

  const totalIn = filteredTransactions.filter(t => t.type === 'Receipt').reduce((acc, curr) => acc + curr.amount, 0);
  const totalOut = filteredTransactions.filter(t => t.type === 'Expense').reduce((acc, curr) => acc + curr.amount, 0);
  const closingBalance = openingBalance + totalIn - totalOut;

  let runningBalance = openingBalance;

  const handleExportExcel = () => {
    const headers = ['DATE', 'REF NO.', 'PARTICULARS', 'IN (RECEIPT)', 'OUT (EXPENSE)', 'BALANCE'];
    
    let currentBal = openingBalance;
    const rows = filteredTransactions.map(t => {
      if (t.type === 'Receipt') currentBal += t.amount;
      else currentBal -= t.amount;
      
      const receipt = t.type === 'Receipt' ? t.amount : '';
      const expense = t.type === 'Expense' ? t.amount : '';
      return `"${t.date}","${t.id}","${t.particulars}","${receipt}","${expense}","${currentBal}"`;
    });

    const csvContent = [
      headers.join(','),
      `"${fromDate}","-","Opening Balance","-","-","${openingBalance}"`,
      ...rows,
      `"","","CLOSING BALANCE","${totalIn}","${totalOut}","${closingBalance}"`
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `CashBook_${fromDate}_to_${toDate}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Excel (CSV) exported successfully');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-dark)', margin: 0 }}>
          Cash Book & Balance
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>From:</span>
            <input 
              type="date" 
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', fontSize: '0.875rem', outline: 'none' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>To:</span>
            <input 
              type="date" 
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', fontSize: '0.875rem', outline: 'none' }}
            />
          </div>
          <button className="btn-primary" onClick={handleExportExcel} style={{ padding: '0.625rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#10b981', borderColor: '#10b981' }}>
            <Download size={16} /> Export Excel
          </button>
          <button className="btn-primary" onClick={() => window.print()} style={{ padding: '0.625rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Download size={16} /> Export PDF
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid #3b82f6' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
            <Wallet size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.25rem' }}>Opening Balance</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>₹{openingBalance.toLocaleString()}</div>
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid #10b981' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
            <ArrowDownRight size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.25rem' }}>Total Receipts (In)</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#10b981' }}>₹{totalIn.toLocaleString()}</div>
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid #ef4444' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
            <ArrowUpRight size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.25rem' }}>Total Expenses (Out)</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ef4444' }}>₹{totalOut.toLocaleString()}</div>
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid #0f172a' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(15, 23, 42, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f172a' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.25rem' }}>Closing Balance</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-dark)' }}>₹{closingBalance.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--primary-dark)', margin: 0 }}>Ledger Transactions</h2>
          <div style={{ position: 'relative', width: '250px' }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', top: '50%', right: '1rem', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Search particulars..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '0.625rem 2.5rem 0.625rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', fontSize: '0.875rem', outline: 'none' }}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Date</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Ref No.</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Particulars</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', textAlign: 'right' }}>In (Receipt)</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', textAlign: 'right' }}>Out (Expense)</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', textAlign: 'right' }}>Balance</th>
              </tr>
            </thead>
            <tbody>
              {/* Opening Balance Row */}
              <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'rgba(59, 130, 246, 0.02)' }}>
                <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{fromDate}</td>
                <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary)' }}>-</td>
                <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary-dark)' }}>Opening Balance</td>
                <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#10b981', textAlign: 'right' }}>-</td>
                <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#ef4444', textAlign: 'right' }}>-</td>
                <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary-dark)', textAlign: 'right' }}>₹{openingBalance.toLocaleString()}</td>
              </tr>

              {filteredTransactions.map((t) => {
                if (t.type === 'Receipt') runningBalance += t.amount;
                else runningBalance -= t.amount;

                return (
                  <tr key={t.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{t.date}</td>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary)' }}>{t.id}</td>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--text-primary)' }}>{t.particulars}</td>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#10b981', textAlign: 'right' }}>
                      {t.type === 'Receipt' ? `+ ₹${t.amount.toLocaleString()}` : '-'}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#ef4444', textAlign: 'right' }}>
                      {t.type === 'Expense' ? `- ₹${t.amount.toLocaleString()}` : '-'}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary-dark)', textAlign: 'right' }}>
                      ₹{runningBalance.toLocaleString()}
                    </td>
                  </tr>
                );
              })}

              {/* Closing Balance Row */}
              <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
                <td colSpan={3} style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary-dark)', textAlign: 'right' }}>CLOSING BALANCE:</td>
                <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: 700, color: '#10b981', textAlign: 'right' }}>₹{totalIn.toLocaleString()}</td>
                <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: 700, color: '#ef4444', textAlign: 'right' }}>₹{totalOut.toLocaleString()}</td>
                <td style={{ padding: '1rem 1.5rem', fontSize: '1rem', fontWeight: 800, color: 'var(--primary-dark)', textAlign: 'right' }}>₹{closingBalance.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CashBook;
