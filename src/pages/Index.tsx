import { useState, useRef } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { AnalysisSection } from "@/components/AnalysisSection";
import { HomeButton } from "@/components/HomeButton";
import { ContactForm } from "@/components/ContactForm";
import { useToast } from "@/components/ui/use-toast";
import { generateAnalysis } from "@/utils/groq";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const [selectedIndustry, setSelectedIndustry] = useState<string>();
  const [analyses, setAnalyses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const analysisGridRef = useRef<HTMLDivElement>(null);

  const handleAnalyze = async () => {
    console.log('Starting analysis for industry:', selectedIndustry);
    
    if (!selectedIndustry) {
      console.log('No industry selected');
      toast({
        title: "Please select an industry",
        description: "An industry must be selected to generate analysis",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setAnalyses([]); // Clear previous results

    try {
      console.log('Fetching analysis data...');
      const results = await generateAnalysis(selectedIndustry);
      console.log('Analysis results:', results);
      
      if (!results || results.length === 0) {
        console.log('No results returned');
        toast({
          title: "No analysis available",
          description: `No recommendations found for ${selectedIndustry}`,
          variant: "destructive",
        });
        return;
      }

      // Use the transformed data directly since it's already in the correct format
      console.log('Setting analyses with results:', results);
      setAnalyses(results);
      setHasSubmitted(true);
      
      toast({
        title: "Analysis complete",
        description: isMobile 
          ? <span>Found {results.length} recommendations for {selectedIndustry}. <span className="text-[#f65228]">Scroll down to view them!</span></span>
          : `Found ${results.length} recommendations for ${selectedIndustry}`,
      });

      if (isMobile && analysisGridRef.current) {
        setTimeout(() => {
          analysisGridRef.current?.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }, 100);
      }
    } catch (error) {
      console.error('Error in handleAnalyze:', error);
      toast({
        title: "Error generating analysis",
        description: "There was a problem generating the analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  console.log('Current state:', { 
    selectedIndustry, 
    analysesLength: analyses.length, 
    isLoading, 
    hasSubmitted 
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isMobile={isMobile} />

      <main className="container mx-auto px-4 py-8">
        <Hero
          selectedIndustry={selectedIndustry}
          setSelectedIndustry={setSelectedIndustry}
          isLoading={isLoading}
          handleAnalyze={handleAnalyze}
          analyses={analyses}
        />

        <AnalysisSection
          analyses={analyses}
          isMobile={isMobile}
          analysisGridRef={analysisGridRef}
        />

        {!isMobile && !hasSubmitted && analyses.length === 0 && (
          <div className="mt-16 flex flex-col items-center space-y-12">
            <ContactForm />
            <HomeButton />
          </div>
        )}

        {hasSubmitted && (
          <div className="mt-8 flex justify-center">
            <HomeButton />
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
