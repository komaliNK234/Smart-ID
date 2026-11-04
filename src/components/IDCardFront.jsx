import React from 'react';

export default function IDCardFront({ student, mode, idType, idOrientation = 'vertical' }) {
  const photoUrl =
    student?.photo ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';

  const studentName = (student?.name || 'KOTHA BHAVYA SREE').toUpperCase();
  const rollNumber = (student?.studentId || '241FA18059').toUpperCase();
  const courseDetails =
    student?.course && student?.section
      ? `${student.course.toUpperCase()} Sec - ${student.section}`
      : student?.course?.toUpperCase() || 'B.TECH ACSE - AI&ML Sec - 25';
  const batchYears = student?.academicYear || '2024 - 2028';

  // Determine if hosteller (green) or day scholar/other (blue)
  const isHosteller =
    idType === 'Hosteller ID' ||
    student?.currentStatus === 'College Hostel';

  // Green theme for Hosteller, Blue theme for Day Scholar / PG
  const headerBg = isHosteller
    ? 'linear-gradient(135deg, #14532d 0%, #16a34a 100%)'
    : 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)';
  const accentColor = isHosteller ? '#16a34a' : '#2563eb';
  const badgeBg = isHosteller ? '#dcfce7' : '#dbeafe';
  const badgeColor = isHosteller ? '#14532d' : '#1e40af';
  const logoStroke = isHosteller ? '#16a34a' : '#0056b3';
  const sigStroke = isHosteller ? '#16a34a' : '#0056b3';
  const watermarkStroke = isHosteller ? '#16a34a' : '#0056b3';
  const cardBorder = isHosteller ? '3px solid #16a34a' : '3px solid #2563eb';

  const isVertical = idOrientation === 'vertical';

  if (isVertical) {
    return (
      <div className="vignan-card-vertical" id="campus-id-front" style={{ border: cardBorder }}>
        {/* Top Header */}
        <div className="vignan-front-header" style={{ background: headerBg }}>
          <div className="vignan-brand-row">
            <div className="vignan-logo-shield">
              <svg width="34" height="38" viewBox="0 0 100 115" fill="none">
                <path
                  d="M50 5 L90 20 L90 65 C90 90 50 110 50 110 C50 110 10 90 10 65 L10 20 Z"
                  fill="#ffffff"
                  stroke={logoStroke}
                  strokeWidth="6"
                />
                <circle cx="50" cy="55" r="24" stroke={logoStroke} strokeWidth="5" fill="none" />
                <path
                  d="M50 31 L50 79 M26 55 L74 55 M33 38 L67 72 M33 72 L67 38"
                  stroke={logoStroke}
                  strokeWidth="4"
                />
                <circle cx="50" cy="55" r="8" fill="#e11d48" />
              </svg>
            </div>

            <div className="vignan-brand-text">
              <div className="vignan-brand-title" style={{ color: '#fff' }}>VIGNAN'S</div>
              <div className="vignan-brand-foundation" style={{ color: 'rgba(255,255,255,0.88)' }}>
                FOUNDATION FOR SCIENCE, TECHNOLOGY &amp; RESEARCH
              </div>
              <div className="vignan-deemed-badge" style={{ color: 'rgba(255,255,255,0.78)' }}>
                (Deemed to be University) - Estd. u/s 3 of UGC Act 1956
              </div>
            </div>
          </div>

          <div className="vignan-blue-divider" style={{ background: 'rgba(255,255,255,0.4)' }} />
        </div>

        {/* Card Body */}
        <div className="vignan-front-body">
          {/* Student Photo */}
          <div className="vignan-photo-container" style={{ borderColor: accentColor }}>
            <img src={photoUrl} alt={studentName} className="vignan-photo-img" />
          </div>

          {/* Role Badge */}
          <div className="vignan-student-badge" style={{ background: badgeBg, color: badgeColor }}>
            S T U D E N T
          </div>

          {/* Student Credentials */}
          <div className="vignan-details-stack">
            <div className="vignan-student-name" style={{ color: '#0f172a' }}>{studentName}</div>
            <div className="vignan-student-roll" style={{ color: accentColor }}>{rollNumber}</div>
            <div className="vignan-student-course">{courseDetails}</div>
            <div className="vignan-student-years">{batchYears}</div>
          </div>

          {/* Status tag */}
          <div style={{
            display: 'inline-block',
            margin: '6px auto 0',
            padding: '2px 10px',
            borderRadius: '999px',
            fontSize: '10px',
            fontWeight: 700,
            background: badgeBg,
            color: badgeColor,
            border: `1px solid ${accentColor}`,
          }}>
            {isHosteller ? '🟢 College Hosteller' : '🔵 Day Scholar'}
          </div>

          {/* Footer */}
          <div className="vignan-front-footer">
            <div className="vignan-signature-box">
              <svg width="90" height="30" viewBox="0 0 120 40">
                <path
                  d="M 10 25 C 25 10, 35 32, 45 15 C 55 2, 60 30, 75 18 C 90 5, 95 28, 110 20"
                  fill="none"
                  stroke={sigStroke}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
              <div className="vignan-signature-title" style={{ color: accentColor }}>Registrar</div>
            </div>

            <div className="vignan-watermark-corner">
              <svg width="70" height="70" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="42" stroke={watermarkStroke} strokeWidth="8" opacity="0.15" />
                <path
                  d="M50 8 L50 92 M8 50 L92 50 M20 20 L80 80 M20 80 L80 20"
                  stroke={watermarkStroke}
                  strokeWidth="6"
                  opacity="0.15"
                />
                <circle cx="50" cy="50" r="18" fill={watermarkStroke} opacity="0.12" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Horizontal Layout (Day Scholar / Outside PG → Blue)
  return (
    <div className="vignan-card-horizontal" id="campus-id-front" style={{ border: cardBorder }}>
      <div className="vignan-front-header" style={{ padding: '8px 14px 4px', background: headerBg }}>
        <div className="vignan-brand-row">
          <div className="vignan-logo-shield">
            <svg width="28" height="32" viewBox="0 0 100 115" fill="none">
              <path
                d="M50 5 L90 20 L90 65 C90 90 50 110 50 110 C50 110 10 90 10 65 L10 20 Z"
                fill="#ffffff"
                stroke={logoStroke}
                strokeWidth="6"
              />
              <circle cx="50" cy="55" r="24" stroke={logoStroke} strokeWidth="5" fill="none" />
              <path
                d="M50 31 L50 79 M26 55 L74 55 M33 38 L67 72 M33 72 L67 38"
                stroke={logoStroke}
                strokeWidth="4"
              />
              <circle cx="50" cy="55" r="8" fill="#e11d48" />
            </svg>
          </div>
          <div className="vignan-brand-text">
            <div className="vignan-brand-title" style={{ fontSize: '18px', color: '#fff' }}>VIGNAN'S</div>
            <div className="vignan-brand-foundation" style={{ fontSize: '6px', color: 'rgba(255,255,255,0.88)' }}>
              FOUNDATION FOR SCIENCE, TECHNOLOGY &amp; RESEARCH
            </div>
            <div className="vignan-deemed-badge" style={{ fontSize: '5.5px', color: 'rgba(255,255,255,0.78)' }}>
              (Deemed to be University) - Estd. u/s 3 of UGC Act 1956
            </div>
          </div>
        </div>
        <div className="vignan-blue-divider" style={{ background: 'rgba(255,255,255,0.4)' }} />
      </div>

      <div style={{ display: 'flex', gap: '16px', padding: '10px 16px', alignItems: 'center' }}>
        <div className="vignan-photo-container" style={{ width: '100px', height: '115px', flexShrink: 0, borderColor: accentColor }}>
          <img src={photoUrl} alt={studentName} className="vignan-photo-img" />
        </div>

        <div style={{ flex: 1, textAlign: 'left' }}>
          <div className="vignan-student-badge" style={{ margin: '0 0 4px', fontSize: '13px', background: badgeBg, color: badgeColor }}>
            S T U D E N T
          </div>
          <div className="vignan-student-name" style={{ fontSize: '14px', color: '#0f172a' }}>{studentName}</div>
          <div className="vignan-student-roll" style={{ fontSize: '13px', color: accentColor }}>{rollNumber}</div>
          <div className="vignan-student-course" style={{ fontSize: '10.5px' }}>{courseDetails}</div>
          <div className="vignan-student-years" style={{ fontSize: '11px' }}>{batchYears}</div>
          <div style={{
            marginTop: '4px',
            display: 'inline-block',
            padding: '1px 8px',
            borderRadius: '999px',
            fontSize: '9px',
            fontWeight: 700,
            background: badgeBg,
            color: badgeColor,
            border: `1px solid ${accentColor}`,
          }}>
            {isHosteller ? '🟢 College Hosteller' : '🔵 Day Scholar'}
          </div>
        </div>

        <div style={{ textAlign: 'center', alignSelf: 'flex-end', marginLeft: 'auto' }}>
          <svg width="70" height="24" viewBox="0 0 120 40">
            <path
              d="M 10 25 C 25 10, 35 32, 45 15 C 55 2, 60 30, 75 18 C 90 5, 95 28, 110 20"
              fill="none"
              stroke={sigStroke}
              strokeWidth="2.5"
            />
          </svg>
          <div style={{ fontSize: '9px', fontWeight: 700, color: accentColor }}>Registrar</div>
        </div>
      </div>
    </div>
  );
}
