import { Student } from '../models/Student.js';
import { memoryStore } from '../config/store.js';
import { getDBStatus } from '../config/db.js';

export const getStudents = async (req, res, next) => {
  try {
    if (getDBStatus()) {
      const students = await Student.find().sort({ createdAt: -1 });
      return res.json({ success: true, data: students });
    }
    return res.json({ success: true, data: memoryStore.students });
  } catch (err) {
    next(err);
  }
};

export const getStudentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (getDBStatus()) {
      const student = await Student.findOne({ studentId: id });
      if (student) return res.json({ success: true, data: student });
    }
    const memStudent = memoryStore.students.find(
      (s) => s.studentId.toLowerCase() === id.toLowerCase()
    );
    if (!memStudent) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    return res.json({ success: true, data: memStudent });
  } catch (err) {
    next(err);
  }
};

export const saveStudent = async (req, res, next) => {
  try {
    const studentData = req.body;
    if (!studentData.studentId || !studentData.name) {
      return res.status(400).json({ success: false, message: 'Student ID and Name are required' });
    }

    if (getDBStatus()) {
      await Student.findOneAndUpdate(
        { studentId: studentData.studentId },
        studentData,
        { upsert: true, new: true }
      );
    }

    const idx = memoryStore.students.findIndex(
      (s) => s.studentId.toLowerCase() === studentData.studentId.toLowerCase()
    );
    if (idx >= 0) {
      memoryStore.students[idx] = { ...memoryStore.students[idx], ...studentData };
    } else {
      memoryStore.students.push(studentData);
    }

    return res.json({ success: true, data: studentData, message: 'Student details saved' });
  } catch (err) {
    next(err);
  }
};
