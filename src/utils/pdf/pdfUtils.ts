import html2canvas from 'html2canvas';
import { jsPDF } from "jspdf";

export const createReportContainer = () => {
  const container = document.createElement('div');
  container.id = 'pdf-container';
  container.style.width = '800px';
  container.style.padding = '40px';
  container.style.background = 'white';
  container.style.fontFamily = 'Inter, sans-serif';
  container.style.whiteSpace = 'pre-line';
  container.style.wordWrap = 'break-word';
  container.style.overflowWrap = 'break-word';
  document.body.appendChild(container);
  return container;
};

export const generatePDF = async (reportContainer: HTMLDivElement): Promise<jsPDF> => {
  try {
    const canvas = await html2canvas(reportContainer, {
      scale: 2,
      logging: false,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      windowWidth: 800,
      height: reportContainer.offsetHeight,
      onclone: (clonedDoc, element) => {
        // Ensure all images are loaded before capturing
        const images = element.getElementsByTagName('img');
        return Promise.all(Array.from(images).map(img => {
          if (img.complete) return Promise.resolve();
          return new Promise(resolve => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        }));
      }
    });

    document.body.removeChild(reportContainer);

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    let heightLeft = imgHeight;
    let position = 0;
    const totalPages = Math.ceil(imgHeight / pageHeight);

    for (let page = 1; page <= totalPages; page++) {
      if (page > 1) {
        pdf.addPage();
      }

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

      heightLeft -= pageHeight;
      position -= pageHeight;
    }

    return pdf;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};