import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import DocumentUpload from './components/DocumentUpload';
import Payment from './components/Payment';
import PaymentSuccess from './components/PaymentSuccess';
import PaymentFailure from './components/PaymentFailure';
import ApplicationStatus from './components/ApplicationStatus';
import PaymentHistory from './components/PaymentHistory';
import VerificationPanel from './components/VerificationPanel';
import AdminDashboard from './components/AdminDashboard';
import IDCard from './components/IDCard';
import DownloadButton from './components/DownloadButton';
import ApplicationWizard from './components/ApplicationWizard';
import Login from './components/Login';
import { apiRequest } from './api';

import {
  LayoutDashboard,
  FilePlus,
  Compass,
  FileText,
  CreditCard,
  CreditCard as IdIcon,
  ShieldCheck,
  LogOut,
} from 'lucide-react';
const INITIAL_STUDENT = {
  studentId: '241FA18059',
  name: 'KOTHA BHAVYA SREE',
  department: 'Computer Science & Engineering',
  course: 'B.TECH ACSE - AI&ML',
  year: 'I Year',
  section: '25',
  academicYear: '2024 - 2028',
  dob: '2006-08-15',
  phone: '9618112688',
  email: '241fa18059@vignan.ac.in',
  parentName: 'KOTHA BHASKAR RAO',
  parentPhone: '9618112688',
  address: '# 2134, Brahmamgari Street, Yerragonda Palem, Prakasam(Dist) - 523327',
  photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  currentStatus: 'College Bus / Day Scholar',
  previousStatus: 'College Bus / Day Scholar',
};

export default function App() {
  // Authentication session persistence
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('campusid_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [role, setRole] = useState(currentUser?.role || 'student'); // 'student' | 'admin'
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [mode, setMode] = useState('SMART'); // 'SMART' | 'COMMON'
  const [applicationType, setApplicationType] = useState('New ID');

  const [student, setStudent] = useState(
    currentUser?.role === 'admin' ? currentUser : currentUser || INITIAL_STUDENT
  );
  const [documents, setDocuments] = useState([]);
  const [applications, setApplications] = useState([]);
  const [payments, setPayments] = useState([]);
  const [feesConfig, setFeesConfig] = useState({
    'New ID': 100,
    Renewal: 100,
    Replacement: 100,
    'Status Change ID': 100,
    processingFee: 0,
  });

  const [activeApplication, setActiveApplication] = useState(null);
  const [paymentView, setPaymentView] = useState('NONE'); // 'NONE' | 'CHECKOUT' | 'SUCCESS' | 'FAILURE'
  const [paymentResultData, setPaymentResultData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiStatus, setApiStatus] = useState('checking');

  // Sync state when currentUser changes
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'admin') {
        setRole('admin');
        setStudent(currentUser);
      } else {
        setRole('student');
        setStudent((prev) => ({
          ...prev,
          ...currentUser,
        }));
      }
    }
  }, [currentUser]);

  // Fetch initial data from backend API
  const fetchApplications = async (user = currentUser) => {
    try {
      const query = user?.studentId
        ? `?studentId=${encodeURIComponent(user.studentId)}`
        : '';
      const data = await apiRequest(`/api/applications${query}`);
      if (data.data) {
        setApplications(data.data);
        if (user?.studentId) {
          const myApp = data.data.find(
            (a) => a.studentId?.toLowerCase() === user.studentId.toLowerCase()
          );
          setActiveApplication(myApp || null);
          setDocuments(myApp?.documents || []);
        } else if (!activeApplication && data.data.length > 0) {
          setActiveApplication(data.data[0]);
        }
      }
    } catch (err) {
      console.error('Unable to load applications:', err.message);
    }
  };

  const fetchPayments = async (user = currentUser) => {
    try {
      const query = user?.studentId
        ? `?studentId=${encodeURIComponent(user.studentId)}`
        : '';
      const data = await apiRequest(`/api/payment/history${query}`);
      if (data.data) {
        setPayments(data.data);
      }
    } catch (err) {
      console.error('Unable to load payment history:', err.message);
    }
  };

  const fetchFees = async () => {
    try {
      const data = await apiRequest('/api/applications/fees');
      if (data.data) {
        setFeesConfig(data.data);
      }
    } catch (err) {
      console.error('Unable to load fee configuration:', err.message);
    }
  };

  const checkApiHealth = async () => {
    try {
      await apiRequest('/api/health');
      setApiStatus('online');
    } catch (err) {
      setApiStatus('offline');
      console.error('CampusID API is unavailable:', err.message);
    }
  };

  useEffect(() => {
    if (!currentUser) return;
    checkApiHealth();
    fetchApplications(currentUser);
    fetchPayments(currentUser);
    fetchFees();
  }, [currentUser]);

  // Compute live ID orientation and type based on business rules
  const isHostel = student.currentStatus === 'College Hostel';
  const computedIdType =
    mode === 'COMMON'
      ? 'Common ID'
      : isHostel
      ? 'Hosteller ID'
      : 'Day Scholar ID';

  // Auto-determine orientation from student status (NO user choice)
  // Hosteller → Vertical (Green), Day Scholar / PG / others → Horizontal (Blue)
  const computedOrientation = isHostel ? 'vertical' : 'horizontal';

  // Check if status change option is selected or status transition requires hostel clearance
  const isStatusChangeActive =
    applicationType === 'Status Change ID' ||
    (student.previousStatus === 'College Hostel' &&
      student.currentStatus !== 'College Hostel');

  // Validate form fields
  const validateForm = () => {
    const errs = {};
    if (!student.name?.trim()) errs.name = 'Student Name is required';
    if (!student.studentId?.trim()) errs.studentId = 'Student ID / Roll No is required';
    if (!student.department?.trim()) errs.department = 'Department is required';
    if (!student.course?.trim()) errs.course = 'Course is required';
    if (!student.phone?.trim()) errs.phone = 'Phone Number is required';
    if (!student.email?.trim()) errs.email = 'Email is required';
    if (!student.dob?.trim()) errs.dob = 'Date of Birth is required';
    if (!student.parentName?.trim()) errs.parentName = 'Parent Name is required';
    if (!student.parentPhone?.trim()) errs.parentPhone = 'Parent Phone is required';

    // Status change document requirements check — only ONE doc needed: Hostel Vacated Form
    if (isStatusChangeActive) {
      const hasVacatedForm = documents.some(
        (d) =>
          d.documentType === 'Vacated College Hostel Form' ||
          d.documentType === 'Hostel Vacated Receipt' ||
          d.documentType?.toLowerCase().includes('vacat') ||
          d.documentType?.toLowerCase().includes('hostel')
      );
      if (!hasVacatedForm) {
        errs.documents =
          'Mandatory: Please upload the signed Hostel Vacated Receipt before proceeding.';
      }
    }

    return errs;
  };

  // Handle Application Submission & Payment Proceed
  const handleProceedToPayment = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      alert(
        errors.documents ||
          Object.values(errors)[0] ||
          'Please complete all required fields before proceeding.'
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const effectiveAppType = isStatusChangeActive
        ? 'Status Change ID'
        : applicationType;

      const resData = await apiRequest('/api/applications', {
        method: 'POST',
        body: JSON.stringify({
          studentId: student.studentId,
          studentData: student,
          applicationType: effectiveAppType,
          mode,
          currentStatus: student.currentStatus,
          previousStatus: student.previousStatus,
          idOrientationChoice: isHostel ? 'vertical' : 'horizontal',
          documents,
        }),
      });

      const createdApp = resData.data;
      setActiveApplication(createdApp);
      await fetchApplications();

      // Check Verification Rule:
      // If status change documents are pending, student cannot proceed to payment until verified!
      if (createdApp.verificationStatus === 'Pending Verification') {
        alert(
          '⚠️ Application Submitted! Your Hostel Vacated Receipt and clearance documents are under review by the Chief Warden and Admin. You will be notified once approved to complete payment.'
        );
        setCurrentTab('tracking');
      } else {
        // Direct payment flow
        setPaymentView('CHECKOUT');
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Payment Success handler
  const handlePaymentSuccess = async (data) => {
    setPaymentResultData(data);
    setPaymentView('SUCCESS');

    // Update active application status
    if (activeApplication) {
      const updatedApp = {
        ...activeApplication,
        paymentStatus: 'PAID',
        generated: true,
        transactionId: data?.payment?.transactionId || data?.transactionId,
      };
      setActiveApplication(updatedApp);
      setApplications((prev) =>
        prev.map((a) =>
          a.applicationId === activeApplication.applicationId ? updatedApp : a
        )
      );
    }

    if (data?.payment) {
      setPayments((prev) => [data.payment, ...prev]);
    }

    await fetchApplications();
    await fetchPayments();
  };

  // Payment Failure handler
  const handlePaymentFailure = (data) => {
    setPaymentResultData(data);
    setPaymentView('FAILURE');
  };

  // Admin Verification Actions
  const handleApproveApp = async (appId) => {
    try {
      await apiRequest(`/api/verification/${appId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ action: 'approve' }),
      });
      alert('Application approved successfully! Student can now pay the fee.');
      await fetchApplications();
    } catch (err) {
      alert(err.message || 'Error approving application.');
    }
  };

  const handleRejectApp = async (appId, reason) => {
    try {
      await apiRequest(`/api/verification/${appId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ action: 'reject', reason }),
      });
      alert('Application rejected with reason.');
      await fetchApplications();
    } catch (err) {
      alert(err.message || 'Error rejecting application.');
    }
  };

  const handleUpdateFees = async (newFees) => {
    try {
      const data = await apiRequest('/api/applications/fees', {
        method: 'POST',
        body: JSON.stringify(newFees),
      });
      setFeesConfig(data.data);
      alert('Fee configuration updated successfully!');
    } catch (err) {
      alert(err.message || 'Error updating fees.');
    }
  };

  // Login handler
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setApplicationType('New ID');
    setMode('SMART');
    setDocuments([]);
    setPaymentView('NONE');
    setPaymentResultData(null);
    try {
      localStorage.setItem('campusid_auth_user', JSON.stringify(user));
    } catch (e) {}

    if (user.role === 'admin') {
      setRole('admin');
      setStudent(user);
      setCurrentTab('admin');
    } else {
      setRole('student');
      setStudent(user);
      setCurrentTab('dashboard');
    }
    setActiveApplication(null);
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('campusid_auth_user');
    setCurrentUser(null);
    setCurrentTab('dashboard');
    setPaymentView('NONE');
    setDocuments([]);
    setApplicationType('New ID');
    setMode('SMART');
    setStudent(INITIAL_STUDENT);
    setPaymentResultData(null);
    setActiveApplication(null);
    setApplications([]);
    setPayments([]);
    setRole('student');
  };

  // If user is not logged in, render Login Portal
  if (!currentUser) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app-shell">
      {/* SIDEBAR NAVIGATION */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon-wrapper">🎓</div>
          <div>
            <div className="brand-title">CampusID</div>
            <div className="brand-subtitle">Digital College ID Portal</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">STUDENT SERVICES</div>

          <button
            type="button"
            className={`nav-item ${currentTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => {
              setCurrentTab('dashboard');
              setPaymentView('NONE');
            }}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </button>

          <button
            type="button"
            className={`nav-item ${currentTab === 'apply' ? 'active' : ''}`}
            onClick={() => {
              setCurrentTab('apply');
              setPaymentView('NONE');
            }}
          >
            <FilePlus size={18} />
            <span>Apply for ID</span>
          </button>

          <button
            type="button"
            className={`nav-item ${currentTab === 'tracking' ? 'active' : ''}`}
            onClick={() => {
              setCurrentTab('tracking');
              setPaymentView('NONE');
            }}
          >
            <Compass size={18} />
            <span>My Application</span>
            <span className="badge-count">
              {
                applications.filter(
                  (a) => a.studentId?.toLowerCase() === student.studentId?.toLowerCase()
                ).length
              }
            </span>
          </button>

          <button
            type="button"
            className={`nav-item ${currentTab === 'documents' ? 'active' : ''}`}
            onClick={() => {
              setCurrentTab('documents');
              setPaymentView('NONE');
            }}
          >
            <FileText size={18} />
            <span>Clearance Docs</span>
            {documents.length > 0 && (
              <span className="badge-count">{documents.length}</span>
            )}
          </button>

          <button
            type="button"
            className={`nav-item ${currentTab === 'history' ? 'active' : ''}`}
            onClick={() => {
              setCurrentTab('history');
              setPaymentView('NONE');
            }}
          >
            <CreditCard size={18} />
            <span>Payment Receipts</span>
          </button>

          <button
            type="button"
            className={`nav-item ${currentTab === 'my-id' ? 'active' : ''}`}
            onClick={() => {
              setCurrentTab('my-id');
              setPaymentView('NONE');
            }}
          >
            <IdIcon size={18} />
            <span>My ID Card</span>
          </button>

          <div className="nav-section-label" style={{ marginTop: '14px' }}>
            OFFICER & ADMIN
          </div>

          {currentUser.role === 'admin' && <button
            type="button"
            className={`nav-item ${currentTab === 'admin' ? 'active' : ''}`}
            onClick={() => {
              setCurrentTab('admin');
              setRole('admin');
              setPaymentView('NONE');
            }}
          >
            <ShieldCheck size={18} />
            <span>Admin Panel</span>
          </button>}

          {currentUser.role === 'admin' && <button
            type="button"
            className={`nav-item ${currentTab === 'verification' ? 'active' : ''}`}
            onClick={() => {
              setCurrentTab('verification');
              setRole('admin');
              setPaymentView('NONE');
            }}
          >
            <FileText size={18} />
            <span>Verification Queue</span>
            {applications.filter((a) => a.verificationStatus === 'Pending Verification').length >
              0 && (
              <span className="badge-count" style={{ background: '#f59e0b' }}>
                {
                  applications.filter(
                    (a) => a.verificationStatus === 'Pending Verification'
                  ).length
                }
              </span>
            )}
          </button>
          }
        </nav>

        <div className="sidebar-footer">
          <div className="user-mini-card">
            {student.photo ? (
              <img
                src={student.photo}
                alt={student.name}
                className="user-avatar-mini"
              />
            ) : (
              <div
                className="user-avatar-mini"
                style={{
                  background: '#2563eb',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '12px',
                }}
              >
                {student.name?.charAt(0) || 'U'}
              </div>
            )}
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div
                className="user-meta-name"
                style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
              >
                {student.name}
              </div>
              <div className="user-meta-role">
                {role === 'admin'
                  ? 'Administrator'
                  : 'Roll: ' + (student.studentId || 'N/A')}
              </div>
            </div>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              style={{
                padding: '4px 6px',
                color: '#ef4444',
                borderColor: '#fca5a5',
                marginLeft: '4px',
              }}
              onClick={handleLogout}
              title="Sign Out"
            >
              <LogOut size={13} />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN BODY AREA */}
      <div className="main-wrapper">
        <Header
          role={role}
          apiStatus={apiStatus}
          onRoleChange={(newRole) => {
            if (newRole === 'admin' && currentUser.role !== 'admin') return;
            setRole(newRole);
            if (newRole === 'admin') setCurrentTab('admin');
            else setCurrentTab('dashboard');
          }}
          currentUser={currentUser}
          onLogout={handleLogout}
        />

        <main className="content-container">
          {apiStatus === 'offline' && (
            <div className="api-offline-banner" role="alert">
              CampusID API is unavailable. Account, application, verification, and payment changes cannot be saved right now.
            </div>
          )}
          {currentUser.isDemo && (
            <div className="demo-account-banner" role="note">
              Demonstration account — records, verification, receipts, and payments are sample data only.
            </div>
          )}
          {/* TAB 1: DASHBOARD */}
          {currentTab === 'dashboard' && (
            <Dashboard
              student={student}
              applications={applications}
              payments={payments}
              onNavigate={(tab) => setCurrentTab(tab)}
              onSelectApplication={(app) => {
                setActiveApplication(app);
                if (app.studentData) setStudent(app.studentData);
                setDocuments(app.documents || []);
              }}
            />
          )}

          {/* TAB 2: APPLY FOR ID (WIZARD WORKFLOW) */}
          {currentTab === 'apply' && (
            <>
              {/* Payment Checkout View */}
              {paymentView === 'CHECKOUT' && activeApplication && (
                <Payment
                  application={activeApplication}
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentFailure={handlePaymentFailure}
                  onBack={() => setPaymentView('NONE')}
                />
              )}

              {/* Payment Success View */}
              {paymentView === 'SUCCESS' && (
                <PaymentSuccess
                  paymentData={paymentResultData}
                  onContinueToID={() => {
                    setPaymentView('NONE');
                    setCurrentTab('my-id');
                  }}
                  onViewReceipt={() => {
                    setPaymentView('NONE');
                    setCurrentTab('history');
                  }}
                />
              )}

              {/* Payment Failure View */}
              {paymentView === 'FAILURE' && (
                <PaymentFailure
                  errorMessage={paymentResultData?.error}
                  onTryAgain={() => setPaymentView('CHECKOUT')}
                  onChangePaymentMethod={() => setPaymentView('CHECKOUT')}
                />
              )}

              {/* Step-by-Step Guided Application Wizard */}
              {paymentView === 'NONE' && (
                <ApplicationWizard
                  student={student}
                  onStudentChange={(updated) => setStudent(updated)}
                  mode={mode}
                  onModeChange={(m) => setMode(m)}
                  applicationType={applicationType}
                  onApplicationTypeChange={(type) => setApplicationType(type)}
                  documents={documents}
                  onDocumentsChange={(docs) => setDocuments(docs)}
                  feesConfig={feesConfig}
                  isSubmitting={isSubmitting}
                  onProceedToPayment={handleProceedToPayment}
                />
              )}
            </>
          )}

          {/* TAB 3: APPLICATION TRACKING */}
          {currentTab === 'tracking' && (
            <ApplicationStatus
              applications={applications}
              currentUser={currentUser}
              role={role}
              onSelectApplication={(app) => {
                setActiveApplication(app);
                if (app.studentData) setStudent(app.studentData);
                setDocuments(app.documents || []);
                setCurrentTab('my-id');
              }}
            />
          )}

          {/* TAB 4: DOCUMENTS VIEW */}
          {currentTab === 'documents' && (
            <div className="panel-card">
              <div className="page-header">
                <h2 className="page-title">Clearance Certificates & Uploaded Files</h2>
                <p className="page-subtitle">
                  Review the official clearance documents (Hostel Vacated Receipt & Bus Pass)
                  attached to your college identity profile.
                </p>
              </div>

              <DocumentUpload
                previousStatus={student.previousStatus}
                currentStatus={student.currentStatus}
                applicationType={applicationType}
                documents={documents}
                onDocumentsChange={(docs) => setDocuments(docs)}
              />
            </div>
          )}

          {/* TAB 5: PAYMENT HISTORY & RECEIPTS */}
          {currentTab === 'history' && (
            <PaymentHistory
              payments={payments}
              currentUser={currentUser}
              role={role}
            />
          )}

          {/* TAB 6: MY ID CARD */}
          {currentTab === 'my-id' && (
            <div style={{ maxWidth: '820px', margin: '0 auto' }}>
              <div className="page-header" style={{ textAlign: 'center' }}>
                <h2 className="page-title">Digital College Identity Card</h2>
                <p className="page-subtitle">
                  Official contactless credential authorized by St. Xavier Institute of Technology.
                </p>
              </div>

              {activeApplication?.generated && activeApplication.paymentStatus === 'PAID' ? (
                <div className="panel-card" style={{ padding: '32px', textAlign: 'center' }}>
                  <div style={{ display: 'inline-block', marginBottom: '20px' }}>
                    <IDCard
                      student={student}
                      mode={activeApplication.mode || mode}
                      idType={activeApplication.idType || computedIdType}
                      idOrientation={activeApplication.idOrientation || computedOrientation}
                    />
                  </div>

                  <div style={{ maxWidth: '480px', margin: '0 auto', textAlign: 'center' }}>
                    <DownloadButton
                      student={student}
                      application={activeApplication}
                      onDownloadReceipt={() => setCurrentTab('history')}
                    />
                  </div>
                </div>
              ) : (
                <div className="panel-card id-not-issued">
                  <ShieldCheck size={28} />
                  <h3>Your digital ID is not available yet</h3>
                  <p>Complete application review and payment before the card can be issued.</p>
                  <button type="button" className="btn btn-primary" onClick={() => setCurrentTab('apply')}>
                    Apply for an ID
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 7: ADMIN DASHBOARD */}
          {currentTab === 'admin' && (
            <AdminDashboard
              applications={applications}
              payments={payments}
              feesConfig={feesConfig}
              onUpdateFees={handleUpdateFees}
              onApproveApplication={handleApproveApp}
              onRejectApplication={handleRejectApp}
              onSelectApplication={(app) => {
                setActiveApplication(app);
                if (app.studentData) setStudent(app.studentData);
                setDocuments(app.documents || []);
                setCurrentTab('my-id');
              }}
            />
          )}

          {/* TAB 8: VERIFICATION QUEUE */}
          {currentTab === 'verification' && (
            <VerificationPanel
              applications={applications}
              onApprove={handleApproveApp}
              onReject={handleRejectApp}
            />
          )}
        </main>
      </div>
    </div>
  );
}
