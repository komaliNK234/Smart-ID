import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Download, Printer, FileText, Check } from 'lucide-react';

export default function DownloadButton({
  student,
  application,
  onDownloadReceipt,
}) {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const frontElem = document.getElementById('campus-id-front');
      if (!frontElem) {
        alert('Card element preview not found in document.');
        setDownloading(false);
        return;
      }

      // Capture front
      const canvasFront = await html2canvas(frontElem, {
        scale: 3, // High DPI capture
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      const frontImgData = canvasFront.toDataURL('image/png');

      // Initialize jsPDF
      const isVertical = canvasFront.height > canvasFront.width;
      const pdf = new jsPDF({
        orientation: isVertical ? 'portrait' : 'landscape',
        unit: 'mm',
        format: isVertical ? [85.6, 53.98] : [53.98, 85.6], // Standard CR80 card dimensions in mm
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(frontImgData, 'PNG', 0, 0, pageWidth, pageHeight);

      // Check if back is available (Back face is ALWAYS Horizontal landscape CR80)
      const backElem = document.getElementById('campus-id-back');
      if (backElem) {
        const canvasBack = await html2canvas(backElem, {
          scale: 3,
          useCORS: true,
          backgroundColor: '#ffffff',
        });
        const backImgData = canvasBack.toDataURL('image/png');
        pdf.addPage([53.98, 85.6], 'landscape');
        pdf.addImage(backImgData, 'PNG', 0, 0, 85.6, 53.98);
      }

      const fileName = `CampusID_${student?.studentId || 'Official'}_Card.pdf`;
      pdf.save(fileName);

      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    } catch (err) {
      console.error('Download error:', err);
      alert('Failed to generate high-res PDF. Trying PNG export...');
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '16px' }}>
      <button
        type="button"
        className="btn btn-primary"
        onClick={handleDownloadPDF}
        disabled={downloading}
      >
        {downloaded ? (
          <>
            <Check size={16} /> ID Card Downloaded!
          </>
        ) : (
          <>
            <Download size={16} /> {downloading ? 'Exporting PDF...' : 'Download ID Card (PDF)'}
          </>
        )}
      </button>

      <button
        type="button"
        className="btn btn-outline"
        onClick={handlePrint}
      >
        <Printer size={16} /> Print ID Card
      </button>

      {onDownloadReceipt && (
        <button
          type="button"
          className="btn btn-outline"
          onClick={onDownloadReceipt}
        >
          <FileText size={16} /> Download Receipt
        </button>
      )}
    </div>
  );
}
