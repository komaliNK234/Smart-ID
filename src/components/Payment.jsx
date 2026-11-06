import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  Building,
  CheckCircle2,
  CreditCard,
  QrCode,
  RefreshCw,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { apiRequest } from '../api';

const DEMO_METHODS = [
  { id: 'FAST', label: 'Quick demo', note: 'Complete immediately', Icon: Zap },
  { id: 'UPI', label: 'UPI demo', note: 'Simulated UPI result', Icon: QrCode },
  { id: 'CARD', label: 'Card demo', note: 'No card details needed', Icon: CreditCard },
  { id: 'NETBANKING', label: 'Bank demo', note: 'Simulated bank result', Icon: Building },
];

export default function Payment({
  application,
  onPaymentSuccess,
  onPaymentFailure,
  onBack,
}) {
  const [selectedMethod, setSelectedMethod] = useState('FAST');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!application) {
    return <div className="panel-card">No active application selected for payment.</div>;
  }

  const { applicationId, studentData, idType = 'Day Scholar ID', totalAmount = 100 } = application;
  const selectedLabel = DEMO_METHODS.find((method) => method.id === selectedMethod)?.label;

  const handleProcessPayment = async (simulateFailure = false) => {
    setLoading(true);
    setErrorMsg('');

    try {
      setLoadingStep('Creating a demo order…');
      const order = await apiRequest('/api/payment/create-order', {
        method: 'POST',
        body: JSON.stringify({ applicationId }),
      });

      setLoadingStep(simulateFailure ? 'Running the demo decline scenario…' : 'Recording demo result…');
      const result = await apiRequest('/api/payment/verify-payment', {
        method: 'POST',
        body: JSON.stringify({
          applicationId,
          orderId: order.orderId,
          paymentMethod: selectedLabel,
          forceFail: simulateFailure,
        }),
      });

      onPaymentSuccess(result.data);
    } catch (error) {
      setErrorMsg(error.message || 'Unable to complete the demo payment.');
      if (simulateFailure) {
        onPaymentFailure({ error: error.message, applicationId });
      }
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  };

  return (
    <div className="payment-page">
      <button type="button" className="btn btn-outline btn-sm" onClick={onBack} disabled={loading}>
        <ArrowLeft size={16} /> Back to application
      </button>

      <section className="panel-card payment-card">
        <div className="payment-card-header">
          <div>
            <span className="payment-mode-badge">
              <ShieldCheck size={14} /> DEMO MODE · NO REAL CHARGE
            </span>
            <h2>Campus ID fee checkout</h2>
            <p>
              {studentData?.name || 'Student'} · {studentData?.studentId || 'Registration pending'} · {idType}
            </p>
          </div>
          <div className="payment-total">
            <span>Total payable</span>
            <strong>₹{Number(totalAmount).toFixed(2)}</strong>
          </div>
        </div>

        <div className="payment-card-body">
          <div className="demo-payment-notice" role="note">
            <AlertTriangle size={18} />
            <span>
              Demonstration only. No bank, UPI app, or card is contacted and no money is transferred.
              Card or account details are never requested here.
            </span>
          </div>

          {errorMsg && (
            <div className="login-error-alert" role="alert">
              <AlertTriangle size={18} />
              <span>{errorMsg}</span>
            </div>
          )}

          <h3 className="payment-method-heading">Choose a simulated method</h3>
          <div className="demo-method-grid">
            {DEMO_METHODS.map(({ id, label, note, Icon }) => (
              <button
                key={id}
                type="button"
                className={`demo-method ${selectedMethod === id ? 'selected' : ''}`}
                onClick={() => setSelectedMethod(id)}
                aria-pressed={selectedMethod === id}
                disabled={loading}
              >
                <Icon size={20} />
                <span><strong>{label}</strong><small>{note}</small></span>
              </button>
            ))}
          </div>

          <button
            type="button"
            className="btn btn-primary btn-block btn-lg demo-pay-button"
            onClick={() => handleProcessPayment(false)}
            disabled={loading}
          >
            {loading ? (
              <><RefreshCw size={17} className="spin" /> {loadingStep}</>
            ) : (
              <><CheckCircle2 size={18} /> Complete demo payment · ₹{Number(totalAmount).toFixed(2)}</>
            )}
          </button>

          <button
            type="button"
            className="demo-failure-button"
            onClick={() => handleProcessPayment(true)}
            disabled={loading}
          >
            Test the demo failure flow
          </button>
        </div>
      </section>
    </div>
  );
}
