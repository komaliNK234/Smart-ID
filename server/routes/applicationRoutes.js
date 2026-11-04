import express from 'express';
import {
  createApplication,
  getApplications,
  getApplicationById,
  uploadApplicationDocument,
  getFeesConfig,
  updateFees,
} from '../controllers/applicationController.js';

const router = express.Router();

router.get('/fees', getFeesConfig);
router.post('/fees', updateFees);
router.get('/', getApplications);
router.get('/:id', getApplicationById);
router.post('/', createApplication);
router.post('/:id/documents', uploadApplicationDocument);

export default router;
