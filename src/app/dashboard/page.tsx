import { DashboardScreen } from "@/features/dashboard/pages/dashboard-screen";
import type { UserRole } from "@/types";

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ role?: string }> }) {
  const { role } = await searchParams;
  const initialRole: UserRole = role === "receptionist" || role === "dentist" ? role : "admin";

  return <DashboardScreen initialRole={initialRole} />;
}
