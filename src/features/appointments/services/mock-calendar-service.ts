import type { CalendarAppointment } from "@/features/appointments/appointment.types";

export const calendarDentists = ["All dentists", "Dr. Salma Hassan", "Dr. Karim Mostafa"];
export const appointmentTypes = ["All appointment types", "Consultation", "Cleaning", "Root canal follow-up", "Crown fitting"];

export const mockAppointments: CalendarAppointment[] = [
  { id: "apt-101", patient: "Mariam Adel", dentist: "Dr. Karim Mostafa", type: "Root canal follow-up", start: "14:00", end: "14:30", room: "Chair 2", appointmentStatus: "Confirmed", visitState: "Waiting", note: "Penicillin allergy recorded." },
  { id: "apt-102", patient: "Omar Nabil", dentist: "Dr. Salma Hassan", type: "Consultation", start: "14:30", end: "15:00", room: "Chair 1", appointmentStatus: "Confirmed", visitState: "Not arrived" },
  { id: "apt-103", patient: "Laila Ahmed", dentist: "Dr. Karim Mostafa", type: "Crown fitting", start: "15:00", end: "16:00", room: "Chair 2", appointmentStatus: "Booked", visitState: "Not arrived" },
  { id: "apt-104", patient: "Youssef Tarek", dentist: "Dr. Salma Hassan", type: "Cleaning", start: "15:30", end: "16:00", room: "Chair 1", appointmentStatus: "Confirmed", visitState: "Not arrived" },
  { id: "apt-105", patient: "Hana Youssef", dentist: "Dr. Karim Mostafa", type: "Consultation", start: "16:00", end: "16:30", room: "Chair 2", appointmentStatus: "Confirmed", visitState: "Not arrived" },
];
