import React, { useRef } from 'react';
import { Camera, Upload, Trash2, RefreshCw } from 'lucide-react';

export default function PhotoUpload({ photo, onPhotoChange }) {
  const fileInputRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type: JPG, JPEG, PNG
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid JPG, JPEG, or PNG image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      onPhotoChange(uploadEvent.target?.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    onPhotoChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="form-group full-width">
      <label className="form-label">
        Student Profile Photo <span className="required">*</span>
      </label>

      <div className="photo-upload-container">
        <div className="photo-preview-box">
          {photo ? (
            <img src={photo} alt="Student Preview" className="photo-preview-img" />
          ) : (
            <div style={{ textAlign: 'center', color: '#94a3b8' }}>
              <Camera size={26} />
              <div style={{ fontSize: '9px', marginTop: '4px' }}>No Photo</div>
            </div>
          )}
        </div>

        <div className="photo-actions">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFile}
            accept=".jpg,.jpeg,.png"
            style={{ display: 'none' }}
            id="student-photo-file-input"
          />

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => fileInputRef.current?.click()}
            >
              {photo ? (
                <>
                  <RefreshCw size={13} /> Replace Photo
                </>
              ) : (
                <>
                  <Upload size={13} /> Upload Photo
                </>
              )}
            </button>

            {photo && (
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={handleRemove}
              >
                <Trash2 size={13} /> Remove
              </button>
            )}
          </div>

          <div className="photo-help">
            Passport format (35x45mm recommended). JPG, JPEG, or PNG up to 5MB.
          </div>
        </div>
      </div>
    </div>
  );
}
