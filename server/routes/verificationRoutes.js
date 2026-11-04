import express from 'express';
import {
  getPendingVerifications,
  updateVerificationStatus,
} from '../controllers/verificationController.js';

const router = express.Router();

router.get('/pending', getPendingVerifications);
router.patch('/:id/status', updateVerificationStatus);

export default router;
