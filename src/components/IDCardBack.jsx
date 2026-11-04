import React from 'react';

export default function IDCardBack({ student }) {
  const fatherName = (student?.parentName || 'KOTHA BHASKAR RAO').toUpperCase();
  const address =
    student?.address ||
    '# 2134, Brahmamgari Street, Yerragonda Palem, Prakasam(Dist) - 523327';
  const phoneNo = student?.phone || student?.parentPhone || '9618112688';
  const rollNumber = (student?.studentId || '241FA18059').toUpperCase();

  // BACK SIDE IS ALWAYS HORIZONTAL FOR ALL CARDS AS PER SPEC
  return (
    <div
      className="vignan-card-horizontal"
      id="campus-id-back"
    >
      <div className="vignan-back-container">
        {/* Top Details Section: Father Name, Address, Phone No */}
        <div className="vignan-back-details">
          <div className="vignan-back-row">
            <span className="vignan-back-lbl">Father Name</span>
            <span className="vignan-back-colon">:</span>
            <span className="vignan-back-val">{fatherName}</span>
          </div>

          <div className="vignan-back-row">
            <span className="vignan-back-lbl">Address</span>
            <span className="vignan-back-colon">:</span>
            <span className="vignan-back-val vignan-address-text">{address}</span>
          </div>

          <div className="vignan-back-row">
            <span className="vignan-back-lbl">Phone No</span>
            <span className="vignan-back-colon">:</span>
            <span className="vignan-back-val">{phoneNo}</span>
          </div>
        </div>

        {/* Middle: Prominent Black Horizontal Strip */}
        <div className="vignan-website-banner">
          <span>www.vignan.ac.in</span>
        </div>

        {/* Bottom Section: Return Instruction & Official Barcode */}
        <div className="vignan-back-bottom">
          <div className="vignan-return-info">
            <div className="vignan-return-head">If Found Please return to</div>
            <div className="vignan-return-org">
              Vignan's Foundation For Science, Technology & Research
            </div>
            <div className="vignan-return-address">
              Vadlamudi(Post), Chebrolu(MD), Guntur(Dist) - 522213, Tel: 0863-2344700
            </div>
          </div>

          {/* Barcode and Roll Number Graphic */}
          <div className="vignan-barcode-wrapper">
            <div className="vignan-barcode-graphic">
              {/* High-density authentic Code 128 / Code 39 Barcode lines */}
              <svg width="180" height="42" viewBox="0 0 180 42">
                {/* Barcode bars */}
                <rect x="0" y="0" width="3" height="42" fill="#000" />
                <rect x="5" y="0" width="1.5" height="42" fill="#000" />
                <rect x="9" y="0" width="3.5" height="42" fill="#000" />
                <rect x="15" y="0" width="2" height="42" fill="#000" />
                <rect x="19" y="0" width="4" height="42" fill="#000" />
                <rect x="25" y="0" width="1.5" height="42" fill="#000" />
                <rect x="28" y="0" width="3" height="42" fill="#000" />
                <rect x="33" y="0" width="1.5" height="42" fill="#000" />
                <rect x="36" y="0" width="4.5" height="42" fill="#000" />
                <rect x="43" y="0" width="2" height="42" fill="#000" />
                <rect x="47" y="0" width="3.5" height="42" fill="#000" />
                <rect x="52" y="0" width="1.5" height="42" fill="#000" />
                <rect x="56" y="0" width="4" height="42" fill="#000" />
                <rect x="62" y="0" width="2.5" height="42" fill="#000" />
                <rect x="67" y="0" width="1.5" height="42" fill="#000" />
                <rect x="70" y="0" width="3.5" height="42" fill="#000" />
                <rect x="75" y="0" width="2" height="42" fill="#000" />
                <rect x="79" y="0" width="4.5" height="42" fill="#000" />
                <rect x="86" y="0" width="2" height="42" fill="#000" />
                <rect x="90" y="0" width="3" height="42" fill="#000" />
                <rect x="95" y="0" width="1.5" height="42" fill="#000" />
                <rect x="98" y="0" width="4" height="42" fill="#000" />
                <rect x="104" y="0" width="2" height="42" fill="#000" />
                <rect x="108" y="0" width="3.5" height="42" fill="#000" />
                <rect x="113" y="0" width="1.5" height="42" fill="#000" />
                <rect x="116" y="0" width="4.5" height="42" fill="#000" />
                <rect x="123" y="0" width="2" height="42" fill="#000" />
                <rect x="127" y="0" width="3" height="42" fill="#000" />
                <rect x="132" y="0" width="1.5" height="42" fill="#000" />
                <rect x="135" y="0" width="4" height="42" fill="#000" />
                <rect x="141" y="0" width="2" height="42" fill="#000" />
                <rect x="145" y="0" width="3.5" height="42" fill="#000" />
                <rect x="150" y="0" width="1.5" height="42" fill="#000" />
                <rect x="153" y="0" width="4" height="42" fill="#000" />
                <rect x="159" y="0" width="2.5" height="42" fill="#000" />
                <rect x="164" y="0" width="1.5" height="42" fill="#000" />
                <rect x="167" y="0" width="3.5" height="42" fill="#000" />
                <rect x="173" y="0" width="2" height="42" fill="#000" />
                <rect x="177" y="0" width="3" height="42" fill="#000" />
              </svg>
            </div>
            <div className="vignan-barcode-text">{rollNumber}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
