import { CompanyFields } from "./company-basics/CompanyFields";
import { ContactFields } from "./company-basics/ContactFields";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { employeeCountOptions, revenueOptions } from "./constants/dropdownOptions";
import { createHandlers } from "./utils/dropdownHandlers";

interface CompanyBasicsStepProps {
  formData: {
    companyName: string;
    ownerName: string;
    phoneNumber: string;
    email: string;
    employees: string;
    revenue: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: { [key: string]: string };
}

export const CompanyBasicsStep = ({
  formData,
  handleInputChange,
  errors,
}: CompanyBasicsStepProps) => {
  const { handleEmployeeChange, handleRevenueChange } = createHandlers(handleInputChange);
  
  console.log("CompanyBasicsStep - Rendering with formData:", formData);

  const selectedEmployeeValue = employeeCountOptions.find(
    opt => opt.label === formData.employees
  )?.value || "";
  
  const selectedRevenueValue = revenueOptions.find(
    opt => opt.label === formData.revenue
  )?.value || "";

  return (
    <div className="space-y-6 bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>
        <p className="text-sm text-gray-600 mb-4">Please provide your company details below:</p>
        <CompanyFields
          companyName={formData.companyName}
          ownerName={formData.ownerName}
          employees={formData.employees}
          revenue={formData.revenue}
          handleInputChange={handleInputChange}
          errors={errors}
        />
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Details</h3>
        <p className="text-sm text-gray-600 mb-4">How can we reach you?</p>
        <ContactFields
          phoneNumber={formData.phoneNumber}
          email={formData.email}
          handleInputChange={handleInputChange}
          errors={errors}
        />
      </div>

      <div className="space-y-6 pt-4 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Company Size & Revenue</h3>
        <p className="text-sm text-gray-600 mb-4">Help us understand your business scale:</p>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="employees" className="text-gray-700 text-base font-medium">
              Question 1: How many employees work at your company?
            </Label>
            <Select value={selectedEmployeeValue} onValueChange={handleEmployeeChange}>
              <SelectTrigger id="employees" className="bg-white">
                <SelectValue placeholder="Select employee count" />
              </SelectTrigger>
              <SelectContent className="bg-white border shadow-lg">
                {employeeCountOptions.map((option) => (
                  <SelectItem 
                    key={option.value} 
                    value={option.value}
                    className="hover:bg-gray-100"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.employees && (
              <p className="text-sm text-red-500 mt-1">{errors.employees}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="revenue" className="text-gray-700 text-base font-medium flex items-center">
              Question 2: What is your annual revenue? <span className="text-red-500 ml-1">*</span>
            </Label>
            <Select value={selectedRevenueValue} onValueChange={handleRevenueChange}>
              <SelectTrigger 
                id="revenue" 
                className={`bg-white ${errors.revenue ? 'border-red-500' : ''}`}
              >
                <SelectValue placeholder="Select revenue range" />
              </SelectTrigger>
              <SelectContent className="bg-white border shadow-lg">
                {revenueOptions.map((option) => (
                  <SelectItem 
                    key={option.value} 
                    value={option.value}
                    className="hover:bg-gray-100"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.revenue && (
              <p className="text-sm text-red-500 mt-1">{errors.revenue}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};