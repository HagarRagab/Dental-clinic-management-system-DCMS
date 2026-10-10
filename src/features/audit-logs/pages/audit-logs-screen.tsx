"use client";

import {
    ClipboardList,
    FileText,
    Globe,
    Lock,
    Package,
    ReceiptText,
    ShieldAlert,
    Stethoscope,
} from "lucide-react";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import type { UserRole } from "@/types";
import type {
    AuditEvent,
    AuditModule,
    AuditModuleFilter,
    AuditResultFilter,
} from "@/features/audit-logs/audit-logs.types";
import { mockAuditEvents } from "@/features/audit-logs/services/mock-audit-logs-service";
import { dashboardUsers } from "@/features/dashboard/services/mock-dashboard-service";
import SummaryChips from "../components/summary-chips";
import Toolbar from "../components/toolbar";
import EventList from "../components/event-list";
import DetailPanel from "../components/detail-panel";

function moduleIcon(module: AuditModule) {
    switch (module) {
        case "Clinical":
            return <Stethoscope aria-hidden="true" />;
        case "Billing":
            return <ReceiptText aria-hidden="true" />;
        case "Inventory":
            return <Package aria-hidden="true" />;
        case "Appointments":
            return <ClipboardList aria-hidden="true" />;
        case "Auth":
            return <Lock aria-hidden="true" />;
        case "Reports":
            return <FileText aria-hidden="true" />;
        case "Settings":
            return <Globe aria-hidden="true" />;
    }
}

function resultClass(result: AuditEvent["result"]) {
    switch (result) {
        case "Success":
            return "audit-result--success";
        case "Denied":
            return "audit-result--denied";
        case "Warning":
            return "audit-result--warning";
    }
}

export function AuditLogsScreen({ initialRole }: { initialRole: UserRole }) {
    const [role, setRole] = useState<UserRole>(initialRole);
    const [query, setQuery] = useState("");
    const [moduleFilter, setModuleFilter] = useState<AuditModuleFilter>("All");
    const [resultFilter, setResultFilter] = useState<AuditResultFilter>("All");
    const [selectedId, setSelectedId] = useState<string>(mockAuditEvents[0].id);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return mockAuditEvents.filter((ev) => {
            if (moduleFilter !== "All" && ev.module !== moduleFilter)
                return false;
            if (resultFilter !== "All" && ev.result !== resultFilter)
                return false;
            if (
                q &&
                ![ev.action, ev.user, ev.entity, ev.module, ev.result]
                    .join(" ")
                    .toLowerCase()
                    .includes(q)
            )
                return false;
            return true;
        });
    }, [query, moduleFilter, resultFilter]);

    if (role !== "admin") {
        return (
            <AppShell
                activeItem="Audit logs"
                role={role}
                userName={dashboardUsers[role]}
                onRoleChange={setRole}
            >
                <section
                    className="permission-state"
                    aria-labelledby="audit-access-title"
                >
                    <span className="permission-state__icon">
                        <ShieldAlert aria-hidden="true" />
                    </span>
                    <p className="page-heading__eyebrow">
                        Restricted workspace
                    </p>
                    <h1 id="audit-access-title">Audit logs are admin-only</h1>
                    <p>
                        The audit log contains sensitive access and financial
                        records. Only Admins may inspect audit events. Contact
                        your system administrator if you believe you need
                        access.
                    </p>
                </section>
            </AppShell>
        );
    }

    return (
        <AppShell
            activeItem="Audit logs"
            role={role}
            userName={dashboardUsers[role]}
            onRoleChange={setRole}
        >
            <header className="page-heading">
                <div>
                    <p className="page-heading__eyebrow">
                        Compliance &amp; security
                    </p>
                    <h1>Audit logs</h1>
                    <p>
                        Immutable record of sensitive actions, access events,
                        and administrative changes. Mock data — real persistence
                        requires the backend.
                    </p>
                </div>
            </header>

            {/* Summary chips */}
            <SummaryChips
                auditEvents={mockAuditEvents}
                resultFilter={resultFilter}
                setResultFilter={setResultFilter}
            />

            {/* Toolbar */}
            <Toolbar
                setQuery={setQuery}
                setModuleFilter={setModuleFilter}
                setResultFilter={setResultFilter}
                moduleFilter={moduleFilter}
                query={query}
                resultFilter={resultFilter}
            />

            <div className="audit-layout">
                {/* ── Event list ── */}
                <EventList
                    filtered={filtered}
                    selectedId={selectedId}
                    setSelectedId={setSelectedId}
                    moduleIcon={moduleIcon}
                    resultClass={resultClass}
                    auditEvents={mockAuditEvents}
                />

                {/* ── Detail panel ── */}
                <DetailPanel
                    moduleIcon={moduleIcon}
                    auditEvents={mockAuditEvents}
                    selectedId={selectedId}
                    filtered={filtered}
                    resultClass={resultClass}
                />
            </div>
        </AppShell>
    );
}
