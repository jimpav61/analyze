import { Card } from "@/components/ui/card";

interface ImplementationDetailsProps {
  explanation: string;
  marketingStrategy: string;
}

export const ImplementationDetails = ({ explanation, marketingStrategy }: ImplementationDetailsProps) => {
  return (
    <Card className="p-6 mt-6 bg-[#F8F9FC] border border-gray-100">
      <div className="space-y-6">
        <div>
          <p className="font-medium text-gray-700 mb-3">Implementation Strategy:</p>
          <p className="text-[#f65228] whitespace-pre-wrap leading-relaxed">{explanation}</p>
        </div>
        <div>
          <p className="font-medium text-gray-700 mb-3">Marketing Strategy:</p>
          <p className="text-[#f65228] whitespace-pre-wrap leading-relaxed">{marketingStrategy}</p>
        </div>
      </div>
    </Card>
  );
};