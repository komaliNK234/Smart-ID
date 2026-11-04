import React from 'react';
import PhotoUpload from './PhotoUpload';
import { User, BookOpen, Hash, Phone, Mail, Droplet, Users, Calendar } from 'lucide-react';

export default function StudentForm({
  student,
  onChange,
  errors = {},
}) {
  const handleChange = (field, value) => {
    onChange({
      ...student,
      [field]: value,
    });
  };

  return (
    <div className="panel-card">
      <div className="panel-title">
        <User size={20} color="#2563eb" /> 1. Student Personal & Academic Details
      </div>
      <div className="panel-subtitle">
        Enter the official collegiate details as registered in the University Admission Database.
      </div>

      <div className="form-grid">
        {/* Photo Upload */}
        <PhotoUpload
          photo={student.photo}
          onPhotoChange={(newPhoto) => handleChange('photo', newPhoto)}
        />

        {/* Student Name */}
        <div className="form-group">
          <label className="form-label" htmlFor="student-name">
            Student Full Name <span className="required">*</span>
          </label>
          <input
            id="student-name"
            type="text"
            className={`form-control ${errors.name ? 'error' : ''}`}
            placeholder="e.g. Aarav Sharma"
            value={student.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

        {/* Student ID / Roll Number */}
        <div className="form-group">
          <label className="form-label" htmlFor="student-id">
            Student ID / Roll Number <span className="required">*</span>
          </label>
          <input
            id="student-id"
            type="text"
            className={`form-control ${errors.studentId ? 'error' : ''}`}
            placeholder="e.g. 22CS084"
            value={student.studentId || ''}
            onChange={(e) => handleChange('studentId', e.target.value.toUpperCase())}
          />
          {errors.studentId && <span className="error-text">{errors.studentId}</span>}
        </div>

        {/* Department */}
        <div className="form-group">
          <label className="form-label" htmlFor="student-dept">
            Department <span className="required">*</span>
          </label>
          <select
            id="student-dept"
            className={`form-control ${errors.department ? 'error' : ''}`}
            value={student.department || ''}
            onChange={(e) => handleChange('department', e.target.value)}
          >
            <option value="">Select Department</option>
            <option value="Computer Science & Engineering">Computer Science & Engineering</option>
            <option value="Electronics & Communication">Electronics & Communication</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Mechanical Engineering">Mechanical Engineering</option>
            <option value="Electrical & Electronics">Electrical & Electronics</option>
            <option value="Civil Engineering">Civil Engineering</option>
            <option value="Management Studies (MBA)">Management Studies (MBA)</option>
          </select>
          {errors.department && <span className="error-text">{errors.department}</span>}
        </div>

        {/* Course */}
        <div className="form-group">
          <label className="form-label" htmlFor="student-course">
            Course / Degree <span className="required">*</span>
          </label>
          <input
            id="student-course"
            type="text"
            className={`form-control ${errors.course ? 'error' : ''}`}
            placeholder="e.g. B.Tech CSE"
            value={student.course || ''}
            onChange={(e) => handleChange('course', e.target.value)}
          />
          {errors.course && <span className="error-text">{errors.course}</span>}
        </div>

        {/* Year */}
        <div className="form-group">
          <label className="form-label" htmlFor="student-year">
            Year of Study <span className="required">*</span>
          </label>
          <select
            id="student-year"
            className="form-control"
            value={student.year || 'III Year'}
            onChange={(e) => handleChange('year', e.target.value)}
          >
            <option value="I Year">I Year</option>
            <option value="II Year">II Year</option>
            <option value="III Year">III Year</option>
            <option value="IV Year">IV Year</option>
          </select>
        </div>

        {/* Section */}
        <div className="form-group">
          <label className="form-label" htmlFor="student-section">
            Section
          </label>
          <select
            id="student-section"
            className="form-control"
            value={student.section || 'A'}
            onChange={(e) => handleChange('section', e.target.value)}
          >
            <option value="A">Section A</option>
            <option value="B">Section B</option>
            <option value="C">Section C</option>
            <option value="D">Section D</option>
          </select>
        </div>

        {/* Academic Year */}
        <div className="form-group">
          <label className="form-label" htmlFor="student-ay">
            Academic Year
          </label>
          <input
            id="student-ay"
            type="text"
            className="form-control"
            value={student.academicYear || '2025 - 2026'}
            onChange={(e) => handleChange('academicYear', e.target.value)}
          />
        </div>

        {/* Date of Birth */}
        <div className="form-group">
          <label className="form-label" htmlFor="student-dob">
            Date of Birth <span className="required">*</span>
          </label>
          <input
            id="student-dob"
            type="date"
            className={`form-control ${errors.dob ? 'error' : ''}`}
            value={student.dob || ''}
            onChange={(e) => handleChange('dob', e.target.value)}
          />
          {errors.dob && <span className="error-text">{errors.dob}</span>}
        </div>

        {/* Phone Number */}
        <div className="form-group">
          <label className="form-label" htmlFor="student-phone">
            Student Phone Number <span className="required">*</span>
          </label>
          <input
            id="student-phone"
            type="tel"
            className={`form-control ${errors.phone ? 'error' : ''}`}
            placeholder="e.g. 9618112688"
            value={student.phone || ''}
            onChange={(e) => handleChange('phone', e.target.value)}
          />
          {errors.phone && <span className="error-text">{errors.phone}</span>}
        </div>

        {/* Email */}
        <div className="form-group">
          <label className="form-label" htmlFor="student-email">
            College Email <span className="required">*</span>
          </label>
          <input
            id="student-email"
            type="email"
            className={`form-control ${errors.email ? 'error' : ''}`}
            placeholder="e.g. 241fa18059@vignan.ac.in"
            value={student.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        {/* Father / Parent Name */}
        <div className="form-group">
          <label className="form-label" htmlFor="student-parent">
            Father / Parent Name <span className="required">*</span>
          </label>
          <input
            id="student-parent"
            type="text"
            className={`form-control ${errors.parentName ? 'error' : ''}`}
            placeholder="e.g. KOTHA BHASKAR RAO"
            value={student.parentName || ''}
            onChange={(e) => handleChange('parentName', e.target.value)}
          />
          {errors.parentName && <span className="error-text">{errors.parentName}</span>}
        </div>

        {/* Parent Phone */}
        <div className="form-group">
          <label className="form-label" htmlFor="student-parent-phone">
            Parent / Emergency Phone <span className="required">*</span>
          </label>
          <input
            id="student-parent-phone"
            type="tel"
            className={`form-control ${errors.parentPhone ? 'error' : ''}`}
            placeholder="e.g. 9618112688"
            value={student.parentPhone || ''}
            onChange={(e) => handleChange('parentPhone', e.target.value)}
          />
          {errors.parentPhone && <span className="error-text">{errors.parentPhone}</span>}
        </div>

        {/* Permanent Residential Address (Printed on Back of ID) */}
        <div className="form-group full-width">
          <label className="form-label" htmlFor="student-address">
            Residential Address (Printed on Card Back) <span className="required">*</span>
          </label>
          <input
            id="student-address"
            type="text"
            className="form-control"
            placeholder="e.g. # 2134, Brahmamgari Street, Yerragonda Palem, Prakasam(Dist) - 523327"
            value={student.address || ''}
            onChange={(e) => handleChange('address', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
