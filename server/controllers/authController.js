import { Student } from '../models/Student.js';
import { memoryStore } from '../config/store.js';
import { getDBStatus } from '../config/db.js';

// Login handler for students and administrators
export const login = async (req, res, next) => {
  try {
    const { identifier, password, role = 'student' } = req.body;

    if (!identifier) {
      return res.status(400).json({
        success: false,
        message: 'Student Roll No / ID or Username is required',
      });
    }

    // 1. Admin Login
    if (role === 'admin' || identifier.toLowerCase() === 'admin') {
      const validAdminPass = !password || password === 'admin123' || password === 'admin';
      if (!validAdminPass) {
        return res.status(401).json({
          success: false,
          message: 'Invalid administrator password. (Default: admin123)',
        });
      }

      return res.json({
        success: true,
        message: 'Administrator authentication successful',
        user: {
          role: 'admin',
          username: 'admin',
          name: 'Administrative Officer',
          title: 'Chief Identity Officer',
          department: 'Campus Security & Identity Authority',
          email: 'admin.id@vignan.ac.in',
        },
      });
    }

    // 2. Student Login
    let student = null;
    const cleanId = identifier.trim().toLowerCase();

    if (getDBStatus()) {
      try {
        student = await Student.findOne({
          $or: [
            { studentId: { $regex: new RegExp(`^${cleanId}$`, 'i') } },
            { email: { $regex: new RegExp(`^${cleanId}$`, 'i') } },
          ],
        });
      } catch (err) {
        student = null;
      }
    }

    if (!student) {
      student = memoryStore.students.find(
        (s) =>
          s.studentId.toLowerCase() === cleanId ||
          s.email?.toLowerCase() === cleanId
      );
    }

    if (!student) {
      // Auto-create account for any new student registration number
      const upperRegNo = identifier.trim().toUpperCase();
      student = {
        studentId: upperRegNo,
        name: `STUDENT ${upperRegNo}`,
        department: 'Computer Science & Engineering',
        course: 'B.TECH',
        year: 'I Year',
        section: '1',
        academicYear: '2024 - 2028',
        dob: '2006-08-15',
        phone: '9848012345',
        email: `${upperRegNo.toLowerCase()}@vignan.ac.in`,
        parentName: 'GUARDIAN',
        parentPhone: '9848012345',
        address: '# Campus Registry, Vadlamudi, Guntur - 522213',
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        currentStatus: 'College Bus / Day Scholar',
        previousStatus: 'College Bus / Day Scholar',
        password: password || 'student123',
      };
      memoryStore.students.unshift(student);
      if (getDBStatus()) {
        try {
          await Student.create(student);
        } catch (e) {}
      }
    }

    // Password validation (default to student123 or matches DOB if set)
    const expectedPassword = student.password || 'student123';
    const isValidPassword =
      !password ||
      password === expectedPassword ||
      password === 'student123' ||
      password === student.dob;

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect password. Default demo password is "student123".',
      });
    }

    // Return authenticated student data
    return res.json({
      success: true,
      message: `Welcome back, ${student.name}!`,
      user: {
        role: 'student',
        ...student,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Register a new student account
export const register = async (req, res, next) => {
  try {
    const {
      studentId,
      name,
      department,
      course,
      year = 'I Year',
      section = '1',
      academicYear = '2025 - 2029',
      dob = '2006-01-01',
      phone,
      email,
      parentName,
      parentPhone,
      currentStatus = 'College Bus / Day Scholar',
      password = 'student123',
    } = req.body;

    if (!studentId || !name || !department || !email) {
      return res.status(400).json({
        success: false,
        message: 'Roll Number, Full Name, Department, and Email are required.',
      });
    }

    const cleanId = studentId.trim();

    // Check duplicate in memoryStore
    const existing = memoryStore.students.find(
      (s) => s.studentId.toLowerCase() === cleanId.toLowerCase()
    );

    if (existing) {
      return res.status(400).json({
        success: false,
        message: `A student account with Roll Number "${cleanId}" already exists. Please log in instead.`,
      });
    }

    const newStudent = {
      studentId: cleanId.toUpperCase(),
      name: name.trim().toUpperCase(),
      department,
      course,
      year,
      section,
      academicYear,
      dob,
      phone: phone || '9999999999',
      email: email.trim().toLowerCase(),
      parentName: parentName || 'Guardian',
      parentPhone: parentPhone || phone || '9999999999',
      address: '# Campus Registry, University Main Gate',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      currentStatus,
      previousStatus: currentStatus,
      password,
    };

    if (getDBStatus()) {
      try {
        await Student.create(newStudent);
      } catch (err) {
        console.warn('DB student insert fallback to memoryStore');
      }
    }

    memoryStore.students.unshift(newStudent);

    return res.status(201).json({
      success: true,
      message: 'Student account registered successfully!',
      user: {
        role: 'student',
        ...newStudent,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Current Session info
export const getMe = (req, res) => {
  const { studentId } = req.query;
  if (!studentId) {
    return res.status(400).json({ success: false, message: 'Student ID required' });
  }

  const student = memoryStore.students.find(
    (s) => s.studentId.toLowerCase() === studentId.trim().toLowerCase()
  );

  if (!student) {
    return res.status(404).json({ success: false, message: 'Student not found' });
  }

  return res.json({
    success: true,
    user: {
      role: 'student',
      ...student,
    },
  });
};

// Quick list of sample accounts for testing
export const getDemoAccounts = (req, res) => {
  const accounts = memoryStore.students.map((s) => ({
    studentId: s.studentId,
    name: s.name,
    department: s.department,
    currentStatus: s.currentStatus,
    photo: s.photo,
  }));

  res.json({
    success: true,
    data: accounts,
    admin: { username: 'admin', defaultPass: 'admin123' },
  });
};

