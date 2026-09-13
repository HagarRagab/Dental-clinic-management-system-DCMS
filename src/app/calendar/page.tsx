import { CalendarScreen } from "@/features/appointments/pages/calendar-screen";
import type { UserRole } from "@/types";

export default async function CalendarPage({ searchParams }: { searchParams: Promise<{ role?: string }> }) {
  const { role } = await searchParams;
  const initialRole: UserRole = role === "receptionist" || role === "dentist" ? role : "admin";
  return <CalendarScreen initialRole={initialRole} />;
}
