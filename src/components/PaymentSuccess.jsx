import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, ArrowRight, Download, Receipt } from 'lucide-react';

export default function PaymentSuccess({
  paymentData,
  onContinueToID,
  onViewReceipt,
}) {
  const { payment, application } = paymentData || {};
  const amount = payment?.amount || application?.totalAmount || 110;
  const transactionId = payment?.transactionId || application?.transactionId || 'TXN202610310001';
  const applicationId = application?.applicationId || payment?.applicationId || 'IDAPP202610310001';
  const paymentDate = payment?.createdAt
    ? new Date(payment.createdAt).toLocaleString()
    : new Date().toLocaleString();

  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // safe fallback if canvas is not ready
    }
  }, []);

  return (
    <div style={{ maxWidth: '560px', margin: '30px auto', textAlign: 'center' }}>
      <div className="panel-card" style={{ padding: '36px 30px' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: '#dcfce7',
            color: '#16a34a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}
        >
          <CheckCircle2 size={36} />
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>
          ✓ Payment Successful
        </h2>
        <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
          Your university digital ID fee has been securely verified and booked.
        </p>

        <div
          style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '20px',
            margin: '24px 0',
            textAlign: 'left',
          }}
        >
          <div className="fee-row">
            <span>Amount Paid:</span>
            <strong style={{ color: '#16a34a', fontSize: '16px' }}>₹{amount}.00</strong>
          </div>
          <div className="fee-row">
            <span>Transaction ID:</span>
            <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#0f172a' }}>{transactionId}</span>
          </div>
          <div className="fee-row">
            <span>Application ID:</span>
            <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#0f172a' }}>{applicationId}</span>
          </div>
          <div className="fee-row" style={{ borderBottom: 'none' }}>
            <span>Payment Date:</span>
            <span style={{ color: '#64748b' }}>{paymentDate}</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            type="button"
            className="btn btn-green btn-block btn-lg"
            onClick={onContinueToID}
          >
            Continue to ID Generation <ArrowRight size={18} />
          </button>

          {onViewReceipt && (
            <button
              type="button"
              className="btn btn-outline btn-block"
              onClick={() => onViewReceipt(payment)}
            >
              <Receipt size={16} /> View & Download Payment Receipt
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
