import { DetailedFormData } from "@/types/analysis";
import { ReportHeader } from "./ReportHeader";
import { CompanyInformation } from "./CompanyInformation";
import { CurrentOperations } from "./CurrentOperations";
import { AnalysisResults } from "./AnalysisResults";
import { ImplementationPlan } from "./ImplementationPlan";
import { ReportFooter } from "./ReportFooter";
import { Phone } from "lucide-react";

interface ReportContentProps {
  formData: DetailedFormData;
  analysis: any;
  onBookDemo?: () => void;
}

export const ReportContent = ({ formData, analysis }: ReportContentProps) => {
  return (
    <div data-report-content="true" className="space-y-8 print:space-y-6 overflow-visible">
      <ReportHeader 
        formData={formData} 
        industry={analysis.industry}
        analysis={analysis}
      />
      <CompanyInformation data={formData} industry={analysis.industry} />
      <CurrentOperations data={formData} />
      <AnalysisResults 
        analyses={analysis.allAnalyses || [{
          department: analysis.department,
          function: analysis.bot_function,
          savings: analysis.savings.toString(),
          profit_increase: analysis.profit_increase.toString(),
          explanation: analysis.explanation,
          marketingStrategy: analysis.marketing_strategy
        }]}
        revenue={formData.revenue || '0'}
      />
      <ImplementationPlan data={{
        objectives: formData.objectives || '',
        timeline: formData.timeline || '',
        budget: formData.budget || '',
        additionalInfo: formData.additionalInfo
      }} />
      <div className="flex flex-col items-center gap-4 py-8 print:py-8 print:block print:text-center">
        <a 
          href="tel:+14808620288"
          className="inline-flex items-center justify-center gap-2 px-8 py-3 font-semibold text-white rounded-md bg-[#f65228] hover:bg-[#d43d16] transition-colors print:bg-[#f65228] print:text-white w-auto"
          style={{
            fontSize: '16px',
            margin: '20px auto',
            minWidth: '200px'
          }}
        >
          <Phone className="h-4 w-4" />
          +1 (480) 862-0288
        </a>
        <p className="text-sm text-gray-600 text-center print:text-gray-600 print:mt-2">
          Talk to Our AI Implementation Expert and Test the Magic
        </p>
      </div>
      <ReportFooter />
    </div>
  );
};