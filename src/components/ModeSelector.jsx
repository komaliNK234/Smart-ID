import React from 'react';
import { RefreshCw, CreditCard, CheckCircle2, ArrowRight } from 'lucide-react';

export default function ModeSelector({ selectedMode, onSelectMode }) {
  return (
    <div className="mode-selector-wrapper">
      <div className="page-header" style={{ textAlign: 'center', marginBottom: '28px' }}>
        <h2 className="page-title" style={{ fontSize: '30px' }}>
          Select College ID Issuance Policy
        </h2>
        <p className="page-subtitle" style={{ fontSize: '15px', maxWidth: '620px', margin: '8px auto 0' }}>
          Choose how student accommodation and transportation privileges should govern digital identity card generation.
        </p>
      </div>

      <div className="mode-selector-grid">
        {/* OPTION A: Smart Student-Based ID */}
        <div
          className={`mode-card ${selectedMode === 'SMART' ? 'selected' : ''}`}
          onClick={() => onSelectMode('SMART')}
        >
          <div className="mode-badge">Option A • Dynamic Privilege Routing</div>
          <div className="mode-icon-big">🔄</div>
          <h2>Smart Student-Based ID</h2>
          <p>
            Generate the appropriate ID card based on student accommodation and transport status.
            Automatically enforces hostel clearance, bus pass checks, and document verification.
          </p>

          <ul className="mode-features">
            <li>
              <CheckCircle2 size={16} color="#16a34a" />
              <span><strong>Hosteller:</strong> Green Vertical orientation with Hall residency details.</span>
            </li>
            <li>
              <CheckCircle2 size={16} color="#2563eb" />
              <span><strong>Day Scholar:</strong> Blue Horizontal orientation with route info.</span>
            </li>
            <li>
              <CheckCircle2 size={16} color="#d97706" />
              <span><strong>Status Transitions:</strong> Auto-flags Hostel &rarr; Bus / PG change.</span>
            </li>
            <li>
              <CheckCircle2 size={16} color="#16a34a" />
              <span><strong>Document Verification:</strong> Clearance proofs checked before payment.</span>
            </li>
          </ul>

          <button
            type="button"
            className="btn btn-primary btn-block btn-lg"
            onClick={(e) => {
              e.stopPropagation();
              onSelectMode('SMART');
            }}
          >
            Use Smart ID Rules <ArrowRight size={16} />
          </button>
        </div>

        {/* OPTION B: Common ID Policy */}
        <div
          className={`mode-card ${selectedMode === 'COMMON' ? 'selected' : ''}`}
          onClick={() => onSelectMode('COMMON')}
        >
          <div className="mode-badge" style={{ background: '#f1f5f9', color: '#475569' }}>
            Option B • Universal Template
          </div>
          <div className="mode-icon-big">🪪</div>
          <h2>Common ID Policy</h2>
          <p>
            Generate one standard ID-card design for all students.
            This option does not differentiate between Hostellers and Day Scholars.
          </p>

          <ul className="mode-features">
            <li>
              <CheckCircle2 size={16} color="#64748b" />
              <span><strong>Standardized Format:</strong> Equal layout for all departments.</span>
            </li>
            <li>
              <CheckCircle2 size={16} color="#64748b" />
              <span><strong>Flexible Orientation:</strong> Choose Horizontal or Vertical.</span>
            </li>
            <li>
              <CheckCircle2 size={16} color="#64748b" />
              <span><strong>Fast-Track:</strong> No accommodation clearance documents needed.</span>
            </li>
            <li>
              <CheckCircle2 size={16} color="#16a34a" />
              <span><strong>Instant Payment & Issue:</strong> Direct calculation & issuance.</span>
            </li>
          </ul>

          <button
            type="button"
            className="btn btn-outline btn-block btn-lg"
            onClick={(e) => {
              e.stopPropagation();
              onSelectMode('COMMON');
            }}
          >
            Use Common ID <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
