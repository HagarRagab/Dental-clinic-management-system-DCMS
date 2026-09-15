import { SettingsScreen } from "@/features/settings/pages/settings-screen";
import type { UserRole } from "@/types";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const { role } = await searchParams;
  const initialRole: UserRole =
    role === "receptionist" || role === "dentist" ? role : "admin";

  return <SettingsScreen initialRole={initialRole} />;
}
