import React from 'react';
import { Home, Bus, Building, AlertTriangle, HelpCircle, Check, ArrowRight } from 'lucide-react';

export default function StudentStatus({
  currentStatus,
  previousStatus,
  onStatusChange,
  onPreviousStatusChange,
  applicationType,
  onApplicationTypeChange,
}) {
  const isStatusChangeActive =
    applicationType === 'Status Change ID' ||
    (previousStatus === 'College Hostel' &&
      (currentStatus === 'College Bus / Day Scholar' || currentStatus === 'Outside Hostel / PG'));

  const handleSelectCategory = (typeId) => {
    onApplicationTypeChange(typeId);
    if (typeId === 'Status Change ID') {
      // Ensure previous status is College Hostel and current is Day Scholar for status change
      if (previousStatus !== 'College Hostel') {
        onPreviousStatusChange('College Hostel');
      }
      if (currentStatus === 'College Hostel') {
        onStatusChange('College Bus / Day Scholar');
      }
    }
  };

  return (
    <div className="panel-card">
      <div className="panel-title">
        <Home size={20} color="#16a34a" /> 2. Accommodation & Transportation Status
      </div>
      <div className="panel-subtitle">
        Declare your verified residency/commute status. This automatically dictates your smart ID layout and badge rules.
      </div>

      {/* Application Type Selector (Section 17) */}
      <div style={{ marginBottom: '18px' }}>
        <label className="form-label">
          Application Category <span className="required">*</span>
        </label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
          {[
            { id: 'New ID', label: 'New ID (₹100)' },
            { id: 'Renewal', label: 'Renewal (₹100)' },
            { id: 'Replacement', label: 'Replacement (₹100)' },
            { id: 'Status Change ID', label: 'Status Change (₹100)' },
          ].map((type) => (
            <button
              key={type.id}
              type="button"
              className={`btn btn-sm ${applicationType === type.id ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => handleSelectCategory(type.id)}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Previous Status Selector (For change simulation & tracking) */}
      <div style={{ marginBottom: '16px', background: '#f8fafc', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <label className="form-label" style={{ marginBottom: 0 }}>
            Academic Records — Previous Enrolled Status:
          </label>
          <select
            className="form-control"
            style={{ width: 'auto', padding: '6px 12px', fontSize: '13px' }}
            value={previousStatus}
            onChange={(e) => onPreviousStatusChange(e.target.value)}
          >
            <option value="College Hostel">College Hostel</option>
            <option value="College Bus / Day Scholar">College Bus / Day Scholar</option>
            <option value="Outside Hostel / PG">Outside Hostel / PG</option>
          </select>
        </div>
      </div>

      {/* Current Student Status Cards (Section 6) */}
      <label className="form-label">
        Current Accommodation / Commute Status <span className="required">*</span>
      </label>

      <div className="status-cards-grid">
        {/* Card 1: College Hostel */}
        <div
          className={`status-card-item ${currentStatus === 'College Hostel' ? 'active-hostel' : ''}`}
          onClick={() => onStatusChange('College Hostel')}
        >
          <div className="status-card-icon">🟢</div>
          <div className="status-card-title">College Hostel</div>
          <div className="status-card-desc">
            Student currently stays in the college hostel campus halls.
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '6px', fontSize: '10.5px', fontWeight: 700, color: '#16a34a' }}>
            → Generates Vertical Hosteller ID
          </div>
        </div>

        {/* Card 2: College Bus / Day Scholar */}
        <div
          className={`status-card-item ${currentStatus === 'College Bus / Day Scholar' ? 'active-dayscholar' : ''}`}
          onClick={() => onStatusChange('College Bus / Day Scholar')}
        >
          <div className="status-card-icon">🔵</div>
          <div className="status-card-title">College Bus / Day Scholar</div>
          <div className="status-card-desc">
            Student uses college transportation routes as a Day Scholar.
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '6px', fontSize: '10.5px', fontWeight: 700, color: '#2563eb' }}>
            → Generates Horizontal Day Scholar ID
          </div>
        </div>

        {/* Card 3: Outside Hostel / PG */}
        <div
          className={`status-card-item ${currentStatus === 'Outside Hostel / PG' ? 'active-dayscholar' : ''}`}
          onClick={() => onStatusChange('Outside Hostel / PG')}
        >
          <div className="status-card-icon">🏢</div>
          <div className="status-card-title">Outside Hostel / PG</div>
          <div className="status-card-desc">
            Student stays in external rental accommodation or private PG.
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '6px', fontSize: '10.5px', fontWeight: 700, color: '#2563eb' }}>
            → Generates Horizontal Day Scholar ID
          </div>
        </div>
      </div>

      {/* STATUS CHANGE DETECTION & WARNING (Section 10 & 39) */}
      {isStatusChangeActive && (
        <div className="status-change-alert">
          <div className="status-change-header">
            <AlertTriangle size={18} />
            ⚠️ Status Change Option Selected ({previousStatus} &rarr; {currentStatus})
          </div>
          <div className="status-change-desc">
            You are changing status from <strong>College Hostel</strong> to <strong>{currentStatus}</strong>.
            The college administration requires an official <strong>Hostel Vacated Receipt / Clearance Form</strong> signed by the Chief Warden before issuing your Day Scholar ID.
          </div>

          <div className="why-required-box">
            <div className="why-required-title">
              <HelpCircle size={14} color="#2563eb" /> Why is the Hostel Vacated Receipt required?
            </div>
            <div className="why-required-text">
              "Your previous status was College Hostel. The college requires confirmation that you have officially vacated the college hostel room with no outstanding dues before issuing a Day Scholar ID."
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
