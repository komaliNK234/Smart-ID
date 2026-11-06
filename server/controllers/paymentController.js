import { randomBytes } from 'crypto';
import { memoryStore, generateTxnId } from '../config/store.js';
import { Application } from '../models/Application.js';
import { Payment } from '../models/Payment.js';
import { getDBStatus } from '../config/db.js';

const findApplication = async (applicationId) => {
  if (getDBStatus()) {
    const application = await Application.findOne({ applicationId });
    if (application) return application;
  }
  return memoryStore.applications.find(
    (application) =>
      application.applicationId?.toLowerCase() === applicationId.toLowerCase()
  );
};

const saveApplication = async (application, updates) => {
  Object.assign(application, updates);
  if (getDBStatus()) {
    await Application.updateOne(
      { applicationId: application.applicationId },
      { $set: updates }
    );
  }
};

export const createOrder = async (req, res, next) => {
  try {
    const body = req.body || {};
    const applicationId =
      typeof body.applicationId === 'string' ? body.applicationId.trim() : '';
    if (!applicationId) {
      return res.status(400).json({
        success: false,
        message: 'Application ID is required.',
      });
    }

    const application = await findApplication(applicationId);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }
    if (application.verificationStatus === 'Pending Verification') {
      return res.status(403).json({
        success: false,
        message: 'Payment is unavailable until application documents are verified.',
      });
    }
    if (application.verificationStatus === 'Rejected') {
      return res.status(403).json({
        success: false,
        message: 'Payment is unavailable because the application was rejected.',
      });
    }
    if (application.paymentStatus === 'PAID') {
      return res.status(409).json({
        success: false,
        message: 'This application has already been paid.',
      });
    }

    const orderId =
      application.paymentStatus !== 'FAILED' && application.demoOrderId
        ? application.demoOrderId
        : `DEMO_ORDER_${Date.now()}_${randomBytes(4).toString('hex')}`;
    await saveApplication(application, {
      demoOrderId: orderId,
      paymentStatus: 'PENDING',
    });

    return res.json({
      success: true,
      orderId,
      amount: Math.round(Number(application.totalAmount || 100) * 100),
      currency: 'INR',
      isSimulated: true,
      paymentMode: 'DEMO',
      application,
      message: 'Demo order created. No money will be moved.',
    });
  } catch (err) {
    next(err);
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const body = req.body || {};
    const applicationId =
      typeof body.applicationId === 'string' ? body.applicationId.trim() : '';
    const orderId = typeof body.orderId === 'string' ? body.orderId.trim() : '';
    const paymentMethod =
      typeof body.paymentMethod === 'string'
        ? body.paymentMethod.trim()
        : 'Demo checkout';

    if (!applicationId || !orderId) {
      return res.status(400).json({
        success: false,
        message: 'Application ID and demo order ID are required.',
      });
    }

    const application = await findApplication(applicationId);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    if (application.demoOrderId !== orderId || !orderId.startsWith('DEMO_ORDER_')) {
      return res.status(400).json({
        success: false,
        message: 'Demo order is invalid or has expired. Create a new order and try again.',
      });
    }

    if (application.paymentStatus === 'PAID') {
      let payment = memoryStore.payments.find(
        (record) => record.applicationId === application.applicationId
      );
      if (!payment && getDBStatus()) {
        payment = await Payment.findOne({ applicationId: application.applicationId });
      }
      if (payment) {
        return res.json({
          success: true,
          message: 'This demo order has already been completed.',
          data: { payment, application },
        });
      }
      return res.status(409).json({
        success: false,
        message: 'Application is already marked paid.',
      });
    }

    if (application.verificationStatus === 'Pending Verification' ||
        application.verificationStatus === 'Rejected') {
      return res.status(403).json({
        success: false,
        message: 'Application is not cleared for payment.',
      });
    }

    if (body.forceFail === true) {
      await saveApplication(application, {
        paymentStatus: 'FAILED',
        demoOrderId: null,
      });
      return res.status(402).json({
        success: false,
        message: 'Demo failure scenario selected. No payment was made.',
      });
    }

    const transactionId = generateTxnId();
    const paymentRecord = {
      transactionId,
      applicationId: application.applicationId,
      studentId: application.studentId,
      studentName: application.studentData?.name || 'Student',
      idType: application.idType,
      amount: Number(application.totalAmount || 100),
      currency: 'INR',
      paymentMethod: `Demo: ${paymentMethod}`,
      paymentMode: 'DEMO',
      status: 'SUCCESS',
      receiptNumber: `DEMO-RCPT-${new Date().getFullYear()}-${transactionId.slice(-4)}`,
      createdAt: new Date(),
    };

    if (getDBStatus()) {
      await Payment.create(paymentRecord);
    }
    memoryStore.payments.unshift(paymentRecord);

    await saveApplication(application, {
      paymentStatus: 'PAID',
      transactionId,
      generated: true,
    });

    return res.json({
      success: true,
      message: 'Demo payment completed. No funds were transferred.',
      data: { payment: paymentRecord, application },
    });
  } catch (err) {
    next(err);
  }
};

export const getPaymentHistory = async (req, res, next) => {
  try {
    const { studentId } = req.query;
    let list = memoryStore.payments;

    if (getDBStatus()) {
      list = await Payment.find().sort({ createdAt: -1 });
    }

    if (studentId) {
      list = list.filter(
        (payment) =>
          payment.studentId?.toLowerCase() === String(studentId).toLowerCase()
      );
    }

    return res.json({ success: true, count: list.length, data: list });
  } catch (err) {
    next(err);
  }
};
