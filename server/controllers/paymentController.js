import { memoryStore, generateTxnId } from '../config/store.js';
import { Application } from '../models/Application.js';
import { Payment } from '../models/Payment.js';
import { getDBStatus } from '../config/db.js';

// 1. Create Sample / Demo Order
export const createOrder = async (req, res, next) => {
  try {
    const { applicationId } = req.body;

    if (!applicationId) {
      return res.status(400).json({ success: false, message: 'Application ID is required' });
    }

    const app = memoryStore.applications.find(
      (a) => a.applicationId.toLowerCase() === applicationId.toLowerCase()
    );

    if (!app) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Verification check: if documents are pending, do not allow payment order creation
    if (app.verificationStatus === 'Pending Verification') {
      return res.status(403).json({
        success: false,
        message: 'Cannot proceed to payment: Application documents are pending verification.',
      });
    }

    if (app.verificationStatus === 'Rejected') {
      return res.status(403).json({
        success: false,
        message: 'Cannot proceed to payment: Application was rejected.',
      });
    }

    // Uniform Flat Fee: ₹100
    const totalAmount = app.totalAmount || 100;
    const mockOrderId = `VIGNAN_ORDER_${Date.now()}`;

    return res.json({
      success: true,
      orderId: mockOrderId,
      amount: totalAmount * 100,
      currency: 'INR',
      keyId: 'sample_demo_mode',
      isSimulated: true,
      application: app,
      message: 'Demo payment order created successfully.',
    });
  } catch (err) {
    next(err);
  }
};

// 2. Verify / Process Sample Payment
export const verifyPayment = async (req, res, next) => {
  try {
    const {
      applicationId,
      paymentMethod = 'Sample Demo Payment',
      forceFail = false,
    } = req.body;

    if (!applicationId) {
      return res.status(400).json({ success: false, message: 'Application ID is required' });
    }

    const app = memoryStore.applications.find(
      (a) => a.applicationId.toLowerCase() === applicationId.toLowerCase()
    );

    if (!app) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    if (forceFail) {
      app.paymentStatus = 'FAILED';
      return res.status(400).json({
        success: false,
        message: 'Payment simulation: transaction was declined by bank or user.',
      });
    }

    // Success! Update application and unlock Digital ID generation
    const transactionId = generateTxnId();
    app.paymentStatus = 'PAID';
    app.transactionId = transactionId;
    app.generated = true; // Digital ID generation unlocked!

    const paymentRecord = {
      transactionId,
      applicationId: app.applicationId,
      studentId: app.studentId,
      studentName: app.studentData?.name || 'Student',
      idType: app.idType,
      amount: app.totalAmount || 100,
      currency: 'INR',
      paymentMethod,
      status: 'SUCCESS',
      receiptNumber: `VIGNAN-RCPT-${new Date().getFullYear()}-${transactionId.slice(-4)}`,
      createdAt: new Date(),
    };

    memoryStore.payments.unshift(paymentRecord);

    if (getDBStatus()) {
      await Application.updateOne(
        { applicationId: app.applicationId },
        {
          paymentStatus: 'PAID',
          transactionId,
          generated: true,
        }
      );
      await Payment.create(paymentRecord);
    }

    return res.json({
      success: true,
      message: 'Sample payment completed successfully and ID generated.',
      data: {
        payment: paymentRecord,
        application: app,
      },
    });
  } catch (err) {
    next(err);
  }
};

// 3. Payment History
export const getPaymentHistory = async (req, res, next) => {
  try {
    const { studentId } = req.query;
    let list = memoryStore.payments;

    if (getDBStatus()) {
      try {
        list = await Payment.find().sort({ createdAt: -1 });
      } catch (e) {
        list = memoryStore.payments;
      }
    }

    if (studentId) {
      list = list.filter((p) => p.studentId.toLowerCase() === studentId.toLowerCase());
    }

    return res.json({ success: true, count: list.length, data: list });
  } catch (err) {
    next(err);
  }
};
