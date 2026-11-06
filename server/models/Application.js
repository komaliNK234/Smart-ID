import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    applicationId: { type: String, required: true, unique: true },
    studentId: { type: String, required: true },
    applicationType: {
      type: String,
      enum: ['New ID', 'Renewal', 'Replacement', 'Status Change ID'],
      default: 'New ID',
    },
    mode: {
      type: String,
      enum: ['SMART', 'COMMON'],
      default: 'SMART',
    },
    idType: {
      type: String,
      enum: ['Hosteller ID', 'Day Scholar ID', 'Common ID'],
      required: true,
    },
    idOrientation: {
      type: String,
      enum: ['vertical', 'horizontal'],
      default: 'vertical',
    },
    previousStatus: { type: String },
    currentStatus: { type: String },
    documents: [
      {
        documentType: String,
        fileName: String,
        fileSize: String,
        status: { type: String, default: 'Uploaded' },
        fileData: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    verificationStatus: {
      type: String,
      enum: ['Pending Verification', 'Verified', 'Rejected', 'Not Required'],
      default: 'Not Required',
    },
    verificationReason: { type: String, default: '' },
    feeAmount: { type: Number, required: true },
    processingFee: { type: Number, default: 10 },
    totalAmount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PAID', 'FAILED'],
      default: 'PENDING',
    },
    transactionId: { type: String },
    demoOrderId: { type: String },
    generated: { type: Boolean, default: false },
    studentData: { type: Object },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Application =
  mongoose.models.Application || mongoose.model('Application', applicationSchema);
