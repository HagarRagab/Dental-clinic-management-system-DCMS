import { ServicesScreen } from "@/features/services/pages/services-screen";
import type { UserRole } from "@/types";

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const { role } = await searchParams;
  const initialRole: UserRole =
    role === "receptionist" || role === "dentist" ? role : "admin";

  return <ServicesScreen initialRole={initialRole} />;
}
