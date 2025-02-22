import { useState, useEffect } from "react";
import { DetailedAnalysisDialog } from "./DetailedAnalysisDialog";
import { HeroHeader } from "./hero/HeroHeader";
import { BenefitsList } from "./hero/BenefitsList";
import { HeroActions } from "./hero/HeroActions";
import { useToast } from "@/hooks/use-toast";
import { AnalysisSection } from "./AnalysisSection";

interface HeroProps {
  selectedIndustry?: string;
  setSelectedIndustry: (industry: string) => void;
  isLoading: boolean;
  handleAnalyze: () => void;
  analyses?: any[];
}

export const Hero = ({
  selectedIndustry,
  setSelectedIndustry,
  isLoading,
  handleAnalyze,
  analyses = [],
}: HeroProps) => {
  const [showDetailedDialog, setShowDetailedDialog] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (analyses && analyses.length > 0) {
      console.log("Hero - Setting up analysis with data:", {
        analysesCount: analyses.length,
        selectedIndustry,
        firstAnalysis: analyses[0]
      });
      
      const primaryAnalysis = {
        industry: selectedIndustry,
        department: analyses[0].department,
        bot_function: analyses[0].function,
        savings: Number(analyses[0].savings),
        profit_increase: Number(analyses[0].profit_increase),
        explanation: analyses[0].explanation,
        marketing_strategy: analyses[0].marketingStrategy,
        allAnalyses: analyses
      };
      
      console.log("Hero - Created primary analysis:", primaryAnalysis);
      setCurrentAnalysis(primaryAnalysis);
      setShowDetailedDialog(true);

      toast({
        title: "AI Implementation Opportunities",
        description: `We've identified ${analyses.length} departments where AI can be implemented to improve efficiency and reduce costs.`,
        duration: 5000,
      });
    }
  }, [analyses, selectedIndustry, toast]);

  const handleAnalyzeClick = () => {
    if (!selectedIndustry) {
      console.log("Hero - No industry selected");
      toast({
        title: "Please select an industry",
        description: "Select your industry to begin the analysis",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    console.log("Hero - Analyze button clicked with industry:", selectedIndustry);
    handleAnalyze();
  };

  return (
    <div className="max-w-4xl mx-auto text-center mb-12">
      <HeroHeader />

      <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <HeroActions
            selectedIndustry={selectedIndustry}
            setSelectedIndustry={setSelectedIndustry}
            isLoading={isLoading}
            handleAnalyze={handleAnalyzeClick}
          />
          <BenefitsList position="right" />
        </div>
      </div>

      <AnalysisSection 
        analyses={analyses.length > 0 ? analyses : []} 
        isMobile={false}
        analysisGridRef={null}
      />

      <DetailedAnalysisDialog
        isOpen={showDetailedDialog}
        onClose={() => {
          console.log("Hero - Closing detailed dialog");
          setShowDetailedDialog(false);
          setCurrentAnalysis(null);
        }}
        industry={selectedIndustry}
        analysis={currentAnalysis}
        showFormOnly={false}
      />
    </div>
  );
};