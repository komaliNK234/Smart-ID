import { Application } from '../models/Application.js';
import { memoryStore, generateAppId } from '../config/store.js';
import { calculateFee, feeConfig, updateFeeConfig } from '../config/fees.js';
import { getDBStatus } from '../config/db.js';

export const getFeesConfig = (req, res) => {
  res.json({ success: true, data: feeConfig });
};

export const updateFees = (req, res) => {
  const updated = updateFeeConfig(req.body);
  res.json({ success: true, data: updated, message: 'Fee configuration updated' });
};

export const createApplication = async (req, res, next) => {
  try {
    const body = req.body || {};
    const {
      studentId,
      studentData,
      applicationType = 'New ID',
      mode = 'SMART',
      currentStatus = 'College Hostel',
      previousStatus = 'College Hostel',
      idOrientationChoice = 'horizontal',
      documents = [],
    } = body;

    if (!studentId || !studentData || !studentData.name) {
      return res.status(400).json({
        success: false,
        message: 'Student ID and full student data are required to apply.',
      });
    }

    let idType = 'Hosteller ID';
    let idOrientation = 'vertical';
    let verificationStatus = 'Not Required';
    let appType = applicationType;

    const isStatusChange =
      applicationType === 'Status Change ID' ||
      (previousStatus === 'College Hostel' && currentStatus !== 'College Hostel');

    if (mode === 'COMMON') {
      idType = 'Common ID';
      idOrientation = idOrientationChoice === 'vertical' ? 'vertical' : 'horizontal';
      if (isStatusChange) {
        appType = 'Status Change ID';
        verificationStatus = 'Pending Verification';
      } else {
        verificationStatus = 'Not Required';
      }
    } else {
      // SMART MODE RULES
      if (isStatusChange) {
        appType = 'Status Change ID';
        verificationStatus = 'Pending Verification';
      }

      if (currentStatus === 'College Hostel') {
        idType = 'Hosteller ID';
        idOrientation = 'vertical';
      } else {
        idType = 'Day Scholar ID';
        idOrientation = 'horizontal';
      }
    }

    // Backend authoritative fee calculation
    const feeInfo = calculateFee(appType);
    const applicationId = generateAppId();

    const applicationPayload = {
      applicationId,
      studentId,
      studentData: {
        ...studentData,
        currentStatus,
        previousStatus,
      },
      applicationType: appType,
      mode,
      idType,
      idOrientation,
      previousStatus,
      currentStatus,
      documents: documents || [],
      verificationStatus,
      verificationReason: '',
      feeAmount: feeInfo.baseFee,
      processingFee: feeInfo.processingFee,
      totalAmount: feeInfo.total,
      paymentStatus: 'PENDING',
      transactionId: null,
      generated: false,
      createdAt: new Date(),
    };

    if (getDBStatus()) {
      await Application.create(applicationPayload);
    }
    memoryStore.applications.unshift(applicationPayload);

    return res.status(201).json({
      success: true,
      data: applicationPayload,
      message: 'Application created successfully',
    });
  } catch (err) {
    next(err);
  }
};

export const getApplications = async (req, res, next) => {
  try {
    const { status, filter, studentId } = req.query;

    let apps = memoryStore.applications;
    if (getDBStatus()) {
      try {
        apps = await Application.find().sort({ createdAt: -1 });
      } catch (e) {
        apps = memoryStore.applications;
      }
    }

    let filtered = [...apps];

    if (studentId) {
      filtered = filtered.filter(
        (a) => a.studentId.toLowerCase() === studentId.toLowerCase()
      );
    }

    if (filter && filter !== 'All') {
      const f = filter.toLowerCase();
      if (f === 'pending') {
        filtered = filtered.filter(
          (a) =>
            a.verificationStatus === 'Pending Verification' ||
            a.paymentStatus === 'PENDING'
        );
      } else if (f === 'verified') {
        filtered = filtered.filter(
          (a) => a.verificationStatus === 'Verified'
        );
      } else if (f === 'rejected') {
        filtered = filtered.filter(
          (a) => a.verificationStatus === 'Rejected'
        );
      } else if (f === 'paid') {
        filtered = filtered.filter((a) => a.paymentStatus === 'PAID');
      } else if (f === 'completed') {
        filtered = filtered.filter(
          (a) => a.paymentStatus === 'PAID' && a.generated === true
        );
      }
    }

    return res.json({ success: true, count: filtered.length, data: filtered });
  } catch (err) {
    next(err);
  }
};

export const getApplicationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let app = null;

    if (getDBStatus()) {
      app = await Application.findOne({ applicationId: id });
    }
    if (!app) {
      app = memoryStore.applications.find(
        (a) => a.applicationId.toLowerCase() === id.toLowerCase()
      );
    }

    if (!app) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    return res.json({ success: true, data: app });
  } catch (err) {
    next(err);
  }
};

export const uploadApplicationDocument = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { documentType, fileName, fileSize, fileData } = req.body;

    let app = null;
    if (getDBStatus()) {
      app = await Application.findOne({ applicationId: id });
    }
    if (!app) {
      app = memoryStore.applications.find(
        (a) => a.applicationId.toLowerCase() === id.toLowerCase()
      );
    }

    if (!app) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    const docObj = {
      documentType,
      fileName,
      fileSize: fileSize || '1.2 MB',
      fileData: fileData || '',
      status: 'Uploaded',
      uploadedAt: new Date(),
    };

    app.documents = app.documents || [];
    const existingIdx = app.documents.findIndex((d) => d.documentType === documentType);
    if (existingIdx >= 0) {
      app.documents[existingIdx] = docObj;
    } else {
      app.documents.push(docObj);
    }

    if (getDBStatus()) {
      await Application.updateOne(
        { applicationId: app.applicationId },
        { documents: app.documents }
      );
    }

    return res.json({
      success: true,
      data: app,
      message: `${documentType} uploaded successfully`,
    });
  } catch (err) {
    next(err);
  }
};
