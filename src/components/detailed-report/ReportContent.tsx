import { DetailedFormData } from "@/types/analysis";
import { CurrentOperations } from "./CurrentOperations";
import { AnalysisResults } from "./AnalysisResults";
import { ImplementationPlan } from "./ImplementationPlan";
import { CompanyInformation } from "./CompanyInformation";
import { ReportHeader } from "./ReportHeader";
import { ReportFooter } from "./ReportFooter";
import { AnalysisGrid } from "../AnalysisGrid";

interface ReportContentProps {
  formData: DetailedFormData;
  analysis: any;
  onBookDemo?: () => void;
}

export const ReportContent = ({ formData, analysis }: ReportContentProps) => {
  console.log("ReportContent - Analysis data:", analysis);
  
  // Calculate actual savings and profit based on revenue
  const calculateFinancials = () => {
    // Extract the revenue range and convert to a number for calculations
    const revenueStr = formData.revenue;
    let revenue: number;

    if (revenueStr.includes('million')) {
      // Handle million+ range
      if (revenueStr.includes('1 million+')) {
        revenue = 1000000; // Use 1 million as base for calculations
      } else {
        const match = revenueStr.match(/\$(\d+(?:\.\d+)?)/);
        revenue = match ? parseFloat(match[1]) * 1000000 : 0;
      }
    } else {
      // Handle ranges like "$10,000 - $50,000"
      const match = revenueStr.match(/\$(\d+(?:,\d{3})*)/g);
      if (match && match.length >= 1) {
        // Use the lower bound of the range for conservative estimates
        revenue = parseFloat(match[0].replace(/[$,]/g, ''));
      } else {
        revenue = 0;
      }
    }

    console.log("Calculated revenue base:", revenue);

    if (revenue === 0) {
      return {
        savings: { amount: 0, percentage: 0 },
        profit: { amount: 0, percentage: 0 }
      };
    }

    // Calculate savings based on the provided savings value from analysis
    const savingsAmount = parseFloat(analysis.savings);
    const savingsPercentage = (savingsAmount / revenue) * 100;
    
    // Calculate profit increase based on the provided percentage
    const profitPercentage = parseFloat(analysis.profit_increase);
    const profitAmount = (revenue * (profitPercentage / 100));
    
    console.log("Financial calculations:", {
      revenue,
      savingsAmount,
      savingsPercentage,
      profitAmount,
      profitPercentage
    });

    return {
      savings: {
        amount: Math.round(savingsAmount),
        percentage: parseFloat(savingsPercentage.toFixed(1))
      },
      profit: {
        amount: Math.round(profitAmount),
        percentage: parseFloat(profitPercentage.toFixed(1))
      }
    };
  };

  const financials = calculateFinancials();

  const analysesForGrid = analysis.allAnalyses?.map((item: any) => {
    return {
      ...item,
      savings: financials.savings.amount.toString(),
      profit_increase: financials.profit.percentage.toString(),
      explanation: item.explanation,
      marketingStrategy: item.marketing_strategy,
      actualProfitIncrease: financials.profit.amount.toString(),
      savingsPercentage: financials.savings.percentage.toString()
    };
  }) || [{
    id: crypto.randomUUID(),
    department: analysis.department,
    function: analysis.bot_function,
    savings: financials.savings.amount.toString(),
    profit_increase: financials.profit.percentage.toString(),
    explanation: analysis.explanation,
    marketingStrategy: analysis.marketing_strategy,
    actualProfitIncrease: financials.profit.amount.toString(),
    savingsPercentage: financials.savings.percentage.toString()
  }];

  console.log("ReportContent - Analyses for grid:", analysesForGrid);

  return (
    <div id="detailed-report" className="space-y-6 bg-white p-4 sm:p-8 rounded-lg max-w-full overflow-x-hidden">
      <ReportHeader />
      <div className="company-info whitespace-pre-line">
        <CompanyInformation data={formData} industry={analysis?.industry} />
      </div>
      <div className="current-operations whitespace-pre-line">
        <CurrentOperations data={formData} />
      </div>
      <div className="analysis-results whitespace-pre-line">
        <AnalysisResults 
          analyses={analysesForGrid} 
          revenue={formData.revenue}
        />
      </div>
      <div className="implementation-recommendations mt-8">
        <h3 className="text-xl font-semibold mb-4">AI Implementation Recommendations</h3>
        <div className="overflow-x-auto">
          <AnalysisGrid analyses={analysesForGrid} />
        </div>
      </div>
      <div className="implementation-plan whitespace-pre-line">
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