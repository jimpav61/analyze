import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { CalendarFormData } from "@/types/analysis";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { generateAnalysisReport } from "@/utils/pdfGeneration";

interface UseBookingSuccessProps {
  formData?: CalendarFormData;
  analysis?: any;
  onSubmit?: () => void;
}

export const useBookingSuccess = ({ 
  formData, 
  analysis, 
  onSubmit 
}: UseBookingSuccessProps) => {
  const { toast } = useToast();

  const handleDownload = useCallback(() => {
    if (!formData || !analysis) {
      toast({
        title: "Error",
        description: "Report data not available. Please try again.",
        variant: "destructive",
      });
      return;
    }

    try {
      const doc = generateAnalysisReport(formData, analysis);
      doc.save("chatsites-analysis-report.pdf");
      
      toast({
        title: "Success",
        description: "Report downloaded successfully!",
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Error",
        description: "Failed to download report. Please try again.",
        variant: "destructive",
      });
    }
  }, [formData, analysis, toast]);

  const handleBookingSuccess = useCallback(() => {
    console.log("Booking successful with data:", {
      formData,
      analysis
    });

    toast({
      title: "Success!",
      description: (
        <div className="space-y-2">
          <p>Your demo has been scheduled. Check your email for confirmation.</p>
          <Button 
            onClick={handleDownload}
            variant="outline" 
            className="w-full flex items-center justify-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download Report
          </Button>
        </div>
      ),
      duration: 5000,
    });

    if (onSubmit) {
      onSubmit();
    }
  }, [formData, analysis, onSubmit, toast, handleDownload]);

  return { handleBookingSuccess };
};