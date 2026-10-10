import { NewAppointmentScreen } from "@/features/appointments/pages/new-appointment-screen";
import type { UserRole } from "@/types";

export default async function NewAppointmentPage({
    searchParams,
}: {
    searchParams: Promise<{ role?: string; patientId?: string }>;
}) {
    const { role, patientId } = await searchParams;
    const initialRole: UserRole =
        role === "dentist"
            ? "dentist"
            : role === "receptionist"
              ? "receptionist"
              : "admin";
    return (
        <NewAppointmentScreen
            initialRole={initialRole}
            initialPatientId={patientId}
        />
    );
}
