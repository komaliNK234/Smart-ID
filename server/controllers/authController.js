import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import { Student } from '../models/Student.js';
import { memoryStore } from '../config/store.js';
import { getDBStatus } from '../config/db.js';

const hashPassword = (password) => {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `scrypt$${salt}$${hash}`;
};

const verifyPassword = (password, passwordHash) => {
  if (!passwordHash) return false;
  const [algorithm, salt, storedHash] = passwordHash.split('$');
  if (algorithm !== 'scrypt' || !salt || !storedHash) return false;

  const expected = Buffer.from(storedHash, 'hex');
  if (expected.length !== 64) return false;
  const actual = scryptSync(password, salt, expected.length);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
};

const publicStudent = (student) => {
  const user = student?.toObject ? student.toObject() : { ...student };
  delete user.password;
  delete user.passwordHash;
  return { role: 'student', ...user };
};

const findMemoryStudent = (identifier) =>
  memoryStore.students.find(
    (student) =>
      student.studentId?.toLowerCase() === identifier ||
      student.email?.toLowerCase() === identifier
  );

const exactMatch = (value) => ({
  $regex: `^${value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`,
  $options: 'i',
});

export const login = async (req, res, next) => {
  try {
    const body = req.body || {};
    const identifier =
      typeof body.identifier === 'string' ? body.identifier.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Registration number/email and password are required.',
      });
    }

    let student;
    if (getDBStatus()) {
      student = await Student.findOne({
        $or: [{ studentId: exactMatch(identifier) }, { email: exactMatch(identifier) }],
      }).select('+passwordHash');
    } else {
      student = findMemoryStudent(identifier);
    }

    if (!student || !verifyPassword(password, student.passwordHash)) {
      return res.status(401).json({
        success: false,
        message: 'Invalid registration number/email or password.',
      });
    }

    return res.json({
      success: true,
      message: `Welcome back, ${student.name}!`,
      user: publicStudent(student),
    });
  } catch (err) {
    next(err);
  }
};

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
      dob,
      phone,
      email,
      parentName,
      parentPhone,
      currentStatus = 'College Bus / Day Scholar',
      password,
    } = req.body || {};

    const cleanId = typeof studentId === 'string' ? studentId.trim().toUpperCase() : '';
    const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const cleanName = typeof name === 'string' ? name.trim() : '';
    if (
      !cleanId ||
      !cleanName ||
      !department?.trim?.() ||
      !course?.trim?.() ||
      !phone?.trim?.() ||
      !parentName?.trim?.() ||
      !parentPhone?.trim?.() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) ||
      typeof password !== 'string' ||
      password.length < 8
    ) {
      return res.status(400).json({
        success: false,
        message: 'Enter all required student details, a valid email, and a password of at least 8 characters.',
      });
    }

    const passwordHash = hashPassword(password);
    const profile = {
      studentId: cleanId,
      name: cleanName,
      department: department.trim(),
      course: course.trim(),
      year,
      section,
      academicYear,
      dob,
      phone: phone.trim(),
      email: cleanEmail,
      parentName: parentName.trim(),
      parentPhone: parentPhone.trim(),
      currentStatus,
      previousStatus: currentStatus,
      address: '# Campus Registry, University Main Gate',
      photo: '',
    };

    let student;
    if (getDBStatus()) {
      const emailOwner = await Student.findOne({ email: exactMatch(cleanEmail) });
      if (emailOwner && emailOwner.studentId.toLowerCase() !== cleanId.toLowerCase()) {
        return res.status(409).json({
          success: false,
          message: 'An account with this email address already exists.',
        });
      }
      student = await Student.findOne({ studentId: exactMatch(cleanId) }).select('+passwordHash');
      if (student?.passwordHash) {
        return res.status(409).json({
          success: false,
          message: 'An account with this registration number already exists. Please sign in.',
        });
      }

      if (student) {
        Object.assign(student, profile, { passwordHash });
        await student.save();
      } else {
        student = await Student.create({ ...profile, passwordHash });
      }
    } else {
      const emailOwner = memoryStore.students.find(
        (existingStudent) =>
          existingStudent.email?.toLowerCase() === cleanEmail &&
          existingStudent.studentId?.toLowerCase() !== cleanId.toLowerCase()
      );
      if (emailOwner) {
        return res.status(409).json({
          success: false,
          message: 'An account with this email address already exists.',
        });
      }
      student = findMemoryStudent(cleanId.toLowerCase());
      if (student?.passwordHash) {
        return res.status(409).json({
          success: false,
          message: 'An account with this registration number already exists. Please sign in.',
        });
      }

      if (student) {
        Object.assign(student, profile, { passwordHash });
        delete student.password;
      } else {
        student = { ...profile, passwordHash };
        memoryStore.students.unshift(student);
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Student account registered successfully.',
      user: publicStudent(student),
    });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const studentId = typeof req.query.studentId === 'string' ? req.query.studentId.trim() : '';
    if (!studentId) {
      return res.status(400).json({ success: false, message: 'Student ID required.' });
    }

    const student = getDBStatus()
      ? await Student.findOne({ studentId: exactMatch(studentId) }).select('+passwordHash')
      : findMemoryStudent(studentId.toLowerCase());
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    return res.json({ success: true, user: publicStudent(student) });
  } catch (err) {
    next(err);
  }
};

export const getDemoAccounts = (req, res) => {
  const accounts = memoryStore.students.slice(0, 1004).map((student) => ({
    studentId: student.studentId,
    name: student.name,
    department: student.department,
    currentStatus: student.currentStatus,
    photo: student.photo,
  }));

  res.json({ success: true, data: accounts });
};
