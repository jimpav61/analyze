import { useState } from "react";
import { DetailedFormData } from "@/types/analysis";

interface ValidationResult {
  isValid: boolean;
  errors: { [key: string]: string };
}

export const useDetailedFormState = (initialData: DetailedFormData | null) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState<DetailedFormData>(
    initialData || {
      companyName: "",
      ownerName: "",
      phoneNumber: "",
      email: "",
      employees: "",
      revenue: "",
      serviceChannels: "",
      monthlyInteractions: "",
      currentTools: "",
      painPoints: "",
      objectives: "",
      timeline: "",
      budget: "",
      additionalInfo: "",
    }
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateStep = (step: number): ValidationResult => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    const validateField = (field: string, label: string) => {
      if (!formData[field as keyof DetailedFormData]?.trim()) {
        newErrors[field] = `${label} is required`;
        isValid = false;
      }
    };

    switch (step) {
      case 1:
        validateField("companyName", "Company name");
        validateField("ownerName", "Owner name");
        validateField("email", "Email");
        validateField("revenue", "Annual revenue");
        // Validate email format
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = "Please enter a valid email address";
          isValid = false;
        }
        break;

      case 2:
        validateField("serviceChannels", "Service channels");
        validateField("monthlyInteractions", "Monthly interactions");
        validateField("currentTools", "Current tools");
        validateField("painPoints", "Pain points");
        break;

      case 3:
        validateField("objectives", "Business objectives");
        validateField("timeline", "Implementation timeline");
        validateField("budget", "Budget range");
        break;
    }

    console.log("Validation result:", { isValid, errors: newErrors });
    return { isValid, errors: newErrors };
  };

  return {
    currentStep,
    setCurrentStep,
    formData,
    errors,
    setErrors,
    handleInputChange,
    validateStep,
  };
};