import type { PatientProfile } from "@/features/patients/patient.types";

export const mariamAdel: PatientProfile = {
  name: "Mariam Adel",
  initials: "MA",
  mobile: "010 1234 5678",
  dateOfBirth: "18 March 1988",
  age: 38,
  gender: "Female",
  address: "New Cairo, Cairo",
  emergencyContact: "Adel Mahmoud · 010 7788 2014",
  allergies: ["Penicillin"],
  currentMedications: "No current medications recorded",
  nextAppointment: { date: "Saturday, 13 September", time: "14:00", type: "Root canal follow-up", dentist: "Dr. Karim Mostafa" },
  balance: "EGP 1,450",
};
