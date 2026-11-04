import React, { useState } from 'react';
import {
  GraduationCap,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  KeyRound,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

// Sample reference credentials for quick demo
const SAMPLE_PREVIEWS = [
  {
    role: 'student',
    regNo: '241FA00001',
    name: 'Day Scholar Student',
    password: 'student123',
    desc: 'From 1000 dataset (Odd = Day Scholar)',
  },
  {
    role: 'student',
    regNo: '241FA00002',
    name: 'College Hosteller Student',
    password: 'student123',
    desc: 'From 1000 dataset (Even = College Hostel)',
  },
  {
    role: 'student',
    regNo: '241FA18059',
    name: 'Kotha Bhavya Sree',
    password: 'student123',
    desc: 'Day Scholar (1 Card Taken, ₹100 Paid)',
  },
  {
    role: 'admin',
    regNo: 'admin',
    name: 'Administrative Officer',
    password: 'admin123',
    desc: 'Verification & Clearance Admin',
  },
];

export default function Login({ onLoginSuccess }) {
  const [registrationNumber, setRegistrationNumber] = useState('241FA00001');
  const [password, setPassword] = useState('student123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successNotice, setSuccessNotice] = useState('');

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setErrorMessage('');
    setSuccessNotice('');

    const cleanRegNo = registrationNumber.trim();
    if (!cleanRegNo) {
      setErrorMessage('Please enter your Registration Number.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your Password.');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Try server login
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: cleanRegNo,
          password: password,
        }),
      });

      const data = await res.json();
      if (data.success && data.user) {
        onLoginSuccess(data.user);
        return;
      } else {
        // Fallback to local client provisioning
        handleLocalFallback(cleanRegNo);
      }
    } catch (err) {
      // Offline fallback
      handleLocalFallback(cleanRegNo);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocalFallback = (regNo) => {
    const upperRegNo = regNo.toUpperCase();

    // 1. Check if admin
    if (upperRegNo === 'ADMIN' || regNo.toLowerCase() === 'admin') {
      if (password && password !== 'admin123' && password !== 'admin') {
        setErrorMessage('Incorrect administrator password. (Default: admin123)');
        return;
      }
      onLoginSuccess({
        role: 'admin',
        username: 'admin',
        name: 'Administrative Officer',
        title: 'Chief Identity Officer',
        department: 'Campus Security & Identity Authority',
      });
      return;
    }

    // 2. Check if student in 1000 dataset (e.g. 241FA00001 to 241FA01000)
    const match1000 = upperRegNo.match(/^241FA(\d{5})$/);
    let stayingStatus = 'College Bus / Day Scholar';
    let studentName = `STUDENT ${upperRegNo}`;

    if (match1000) {
      const num = parseInt(match1000[1], 10);
      const isHostel = num % 2 === 0;
      stayingStatus = isHostel ? 'College Hostel' : 'College Bus / Day Scholar';
      studentName = isHostel ? `Aarav Sharma (${upperRegNo})` : `Kotha Bhavya (${upperRegNo})`;
    } else if (upperRegNo === '241FA18059') {
      studentName = 'KOTHA BHAVYA SREE';
      stayingStatus = 'College Bus / Day Scholar';
    } else if (upperRegNo === '22CS084') {
      studentName = 'Aarav Sharma';
      stayingStatus = 'College Hostel';
    } else if (upperRegNo === '22ME045') {
      studentName = 'Rohan Verma';
      stayingStatus = 'Outside Hostel / PG';
    }

    // Allow ANY student registration number (automatically register new student)
    const studentUser = {
      role: 'student',
      studentId: upperRegNo,
      name: studentName,
      department: 'Computer Science & Engineering',
      course: 'B.TECH',
      year: 'I Year',
      section: '25',
      academicYear: '2024 - 2028',
      dob: '2006-08-15',
      phone: '9848012345',
      email: `${upperRegNo.toLowerCase()}@vignan.ac.in`,
      parentName: 'GUARDIAN RAO',
      parentPhone: '9848012345',
      address: '# Campus Enclave, Vadlamudi, Guntur(Dist) - 522213',
      photo:
        stayingStatus === 'College Hostel'
          ? 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      currentStatus: stayingStatus,
      previousStatus: stayingStatus,
      password: password || 'student123',
    };

    onLoginSuccess(studentUser);
  };

  const handleSelectCredential = (item) => {
    setRegistrationNumber(item.regNo);
    setPassword(item.password);
    setErrorMessage('');
  };

  return (
    <div className="login-portal-backdrop">
      <div className="login-portal-card" style={{ maxWidth: '540px' }}>
        {/* Brand Header */}
        <div className="login-portal-header">
          <div className="login-brand-icon">
            <GraduationCap size={32} />
          </div>
          <h2 className="login-portal-title">CampusID Portal</h2>
          <p className="login-portal-subtitle">
            Digital Identity & Smart Card Access • Any Student or Administrator
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="login-error-alert">
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Notice */}
        {successNotice && (
          <div
            style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              color: '#15803d',
              padding: '10px 14px',
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <CheckCircle2 size={16} />
            <span>{successNotice}</span>
          </div>
        )}

        {/* Universal Single Login Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">
              Registration Number <span className="required">*</span>
            </label>
            <div className="input-with-icon">
              <User size={18} className="input-icon" />
              <input
                type="text"
                className="form-control"
                placeholder="Enter Registration No (e.g. 241FA00001 or any Roll No / admin)"
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
                autoFocus
                required
              />
            </div>
            <div className="input-hint">
              Supports 1,000 students (<strong>241FA00001</strong> to <strong>241FA01000</strong>) or <em>any</em> new registration number!
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Password <span className="required">*</span>
            </label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block btn-lg"
            disabled={isLoading}
            style={{ marginTop: '8px' }}
          >
            {isLoading ? 'Verifying & Provisioning...' : 'Sign In to Portal'}
            {!isLoading && <ArrowRight size={18} />}
          </button>
        </form>

        {/* Login Credentials Reference Box */}
        <div
          style={{
            marginTop: '22px',
            paddingTop: '16px',
            borderTop: '1px solid #e2e8f0',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '10px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                fontWeight: 700,
                color: '#334155',
              }}
            >
              <KeyRound size={14} color="#2563eb" />
              <span>Available Credentials (Click to fill):</span>
            </div>
            <span
              style={{
                fontSize: '10.5px',
                background: '#e0f2fe',
                color: '#0369a1',
                padding: '2px 8px',
                borderRadius: '999px',
                fontWeight: 700,
              }}
            >
              1,000+ Students Active
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {SAMPLE_PREVIEWS.map((item) => (
              <div
                key={item.regNo}
                onClick={() => handleSelectCredential(item)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '9px 12px',
                  background:
                    registrationNumber.toLowerCase() === item.regNo.toLowerCase()
                      ? '#eff6ff'
                      : '#f8fafc',
                  border:
                    registrationNumber.toLowerCase() === item.regNo.toLowerCase()
                      ? '1.5px solid #3b82f6'
                      : '1px solid #e2e8f0',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                title={`Click to fill credentials for ${item.name}`}
              >
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>
                    {item.role === 'admin' ? '🛡️ Admin' : '🎓 Student'}: {item.name}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                    {item.desc}
                  </div>
                </div>

                <div style={{ textAlign: 'right', fontFamily: 'monospace', fontSize: '11px' }}>
                  <div>
                    Reg No: <strong style={{ color: '#1d4ed8' }}>{item.regNo}</strong>
                  </div>
                  <div style={{ color: '#475569' }}>
                    Pass: <strong>{item.password}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: '10px',
              padding: '8px 12px',
              background: '#f8fafc',
              borderRadius: '6px',
              fontSize: '11px',
              color: '#64748b',
              textAlign: 'center',
            }}
          >
            💡 <em>New Student?</em> Simply enter <strong>any Registration Number</strong> and password — your profile will be created automatically!
          </div>
        </div>
      </div>
    </div>
  );
}
