export type ClinicalDiagnosis = {
  primary: string;
  code?: string;
  affectedTeeth: number[];
};

export type PerformedProcedure = {
  id: string;
  procedure: string;
  tooth?: number;
  anesthesia?: string;
  materials?: string;
  notes?: string;
  cost: number;
};

export type ClinicalAmendment = {
  id: string;
  timestamp: string;
  dentist: string;
  reason: string;
  note: string;
};

export type ClinicalAttachment = {
  id: string;
  title: string;
  type: string;
  size: string;
  date: string;
  category: "X-Ray" | "Photo" | "Consent" | "Lab report";
};

export type ClinicalVisitRecord = {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  patientMobile: string;
  allergies: string[];
  medicalAlerts: string[];
  appointment: {
    date: string;
    time: string;
    dentist: string;
    chair: string;
    type: string;
    status: string;
    visitState: string;
    arrivedMinutesAgo: number;
  };
  chiefComplaint: string;
  subjectiveNotes: string;
  objectiveFindings: string;
  diagnosis: ClinicalDiagnosis;
  treatmentPlanRef: {
    title: string;
    planId: string;
    progress: string;
    nextPlannedStep: string;
  };
  treatmentsPerformed: PerformedProcedure[];
  prescriptions: string;
  nextVisitRecommendation: string;
  attachments: ClinicalAttachment[];
  selectedTooth: number;
  status: "In progress" | "Draft" | "Finalized";
  finalizedAt?: string;
  finalizedBy?: string;
  amendments: ClinicalAmendment[];
};
