import React, { useState } from 'react';
import {
  CreditCard,
  QrCode,
  Building,
  Zap,
  ShieldCheck,
  Lock,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  RefreshCw,
  Info,
} from 'lucide-react';

export default function Payment({
  application,
  onPaymentSuccess,
  onPaymentFailure,
  onBack,
}) {
  const [selectedMethod, setSelectedMethod] = useState('FAST'); // 'FAST' | 'UPI' | 'CARD' | 'NETBANKING'
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Sample card form state
  const [cardNumber, setCardNumber] = useState('4532 8812 9043 8892');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('882');
  const [selectedBank, setSelectedBank] = useState('State Bank of India');

  if (!application) {
    return <div className="panel-card">No active application selected for payment.</div>;
  }

  const {
    applicationId,
    studentData,
    idType = 'Day Scholar ID',
    applicationType = 'New ID',
    totalAmount = 100,
  } = application;

  const handleProcessPayment = async (simulateFailure = false) => {
    setLoading(true);
    setErrorMsg('');

    try {
      setLoadingStep('Authorizing demonstration payment...');
      await new Promise((r) => setTimeout(r, 600));

      setLoadingStep('Verifying university fee ledger (₹100.00)...');
      await new Promise((r) => setTimeout(r, 600));

      const res = await fetch('/api/payment/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId,
          paymentMethod:
            selectedMethod === 'FAST'
              ? 'Demo 1-Click Fast Pay'
              : selectedMethod === 'UPI'
              ? 'Demo UPI (vignan.fees@sbi)'
              : selectedMethod === 'CARD'
              ? 'Demo Card (Visa •••• 8892)'
              : `Demo Net Banking (${selectedBank})`,
          forceFail: simulateFailure,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || 'Payment simulation failed');
      }

      setLoadingStep('Generating official digital credentials...');
      await new Promise((r) => setTimeout(r, 400));

      onPaymentSuccess(data.data);
    } catch (err) {
      setErrorMsg(err.message);
      if (simulateFailure) {
        onPaymentFailure({
          error: err.message,
          applicationId,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto' }}>
      {/* Back button */}
      <div style={{ marginBottom: '16px' }}>
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={onBack}
          disabled={loading}
        >
          <ArrowLeft size={16} /> Back to Application Review
        </button>
      </div>

      <div className="panel-card" style={{ padding: '0', overflow: 'hidden' }}>
        {/* University Payment Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1e3a8a 0%, #0056b3 100%)',
            color: '#ffffff',
            padding: '24px 28px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(255, 255, 255, 0.2)',
                padding: '3px 10px',
                borderRadius: '999px',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.5px',
              }}
            >
              <Zap size={13} color="#fde047" /> SAMPLE PAYMENT GATEWAY (WORKING DEMO)
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, marginTop: '8px' }}>
              Vignan's University Fee Checkout
            </h2>
            <div style={{ fontSize: '13px', opacity: 0.9, marginTop: '2px' }}>
              Student: <strong>{studentData?.name || 'KOTHA BHAVYA SREE'}</strong> • Roll:{' '}
              <strong>{studentData?.studentId || '241FA18059'}</strong>
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '12px',
              padding: '12px 20px',
              textAlign: 'right',
            }}
          >
            <div style={{ fontSize: '11px', textTransform: 'uppercase', opacity: 0.85 }}>
              Total Payable
            </div>
            <div style={{ fontSize: '28px', fontWeight: 900, letterSpacing: '-0.5px' }}>
              ₹{totalAmount}.00
            </div>
            <div style={{ fontSize: '10.5px', color: '#93c5fd' }}>
              Flat Fee (All ID Categories)
            </div>
          </div>
        </div>

        {/* Payment Details Body */}
        <div style={{ padding: '28px' }}>
          {errorMsg && (
            <div
              style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#b91c1c',
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '13px',
              }}
            >
              <AlertTriangle size={18} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Demonstration Notice */}
          <div
            style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '10px',
              padding: '12px 16px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <ShieldCheck size={22} color="#16a34a" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: '12.5px', color: '#166534' }}>
              <strong>Safe Demonstration Mode:</strong> No real bank charges or credit cards are
              required. Click the test buttons below to simulate a real payment and instantly
              generate the digital card!
            </div>
          </div>

          {/* Payment Method Tabs */}
          <div style={{ marginBottom: '20px' }}>
            <label className="form-label" style={{ fontSize: '13px', fontWeight: 700 }}>
              Select Sample Payment Method:
            </label>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '10px',
                marginTop: '8px',
              }}
            >
              <button
                type="button"
                className={`btn ${selectedMethod === 'FAST' ? 'btn-primary' : 'btn-outline'}`}
                style={{ padding: '12px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
                onClick={() => setSelectedMethod('FAST')}
              >
                <Zap size={18} />
                <span style={{ fontSize: '12.5px', fontWeight: 700 }}>1-Click Demo</span>
                <span style={{ fontSize: '10px', opacity: 0.8 }}>Fastest option</span>
              </button>

              <button
                type="button"
                className={`btn ${selectedMethod === 'UPI' ? 'btn-primary' : 'btn-outline'}`}
                style={{ padding: '12px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
                onClick={() => setSelectedMethod('UPI')}
              >
                <QrCode size={18} />
                <span style={{ fontSize: '12.5px', fontWeight: 700 }}>Sample UPI QR</span>
                <span style={{ fontSize: '10px', opacity: 0.8 }}>GPay, PhonePe, Paytm</span>
              </button>

              <button
                type="button"
                className={`btn ${selectedMethod === 'CARD' ? 'btn-primary' : 'btn-outline'}`}
                style={{ padding: '12px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
                onClick={() => setSelectedMethod('CARD')}
              >
                <CreditCard size={18} />
                <span style={{ fontSize: '12.5px', fontWeight: 700 }}>Sample Card</span>
                <span style={{ fontSize: '10px', opacity: 0.8 }}>Debit / Credit</span>
              </button>

              <button
                type="button"
                className={`btn ${selectedMethod === 'NETBANKING' ? 'btn-primary' : 'btn-outline'}`}
                style={{ padding: '12px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
                onClick={() => setSelectedMethod('NETBANKING')}
              >
                <Building size={18} />
                <span style={{ fontSize: '12.5px', fontWeight: 700 }}>Net Banking</span>
                <span style={{ fontSize: '10px', opacity: 0.8 }}>SBI, HDFC, etc.</span>
              </button>
            </div>
          </div>

          {/* METHOD 1: 1-CLICK FAST DEMO */}
          {selectedMethod === 'FAST' && (
            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '24px',
                textAlign: 'center',
                marginBottom: '24px',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: '#eff6ff',
                  color: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px',
                }}
              >
                <Zap size={28} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
                Instant Demonstration Authorization
              </h3>
              <p style={{ fontSize: '13px', color: '#64748b', maxWidth: '480px', margin: '6px auto 18px' }}>
                Click below to instantly authorize the <strong>₹100.00</strong> fee, generate receipt,
                and unlock the live digital college ID card.
              </p>

              <button
                type="button"
                className="btn btn-primary btn-lg"
                style={{ minWidth: '260px' }}
                onClick={() => handleProcessPayment(false)}
                disabled={loading}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <RefreshCw size={16} className="spin" /> {loadingStep}
                  </span>
                ) : (
                  <>⚡ Complete Payment of ₹{totalAmount}.00</>
                )}
              </button>
            </div>
          )}

          {/* METHOD 2: SAMPLE UPI / QR */}
          {selectedMethod === 'UPI' && (
            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '24px',
                textAlign: 'center',
                marginBottom: '24px',
              }}
            >
              <div
                style={{
                  background: '#ffffff',
                  display: 'inline-block',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid #cbd5e1',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                  marginBottom: '14px',
                }}
              >
                {/* Visual QR Code Representation */}
                <div
                  style={{
                    width: '160px',
                    height: '160px',
                    background: '#0f172a',
                    padding: '8px',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ width: '40px', height: '40px', background: '#ffffff', borderRadius: '4px' }} />
                    <div style={{ width: '40px', height: '40px', background: '#ffffff', borderRadius: '4px' }} />
                  </div>
                  <div style={{ color: '#ffffff', fontSize: '11px', fontWeight: 800 }}>
                    VIGNAN • UPI QR
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ width: '40px', height: '40px', background: '#ffffff', borderRadius: '4px' }} />
                    <div style={{ width: '40px', height: '40px', background: '#3b82f6', borderRadius: '4px' }} />
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>
                Scan with any UPI App or Pay to:
              </div>
              <div
                style={{
                  display: 'inline-block',
                  background: '#eff6ff',
                  color: '#1d4ed8',
                  padding: '4px 14px',
                  borderRadius: '999px',
                  fontSize: '12.5px',
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  margin: '6px 0 16px',
                }}
              >
                vignan.fees@sbi
              </div>

              <div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleProcessPayment(false)}
                  disabled={loading}
                >
                  {loading ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <RefreshCw size={16} className="spin" /> {loadingStep}
                    </span>
                  ) : (
                    <>⚡ Simulate UPI Payment Received (₹{totalAmount}.00)</>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* METHOD 3: SAMPLE CARD */}
          {selectedMethod === 'CARD' && (
            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '24px',
                marginBottom: '24px',
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Card Number (Pre-filled Test Card)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                  />
                </div>

                <div>
                  <label className="form-label">Expiry Date</label>
                  <input
                    type="text"
                    className="form-control"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                  />
                </div>

                <div>
                  <label className="form-label">CVV / CVC</label>
                  <input
                    type="password"
                    className="form-control"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ marginTop: '18px', textAlign: 'right' }}>
                <button
                  type="button"
                  className="btn btn-primary btn-block btn-lg"
                  onClick={() => handleProcessPayment(false)}
                  disabled={loading}
                >
                  {loading ? (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <RefreshCw size={16} className="spin" /> {loadingStep}
                    </span>
                  ) : (
                    <>Pay ₹{totalAmount}.00 with Card</>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* METHOD 4: NET BANKING */}
          {selectedMethod === 'NETBANKING' && (
            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '24px',
                marginBottom: '24px',
              }}
            >
              <label className="form-label">Select University Partner Bank:</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', marginTop: '8px' }}>
                {['State Bank of India', 'HDFC Bank', 'Andhra Bank / Union Bank', 'ICICI Bank'].map((b) => (
                  <button
                    key={b}
                    type="button"
                    className={`btn ${selectedBank === b ? 'btn-primary' : 'btn-outline'}`}
                    style={{ fontSize: '12.5px', padding: '10px' }}
                    onClick={() => setSelectedBank(b)}
                  >
                    {b}
                  </button>
                ))}
              </div>

              <div style={{ marginTop: '20px' }}>
                <button
                  type="button"
                  className="btn btn-primary btn-block btn-lg"
                  onClick={() => handleProcessPayment(false)}
                  disabled={loading}
                >
                  {loading ? (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <RefreshCw size={16} className="spin" /> {loadingStep}
                    </span>
                  ) : (
                    <>Authorize & Pay ₹{totalAmount}.00 via {selectedBank}</>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Bottom helper & Failure test link */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid #e2e8f0',
              paddingTop: '16px',
              fontSize: '11.5px',
              color: '#64748b',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Lock size={13} color="#16a34a" /> 256-Bit SSL Demo Sandbox Environment
            </div>

            <button
              type="button"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                fontSize: '11px',
                textDecoration: 'underline',
              }}
              onClick={() => handleProcessPayment(true)}
              title="Test payment failure handling"
            >
              Test Payment Failure Flow
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
