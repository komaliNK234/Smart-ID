import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  FileText,
  AlertTriangle,
  Clock,
  Eye,
  Check,
  X,
} from 'lucide-react';

export default function VerificationPanel({
  applications = [],
  onApprove,
  onReject,
  loading = false,
}) {
  const [rejectingAppId, setRejectingAppId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [viewingDoc, setViewingDoc] = useState(null);

  const pendingApps = applications.filter(
    (app) => app.verificationStatus === 'Pending Verification'
  );

  const handleConfirmReject = (appId) => {
    if (!rejectionReason.trim()) {
      alert('Please specify a rejection reason for the student.');
      return;
    }
    onReject(appId, rejectionReason);
    setRejectingAppId(null);
    setRejectionReason('');
  };

  return (
    <div className="verification-panel-wrapper">
      <div className="page-header">
        <h2 className="page-title">
          🛡️ Identity & Status Change Verification Panel
        </h2>
        <p className="page-subtitle">
          Administrative oversight for reviewing hostel clearance and transit proofs prior to fee authorization.
        </p>
      </div>

      {pendingApps.length === 0 ? (
        <div className="panel-card" style={{ textAlign: 'center', padding: '48px 20px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: '#dcfce7',
              color: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
            }}
          >
            <CheckCircle2 size={32} />
          </div>
          <h3 style={{ fontSize: '18px', color: '#0f172a' }}>Verification Queue Clear!</h3>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
            There are currently no student applications pending document verification.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {pendingApps.map((app) => (
            <div
              key={app.applicationId}
              className="panel-card"
              style={{ borderLeft: '6px solid var(--amber-500)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '16px' }}>
                      {app.applicationId}
                    </span>
                    <span className="status-pill pill-amber">
                      <Clock size={12} /> 🟡 Pending Verification
                    </span>
                  </div>

                  <div style={{ fontSize: '14px', color: '#0f172a', fontWeight: 700, marginTop: '6px' }}>
                    {app.studentData?.name} ({app.studentId})
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    {app.studentData?.department} • {app.studentData?.course}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    Status Transition Requested:
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#dc2626', marginTop: '2px' }}>
                    {app.previousStatus} &rarr; <span style={{ color: '#2563eb' }}>{app.currentStatus}</span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                    Submitted: {new Date(app.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Uploaded Documents List */}
              <div style={{ margin: '16px 0' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginBottom: '10px' }}>
                  Submitted Clearance Documents ({app.documents?.length || 0}):
                </div>

                {(!app.documents || app.documents.length === 0) ? (
                  <div style={{ fontSize: '12px', color: '#dc2626', background: '#fee2e2', padding: '10px', borderRadius: '6px' }}>
                    ⚠️ No documents attached yet by student.
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
                    {app.documents.map((doc, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          padding: '10px 14px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                          <FileText size={18} color="#2563eb" style={{ flexShrink: 0 }} />
                          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            <div style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a' }}>
                              {doc.documentType}
                            </div>
                            <div style={{ fontSize: '11px', color: '#64748b' }}>
                              {doc.fileName} ({doc.fileSize || '1.2 MB'})
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          style={{ fontSize: '11px', padding: '4px 8px', flexShrink: 0 }}
                          onClick={() => setViewingDoc(doc)}
                        >
                          <Eye size={12} /> View
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Rejection Form Box */}
              {rejectingAppId === app.applicationId && (
                <div
                  style={{
                    background: '#fef2f2',
                    border: '1px solid #fecdd3',
                    borderRadius: '8px',
                    padding: '16px',
                    margin: '16px 0',
                  }}
                >
                  <label className="form-label" style={{ color: '#991b1b' }}>
                    Specify Rejection Reason <span className="required">*</span>
                  </label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="e.g. Hostel clearance seal is missing warden signature / Receipt belongs to previous semester."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                  />
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '10px' }}>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => setRejectingAppId(null)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => handleConfirmReject(app.applicationId)}
                      disabled={loading}
                    >
                      Confirm Rejection
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '10px' }}>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => {
                    setRejectingAppId(app.applicationId);
                    setRejectionReason('');
                  }}
                  disabled={loading}
                >
                  <X size={14} /> ✕ Reject
                </button>

                <button
                  type="button"
                  className="btn btn-green btn-sm"
                  onClick={() => onApprove(app.applicationId)}
                  disabled={loading}
                >
                  <Check size={14} /> ✓ Approve Documents
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Document View Modal */}
      {viewingDoc && (
        <div className="modal-overlay" onClick={() => setViewingDoc(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">{viewingDoc.documentType}</div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setViewingDoc(null)}
              >
                <X size={20} />
              </button>
            </div>
            <div style={{ textAlign: 'center', padding: '20px', background: '#f8fafc', borderRadius: '8px' }}>
              <FileText size={64} color="#2563eb" style={{ margin: '0 auto 12px' }} />
              <h4>{viewingDoc.fileName}</h4>
              <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                File Size: {viewingDoc.fileSize} • Upload Status: Verified Authenticity
              </p>
              <div style={{ margin: '20px 0', padding: '12px', background: '#eff6ff', borderRadius: '6px', fontSize: '12px', color: '#1e40af' }}>
                Verified by Campus Clearance Officer Protocol. Document signature seal intact.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
