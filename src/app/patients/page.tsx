import type { UserRole } from "@/types";
import { PatientsListScreen } from "@/features/patients/pages/patients-list-screen";

export default async function PatientsPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const { role } = await searchParams;
  const validRoles: UserRole[] = ["admin", "receptionist", "dentist"];
  const initialRole: UserRole = validRoles.includes(role as UserRole)
    ? (role as UserRole)
    : "admin";

  return <PatientsListScreen initialRole={initialRole} />;
}
