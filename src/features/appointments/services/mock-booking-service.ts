import { mockPatientList } from "@/features/patients/services/mock-patient-list-service";
import { BookingPatient } from "../appointment.types";

export const bookingPatients: BookingPatient[] = mockPatientList.map((p) => ({
    id: p.id,
    name: p.name,
    mobile: p.mobile,
    dob: p.dob,
    alert: p.alerts[0] || undefined,
}));

export function getBookingPatientById(
    idOrSlug?: string | null,
): BookingPatient | undefined {
    if (!idOrSlug) return undefined;
    const norm = idOrSlug.trim().toLowerCase();
    const fromList = mockPatientList.find(
        (p) =>
            p.id.toLowerCase() === norm ||
            (p.profileSlug && p.profileSlug.toLowerCase() === norm) ||
            p.name.toLowerCase().replace(/\s+/g, "-") === norm ||
            p.name.toLowerCase() === norm,
    );
    if (fromList) {
        return {
            id: fromList.id,
            name: fromList.name,
            mobile: fromList.mobile,
            dob: fromList.dob,
            alert: fromList.alerts[0] || undefined,
        };
    }
    return bookingPatients.find(
        (p) => p.id.toLowerCase() === norm || p.name.toLowerCase() === norm,
    );
}

export const bookingDentists = ["Dr. Salma Hassan", "Dr. Karim Mostafa"];
export const bookingAppointmentTypes = [
    "Consultation",
    "Cleaning",
    "Root canal follow-up",
    "Crown fitting",
];
export const availableSlots = [
    "13:00",
    "13:30",
    "14:30",
    "15:00",
    "16:00",
    "16:30",
    "17:00",
];
