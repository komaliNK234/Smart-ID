import express from 'express';
import { getStudents, getStudentById, saveStudent } from '../controllers/studentController.js';

const router = express.Router();

router.get('/', getStudents);
router.get('/:id', getStudentById);
router.post('/', saveStudent);

export default router;
