import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
  {
    documentId: { type: String, required: true },
    applicationId: { type: String, required: true },
    studentId: { type: String, required: true },
    documentType: { type: String, required: true },
    fileName: { type: String, required: true },
    fileSize: { type: String },
    fileType: { type: String },
    fileData: { type: String },
    status: {
      type: String,
      enum: ['Uploaded', 'Pending Verification', 'Verified', 'Rejected'],
      default: 'Uploaded',
    },
    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Document =
  mongoose.models.Document || mongoose.model('Document', documentSchema);
