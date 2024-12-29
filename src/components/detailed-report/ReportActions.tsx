import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DetailedFormData } from "@/types/analysis";
import { generateAnalysisReport } from "@/utils/pdfGenerator";

interface ReportActionsProps {
  formData: DetailedFormData;
  analysis: any;
  onBookDemo?: () => void;
}

export const ReportActions = ({ formData, analysis, onBookDemo }: ReportActionsProps) => {
  const { toast } = useToast();

  const handleDownload = async () => {
    try {
      console.log("ReportActions - Starting download with data:", {
        formData,
        analysis,
        hasAnalyses: !!analysis.allAnalyses,
        analysesCount: analysis.allAnalyses?.length || 1
      });

      if (!formData || !analysis) {
        throw new Error("Missing required data for report generation");
      }

      const reportElement = document.getElementById('detailed-report');
      if (!reportElement) {
        console.error("ReportActions - Report element not found in DOM");
        throw new Error("Report element not found");
      }

      console.log("ReportActions - Found report element, checking content:", {
        childNodes: reportElement.childNodes.length,
        cards: reportElement.getElementsByClassName('card').length,
        height: reportElement.offsetHeight,
        scrollHeight: reportElement.scrollHeight
      });

      const pdf = await generateAnalysisReport({ formData, analysis });
      const fileName = `AI_Analysis_Report_${formData.companyName.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      
      console.log("ReportActions - PDF generated successfully, saving as:", fileName);
      pdf.save(fileName);
      
      console.log("ReportActions - PDF saved successfully");
      toast({
        title: "Success",
        description: "Report downloaded successfully",
        duration: 1500,
      });
    } catch (error) {
      console.error("ReportActions - Download error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to download report. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-wrap gap-4 items-center justify-end">
      <Button onClick={onBookDemo} size="sm" className="bg-[#f65228] hover:bg-[#d43d16] text-white">
        Book Demo
      </Button>
      <Button 
        onClick={handleDownload}
        variant="outline" 
        size="sm" 
        className="bg-white hover:bg-gray-50"
      >
        <Download className="mr-2 h-4 w-4 text-[#f65228]" />
        Download Report
      </Button>
    </div>
  );
};