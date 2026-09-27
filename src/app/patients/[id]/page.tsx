import { PatientProfileScreen } from "@/features/patients/pages/patient-profile-screen";
import type { UserRole } from "@/types";

export default async function PatientPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ role?: string }>;
}) {
  const { id } = await params;
  const { role } = await searchParams;
  const initialRole: UserRole = role === "receptionist" || role === "dentist" ? role : "admin";

  return <PatientProfileScreen initialRole={initialRole} patientId={id} />;
}
