export type ToothSurface =
  | "occlusal"
  | "mesial"
  | "distal"
  | "buccal"
  | "lingual";

export type ToothCondition =
  | "healthy"
  | "caries"
  | "composite"
  | "amalgam"
  | "crown"
  | "root-canal"
  | "missing"
  | "implant";

export type ToothRecord = {
  toothNumber: number;
  condition: ToothCondition;
  surfaces: Record<ToothSurface, boolean>;
  notes?: string;
  plannedProcedure?: string;
  completedProcedure?: string;
  lastUpdated?: string;
};

export type OdontogramChartData = {
  patientId: string;
  patientName: string;
  teeth: Record<number, ToothRecord>;
  generalNotes?: string;
};

export type ConditionDefinition = {
  id: ToothCondition;
  label: string;
  shortCode: string;
  color: string;
  badgeClass: string;
  description: string;
};

export type ChartSummaryMetrics = {
  totalTeeth: number;
  healthy: number;
  caries: number;
  restored: number;
  crownEndo: number;
  missing: number;
  implants: number;
};
