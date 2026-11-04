import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  FileText,
  CreditCard,
  CreditCard as IdIcon,
  ShieldCheck,
} from 'lucide-react';

export default function ApplicationStatus({
  applications = [],
  onSelectApplication,
  currentUser,
  role = 'student',
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMyAppsOnly, setFilterMyAppsOnly] = useState(role === 'student');

  const currentStudentId = currentUser?.studentId?.trim().toLowerCase();

  const filtered = applications.filter((app) => {
    if (filterMyAppsOnly && currentStudentId) {
      if (app.studentId?.trim().toLowerCase() !== currentStudentId) {
        return false;
      }
    }
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      app.applicationId?.toLowerCase().includes(q) ||
      app.studentId?.toLowerCase().includes(q) ||
      app.studentData?.name?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="application-tracking-wrapper">
      <div className="page-header">
        <h2 className="page-title">Track Application Progress</h2>
        <p className="page-subtitle">
          Real-time lifecycle tracking of your student ID issuance, verification clearance, and digital card status.
        </p>
      </div>

      {currentUser && (
        <div
          style={{
            background: 'linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%)',
            border: '1px solid #bfdbfe',
            borderRadius: '12px',
            padding: '14px 20px',
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
              <strong style={{ color: '#1e3a8a', fontSize: '13.5px' }}>
                {filterMyAppsOnly ? 'My ID Applications' : 'All Student Applications'}
              </strong>
              <span className="badge-pill" style={{ background: '#2563eb', color: '#fff' }}>
                {filtered.length} Requests
              </span>
            </div>
            <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>
              Roll Number: <strong>{currentUser.studentId || 'Admin'}</strong> • Student:{' '}
              {currentUser.name}
            </div>
          </div>

          {role === 'student' && (
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => setFilterMyAppsOnly(!filterMyAppsOnly)}
              style={{ background: '#fff', fontSize: '11.5px' }}
            >
              {filterMyAppsOnly ? 'Show All Students' : 'Show Only Mine'}
            </button>
          )}
        </div>
      )}

      {/* Search Bar */}
      <div className="panel-card" style={{ marginBottom: '24px', padding: '18px 24px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search
              size={18}
              color="#94a3b8"
              style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: '42px', width: '100%' }}
              placeholder="Search by Application ID (e.g. IDAPP202610310001) or Student Roll No..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {searchQuery && (
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => setSearchQuery('')}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Applications List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {filtered.length === 0 ? (
          <div className="panel-card" style={{ textAlign: 'center', padding: '48px 20px', color: '#64748b' }}>
            <Search size={36} color="#cbd5e1" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '16px', color: '#0f172a' }}>No Applications Found</h3>
            <p style={{ fontSize: '13px', marginTop: '4px' }}>
              Try searching with another Application ID or Student Roll Number.
            </p>
          </div>
        ) : (
          filtered.map((app) => (
            <ApplicationCard
              key={app.applicationId}
              application={app}
              onSelect={() => onSelectApplication && onSelectApplication(app)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function ApplicationCard({ application, onSelect }) {
  const {
    applicationId,
    studentId,
    studentData,
    applicationType,
    idType,
    verificationStatus,
    verificationReason,
    paymentStatus,
    generated,
    createdAt,
  } = application;

  // Determine stage flags
  const isDetailsSubmitted = true;
  const isDocVerified =
    verificationStatus === 'Verified' || verificationStatus === 'Not Required';
  const isDocPending = verificationStatus === 'Pending Verification';
  const isDocRejected = verificationStatus === 'Rejected';
  const isFeePaid = paymentStatus === 'PAID';
  const isIDGenerated = generated && isFeePaid;

  // Overall status badge
  let overallBadge = { text: 'IN PROGRESS', class: 'pill-blue' };
  if (isIDGenerated) {
    overallBadge = { text: 'COMPLETED', class: 'pill-green' };
  } else if (isDocRejected) {
    overallBadge = { text: 'REJECTED', class: 'pill-red' };
  } else if (isDocPending) {
    overallBadge = { text: 'DOCS UNDER VERIFICATION', class: 'pill-amber' };
  } else if (!isFeePaid) {
    overallBadge = { text: 'PAYMENT PENDING', class: 'pill-blue' };
  }

  // Calculate Stepper progress %
  let stepIndex = 1;
  if (isDocVerified) stepIndex = 2;
  if (isFeePaid) stepIndex = 4;
  if (isIDGenerated) stepIndex = 5;

  const progressPercentage = ((stepIndex - 1) / 4) * 100;

  return (
    <div className="panel-card" style={{ borderLeft: `6px solid ${isIDGenerated ? '#16a34a' : isDocRejected ? '#dc2626' : '#2563eb'}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '16px', color: '#0f172a' }}>
              {applicationId}
            </span>
            <span className={`status-pill ${overallBadge.class}`}>
              {overallBadge.text}
            </span>
          </div>

          <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
            Student: <strong>{studentData?.name}</strong> ({studentId}) • {studentData?.department}
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '12px', color: '#64748b' }}>
            Category: <strong>{idType}</strong> ({applicationType})
          </div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
            Submitted: {new Date(createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Stepper (Section 25) */}
      <div className="stepper-container">
        <div className="stepper-progress-bar">
          <div
            className="stepper-progress-fill"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Step 1 */}
        <div className={`step-item ${isDetailsSubmitted ? 'completed' : ''}`}>
          <div className="step-bubble">
            <CheckCircle2 size={16} />
          </div>
          <div className="step-label">Details Submitted</div>
        </div>

        {/* Step 2 */}
        <div
          className={`step-item ${
            isDocVerified ? 'completed' : isDocRejected ? 'active' : isDocPending ? 'active' : ''
          }`}
        >
          <div
            className="step-bubble"
            style={{
              borderColor: isDocRejected ? '#dc2626' : undefined,
              color: isDocRejected ? '#dc2626' : undefined,
            }}
          >
            {isDocVerified ? <CheckCircle2 size={16} /> : isDocRejected ? <XCircle size={16} /> : <Clock size={16} />}
          </div>
          <div className="step-label">
            {isDocVerified
              ? 'Documents Verified'
              : isDocRejected
              ? 'Verification Rejected'
              : 'Docs Verification'}
          </div>
        </div>

        {/* Step 3 */}
        <div className={`step-item ${isFeePaid ? 'completed' : isDocVerified ? 'active' : ''}`}>
          <div className="step-bubble">
            <CreditCard size={16} />
          </div>
          <div className="step-label">Fee Payment</div>
        </div>

        {/* Step 4 */}
        <div className={`step-item ${isFeePaid ? 'completed' : ''}`}>
          <div className="step-bubble">
            <ShieldCheck size={16} />
          </div>
          <div className="step-label">Payment Verified</div>
        </div>

        {/* Step 5 */}
        <div className={`step-item ${isIDGenerated ? 'completed' : ''}`}>
          <div className="step-bubble">
            <CheckCircle2 size={16} />
          </div>
          <div className="step-label">ID Generated</div>
        </div>
      </div>

      {/* Feedback notes if rejected */}
      {isDocRejected && (
        <div
          style={{
            background: '#fef2f2',
            border: '1px solid #fee2e2',
            borderRadius: '8px',
            padding: '12px 14px',
            fontSize: '12.5px',
            color: '#b91c1c',
            marginTop: '12px',
          }}
        >
          <strong>Rejection Reason:</strong> {verificationReason || 'Uploaded clearance certificate is incomplete or expired.'}
        </div>
      )}

      {/* Action footer */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
        {onSelect && (
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={onSelect}
          >
            Open in Live Viewer / Preview &rarr;
          </button>
        )}
      </div>
    </div>
  );
}
