import React from 'react';
import {
  Bell,
  ShieldCheck,
  UserCheck,
  Sparkles,
  School,
  LogOut,
  User,
  RotateCcw,
} from 'lucide-react';

export default function Header({
  role,
  onRoleChange,
  currentUser,
  onLogout,
  onSwitchAccount,
  apiStatus = 'checking',
}) {
  return (
    <header className="header">
      <div className="header-left">
        <div className="header-greeting">
          <h1>
            🎓 CampusID
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                background: '#e0f2fe',
                color: '#0369a1',
                padding: '2px 8px',
                borderRadius: '999px',
                letterSpacing: '0.4px',
              }}
            >
              v2.6 Portal
            </span>
          </h1>
          <p>Apply • Verify • Pay • Generate — Official College Identity System</p>
        </div>
      </div>

      <div className="header-right">
        {/* Role Switcher: Student vs Administrator */}
        <div className="role-switcher">
          <button
            type="button"
            className={`role-btn ${role === 'student' ? 'active' : ''}`}
            onClick={() => onRoleChange('student')}
            title="Switch to Student Application View"
          >
            <UserCheck size={14} /> Student View
          </button>
          {currentUser?.role === 'admin' && (
            <button
              type="button"
              className={`role-btn ${role === 'admin' ? 'active' : ''}`}
              onClick={() => onRoleChange('admin')}
              title="Switch to Officer Verification & Admin View"
            >
              <ShieldCheck size={14} /> Admin / Verifier
            </button>
          )}
        </div>

        {/* User Profile Pill & Logout Button */}
        {currentUser && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: '#f8fafc',
              padding: '4px 10px 4px 6px',
              borderRadius: '999px',
              border: '1px solid #e2e8f0',
            }}
          >
            {currentUser.photo ? (
              <img
                src={currentUser.photo}
                alt={currentUser.name}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '1.5px solid #2563eb',
                }}
              />
            ) : (
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: '#2563eb',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 700,
                }}
              >
                {currentUser.name ? currentUser.name.charAt(0) : 'U'}
              </div>
            )}

            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>
                {currentUser.name || 'Student'}
              </div>
              <div style={{ fontSize: '10.5px', color: '#64748b' }}>
                {currentUser.role === 'admin'
                  ? 'Administrator'
                  : currentUser.studentId || 'Roll No'}
              </div>
            </div>

            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={onLogout}
              style={{
                padding: '4px 8px',
                fontSize: '11px',
                color: '#ef4444',
                borderColor: '#fca5a5',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                marginLeft: '4px',
              }}
              title="Sign Out of CampusID"
            >
              <LogOut size={12} />
              <span>Sign Out</span>
            </button>
          </div>
        )}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px',
            color: apiStatus === 'online' ? '#16a34a' : apiStatus === 'offline' ? '#dc2626' : '#64748b',
            background: apiStatus === 'online' ? '#f0fdf4' : apiStatus === 'offline' ? '#fef2f2' : '#f1f5f9',
            padding: '5px 10px',
            borderRadius: '999px',
            border: `1px solid ${apiStatus === 'online' ? '#bbf7d0' : apiStatus === 'offline' ? '#fecaca' : '#e2e8f0'}`,
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: apiStatus === 'online' ? '#22c55e' : apiStatus === 'offline' ? '#ef4444' : '#94a3b8',
              display: 'inline-block',
            }}
          ></span>
          <strong>{apiStatus === 'online' ? 'API Online' : apiStatus === 'offline' ? 'API Offline' : 'Connecting'}</strong>
        </div>
      </div>
    </header>
  );
}
