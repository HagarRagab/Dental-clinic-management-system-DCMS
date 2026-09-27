export type TreatmentPlanStatus =
  | "Draft"
  | "Pending approval"
  | "Approved"
  | "In progress"
  | "Completed"
  | "Cancelled";

export type TreatmentStepStatus = "Planned" | "In progress" | "Completed" | "Skipped";

export type TreatmentStep = {
  id: string;
  stepNumber: number;
  procedureName: string;
  cdtCode?: string;
  toothNumbers: number[];
  estimatedFee: number;
  status: TreatmentStepStatus;
  completedDate?: string;
  notes?: string;
  /** ID of the clinical visit record where this step was performed */
  linkedVisitId?: string;
};

export type TreatmentPlan = {
  id: string;
  patientId: string;
  patientName: string;
  title: string;
  description?: string;
  createdDate: string;
  approvedDate?: string;
  dentist: string;
  status: TreatmentPlanStatus;
  steps: TreatmentStep[];
  totalEstimatedFee: number;
  totalPaidToDate: number;
  currency: string;
};
