import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    department: { type: String, required: true },
    course: { type: String, required: true },
    year: { type: String, required: true },
    section: { type: String, default: 'A' },
    academicYear: { type: String, default: '2025 - 2026' },
    dob: { type: String },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    bloodGroup: { type: String, default: 'O+' },
    parentName: { type: String, required: true },
    parentPhone: { type: String, required: true },
    photo: { type: String },
    currentStatus: {
      type: String,
      enum: ['College Hostel', 'College Bus / Day Scholar', 'Outside Hostel / PG'],
      default: 'College Hostel',
    },
    previousStatus: {
      type: String,
      default: 'College Hostel',
    },
  },
  { timestamps: true }
);

export const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);
