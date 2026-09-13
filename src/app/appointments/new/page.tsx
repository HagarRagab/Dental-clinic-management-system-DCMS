import { NewAppointmentScreen } from "@/features/appointments/pages/new-appointment-screen";
import type { UserRole } from "@/types";

export default async function NewAppointmentPage({ searchParams }: { searchParams: Promise<{ role?: string }> }) {
  const { role } = await searchParams;
  const initialRole: UserRole = role === "receptionist" ? "receptionist" : "admin";
  return <NewAppointmentScreen initialRole={initialRole} />;
}
