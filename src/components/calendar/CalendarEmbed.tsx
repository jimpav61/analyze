import { useRef } from "react";
import { CalendarProps } from "@/types/calendar";
import { useBookingSuccess } from "@/hooks/calendar/useBookingSuccess";
import { useCalendlyConfig } from "./useCalendlyConfig";
import { useCalendlyEvents } from "./useCalendlyEvents";
import { CalendarFormData } from "@/types/analysis";
import { useCalendarInitialization } from "@/hooks/calendar/useCalendarInitialization";
import { CalendarContainer } from "./CalendarContainer";
import { Button } from "../ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { exportReportAsPDF } from "@/utils/reportExport";

interface CalendarEmbedProps extends Omit<CalendarProps, 'formData'> {
  formData?: CalendarFormData;
}

export const CalendarEmbed = ({ 
  calLink, 
  onSubmit, 
  formData, 
  analysis 
}: CalendarEmbedProps) => {
  console.log("[DEBUG] CalendarEmbed - Component Mounted", {
    calLink,
    hasFormData: !!formData,
    hasAnalysis: !!analysis,
    formData,
    analysis
  });

  const calendarRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const { handleBookingSuccess } = useBookingSuccess({ 
    formData, 
    analysis, 
    onSubmit 
  });
  
  const { calendlyInitialized, getPrefillData } = useCalendlyConfig(formData);
  const { handleCalendlyInit, handleEventScheduled } = useCalendlyEvents({
    formData,
    onBookingSuccess: handleBookingSuccess
  });

  useCalendarInitialization({
    calendarRef,
    calendlyInitialized,
    calLink,
    getPrefillData,
    handleCalendlyInit,
    handleEventScheduled,
    formData
  });

  const handleDownload = async () => {
    console.log("[DEBUG] CalendarEmbed - Download initiated", {
      formData,
      analysis
    });

    if (!formData || !analysis) {
      console.error("[DEBUG] CalendarEmbed - Missing required data for download");
      toast({
        title: "Error",
        description: "Could not generate report. Please try again.",
        variant: "destructive",
      });
      return;
    }

    const reportElement = document.createElement('div');
    reportElement.innerHTML = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1>AI Implementation Analysis Report</h1>
        <h2>Company Information</h2>
        <p>Company: ${formData.companyName || 'N/A'}</p>
        <p>Industry: ${analysis.industry || 'N/A'}</p>
        <h2>Analysis Results</h2>
        <p>Potential Savings: $${analysis.savings?.toLocaleString() || '0'}</p>
        <p>Profit Increase: ${analysis.profit_increase || '0'}%</p>
        <p>Implementation Strategy: ${analysis.marketing_strategy || 'N/A'}</p>
        <h2>Detailed Explanation</h2>
        <p>${analysis.explanation || 'N/A'}</p>
      </div>
    `;
    document.body.appendChild(reportElement);

    console.log("[DEBUG] CalendarEmbed - Attempting PDF export");
    const success = await exportReportAsPDF(reportElement);
    document.body.removeChild(reportElement);

    toast({
      title: success ? "Success" : "Error",
      description: success 
        ? "Report downloaded successfully!" 
        : "Failed to download report. Please try again.",
      variant: success ? "default" : "destructive",
    });
  };

  return (
    <div className="w-full h-[700px]">
      <CalendarContainer ref={calendarRef}>
        <div 
          className="calendly-inline-widget" 
          data-url={`https://calendly.com/${calLink}`}
          style={{ minWidth: '320px', height: '700px' }}
        />
      </CalendarContainer>
      <style>{`
        .calendly-success-message {
          position: relative !important;
        }
        .calendly-success-message::before {
          content: '';
          display: block;
          margin: 20px auto;
        }
        .calendly-success-message button {
          margin-top: 15px !important;
        }
        .download-report-button {
          display: block;
          margin: 15px auto !important;
          position: relative !important;
          z-index: 100;
        }
      `}</style>
      <script dangerouslySetInnerHTML={{
        __html: `
          window.addEventListener('calendly.event_scheduled', function() {
            setTimeout(() => {
              const successMessage = document.querySelector('.calendly-success-message');
              if (successMessage) {
                const downloadButton = document.createElement('button');
                downloadButton.className = 'download-report-button';
                downloadButton.innerHTML = '<span style="display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: #f65228; color: white; border-radius: 6px; font-weight: 500;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>Download Report</span>';
                downloadButton.onclick = ${handleDownload.toString()};
                const firstButton = successMessage.querySelector('button');
                if (firstButton) {
                  successMessage.insertBefore(downloadButton, firstButton);
                }
              }
            }, 100);
          });
        `
      }} />
    </div>
  );
};