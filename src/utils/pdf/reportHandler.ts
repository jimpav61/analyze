import { jsPDF } from "jspdf";
import { DetailedFormData } from "@/types/analysis";
import { createPdfDocument } from "./config/pdfConfig";
import { createReportCanvas } from "./handlers/canvasHandler";
import { addPagesToDocument } from "./handlers/pdfPageHandler";
import { hideActionButtons, restoreActionButtons } from './handlers/actionButtonsHandler';

interface GenerateReportParams {
  formData: DetailedFormData;
  analysis: any;
}

export const generateFullReport = async ({ formData, analysis }: GenerateReportParams): Promise<jsPDF> => {
  console.log('[ReportHandler] Starting PDF generation with data:', { formData, analysis });
  
  const reportElement = document.getElementById('detailed-report');
  if (!reportElement) {
    console.error("[ReportHandler] Report element not found");
    throw new Error("Report element not found");
  }

  // Hide action buttons before capture
  hideActionButtons(document);

  try {
    // Create canvas with proper formatting
    const canvas = await createReportCanvas(reportElement);
    
    // Create PDF document with A4 format
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    // Get dimensions
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const pageCount = Math.ceil(imgHeight / pageHeight);

    // Add pages to document
    for (let i = 0; i < pageCount; i++) {
      if (i > 0) {
        pdf.addPage();
      }

      // Calculate position for current page
      const position = -(i * pageHeight);
      
      console.log(`[PdfPageHandler] Adding page ${i + 1} at position:`, position);

      pdf.addImage(
        canvas.toDataURL('image/png', 1.0),
        'PNG',
        0,
        position,
        imgWidth,
        imgHeight,
        '',
        'FAST'
      );
    }

    console.log('[ReportHandler] PDF created successfully with', pageCount, 'pages');
    return pdf;
  } finally {
    // Always restore action buttons visibility
    restoreActionButtons(document);
  }
};

export const getReportFileName = (companyName: string): string => {
  return `AI_Analysis_Report_${companyName.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
};