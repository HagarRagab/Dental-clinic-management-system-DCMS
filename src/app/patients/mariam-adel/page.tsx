import { PatientProfileScreen } from "@/features/patients/pages/patient-profile-screen";
import type { UserRole } from "@/types";

export default async function MariamAdelPatientPage({ searchParams }: { searchParams: Promise<{ role?: string }> }) {
  const { role } = await searchParams;
  const initialRole: UserRole = role === "receptionist" || role === "dentist" ? role : "admin";
  return <PatientProfileScreen initialRole={initialRole} />;
}
