import { DetailedFormData } from "@/types/analysis";
import { CurrentOperations } from "./CurrentOperations";
import { AnalysisResults } from "./AnalysisResults";
import { ImplementationPlan } from "./ImplementationPlan";
import { CompanyInformation } from "./CompanyInformation";
import { ReportHeader } from "./ReportHeader";
import { ReportFooter } from "./ReportFooter";
import { ImplementationRecommendations } from "./ImplementationRecommendations";

interface ReportContentProps {
  formData: DetailedFormData;
  analysis: any;
  onBookDemo?: () => void;
}

export const ReportContent = ({ formData, analysis }: ReportContentProps) => {
  return (
    <div id="detailed-report" className="space-y-6 bg-white p-4 sm:p-8 rounded-lg max-w-full overflow-x-hidden whitespace-pre-wrap">
      <ReportHeader />
      
      <div className="company-info">
        <CompanyInformation data={formData} industry={analysis?.industry} />
      </div>
      
      <div className="current-operations">
        <CurrentOperations data={formData} />
      </div>
      
      <div className="analysis-results">
        <AnalysisResults 
          analyses={analysis.allAnalyses || [analysis]} 
          revenue={formData.revenue}
        />
      </div>

      <ImplementationRecommendations analysis={analysis} formData={formData} />
      
      <div className="implementation-plan">
        <ImplementationPlan data={{
          objectives: formData.objectives,
          timeline: formData.timeline,
          budget: formData.budget,
          additionalInfo: formData.additionalInfo
        }} />
      </div>
      
      <ReportFooter />
    </div>
  );
};