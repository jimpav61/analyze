import { DetailedFormData } from "@/types/analysis";
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';

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

  console.log('[ReportHandler] Report element found with dimensions:', {
    offsetWidth: reportElement.offsetWidth,
    offsetHeight: reportElement.offsetHeight,
    scrollWidth: reportElement.scrollWidth,
    scrollHeight: reportElement.scrollHeight
  });

  // Store original styles
  const originalStyles = {
    display: reportElement.style.display,
    visibility: reportElement.style.visibility,
    opacity: reportElement.style.opacity,
    position: reportElement.style.position,
    transform: reportElement.style.transform,
    margin: reportElement.style.margin,
    padding: reportElement.style.padding,
    whiteSpace: reportElement.style.whiteSpace
  };

  // Prepare the element for capture
  reportElement.style.width = '900px';
  reportElement.style.padding = '40px';
  reportElement.style.backgroundColor = 'white';
  reportElement.style.position = 'relative';
  reportElement.style.opacity = '1';
  reportElement.style.visibility = 'visible';
  reportElement.style.display = 'block';
  reportElement.style.transform = 'none';
  reportElement.style.margin = '0';
  reportElement.style.whiteSpace = 'pre-line';
  
  // Process all child elements
  const allElements = reportElement.getElementsByTagName('*');
  Array.from(allElements).forEach((el) => {
    const elem = el as HTMLElement;
    elem.style.display = 'block';
    elem.style.visibility = 'visible';
    elem.style.opacity = '1';
    elem.style.position = 'relative';
    elem.style.transform = 'none';
    
    if (elem.classList.contains('whitespace-pre-line')) {
      elem.style.whiteSpace = 'pre-line';
    }
    
    if (elem.innerHTML.includes('<br>')) {
      elem.innerHTML = elem.innerHTML.replace(/<br\s*\/?>/gi, '\n');
    }
  });

  // Wait for rendering
  await new Promise(resolve => setTimeout(resolve, 100));
  
  console.log('[ReportHandler] Creating canvas');
  const canvas = await html2canvas(reportElement, {
    scale: 2,
    useCORS: true,
    logging: true,
    backgroundColor: '#ffffff',
    width: 900,
    height: reportElement.scrollHeight,
    onclone: (_, clonedElement) => {
      const textElements = clonedElement.getElementsByTagName('*');
      Array.from(textElements).forEach((el) => {
        if (el.innerHTML.includes('<br>')) {
          el.innerHTML = el.innerHTML.replace(/<br\s*\/?>/gi, '\n');
        }
      });
    }
  });

  // Restore original styles
  Object.entries(originalStyles).forEach(([property, value]) => {
    (reportElement.style as any)[property] = value;
  });

  console.log('[ReportHandler] Canvas created with dimensions:', {
    width: canvas.width,
    height: canvas.height
  });

  // Calculate PDF dimensions (A4)
  const imgWidth = 210; // A4 width in mm
  const pageHeight = 297; // A4 height in mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
  // Calculate number of pages needed
  const pageCount = Math.ceil(imgHeight / pageHeight);
  console.log('[ReportHandler] Pages needed:', pageCount);
  
  const pdf = new jsPDF('p', 'mm', 'a4');
  
  // Add content page by page
  for (let i = 0; i < pageCount; i++) {
    if (i > 0) {
      pdf.addPage();
    }
    
    const position = -i * pageHeight;
    console.log(`[ReportHandler] Adding page ${i + 1} at position:`, position);
    
    pdf.addImage(
      canvas.toDataURL('image/png'),
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
};

export const getReportFileName = (companyName: string): string => {
  return `AI_Analysis_Report_${companyName.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
};