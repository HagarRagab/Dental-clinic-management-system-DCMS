export type PatientProfile = {
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
  nextAppointment: { date: string; time: string; type: string; dentist: string };
  balance: string;
};

export type PatientTab = "Overview" | "Appointments" | "Clinical Records" | "Treatment Plans" | "Odontogram" | "Invoices" | "Payments" | "Patient Statement" | "Attachments";
