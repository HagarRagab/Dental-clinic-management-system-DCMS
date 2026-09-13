export type BookingPatient = { id: string; name: string; mobile: string; dob: string; alert?: string };

export const bookingPatients: BookingPatient[] = [
  { id: "patient-01", name: "Mariam Adel", mobile: "010 1234 5678", dob: "18 Mar 1988", alert: "Penicillin allergy" },
  { id: "patient-02", name: "Omar Nabil", mobile: "010 8945 1172", dob: "23 Jul 1991" },
  { id: "patient-03", name: "Laila Ahmed", mobile: "012 5783 6621", dob: "11 Jan 1984" },
];

export const bookingDentists = ["Dr. Salma Hassan", "Dr. Karim Mostafa"];
export const bookingAppointmentTypes = ["Consultation", "Cleaning", "Root canal follow-up", "Crown fitting"];
export const availableSlots = ["13:00", "13:30", "14:30", "15:00", "16:00", "16:30", "17:00"];
