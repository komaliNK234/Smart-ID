import React from 'react';
import IDCard from './IDCard';
import {
  LayoutDashboard,
  CreditCard,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Receipt,
  Download,
  Calendar,
  Sparkles,
  Eye,
  History,
  Check,
  Lock,
} from 'lucide-react';

export default function Dashboard({
  student,
  applications = [],
  payments = [],
  onNavigate,
  onSelectApplication,
}) {
  const currentStudentId = student?.studentId?.trim().toLowerCase();

  // Filter student-specific records
  const myApplications = applications.filter(
    (a) => a.studentId?.trim().toLowerCase() === currentStudentId
  );

  const issuedCards = myApplications.filter(
    (a) => a.generated && a.paymentStatus === 'PAID'
  );

  const myPayments = payments.filter(
    (p) => p.studentId?.trim().toLowerCase() === currentStudentId
  );

  const totalPaid = myPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

  const activeApp = myApplications[0] || applications[0] || null;
  const recentPayment = myPayments[0] || null;

  return (
    <div className="dashboard-content-wrapper">
      {/* Welcome Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
          borderRadius: '16px',
          padding: '28px 32px',
          color: '#ffffff',
          marginBottom: '28px',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-block',
              background: 'rgba(255,255,255,0.2)',
              padding: '3px 10px',
              borderRadius: '999px',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.5px',
            }}
          >
            🎓 OFFICIAL UNIVERSITY IDENTITY REGISTRY
          </div>
          <h2
            style={{
              fontSize: '26px',
              fontWeight: 800,
              margin: '8px 0 4px',
              letterSpacing: '-0.5px',
            }}
          >
            Welcome, {student?.name || 'Student'}!
          </h2>
          <p style={{ fontSize: '13.5px', opacity: 0.9, maxWidth: '580px' }}>
            Roll No: <strong>{student?.studentId}</strong> • Department:{' '}
            <strong>{student?.department}</strong> ({student?.year})
          </p>
          <div style={{ marginTop: '8px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span
              style={{
                fontSize: '11.5px',
                background: 'rgba(255,255,255,0.18)',
                padding: '2px 8px',
                borderRadius: '6px',
              }}
            >
              Current Status: <strong>{student?.currentStatus}</strong>
            </span>
            <span
              style={{
                fontSize: '11.5px',
                background: '#16a34a',
                color: '#fff',
                padding: '2px 8px',
                borderRadius: '6px',
                fontWeight: 700,
              }}
            >
              ID Cards Taken: {issuedCards.length} times
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            className="btn btn-outline"
            style={{ background: '#ffffff', color: '#1e3a8a', fontWeight: 700 }}
            onClick={() => onNavigate('apply')}
          >
            Apply for ID Card <ArrowRight size={16} />
          </button>
          <button
            type="button"
            className="btn btn-outline"
            style={{
              background: 'rgba(255,255,255,0.15)',
              color: '#ffffff',
              borderColor: 'rgba(255,255,255,0.3)',
            }}
            onClick={() => onNavigate('my-id')}
          >
            View Active ID
          </button>
        </div>
      </div>

      {/* Overview Stats (Reflecting student-specific metrics) */}
      <div className="stats-grid">
        {/* Card 1: How many times ID was taken */}
        <div className="stat-card" style={{ borderLeft: '4px solid #16a34a' }}>
          <div className="stat-icon-wrap stat-icon-green">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div className="stat-val">{issuedCards.length}</div>
            <div className="stat-lbl">ID Cards Taken / Issued</div>
            <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: 600, marginTop: '2px' }}>
              {issuedCards.length === 1
                ? '1 Active Card on Record'
                : `${issuedCards.length} Official Cards Generated`}
            </div>
          </div>
        </div>

        {/* Card 2: Total Applications */}
        <div className="stat-card">
          <div className="stat-icon-wrap stat-icon-blue">
            <CreditCard size={22} />
          </div>
          <div>
            <div className="stat-val">{myApplications.length}</div>
            <div className="stat-lbl">Applications Submitted</div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
              Roll: {student?.studentId}
            </div>
          </div>
        </div>

        {/* Card 3: Clearances in Verification */}
        <div className="stat-card">
          <div className="stat-icon-wrap stat-icon-amber">
            <Clock size={22} />
          </div>
          <div>
            <div className="stat-val">
              {myApplications.filter((a) => a.verificationStatus === 'Pending Verification').length}
            </div>
            <div className="stat-lbl">Docs in Verification</div>
            <div style={{ fontSize: '11px', color: '#d97706', marginTop: '2px' }}>
              Hostel / clearance review
            </div>
          </div>
        </div>

        {/* Card 4: Payments & Receipts */}
        <div className="stat-card" style={{ borderLeft: '4px solid #2563eb' }}>
          <div className="stat-icon-wrap stat-icon-blue">
            <Receipt size={22} />
          </div>
          <div>
            <div className="stat-val">{myPayments.length}</div>
            <div className="stat-lbl">Payment Receipts</div>
            <div style={{ fontSize: '11px', color: '#2563eb', fontWeight: 600, marginTop: '2px' }}>
              ₹{totalPaid}.00 Total Paid
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="workflow-grid">
        {/* Left: Recent Activity, ID Issuance Records & Receipts */}
        <div>
          {/* SECTION A: ID ISSUANCE HISTORY ("HOW MANY TIMES I TOOK") */}
          <div className="panel-card" style={{ marginBottom: '20px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '14px',
              }}
            >
              <div className="panel-title" style={{ marginBottom: 0 }}>
                <History size={20} color="#16a34a" /> ID Cards Taken History ({issuedCards.length})
              </div>
              <span className="badge-pill" style={{ background: '#dcfce7', color: '#15803d' }}>
                {issuedCards.length} Cards Issued to You
              </span>
            </div>

            {issuedCards.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {issuedCards.map((app, index) => (
                  <div
                    key={app.applicationId}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 16px',
                      background: '#f8fafc',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span
                          style={{
                            background: '#2563eb',
                            color: '#fff',
                            fontSize: '10px',
                            fontWeight: 800,
                            padding: '2px 6px',
                            borderRadius: '4px',
                          }}
                        >
                          CARD #{index + 1}
                        </span>
                        <strong style={{ fontSize: '13px', color: '#0f172a' }}>
                          {app.idType} ({app.applicationType})
                        </strong>
                      </div>
                      <div
                        style={{
                          fontSize: '11.5px',
                          color: '#64748b',
                          marginTop: '4px',
                          display: 'flex',
                          gap: '12px',
                        }}
                      >
                        <span>App ID: {app.applicationId}</span>
                        <span>
                          Date Taken: {new Date(app.createdAt).toLocaleDateString()}
                        </span>
                        <span>Mode: {app.mode}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span className="status-pill pill-green" style={{ fontSize: '11px' }}>
                        ✓ Active & Verified
                      </span>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => {
                          onSelectApplication(app);
                          onNavigate('my-id');
                        }}
                      >
                        <Eye size={13} /> View Card
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  textAlign: 'center',
                  padding: '24px 16px',
                  background: '#f8fafc',
                  borderRadius: '8px',
                  color: '#64748b',
                }}
              >
                <CreditCard size={32} color="#cbd5e1" style={{ margin: '0 auto 8px' }} />
                <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#334155' }}>
                  No Official ID Cards Taken Yet
                </div>
                <p style={{ fontSize: '12px', margin: '4px 0 12px' }}>
                  Submit an application to get your digital smart identity card generated.
                </p>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => onNavigate('apply')}
                >
                  Apply for ID Card
                </button>
              </div>
            )}
          </div>

          {/* SECTION B: MY FEE PAYMENTS & RECEIPTS */}
          <div className="panel-card" style={{ marginBottom: '20px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '14px',
              }}
            >
              <div className="panel-title" style={{ marginBottom: 0 }}>
                <Receipt size={20} color="#2563eb" /> All Payment Receipts ({myPayments.length})
              </div>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => onNavigate('history')}
              >
                All Invoices &rarr;
              </button>
            </div>

            {myPayments.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {myPayments.map((p) => (
                  <div
                    key={p.transactionId}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 14px',
                      background: '#f0fdf4',
                      borderRadius: '8px',
                      border: '1px solid #bbf7d0',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '13px', color: '#15803d' }}>
                        ₹{p.amount}.00 • {p.receiptNumber || 'Payment Receipt'}
                      </div>
                      <div
                        style={{
                          fontFamily: 'monospace',
                          fontSize: '11px',
                          color: '#475569',
                          marginTop: '2px',
                        }}
                      >
                        TXN: {p.transactionId} • Method: {p.paymentMethod}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                        Date: {new Date(p.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => onNavigate('history')}
                      style={{ background: '#ffffff', fontSize: '11px' }}
                    >
                      <Download size={12} /> Download Receipt
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: '13px', color: '#64748b', padding: '12px 0' }}>
                No completed fee payments found for this account.
              </div>
            )}
          </div>

          {/* SECTION C: CURRENT APPLICATION STATUS */}
          <div className="panel-card">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <div className="panel-title" style={{ marginBottom: 0 }}>
                <Clock size={20} color="#2563eb" /> Latest Application Tracking
              </div>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => onNavigate('tracking')}
              >
                Track Lifecycle &rarr;
              </button>
            </div>

            {activeApp ? (
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    background: '#f8fafc',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div>
                    <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#0f172a' }}>
                      {activeApp.applicationId}
                    </span>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                      Category: <strong>{activeApp.idType}</strong> ({activeApp.applicationType})
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span
                      className={`status-pill ${
                        activeApp.generated
                          ? 'pill-green'
                          : activeApp.verificationStatus === 'Rejected'
                          ? 'pill-red'
                          : activeApp.verificationStatus === 'Pending Verification'
                          ? 'pill-amber'
                          : 'pill-blue'
                      }`}
                    >
                      {activeApp.generated
                        ? 'COMPLETED'
                        : activeApp.verificationStatus === 'Pending Verification'
                        ? 'VERIFYING DOCS'
                        : activeApp.paymentStatus === 'PAID'
                        ? 'FEE PAID'
                        : 'PAYMENT PENDING'}
                    </span>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                      {new Date(activeApp.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      onSelectApplication(activeApp);
                      if (activeApp.generated) {
                        onNavigate('my-id');
                      } else {
                        onNavigate('apply');
                      }
                    }}
                  >
                    Continue Application Flow &rarr;
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                <p>No active ID card application in progress.</p>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  style={{ marginTop: '10px' }}
                  onClick={() => onNavigate('apply')}
                >
                  Start New Application
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: ID Card Preview (Only unlocked AFTER payment) */}
        <div className="id-preview-sticky">
          {issuedCards.length > 0 ? (
            <div className="panel-card" style={{ padding: '20px' }}>
              <div style={{ marginBottom: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
                  Your Official Digital Student Card
                </div>
                <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                  Authorized credentials encoded for Roll No: {student?.studentId}
                </div>
              </div>

              <IDCard
                student={student}
                mode={activeApp?.mode || 'SMART'}
                idType={
                  activeApp?.idType ||
                  (student?.currentStatus === 'College Hostel'
                    ? 'Hosteller ID'
                    : 'Day Scholar ID')
                }
                idOrientation={activeApp?.idOrientation}
              />
            </div>
          ) : (
            <div
              className="panel-card"
              style={{
                padding: '32px 20px',
                textAlign: 'center',
                background: '#f8fafc',
                border: '2px dashed #cbd5e1',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: '#fee2e2',
                  color: '#dc2626',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <Lock size={26} />
              </div>
              <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                ID Card Locked — Payment Required
              </h4>
              <p
                style={{
                  fontSize: '12.5px',
                  color: '#64748b',
                  lineHeight: 1.45,
                  maxWidth: '300px',
                  margin: '0 auto 16px',
                }}
              >
                Your official digital card with QR verification and barcode will be unlocked and available for download immediately after completing the ₹100 fee payment.
              </p>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => onNavigate('apply')}
              >
                {activeApp ? 'Complete Payment (₹100) & Unlock Card' : 'Apply for ID & Pay Fee'} &rarr;
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
