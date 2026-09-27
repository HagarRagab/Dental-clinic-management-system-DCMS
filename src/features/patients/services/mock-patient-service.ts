import type { PatientProfile } from "@/features/patients/patient.types";
import { mockPatientList } from "@/features/patients/services/mock-patient-list-service";

export const mariamAdel: PatientProfile = {
  id: "pt-001",
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

const districtDirectory = [
  "New Cairo, Cairo",
  "Maadi, Cairo",
  "Heliopolis, Cairo",
  "Zamalek, Cairo",
  "Nasr City, Cairo",
  "Dokki, Giza",
  "Sheikh Zayed, Giza",
  "Mohandessin, Giza",
];

const mockEmergencyContacts: Record<string, string> = {
  "pt-001": "Adel Mahmoud · 010 7788 2014",
  "pt-002": "Nadia Hassan · 011 4455 6677",
  "pt-003": "Sayed Sayed · 012 8899 0011",
  "pt-004": "Khaled Mostafa · 010 6677 8899",
  "pt-005": "Hoda Farouk · 015 1122 3344",
  "pt-006": "Ramadan Ali · 011 9988 7766",
  "pt-007": "Nabil Youssef · 012 3322 1100",
  "pt-008": "Ibrahim Tarek · 010 4433 2211",
  "pt-009": "Mansour Tarek · 015 7766 5544",
  "pt-010": "Fawzy Samir · 011 8877 6655",
};

/**
 * Resolves a patient profile by ID, slug, or normalized name.
 * Returns null if the patient cannot be found in the clinic records.
 */
export function getPatientProfileById(idOrSlug: string): PatientProfile | null {
  if (!idOrSlug) return null;
  const normalized = idOrSlug.trim().toLowerCase();

  // Primary mock patient
  if (normalized === "mariam-adel" || normalized === "pt-001" || normalized === "mariam adel") {
    return mariamAdel;
  }

  // Lookup in mock roster
  const found = mockPatientList.find(
    (p) =>
      p.id.toLowerCase() === normalized ||
      p.profileSlug?.toLowerCase() === normalized ||
      p.name.toLowerCase().replace(/\s+/g, "-") === normalized ||
      p.name.toLowerCase() === normalized
  );

  if (found) {
    const numericIndex = parseInt(found.id.replace(/\D/g, ""), 10) || 0;
    const address = districtDirectory[numericIndex % districtDirectory.length];
    const emergencyContact =
      mockEmergencyContacts[found.id] ||
      `${found.name.split(" ").slice(-1)[0]} Emergency · ${found.mobile}`;

    const allergies = found.alerts.length > 0 ? found.alerts : ["No known allergies"];

    let medications = "No current medications recorded";
    if (found.alerts.some((a) => a.toLowerCase().includes("hypertension"))) {
      medications = "Amlodipine 5mg OD; Aspirin 81mg OD";
    } else if (found.alerts.some((a) => a.toLowerCase().includes("diabetes"))) {
      medications = "Metformin 500mg BID";
    }

    return {
      id: found.id,
      name: found.name,
      initials: found.initials,
      mobile: found.mobile,
      dateOfBirth: found.dob,
      age: found.age,
      gender: found.gender,
      address,
      emergencyContact,
      allergies,
      currentMedications: medications,
      nextAppointment: found.nextAppointment,
      balance: found.balance,
    };
  }

  return null;
}

