export type ServiceCategory =
  | "All"
  | "Diagnostic & Preventive"
  | "Restorative"
  | "Endodontics"
  | "Periodontics"
  | "Prosthodontics"
  | "Oral Surgery"
  | "Orthodontics"
  | "Cosmetic";

export type ClinicalProcedure = {
  id: string;
  code: string;
  name: string;
  category: Exclude<ServiceCategory, "All">;
  defaultPrice: number;
  durationMinutes: number;
  active: boolean;
  description: string;
  requiresToothTarget: boolean;
};

export type AppointmentTypeConfig = {
  id: string;
  name: string;
  category: string;
  defaultDurationMinutes: number;
  defaultPrice: number;
  color: string;
  active: boolean;
  description: string;
  requiresChair: boolean;
};

export type ServicesTab = "procedures" | "appointment-types";
