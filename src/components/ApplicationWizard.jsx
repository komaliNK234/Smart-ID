import React, { useState } from 'react';
import ModeSelector from './ModeSelector';
import StudentForm from './StudentForm';
import StudentStatus from './StudentStatus';
import DocumentUpload from './DocumentUpload';
import IDCard from './IDCard';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  CreditCard,
  User,
  Compass,
  Home,
  ShieldCheck,
  FileText,
  Lock,
  Eye,
  Info,
  Check,
  RotateCcw,
} from 'lucide-react';

export default function ApplicationWizard({
  student,
  onStudentChange,
  mode,
  onModeChange,
  applicationType,
  onApplicationTypeChange,
  documents,
  onDocumentsChange,
  feesConfig,
  isSubmitting,
  onProceedToPayment,
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [stepErrors, setStepErrors] = useState({});

  // Compute status change condition
  const isHostel = student.currentStatus === 'College Hostel';
  const isStatusChangeActive =
    applicationType === 'Status Change ID' ||
    (student.previousStatus === 'College Hostel' &&
      student.currentStatus !== 'College Hostel');

  // Dynamic steps: Only include "Clearance Docs" step if status change is active!
  // Removes the unnecessary "No documents needed" screen for New ID, Renewal, Replacement!
  const activeSteps = isStatusChangeActive
    ? [
        { id: 1, title: 'ID Policy', icon: Compass, desc: 'Policy & Format' },
        { id: 2, title: 'Profile Details', icon: User, desc: 'Personal & academic info' },
        { id: 3, title: 'Residency Status', icon: Home, desc: 'Commute & accommodation' },
        { id: 4, title: 'Clearance Docs', icon: FileCheck, desc: 'Hostel Vacated Receipt' },
        { id: 5, title: 'Fee Checkout', icon: CreditCard, desc: 'Summary & payment' },
      ]
    : [
        { id: 1, title: 'ID Policy', icon: Compass, desc: 'Policy & Format' },
        { id: 2, title: 'Profile Details', icon: User, desc: 'Personal & academic info' },
        { id: 3, title: 'Residency Status', icon: Home, desc: 'Commute & accommodation' },
        { id: 4, title: 'Fee Checkout', icon: CreditCard, desc: 'Summary & payment' },
      ];

  const totalSteps = activeSteps.length;
  const isReviewStep = currentStep === totalSteps;

  const computedIdType =
    mode === 'COMMON'
      ? 'Common ID'
      : isHostel
      ? 'Hosteller ID'
      : 'Day Scholar ID';

  // Auto-determine orientation from student status (NO user choice)
  // Hosteller → Vertical (green), Day Scholar / PG / others → Horizontal (blue)
  const computedOrientation = isHostel ? 'vertical' : 'horizontal';

  // Uniform Flat Fee: ₹100
  const currentBaseFee = 100;
  const currentProcessingFee = 0;
  const currentTotalFee = 100;

  // Validate current step before advancing
  const validateStep = (stepNumber) => {
    const errs = {};
    if (stepNumber === 2) {
      if (!student.name?.trim()) errs.name = 'Full Name is required';
      if (!student.studentId?.trim()) errs.studentId = 'Roll No / ID is required';
      if (!student.department?.trim()) errs.department = 'Department is required';
      if (!student.course?.trim()) errs.course = 'Course is required';
      if (!student.phone?.trim()) errs.phone = 'Phone Number is required';
      if (!student.email?.trim()) errs.email = 'College Email is required';
      if (!student.dob?.trim()) errs.dob = 'Date of Birth is required';
      if (!student.parentName?.trim()) errs.parentName = 'Parent Name is required';
      if (!student.parentPhone?.trim()) errs.parentPhone = 'Parent Phone is required';
    } else if (stepNumber === 4 && isStatusChangeActive) {
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
    setStepErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep((prev) => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setStepErrors({});
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleStepClick = (stepId) => {
    if (stepId < currentStep) {
      setStepErrors({});
      setCurrentStep(stepId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (stepId === currentStep + 1 && validateStep(currentStep)) {
      setCurrentStep(stepId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const currentStepDef = activeSteps[currentStep - 1] || activeSteps[0];

  return (
    <div className="wizard-container">
      {/* STEP PROGRESS HEADER */}
      <div className="wizard-stepper-card">
        <div className="wizard-header-top">
          <div>
            <span className="badge-step-pill">
              STEP {currentStep} OF {totalSteps}
            </span>
            <h2 className="wizard-main-title">{currentStepDef.title}</h2>
            <p className="wizard-main-subtitle">{currentStepDef.desc}</p>
          </div>
        </div>

        {/* Stepper Steps Bar */}
        <div className="stepper-track">
          {activeSteps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = currentStep > step.id;
            const isActive = currentStep === step.id;
            const isClickable = step.id < currentStep;

            return (
              <React.Fragment key={step.id}>
                <div
                  className={`stepper-node ${isActive ? 'active' : ''} ${
                    isCompleted ? 'completed' : ''
                  } ${isClickable ? 'clickable' : ''}`}
                  onClick={() => isClickable && handleStepClick(step.id)}
                  role="button"
                  tabIndex={isClickable ? 0 : -1}
                >
                  <div className="node-circle">
                    {isCompleted ? (
                      <Check size={16} strokeWidth={3} />
                    ) : (
                      <Icon size={16} />
                    )}
                  </div>
                  <div className="node-text">
                    <span className="node-number">Step {step.id}</span>
                    <span className="node-title">{step.title}</span>
                  </div>
                </div>

                {idx < activeSteps.length - 1 && (
                  <div
                    className={`stepper-connector ${
                      currentStep > idx + 1 ? 'filled' : ''
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="stepper-progress-track">
          <div
            className="stepper-progress-fill"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* STEP CONTENT BODY */}
      <div className="wizard-step-body">
        {/* ================= STEP 1: ID POLICY & ORIENTATION ================= */}
        {currentStep === 1 && (
          <div>
            <div className="step-intro-box">
              <Compass size={22} color="#2563eb" />
              <div>
                <h4>Step 1: ID Issuance Policy & Front Layout Orientation</h4>
                <p>
                  Choose your application category and mode. Card orientation is auto-determined by your residency status.
                </p>
              </div>
            </div>

            {/* Application Category selector */}
            <div className="panel-card" style={{ marginBottom: '20px' }}>
              <label className="form-label" style={{ fontSize: '14px', fontWeight: 700 }}>
                Application Category <span className="required">*</span>
              </label>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '8px' }}>
                {[
                  { id: 'New ID', label: 'New ID (₹100)', desc: 'First time issue' },
                  { id: 'Renewal', label: 'Renewal (₹100)', desc: 'Next academic year' },
                  { id: 'Replacement', label: 'Replacement (₹100)', desc: 'Lost / Damaged' },
                  { id: 'Status Change ID', label: 'Status Change (₹100)', desc: 'Hostel ↔ Day Scholar' },
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    className={`btn ${
                      applicationType === type.id ? 'btn-primary' : 'btn-outline'
                    }`}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      padding: '10px 16px',
                    }}
                    onClick={() => {
                      onApplicationTypeChange(type.id);
                      if (type.id === 'Status Change ID') {
                        onStudentChange({
                          ...student,
                          previousStatus: 'College Hostel',
                          currentStatus:
                            student.currentStatus === 'College Hostel'
                              ? 'College Bus / Day Scholar'
                              : student.currentStatus,
                        });
                      }
                    }}
                  >
                    <span style={{ fontWeight: 700 }}>{type.label}</span>
                    <span style={{ fontSize: '11px', opacity: 0.85 }}>{type.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mode Selector */}
            <ModeSelector
              selectedMode={mode}
              onSelectMode={(m) => onModeChange(m)}
            />

            {/* Auto Orientation Info Banner — NO user choice, auto-assigned by status */}
            <div className="panel-card" style={{ marginTop: '20px', background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
              <div className="panel-title" style={{ color: '#166534' }}>
                <Info size={18} color="#16a34a" /> Card Orientation &amp; Color — Auto-Assigned by Status
              </div>
              <div style={{ fontSize: '13px', color: '#15803d', marginTop: '8px', lineHeight: 1.8 }}>
                <div>🟢 <strong>College Hostel</strong> → Front: <strong>Vertical + Green</strong> | Back: Horizontal</div>
                <div>🔵 <strong>Day Scholar / Outside PG</strong> → Front: <strong>Horizontal + Blue</strong> | Back: Horizontal</div>
                <div style={{ marginTop: '8px', padding: '8px 12px', background: '#fff', borderRadius: '8px', border: '1px solid #d1fae5', color: '#0f172a', fontSize: '12.5px' }}>
                  Your current status: <strong>{student.currentStatus || 'Not set'}</strong> →{' '}
                  Front will be <strong style={{ color: isHostel ? '#16a34a' : '#2563eb' }}>
                    {computedOrientation} ({isHostel ? '🟢 Green' : '🔵 Blue'})
                  </strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 2: PROFILE DETAILS ================= */}
        {currentStep === 2 && (
          <div>
            <div className="step-intro-box">
              <User size={22} color="#2563eb" />
              <div>
                <h4>Step 2: Student Personal & Academic Details</h4>
                <p>
                  Verify your university credentials and portrait photo to be printed onto
                  the official smart card.
                </p>
              </div>
            </div>

            {Object.keys(stepErrors).length > 0 && (
              <div className="wizard-validation-alert">
                <AlertTriangle size={18} color="#dc2626" />
                <span>Please complete the required fields highlighted below.</span>
              </div>
            )}

            <StudentForm
              student={student}
              onChange={onStudentChange}
              errors={stepErrors}
            />
          </div>
        )}

        {/* ================= STEP 3: RESIDENCY & STATUS ================= */}
        {currentStep === 3 && (
          <div>
            <div className="step-intro-box">
              <Home size={22} color="#16a34a" />
              <div>
                <h4>Step 3: Residency & Transportation Privileges</h4>
                <p>
                  Declare your accommodation type (Hostel Hall or Day Scholar Bus commute).
                </p>
              </div>
            </div>

            {mode === 'SMART' ? (
              <StudentStatus
                currentStatus={student.currentStatus}
                previousStatus={student.previousStatus}
                onStatusChange={(st) =>
                  onStudentChange({ ...student, currentStatus: st })
                }
                onPreviousStatusChange={(prev) =>
                  onStudentChange({ ...student, previousStatus: prev })
                }
                applicationType={applicationType}
                onApplicationTypeChange={onApplicationTypeChange}
              />
            ) : (
              <div className="panel-card" style={{ textAlign: 'center', padding: '36px 20px' }}>
                <CheckCircle2 size={40} color="#16a34a" style={{ margin: '0 auto 12px' }} />
                <h3 style={{ fontSize: '18px', color: '#0f172a' }}>
                  Universal Common ID Mode Selected
                </h3>
                <p style={{ fontSize: '13.5px', color: '#64748b', maxWidth: '520px', margin: '8px auto' }}>
                  Standardized collegiate card layout without accommodation distinction.
                  Proceed directly to fee checkout.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ================= STEP 4: CLEARANCE DOCS (ONLY IF STATUS CHANGE) ================= */}
        {isStatusChangeActive && currentStep === 4 && (
          <div>
            <div className="step-intro-box">
              <FileCheck size={22} color="#2563eb" />
              <div>
                <h4>Step 4: Hostel Clearance & Clearance Documents</h4>
                <p>
                  Upload your official signed Hostel Vacated Receipt for administrative verification.
                </p>
              </div>
            </div>

            {stepErrors.documents && (
              <div className="wizard-validation-alert">
                <AlertTriangle size={18} color="#dc2626" />
                <span>{stepErrors.documents}</span>
              </div>
            )}

            <div
              style={{
                background: '#fffbeb',
                border: '1px solid #fde68a',
                borderRadius: '12px',
                padding: '16px 20px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
              }}
            >
              <AlertTriangle size={22} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h4 style={{ color: '#92400e', fontSize: '14px', fontWeight: 700 }}>
                  ⚠️ Mandatory: Signed Hostel Vacated Receipt Required
                </h4>
                <p style={{ color: '#b45309', fontSize: '13px', marginTop: '4px' }}>
                  Because you are switching status from <strong>College Hostel</strong> to{' '}
                  <strong>{student.currentStatus}</strong>, the Chief Warden and Admin Office must
                  verify that your room has been vacated with no pending dues.
                </p>
              </div>
            </div>

            <DocumentUpload
              previousStatus={student.previousStatus}
              currentStatus={student.currentStatus}
              applicationType={applicationType}
              documents={documents}
              onDocumentsChange={onDocumentsChange}
            />
          </div>
        )}

        {/* ================= FINAL STEP: REVIEW & FEE CHECKOUT ================= */}
        {isReviewStep && (
          <div>
            <div className="step-intro-box">
              <CreditCard size={22} color="#2563eb" />
              <div>
                <h4>Step {totalSteps}: Application Summary & Fee Checkout</h4>
                <p>
                  Review your credentials and submit payment to generate your official smart card.
                </p>
              </div>
            </div>

            <div className="workflow-grid" style={{ marginTop: '16px' }}>
              {/* Left Column: Summary & Fee Breakdown */}
              <div>
                <div className="panel-card" style={{ marginBottom: '18px' }}>
                  <div className="panel-title" style={{ fontSize: '15px' }}>
                    <User size={18} color="#2563eb" /> Verified Profile Summary
                  </div>

                  <div className="review-grid">
                    <div className="review-item">
                      <span className="review-label">Full Name</span>
                      <span className="review-val font-bold">{student.name}</span>
                    </div>
                    <div className="review-item">
                      <span className="review-label">Roll Number</span>
                      <span className="review-val font-mono">{student.studentId}</span>
                    </div>
                    <div className="review-item">
                      <span className="review-label">Department</span>
                      <span className="review-val">{student.department}</span>
                    </div>
                    <div className="review-item">
                      <span className="review-label">Residency</span>
                      <span className="review-val font-bold">{student.currentStatus}</span>
                    </div>
                    <div className="review-item">
                      <span className="review-label">Front Layout</span>
                      <span className="review-val">{computedOrientation}</span>
                    </div>
                    <div className="review-item">
                      <span className="review-label">Back Layout</span>
                      <span className="review-val">horizontal (standard)</span>
                    </div>
                  </div>
                </div>

                {/* Clearance Verification Rule */}
                <div className="panel-card" style={{ marginBottom: '18px' }}>
                  <div className="panel-title" style={{ fontSize: '15px' }}>
                    <ShieldCheck size={18} color="#16a34a" /> Issuance Status & Clearance
                  </div>
                  {isStatusChangeActive ? (
                    <div style={{ fontSize: '13px', color: '#b45309', background: '#fffbeb', padding: '12px 14px', borderRadius: '8px', border: '1px solid #fde68a' }}>
                      ⚠️ <strong>Requires Admin Approval:</strong> Your status change requires clearance verification (Hostel Vacated Receipt). Upon submission, the college office will review your uploaded documents before releasing payment.
                    </div>
                  ) : (
                    <div style={{ fontSize: '13px', color: '#15803d', background: '#f0fdf4', padding: '12px 14px', borderRadius: '8px', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle2 size={16} />
                      <span><strong>Fast-Track:</strong> Instant digital card generation upon payment completion!</span>
                    </div>
                  )}
                </div>

                {/* Fee Breakdown & Proceed */}
                <div className="panel-card">
                  <div className="panel-title" style={{ fontSize: '15px' }}>
                    <CreditCard size={18} color="#2563eb" /> Applicable Fee Breakdown
                  </div>

                  <div className="fee-summary-box">
                    <div className="fee-row">
                      <span>Category:</span>
                      <strong>{isStatusChangeActive ? 'Status Change ID' : applicationType}</strong>
                    </div>
                    <div className="fee-row">
                      <span>Card Issuance & Encoding:</span>
                      <span>₹{currentBaseFee}.00</span>
                    </div>
                    <div className="fee-row total-row">
                      <span>Total Payable:</span>
                      <span>₹{currentTotalFee}.00</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn btn-primary btn-block btn-lg"
                    onClick={onProceedToPayment}
                    disabled={isSubmitting}
                    style={{ marginTop: '16px' }}
                  >
                    {isSubmitting ? (
                      'Submitting Application...'
                    ) : isStatusChangeActive ? (
                      <>
                        Submit Application for Clearance <ArrowRight size={18} />
                      </>
                    ) : (
                      <>
                        Proceed to Demo Checkout (₹{currentTotalFee}) <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Right Column: Locked Notice before payment */}
              <div>
                <div
                  className="panel-card"
                  style={{
                    padding: '36px 20px',
                    textAlign: 'center',
                    background: '#f8fafc',
                    border: '2px dashed #cbd5e1',
                  }}
                >
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      background: '#eff6ff',
                      color: '#2563eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                    }}
                  >
                    <Lock size={28} />
                  </div>
                  <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                    Official ID Card Unlocks After Payment
                  </h4>
                  <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5, maxWidth: '320px', margin: '0 auto' }}>
                    Your official university identity card, high-resolution portrait, verified barcode, and PDF download permissions will be generated in the next step immediately after payment of ₹{currentTotalFee}.00.
                  </p>
                  <div
                    style={{
                      display: 'inline-block',
                      marginTop: '16px',
                      fontSize: '11.5px',
                      background: '#e0f2fe',
                      color: '#0369a1',
                      padding: '4px 10px',
                      borderRadius: '999px',
                      fontWeight: 700,
                    }}
                  >
                    Format: Front {computedOrientation} • Back horizontal
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER NAVIGATION */}
      <div className="wizard-footer-bar">
        <button
          type="button"
          className="btn btn-outline"
          onClick={handleBack}
          disabled={currentStep === 1}
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>
          Step {currentStep} of {totalSteps}
        </div>

        {!isReviewStep ? (
          <button type="button" className="btn btn-primary" onClick={handleNext}>
            Next Step <ArrowRight size={16} />
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-primary"
            onClick={onProceedToPayment}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Proceed to Demo Checkout (₹100)'}
            <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
