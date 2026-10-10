import { Dispatch, SetStateAction } from "react";
import { ShieldAlert } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { UserRole } from "@/types";
import { dashboardUsers } from "@/features/dashboard/services/mock-dashboard-service";

function DoctorReportsScreen({
    role,
    onRoleChange,
}: {
    role: UserRole;
    onRoleChange: Dispatch<SetStateAction<UserRole>>;
}) {
    return (
        <AppShell
            activeItem="Reports"
            role={role}
            userName={dashboardUsers[role]}
            onRoleChange={onRoleChange}
        >
            <section
                className="permission-state"
                aria-labelledby="reports-access-title"
            >
                <span className="permission-state__icon">
                    <ShieldAlert aria-hidden="true" />
                </span>
                <p className="page-heading__eyebrow">Restricted workspace</p>
                <h1 id="reports-access-title">Reports are not available</h1>
                <p>
                    Operational and financial reports are available to Admins
                    and authorised staff. Clinical summaries are part of the
                    clinical workspace, not this reports module.
                </p>
            </section>
        </AppShell>
    );
}

export default DoctorReportsScreen;
