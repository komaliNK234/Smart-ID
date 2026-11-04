import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

export default function QRCode({ student, idType, size = 64 }) {
  const qrData = JSON.stringify({
    studentId: student?.studentId || 'N/A',
    name: student?.name || 'N/A',
    department: student?.department || 'N/A',
    course: student?.course || 'N/A',
    academicYear: student?.academicYear || '2025 - 2026',
    idType: idType || 'College ID',
    issuedBy: 'CampusID Verification Authority',
  });

  return (
    <div
      style={{
        background: '#ffffff',
        padding: '4px',
        borderRadius: '6px',
        display: 'inline-flex',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      }}
      title="Scan to verify student credential authenticity"
    >
      <QRCodeSVG
        value={qrData}
        size={size}
        level="M"
        includeMargin={false}
      />
    </div>
  );
}
