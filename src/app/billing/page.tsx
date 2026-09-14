import { BillingScreen } from "@/features/billing/pages/billing-screen";
import type { UserRole } from "@/types";

export default async function BillingPage({ searchParams }: { searchParams: Promise<{ role?: string }> }) {
  const { role } = await searchParams;
  const initialRole: UserRole = role === "receptionist" ? "receptionist" : "admin";
  return <BillingScreen initialRole={initialRole} />;
}
