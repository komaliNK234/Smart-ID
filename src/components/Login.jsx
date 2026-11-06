import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  GraduationCap,
  Lock,
  User,
  UserPlus,
} from 'lucide-react';
import { apiRequest } from '../api';

const DEMO_ACCOUNTS = [
  { role: 'student', studentId: '241FA00001', name: 'Day Scholar Demo', status: 'College Bus / Day Scholar' },
  { role: 'student', studentId: '241FA00002', name: 'Hosteller Demo', status: 'College Hostel' },
  { role: 'student', studentId: '241FA18059', name: 'CampusID Student Demo', status: 'College Bus / Day Scholar' },
  { role: 'admin', studentId: 'admin', name: 'Administrative Officer' },
];

const initialRegistration = {
  studentId: '',
  name: '',
  department: '',
  course: '',
  phone: '',
  email: '',
  parentName: '',
  parentPhone: '',
  password: '',
};

export default function Login({ onLoginSuccess }) {
  const [mode, setMode] = useState('login');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [password, setPassword] = useState('');
  const [registration, setRegistration] = useState(initialRegistration);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      if (mode === 'register') {
        const result = await apiRequest('/api/auth/register', {
          method: 'POST',
          body: JSON.stringify(registration),
        });
        onLoginSuccess(result.user);
      } else {
        const result = await apiRequest('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify({
            identifier: registrationNumber.trim(),
            password,
          }),
        });
        onLoginSuccess(result.user);
      }
    } catch (error) {
      setErrorMessage(error.message || 'Unable to reach the CampusID service.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (account) => {
    setErrorMessage('');
    if (account.role === 'admin') {
      onLoginSuccess({
        role: 'admin',
        isDemo: true,
        username: 'admin-demo',
        name: account.name,
        title: 'Demo Identity Officer',
        department: 'Campus Security & Identity Authority',
      });
      return;
    }

    onLoginSuccess({
      role: 'student',
      isDemo: true,
      studentId: account.studentId,
      name: account.name,
      department: 'Computer Science & Engineering',
      course: 'B.TECH',
      year: 'I Year',
      section: '1',
      academicYear: '2024 - 2028',
      dob: '2006-08-15',
      phone: '0000000000',
      email: `${account.studentId.toLowerCase()}@demo.campusid.invalid`,
      parentName: 'Demo Guardian',
      parentPhone: '0000000000',
      address: 'CampusID demonstration profile',
      currentStatus: account.status,
      previousStatus: account.status,
    });
  };

  const updateRegistration = (field, value) => {
    setRegistration((previous) => ({ ...previous, [field]: value }));
  };

  return (
    <div className="login-portal-backdrop">
      <div className="login-portal-card">
        <div className="login-portal-header">
          <div className="login-brand-icon">
            <GraduationCap size={32} />
          </div>
          <h1 className="login-portal-title">CampusID Portal</h1>
          <p className="login-portal-subtitle">
            Digital identity and college ID management
          </p>
        </div>

        <div className="login-tabs" role="tablist" aria-label="Account options">
          <button
            type="button"
            className={`login-tab-btn ${mode === 'login' ? 'active' : ''}`}
            onClick={() => {
              setMode('login');
              setErrorMessage('');
            }}
          >
            <Lock size={15} /> Sign in
          </button>
          <button
            type="button"
            className={`login-tab-btn ${mode === 'register' ? 'active' : ''}`}
            onClick={() => {
              setMode('register');
              setErrorMessage('');
            }}
          >
            <UserPlus size={15} /> Create account
          </button>
        </div>

        {errorMessage && (
          <div className="login-error-alert" role="alert">
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          {mode === 'login' ? (
            <>
              <div className="form-group">
                <label className="form-label" htmlFor="campusid-identifier">
                  Registration number or email
                </label>
                <div className="input-with-icon">
                  <User size={18} className="input-icon" />
                  <input
                    id="campusid-identifier"
                    type="text"
                    className="form-control"
                    autoComplete="username"
                    value={registrationNumber}
                    onChange={(event) => setRegistrationNumber(event.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="campusid-password">Password</label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <input
                    id="campusid-password"
                    type="password"
                    className="form-control"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="registration-form-grid">
              <label className="form-group">
                <span className="form-label">Registration number</span>
                <input className="form-control" value={registration.studentId} onChange={(e) => updateRegistration('studentId', e.target.value)} required />
              </label>
              <label className="form-group">
                <span className="form-label">Full name</span>
                <input className="form-control" autoComplete="name" value={registration.name} onChange={(e) => updateRegistration('name', e.target.value)} required />
              </label>
              <label className="form-group">
                <span className="form-label">Department</span>
                <input className="form-control" value={registration.department} onChange={(e) => updateRegistration('department', e.target.value)} required />
              </label>
              <label className="form-group">
                <span className="form-label">Course</span>
                <input className="form-control" value={registration.course} onChange={(e) => updateRegistration('course', e.target.value)} required />
              </label>
              <label className="form-group">
                <span className="form-label">Phone</span>
                <input className="form-control" type="tel" autoComplete="tel" value={registration.phone} onChange={(e) => updateRegistration('phone', e.target.value)} required />
              </label>
              <label className="form-group">
                <span className="form-label">Email</span>
                <input className="form-control" type="email" autoComplete="email" value={registration.email} onChange={(e) => updateRegistration('email', e.target.value)} required />
              </label>
              <label className="form-group">
                <span className="form-label">Parent / guardian name</span>
                <input className="form-control" value={registration.parentName} onChange={(e) => updateRegistration('parentName', e.target.value)} required />
              </label>
              <label className="form-group">
                <span className="form-label">Parent / guardian phone</span>
                <input className="form-control" type="tel" value={registration.parentPhone} onChange={(e) => updateRegistration('parentPhone', e.target.value)} required />
              </label>
              <label className="form-group registration-password">
                <span className="form-label">Password (at least 8 characters)</span>
                <input className="form-control" type="password" autoComplete="new-password" minLength={8} value={registration.password} onChange={(e) => updateRegistration('password', e.target.value)} required />
              </label>
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={isLoading}>
            {isLoading ? 'Please wait…' : mode === 'login' ? 'Sign in to CampusID' : 'Create account'}
            {!isLoading && <ArrowRight size={18} />}
          </button>
        </form>

        <section className="demo-access" aria-labelledby="demo-access-title">
          <h2 id="demo-access-title">Demo access</h2>
          <p>These profiles are for demonstration only. They do not authenticate a real student or process a real payment.</p>
          <div className="demo-access-grid">
            {DEMO_ACCOUNTS.map((account) => (
              <button
                key={account.studentId}
                type="button"
                className="btn btn-outline"
                onClick={() => handleDemoLogin(account)}
              >
                {account.role === 'admin' ? 'Admin demo' : `${account.name} · ${account.studentId}`}
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
