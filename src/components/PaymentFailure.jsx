import React from 'react';
import { XCircle, RefreshCw, CreditCard, ArrowLeft } from 'lucide-react';

export default function PaymentFailure({
  errorMessage = 'Your payment could not be completed.',
  onTryAgain,
  onChangePaymentMethod,
}) {
  return (
    <div style={{ maxWidth: '540px', margin: '30px auto', textAlign: 'center' }}>
      <div className="panel-card" style={{ padding: '36px 30px' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: '#fee2e2',
            color: '#dc2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}
        >
          <XCircle size={36} />
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#991b1b' }}>
          ✕ Payment Failed
        </h2>
        <p style={{ fontSize: '14px', color: '#64748b', marginTop: '6px' }}>
          {errorMessage || 'Your payment could not be completed.'}
        </p>

        <div
          style={{
            background: '#fff1f2',
            border: '1px solid #fecdd3',
            borderRadius: '8px',
            padding: '12px 16px',
            margin: '20px 0',
            fontSize: '12px',
            color: '#9f1239',
            textAlign: 'left',
          }}
        >
          <strong>Security Notice:</strong> No funds were deducted from your account. Your ID card generation is locked until the required semester fee payment is verified.
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
          <button
            type="button"
            className="btn btn-primary btn-block"
            onClick={onTryAgain}
          >
            <RefreshCw size={16} /> Try Again
          </button>
          <button
            type="button"
            className="btn btn-outline btn-block"
            onClick={onChangePaymentMethod}
          >
            <CreditCard size={16} /> Change Payment Method
          </button>
        </div>
      </div>
    </div>
  );
}
