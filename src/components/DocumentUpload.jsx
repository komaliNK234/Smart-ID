import React, { useRef } from 'react';
import {
  FileText,
  Upload,
  CheckCircle2,
  Trash2,
  RefreshCw,
  AlertCircle,
  FileCheck,
  Sparkles,
} from 'lucide-react';

export default function DocumentUpload({
  previousStatus,
  currentStatus,
  applicationType = 'New ID',
  documents = [],
  onDocumentsChange,
}) {
  // Only ONE document is ever required: Hostel Vacated Form (for status change)
  const getRequiredDocs = () => {
    return [
      {
        id: 'Vacated College Hostel Form',
        title: '📄 College Hostel Vacated Form',
        description:
          'Signed clearance from Chief Warden confirming room surrender with zero pending dues.',
        required: true,
        icon: <FileText size={22} />,
        demoFile: 'Hostel_Vacated_Receipt_Warden_Signed.pdf',
      },
    ];
  };

  const reqDocList = getRequiredDocs();

  const handleFileUpload = (docDef, file) => {
    if (!file) return;

    const validExtensions = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!validExtensions.includes(file.type)) {
      alert('Only PDF, JPG, JPEG, and PNG documents are accepted.');
      return;
    }

    const fileSizeFormatted =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

    const newDoc = {
      documentType: docDef.id,
      fileName: file.name,
      fileSize: fileSizeFormatted,
      fileType: file.type,
      status: 'Uploaded',
      uploadedAt: new Date().toISOString(),
    };

    const updated = documents.filter((d) => d.documentType !== docDef.id);
    updated.push(newDoc);
    onDocumentsChange(updated);
  };

  const handleAttachDemo = (docDef) => {
    const demoDoc = {
      documentType: docDef.id,
      fileName: docDef.demoFile || `${docDef.id.replace(/\s+/g, '_')}.pdf`,
      fileSize: '1.2 MB',
      fileType: 'application/pdf',
      status: 'Uploaded',
      uploadedAt: new Date().toISOString(),
    };

    const updated = documents.filter((d) => d.documentType !== docDef.id);
    updated.push(demoDoc);
    onDocumentsChange(updated);
  };

  const handleRemoveDoc = (docId) => {
    const updated = documents.filter((d) => d.documentType !== docId);
    onDocumentsChange(updated);
  };

  return (
    <div className="panel-card">
      <div className="panel-title">
        <FileCheck size={20} color="#2563eb" /> Verification Documents Upload
      </div>
      <div className="panel-subtitle">
        Upload the signed Hostel Vacated Form (PDF/JPG/PNG). You may also attach a demo receipt for testing.
      </div>

      <div className="docs-list">
        {reqDocList.map((docDef) => {
          const uploadedDoc = documents.find((d) => d.documentType === docDef.id);
          const isUploaded = Boolean(uploadedDoc);

          return (
            <DocUploadItem
              key={docDef.id}
              docDef={docDef}
              uploadedDoc={uploadedDoc}
              isUploaded={isUploaded}
              onUpload={(file) => handleFileUpload(docDef, file)}
              onAttachDemo={() => handleAttachDemo(docDef)}
              onRemove={() => handleRemoveDoc(docDef.id)}
            />
          );
        })}
      </div>
    </div>
  );
}

function DocUploadItem({ docDef, uploadedDoc, isUploaded, onUpload, onAttachDemo, onRemove }) {
  const fileInputRef = useRef(null);

  const onChangeFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div className="doc-item-card">
      <input
        type="file"
        ref={fileInputRef}
        onChange={onChangeFile}
        accept=".pdf,.jpg,.jpeg,.png"
        style={{ display: 'none' }}
      />

      <div className="doc-info">
        <div
          className="doc-icon"
          style={{
            background: isUploaded ? 'var(--green-50)' : 'var(--blue-50)',
            color: isUploaded ? 'var(--green-600)' : 'var(--blue-600)',
          }}
        >
          {docDef.icon}
        </div>

        <div>
          <div className="doc-title">
            {docDef.title}
            {docDef.required ? (
              <span className="doc-badge-req">Mandatory</span>
            ) : (
              <span style={{ fontSize: '10px', color: '#64748b' }}>(Optional)</span>
            )}
          </div>
          <div className="doc-meta">{docDef.description}</div>

          {isUploaded && (
            <div
              style={{
                marginTop: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '12px',
                color: '#16a34a',
              }}
            >
              <span className="doc-status-badge doc-status-uploaded">
                <CheckCircle2 size={13} /> ✓ Uploaded &amp; Verified
              </span>
              <span style={{ color: '#475569', fontWeight: 600 }}>
                {uploadedDoc.fileName} ({uploadedDoc.fileSize})
              </span>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
        {isUploaded ? (
          <>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => fileInputRef.current?.click()}
              title="Replace this document"
            >
              <RefreshCw size={13} /> Replace
            </button>
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={onRemove}
              title="Remove document"
            >
              <Trash2 size={13} /> Remove
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={14} /> Upload File
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              style={{ borderColor: '#3b82f6', color: '#1d4ed8', background: '#eff6ff' }}
              onClick={onAttachDemo}
              title="Attach verified sample receipt for demonstration"
            >
              <Sparkles size={13} color="#2563eb" /> Demo Receipt
            </button>
          </>
        )}
      </div>
    </div>
  );
}
