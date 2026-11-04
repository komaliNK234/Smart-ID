import React, { useState } from 'react';
import {
  Receipt,
  Download,
  Printer,
  CheckCircle2,
  Search,
  X,
  User,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export default function PaymentHistory({ payments = [], currentUser, role = 'student' }) {
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMyPaymentsOnly, setFilterMyPaymentsOnly] = useState(role === 'student');

  const currentStudentId = currentUser?.studentId?.trim().toLowerCase();

  // Filter payments
  const displayedPayments = payments.filter((p) => {
    if (filterMyPaymentsOnly && currentStudentId) {
      if (p.studentId?.trim().toLowerCase() !== currentStudentId) {
        return false;
      }
    }
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.transactionId?.toLowerCase().includes(q) ||
      p.applicationId?.toLowerCase().includes(q) ||
      p.studentId?.toLowerCase().includes(q) ||
      p.studentName?.toLowerCase().includes(q) ||
      p.receiptNumber?.toLowerCase().includes(q)
    );
  });

  const totalAmount = displayedPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

  const handleDownloadReceiptPDF = async () => {
    const receiptElement = document.getElementById('printable-receipt-modal');
    if (!receiptElement) return;

    try {
      const canvas = await html2canvas(receiptElement, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 10, width, height);
      pdf.save(`Receipt_${selectedReceipt.transactionId}.pdf`);
    } catch (err) {
      console.error('Failed to download receipt', err);
    }
  };

  return (
    <div className="payment-history-wrapper">
      <div className="page-header">
        <h2 className="page-title">Payment History & Tax Receipts</h2>
        <p className="page-subtitle">
          Audited log of all digital college card fee payments and official university receipts.
        </p>
      </div>

      {/* Student Account Summary Banner */}
      {currentUser && (
        <div
          style={{
            background: 'linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 100%)',
            border: '1px solid #bbf7d0',
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Receipt size={18} color="#15803d" />
              <strong style={{ color: '#14532d', fontSize: '14px' }}>
                {filterMyPaymentsOnly ? 'My Official Receipts' : 'All Institutional Payments'}
              </strong>
              <span
                style={{
                  fontSize: '11px',
                  background: '#15803d',
                  color: '#fff',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  fontWeight: 700,
                }}
              >
                {displayedPayments.length} Receipts Found
              </span>
            </div>
            <div style={{ fontSize: '12.5px', color: '#166534', marginTop: '4px' }}>
              Account Holder: <strong>{currentUser.name}</strong> • Roll No:{' '}
              <strong>{currentUser.studentId || 'Admin'}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>
                Total Fee Settled
              </div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#15803d' }}>
                ₹{totalAmount}.00
              </div>
            </div>

            {role === 'student' && (
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setFilterMyPaymentsOnly(!filterMyPaymentsOnly)}
                style={{ background: '#fff', fontSize: '11.5px' }}
              >
                {filterMyPaymentsOnly ? 'Show All Students' : 'Show Only Mine'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Filter / Search Bar */}
      <div className="panel-card" style={{ marginBottom: '20px', padding: '16px 20px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Search size={18} color="#94a3b8" />
          <input
            type="text"
            className="form-control"
            style={{ width: '100%' }}
            placeholder="Search payments by Transaction ID, Receipt No, Application ID, or Roll Number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Payment Table */}
      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Receipt Ref</th>
              <th>Application ID</th>
              <th>Student ID</th>
              <th>Student Name</th>
              <th>ID Type</th>
              <th>Amount</th>
              <th>Payment Method</th>
              <th>Transaction ID</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {displayedPayments.length === 0 ? (
              <tr>
                <td
                  colSpan="11"
                  style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}
                >
                  <Receipt size={32} color="#cbd5e1" style={{ margin: '0 auto 8px' }} />
                  <div>No payment receipts found matching your query.</div>
                </td>
              </tr>
            ) : (
              displayedPayments.map((item) => (
                <tr key={item.transactionId}>
                  <td style={{ fontWeight: 700, color: '#15803d', fontSize: '12px' }}>
                    {item.receiptNumber || `RCPT-${item.transactionId.slice(-6)}`}
                  </td>
                  <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>
                    {item.applicationId}
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: '#1d4ed8' }}>
                      {item.studentId}
                    </span>
                  </td>
                  <td>{item.studentName || 'Student'}</td>
                  <td>{item.idType}</td>
                  <td>
                    <strong>₹{item.amount}.00</strong>
                  </td>
                  <td>
                    <span style={{ fontSize: '11px', color: '#475569' }}>
                      {item.paymentMethod || 'Razorpay UPI'}
                    </span>
                  </td>
                  <td style={{ fontFamily: 'monospace', fontSize: '11px' }}>
                    {item.transactionId}
                  </td>
                  <td style={{ fontSize: '12px' }}>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <span className="status-pill pill-green">
                      <CheckCircle2 size={12} /> {item.status}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      style={{ fontSize: '11.5px', padding: '4px 8px' }}
                      onClick={() => setSelectedReceipt(item)}
                    >
                      <FileText size={12} /> Receipt
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* RECEIPT MODAL */}
      {selectedReceipt && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
            backdropFilter: 'blur(4px)',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedReceipt(null);
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              maxWidth: '560px',
              width: '100%',
              padding: '28px',
              boxShadow: 'var(--shadow-xl)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '18px',
              }}
            >
              <h3 style={{ fontSize: '16px', fontWeight: 800 }}>
                Official University Payment Receipt
              </h3>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setSelectedReceipt(null)}
              >
                <X size={20} />
              </button>
            </div>

            {/* Printable Receipt Body */}
            <div
              id="printable-receipt-modal"
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '24px',
              }}
            >
              <div
                style={{
                  textAlign: 'center',
                  borderBottom: '2px solid #0f172a',
                  paddingBottom: '16px',
                  marginBottom: '16px',
                }}
              >
                <div style={{ fontSize: '28px' }}>🎓</div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, textTransform: 'uppercase' }}>
                  St. Xavier Institute of Technology
                </h3>
                <p style={{ fontSize: '11px', color: '#64748b' }}>
                  Office of Accounts & Student Identity Affairs • Chennai - 600028
                </p>
                <div
                  style={{
                    display: 'inline-block',
                    background: '#dcfce7',
                    color: '#15803d',
                    fontWeight: 800,
                    fontSize: '11px',
                    padding: '3px 12px',
                    borderRadius: '999px',
                    marginTop: '8px',
                  }}
                >
                  RECEIPT REF: {selectedReceipt.receiptNumber || selectedReceipt.transactionId}
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  fontSize: '12px',
                  marginBottom: '18px',
                }}
              >
                <div>
                  <span style={{ color: '#64748b' }}>Student Name:</span>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>
                    {selectedReceipt.studentName}
                  </div>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Roll Number:</span>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>
                    {selectedReceipt.studentId}
                  </div>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Application Ref:</span>
                  <div style={{ fontFamily: 'monospace', fontWeight: 700 }}>
                    {selectedReceipt.applicationId}
                  </div>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Transaction ID:</span>
                  <div style={{ fontFamily: 'monospace', fontWeight: 700 }}>
                    {selectedReceipt.transactionId}
                  </div>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Payment Mode:</span>
                  <div style={{ fontWeight: 600 }}>{selectedReceipt.paymentMethod}</div>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Payment Timestamp:</span>
                  <div>{new Date(selectedReceipt.createdAt).toLocaleString()}</div>
                </div>
              </div>

              {/* Line items */}
              <div
                style={{
                  borderTop: '1px solid #e2e8f0',
                  borderBottom: '1px solid #e2e8f0',
                  padding: '12px 0',
                  margin: '14px 0',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '12px',
                    padding: '4px 0',
                  }}
                >
                  <span>Digital ID Card Issuance & Smart Encoding ({selectedReceipt.idType})</span>
                  <span>₹{selectedReceipt.amount}.00</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '14px',
                    fontWeight: 800,
                    borderTop: '1px dashed #cbd5e1',
                    paddingTop: '8px',
                    marginTop: '6px',
                  }}
                >
                  <span>Total Amount Settled:</span>
                  <span style={{ color: '#16a34a' }}>₹{selectedReceipt.amount}.00</span>
                </div>
              </div>

              <div
                style={{
                  textAlign: 'center',
                  fontSize: '10px',
                  color: '#94a3b8',
                  marginTop: '16px',
                }}
              >
                Official computer-generated university e-receipt. Valid without physical signature.
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '10px',
                marginTop: '20px',
              }}
            >
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleDownloadReceiptPDF}
              >
                <Download size={14} /> Download PDF Receipt
              </button>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => window.print()}
              >
                <Printer size={14} /> Print
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
