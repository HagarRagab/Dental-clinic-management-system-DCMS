export type PatientProfile = {
  id?: string;
  name: string;
  initials: string;
  mobile: string;
  dateOfBirth: string;
  age: number;
  gender: string;
  address: string;
  emergencyContact: string;
  allergies: string[];
  currentMedications: string;
  nextAppointment: { date: string; time: string; type: string; dentist: string } | null;
  balance: string;
};

export type PatientStatus = "Active" | "Inactive" | "New";

export type PatientListRow = {
  id: string;
  name: string;
  initials: string;
  mobile: string;
  dob: string;
  age: number;
  gender: "Male" | "Female";
  status: PatientStatus;
  lastVisitDate: string | null;
  lastVisitType: string | null;
  nextAppointment: { date: string; time: string; type: string; dentist: string } | null;
  balance: string;
  balanceNumeric: number;
  alerts: string[];
  /** Profile route slug or patient ID (e.g. "mariam-adel" or "pt-002") */
  profileSlug: string | null;
};

export type PatientTab = "Overview" | "Appointments" | "Clinical Records" | "Treatment Plans" | "Odontogram" | "Invoices" | "Payments" | "Patient Statement" | "Attachments";
