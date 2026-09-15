import { DoctorScheduleScreen } from "@/features/doctors/pages/doctor-schedule-screen";
import type { UserRole } from "@/types";

export default async function DoctorsPage({
    searchParams,
}: {
    searchParams: Promise<{ role?: string }>;
}) {
    const { role } = await searchParams;
    const initialRole: UserRole =
        role === "receptionist" || role === "dentist" ? role : "admin";

    return <DoctorScheduleScreen initialRole={initialRole} />;
}

