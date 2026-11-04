import React, { useState } from 'react';
import IDCardFront from './IDCardFront';
import IDCardBack from './IDCardBack';
import { RotateCw, Sparkles } from 'lucide-react';

export default function IDCard({
  student,
  mode = 'SMART',
  idType,
  idOrientation,
  allowFlip = true,
}) {
  const [isFlipped, setIsFlipped] = useState(false);

  // AUTO-DETERMINE orientation from idType / student status (NO manual choice)
  // Hosteller → Vertical (Green), Day Scholar / Outside PG → Horizontal (Blue)
  const isHosteller =
    idType === 'Hosteller ID' ||
    student?.currentStatus === 'College Hostel';

  const frontOrientation = isHosteller ? 'vertical' : 'horizontal';

  // Dynamic dimensions: Front follows status-based orientation; Back is ALWAYS Horizontal
  const cardWidth = isFlipped
    ? '440px'
    : frontOrientation === 'vertical'
    ? '320px'
    : '440px';

  const cardHeight = isFlipped
    ? '275px'
    : frontOrientation === 'vertical'
    ? '500px'
    : '275px';

  return (
    <div className="id-card-preview-wrapper">
      {allowFlip && (
        <div className="id-preview-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700 }}>
            <Sparkles size={16} color="#2563eb" /> Live Digital ID Preview
          </div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>
            {isFlipped
              ? 'Back Side (Horizontal)'
              : `Front Side (${frontOrientation} • ${isHosteller ? '🟢 Green' : '🔵 Blue'})`}
          </div>
        </div>
      )}

      {/* 3D Flip Card Container */}
      <div className="card-scene">
        <div
          className={`card-flipper ${isFlipped ? 'is-flipped' : ''}`}
          style={{
            width: cardWidth,
            height: cardHeight,
            transition: 'width 0.3s ease, height 0.3s ease, transform 0.6s',
          }}
        >
          {/* Front Face: auto-orientation based on status */}
          <div className="card-face card-face-front">
            <IDCardFront
              student={student}
              mode={mode}
              idType={idType}
              idOrientation={frontOrientation}
            />
          </div>

          {/* Back Face: ALWAYS Horizontal */}
          <div className="card-face card-face-back">
            <IDCardBack student={student} />
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '12px' }}>
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={() => setIsFlipped(!isFlipped)}
          style={{ fontSize: '11px', padding: '5px 12px' }}
        >
          <RotateCw size={12} /> {isFlipped ? 'View Front' : 'View Back'}
        </button>
      </div>
    </div>
  );
}
