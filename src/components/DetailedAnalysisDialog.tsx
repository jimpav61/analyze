import { Dialog, DialogContent } from "./ui/dialog";
import { useState, useCallback } from "react";
import { useToast } from "./ui/use-toast";
import { DetailedFormData } from "@/types/analysis";
import { DialogContent as CustomDialogContent } from "./detailed-analysis/DialogContent";
import { DetailedAnalysisProps } from "./detailed-analysis/types";
import { Calendar } from "./Calendar";

export const DetailedAnalysisDialog = ({
  isOpen,
  onClose,
  industry,
  analysis,
}: DetailedAnalysisProps) => {
  const { toast } = useToast();
  const [showReport, setShowReport] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [formData, setFormData] = useState<DetailedFormData | null>(null);

  console.log("DetailedAnalysisDialog - Initial render:", { industry, analysis, showReport, showCalendar, formData });

  const handleSubmit = useCallback((data: DetailedFormData) => {
    console.log("DetailedAnalysisDialog - handleSubmit called with:", data);
    console.log("DetailedAnalysisDialog - Current analysis:", analysis);
    
    if (!data) {
      console.error("DetailedAnalysisDialog - No form data provided");
      toast({
        title: "Error",
        description: "Form data is missing",
        variant: "destructive",
      });
      return;
    }

    setFormData(data);
    setShowReport(true);
  }, [analysis, toast]);

  const handleBookingSubmit = useCallback(() => {
    console.log("DetailedAnalysisDialog - Booking submitted");
    // Keep the report visible after booking
    setShowCalendar(false);
    setShowReport(true);
  }, []);

  const handleClose = useCallback(() => {
    console.log("DetailedAnalysisDialog - Closing dialog");
    if (!isOpen) return;
    
    onClose();
    // Only reset states when dialog is fully closed
    const timer = setTimeout(() => {
      setFormData(null);
      setShowReport(false);
      setShowCalendar(false);
    }, 300); // Match dialog transition time

    return () => clearTimeout(timer);
  }, [isOpen, onClose]);

  const handleBookDemo = useCallback((e?: React.MouseEvent) => {
    console.log("DetailedAnalysisDialog - Book demo clicked");
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setShowCalendar(true);
  }, []);

  const calLink = "chatsites/ai-discovery-call";

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto">
          {showCalendar ? (
            <Calendar calLink={calLink} onSubmit={handleBookingSubmit} />
          ) : (
            <CustomDialogContent
              showReport={showReport}
              formData={formData}
              onSubmit={handleSubmit}
              industry={industry}
              analysis={analysis}
              onBookDemo={handleBookDemo}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
