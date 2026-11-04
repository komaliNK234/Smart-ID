import express from 'express';
import {
  createOrder,
  verifyPayment,
  getPaymentHistory,
} from '../controllers/paymentController.js';

const router = express.Router();

router.post('/create-order', createOrder);
router.post('/verify-payment', verifyPayment);
router.get('/history', getPaymentHistory);

export default router;
