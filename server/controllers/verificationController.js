import { Application } from '../models/Application.js';
import { memoryStore } from '../config/store.js';
import { getDBStatus } from '../config/db.js';

export const getPendingVerifications = async (req, res, next) => {
  try {
    let apps = memoryStore.applications;
    if (getDBStatus()) {
      try {
        apps = await Application.find().sort({ createdAt: -1 });
      } catch (e) {
        apps = memoryStore.applications;
      }
    }

    const pending = apps.filter(
      (a) => a.verificationStatus === 'Pending Verification'
    );

    return res.json({ success: true, count: pending.length, data: pending });
  } catch (err) {
    next(err);
  }
};

export const updateVerificationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { action, reason } = req.body; // action: 'approve' | 'reject'

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

    if (action === 'approve') {
      app.verificationStatus = 'Verified';
      app.verificationReason = '';
      if (app.documents && app.documents.length) {
        app.documents.forEach((d) => (d.status = 'Verified'));
      }
    } else if (action === 'reject') {
      app.verificationStatus = 'Rejected';
      app.verificationReason = reason || 'Documentation does not meet verification requirements.';
      if (app.documents && app.documents.length) {
        app.documents.forEach((d) => (d.status = 'Rejected'));
      }
    } else {
      return res.status(400).json({ success: false, message: 'Invalid action. Must be approve or reject.' });
    }

    if (getDBStatus()) {
      await Application.updateOne(
        { applicationId: app.applicationId },
        {
          verificationStatus: app.verificationStatus,
          verificationReason: app.verificationReason,
          documents: app.documents,
        }
      );
    }

    return res.json({
      success: true,
      data: app,
      message: `Application ${action === 'approve' ? 'Approved' : 'Rejected'} successfully`,
    });
  } catch (err) {
    next(err);
  }
};
