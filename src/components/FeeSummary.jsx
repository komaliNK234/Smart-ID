import React from 'react';
import { CreditCard, ShieldCheck, ArrowRight, Info } from 'lucide-react';

export default function FeeSummary({
  applicationType = 'New ID',
  baseFee = 100,
  processingFee = 0,
  total = 100,
  onProceed,
  disabled = false,
  disabledReason = '',
}) {
  return (
    <div className="panel-card">
      <div className="panel-title">
        <CreditCard size={20} color="#2563eb" /> 4. Applicable Fee Breakdown
      </div>
      <div className="panel-subtitle">
        Flat uniform rate of ₹100.00 for all ID issuance categories.
      </div>

      <div className="fee-summary-box">
        <div className="fee-row">
          <span>Application Category:</span>
          <strong>{applicationType}</strong>
        </div>
        <div className="fee-row">
          <span>Digital Card Issuance & NFC Chip:</span>
          <span>₹{baseFee}.00</span>
        </div>
        <div className="fee-row">
          <span>University Processing Fee:</span>
          <span>₹{processingFee}.00 (Waived)</span>
        </div>
        <div className="fee-row total-row">
          <span>Total Payable Amount:</span>
          <span>₹{total}.00</span>
        </div>
      </div>

      {disabledReason && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#fffbeb',
            border: '1px solid #fde68a',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '12px',
            color: '#b45309',
            marginBottom: '16px',
          }}
        >
          <Info size={16} />
          <span>{disabledReason}</span>
        </div>
      )}

      <button
        type="button"
        className="btn btn-primary btn-block btn-lg"
        onClick={onProceed}
        disabled={disabled}
      >
        Proceed to Online Payment (₹{total}) <ArrowRight size={18} />
      </button>

      <div style={{ textAlign: 'center', fontSize: '11px', color: '#64748b', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
        <ShieldCheck size={14} color="#16a34a" /> Official University Payment System (Demo Working Process)
      </div>
    </div>
  );
}
