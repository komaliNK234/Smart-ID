import React, { useState } from 'react';
import {
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  CreditCard,
  DollarSign,
  Filter,
  Settings,
  Eye,
  Check,
  X,
  FileCheck,
} from 'lucide-react';

export default function AdminDashboard({
  applications = [],
  payments = [],
  feesConfig = {},
  onUpdateFees,
  onApproveApplication,
  onRejectApplication,
  onSelectApplication,
}) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [showFeeConfigModal, setShowFeeConfigModal] = useState(false);
  const [feeForm, setFeeForm] = useState({ ...feesConfig });

  // Calculate Statistics
  const totalApps = applications.length;
  const pendingVerification = applications.filter(
    (a) => a.verificationStatus === 'Pending Verification'
  ).length;
  const verifiedApps = applications.filter(
    (a) => a.verificationStatus === 'Verified'
  ).length;
  const pendingPayments = applications.filter(
    (a) => a.paymentStatus === 'PENDING'
  ).length;
  const completedIDs = applications.filter(
    (a) => a.paymentStatus === 'PAID' && a.generated === true
  ).length;
  const rejectedApps = applications.filter(
    (a) => a.verificationStatus === 'Rejected'
  ).length;

  const totalRevenue = payments
    .filter((p) => p.status === 'SUCCESS')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  // Filter application list
  const filteredApps = applications.filter((app) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Pending')
      return (
        app.verificationStatus === 'Pending Verification' ||
        app.paymentStatus === 'PENDING'
      );
    if (activeFilter === 'Verified')
      return app.verificationStatus === 'Verified';
    if (activeFilter === 'Rejected')
      return app.verificationStatus === 'Rejected';
    if (activeFilter === 'Paid') return app.paymentStatus === 'PAID';
    if (activeFilter === 'Completed')
      return app.paymentStatus === 'PAID' && app.generated === true;
    return true;
  });

  const handleSaveFees = (e) => {
    e.preventDefault();
    onUpdateFees(feeForm);
    setShowFeeConfigModal(false);
  };

  return (
    <div className="admin-dashboard-wrapper">
      <div className="page-header">
        <div className="page-title-row">
          <div>
            <h2 className="page-title">Identity Authority Administration Portal</h2>
            <p className="page-subtitle">
              Comprehensive control center for student credentials, compliance verification, and gateway settlements.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => {
              setFeeForm({ ...feesConfig });
              setShowFeeConfigModal(true);
            }}
          >
            <Settings size={14} /> Configure ID Fees
          </button>
        </div>
      </div>

      {/* Top Metric Statistics Cards (Section 31) */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrap stat-icon-blue">
            <Users size={22} />
          </div>
          <div>
            <div className="stat-val">{totalApps}</div>
            <div className="stat-lbl">Total Applications</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap stat-icon-amber">
            <Clock size={22} />
          </div>
          <div>
            <div className="stat-val">{pendingVerification}</div>
            <div className="stat-lbl">Pending Verification</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap stat-icon-green">
            <FileCheck size={22} />
          </div>
          <div>
            <div className="stat-val">{verifiedApps}</div>
            <div className="stat-lbl">Verified Applications</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap stat-icon-blue">
            <CreditCard size={22} />
          </div>
          <div>
            <div className="stat-val">{pendingPayments}</div>
            <div className="stat-lbl">Pending Payments</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap stat-icon-green">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div className="stat-val">{completedIDs}</div>
            <div className="stat-lbl">Completed IDs</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap stat-icon-green">
            <DollarSign size={22} />
          </div>
          <div>
            <div className="stat-val">₹{totalRevenue}</div>
            <div className="stat-lbl">Total Fee Collections</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap stat-icon-red">
            <XCircle size={22} />
          </div>
          <div>
            <div className="stat-val">{rejectedApps}</div>
            <div className="stat-lbl">Rejected Applications</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {['All', 'Pending', 'Verified', 'Paid', 'Completed', 'Rejected'].map((f) => (
          <button
            key={f}
            type="button"
            className={`btn btn-sm ${activeFilter === f ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Applications Table */}
      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Application ID</th>
              <th>Roll Number</th>
              <th>Student Name</th>
              <th>Category</th>
              <th>Residency Status</th>
              <th>Verification</th>
              <th>Payment</th>
              <th>ID Issued</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredApps.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                  No applications found under "{activeFilter}" filter.
                </td>
              </tr>
            ) : (
              filteredApps.map((app) => (
                <tr key={app.applicationId}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>
                    {app.applicationId}
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: '#1d4ed8' }}>{app.studentId}</span>
                  </td>
                  <td>{app.studentData?.name || 'N/A'}</td>
                  <td>{app.idType}</td>
                  <td>
                    <span style={{ fontSize: '11px', color: '#475569' }}>
                      {app.currentStatus}
                      {app.previousStatus && app.previousStatus !== app.currentStatus && (
                        <div style={{ fontSize: '10px', color: '#b45309' }}>
                          Prev: {app.previousStatus}
                        </div>
                      )}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`status-pill ${
                        app.verificationStatus === 'Verified'
                          ? 'pill-green'
                          : app.verificationStatus === 'Rejected'
                          ? 'pill-red'
                          : app.verificationStatus === 'Pending Verification'
                          ? 'pill-amber'
                          : 'pill-blue'
                      }`}
                    >
                      {app.verificationStatus}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`status-pill ${
                        app.paymentStatus === 'PAID' ? 'pill-green' : 'pill-amber'
                      }`}
                    >
                      {app.paymentStatus}
                    </span>
                  </td>
                  <td>
                    {app.generated ? (
                      <span className="status-pill pill-green">✓ Generated</span>
                    ) : (
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>Locked</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        style={{ padding: '4px 8px', fontSize: '11px' }}
                        onClick={() => onSelectApplication && onSelectApplication(app)}
                        title="View Full ID Preview"
                      >
                        <Eye size={12} /> View
                      </button>

                      {app.verificationStatus === 'Pending Verification' && (
                        <>
                          <button
                            type="button"
                            className="btn btn-green btn-sm"
                            style={{ padding: '4px 8px', fontSize: '11px' }}
                            onClick={() => onApproveApplication(app.applicationId)}
                            title="Approve"
                          >
                            <Check size={12} />
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            style={{ padding: '4px 8px', fontSize: '11px' }}
                            onClick={() =>
                              onRejectApplication(app.applicationId, 'Documents rejected by Admin Officer.')
                            }
                            title="Reject"
                          >
                            <X size={12} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* FEE CONFIGURATION MODAL (SECTION 17) */}
      {showFeeConfigModal && (
        <div className="modal-overlay" onClick={() => setShowFeeConfigModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Configurable ID Application Fee Structure</div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowFeeConfigModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveFees}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">New ID Base Fee (₹)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={feeForm['New ID'] ?? 100}
                    onChange={(e) =>
                      setFeeForm({ ...feeForm, 'New ID': Number(e.target.value) })
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Renewal Fee (₹)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={feeForm['Renewal'] ?? 75}
                    onChange={(e) =>
                      setFeeForm({ ...feeForm, 'Renewal': Number(e.target.value) })
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Replacement Fee (₹)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={feeForm['Replacement'] ?? 150}
                    onChange={(e) =>
                      setFeeForm({ ...feeForm, 'Replacement': Number(e.target.value) })
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Status Change ID Fee (₹)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={feeForm['Status Change ID'] ?? 100}
                    onChange={(e) =>
                      setFeeForm({ ...feeForm, 'Status Change ID': Number(e.target.value) })
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Portal Processing Surcharge (₹)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={feeForm.processingFee ?? 10}
                    onChange={(e) =>
                      setFeeForm({ ...feeForm, processingFee: Number(e.target.value) })
                    }
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => setShowFeeConfigModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Save Fee Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
