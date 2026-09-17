import { ClinicalWorkspaceScreen } from "@/features/clinical/pages/clinical-workspace-screen";
import type { UserRole } from "@/types";

export default async function ClinicalCurrentVisitPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const { role } = await searchParams;
  const initialRole: UserRole =
    role === "receptionist" || role === "admin" ? role : "dentist";

  return <ClinicalWorkspaceScreen initialRole={initialRole} />;
}
