import { InventoryScreen } from "@/features/inventory/pages/inventory-screen";
import type { UserRole } from "@/types";

export default async function InventoryPage({
    searchParams,
}: {
    searchParams: Promise<{ role?: string }>;
}) {
    const { role } = await searchParams;
    const initialRole: UserRole =
        role === "receptionist" || role === "dentist" ? role : "admin";

    return <InventoryScreen initialRole={initialRole} />;
}

