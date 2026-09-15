import { ReportsScreen } from "@/features/reports/pages/reports-screen";
import type { UserRole } from "@/types";

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const { role } = await searchParams;
  const initialRole: UserRole =
    role === "receptionist" || role === "dentist" ? role : "admin";

  return <ReportsScreen initialRole={initialRole} />;
}
