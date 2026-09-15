import { NotificationsScreen } from "@/features/notifications/pages/notifications-screen";
import type { UserRole } from "@/types";

export default async function NotificationsPage({
    searchParams,
}: {
    searchParams: Promise<{ role?: string }>;
}) {
    const { role } = await searchParams;
    const initialRole: UserRole =
        role === "receptionist" || role === "dentist" ? role : "admin";

    return <NotificationsScreen initialRole={initialRole} />;
}

