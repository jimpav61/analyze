import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateFullReport, getReportFileName } from "@/utils/pdf/reportHandler";
import { DetailedFormData } from "@/types/analysis";

interface ReportActionsProps {
  formData: DetailedFormData;
  analysis: any;
  onBookDemo?: () => void;
}

export const ReportActions = ({ formData, analysis, onBookDemo }: ReportActionsProps) => {
  const { toast } = useToast();

  const handleDownload = async () => {
    try {
      console.log("ReportContent - Starting download with data:", {
        formData,
        analysis,
        hasAllAnalyses: !!analysis.allAnalyses,
        analysesCount: analysis.allAnalyses?.length || 1
      });

      const pdf = await generateFullReport({ formData, analysis });
      const fileName = getReportFileName(formData.companyName);
      
      console.log("ReportContent - PDF generated successfully, saving as:", fileName);
      pdf.save(fileName);
      
      toast({
        title: "Success",
        description: "Report downloaded successfully",
        duration: 3000,
      });
    } catch (error) {
      console.error("ReportContent - Download error:", error);
      toast({
        title: "Error",
        description: "Failed to download report. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  return (
    <div className="flex justify-end space-x-4 mb-6">
      <Button
        onClick={onBookDemo}
        size="sm"
        className="bg-[#f65228] hover:bg-[#d43d16] text-white"
      >
        Book Demo
      </Button>
      <Button 
        onClick={handleDownload}
        variant="outline" 
        size="sm" 
        className="bg-white hover:bg-gray-50 flex items-center gap-2"
      >
        <Download className="h-4 w-4 text-[#f65228]" />
        Download Report
      </Button>
    </div>
  );
};