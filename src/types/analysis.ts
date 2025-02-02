export interface DetailedFormData {
  companyName: string;
  ownerName: string;
  phoneNumber: string;
  email: string;
  employees: string;
  revenue: string;
  serviceChannels: string;
  monthlyInteractions: string;
  currentTools: string;
  painPoints: string;
  objectives: string;
  timeline: string;
  budget: string;
  additionalInfo: string;
  industry?: string;
}

export interface AnalysisData {
  industry: string;
  department: string;
  bot_function: string;
  savings: number;
  profit_increase: number;
  explanation: string;
  marketing_strategy: string;
}

export interface ImplementationData {
  objectives?: string;
  timeline?: string;
  budget?: string;
  additionalInfo?: string;
}

// New type for calendar-specific form data
export type CalendarFormData = Partial<DetailedFormData>;