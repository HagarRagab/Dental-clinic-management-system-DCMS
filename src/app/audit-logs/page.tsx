import { AuditLogsScreen } from "@/features/audit-logs/pages/audit-logs-screen";
import type { UserRole } from "@/types";

export default async function AuditLogsPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const { role } = await searchParams;
  const initialRole: UserRole =
    role === "receptionist" || role === "dentist" ? role : "admin";

  return <AuditLogsScreen initialRole={initialRole} />;
}
