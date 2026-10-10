"use client";

import { Download } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import type { UserRole } from "@/types";
import { mockReportsData } from "@/features/reports/services/mock-reports-service";
import { dashboardUsers } from "@/features/dashboard/services/mock-dashboard-service";
import ReceptionistReportsScreen from "../components/receptionist-reports-screen";
import DoctorReportsScreen from "../components/doctor-reports-screen";
import csvNotice from "../components/csvNotice";
import AdminReportsOverviewTab from "../components/admin-reports-overview-tab";
import AdminReportsAppointmentTab from "../components/admin-reports-appointment-tab";
import AdminReportsRevenueTab from "../components/admin-reports-revenue-tab";
import AdminReportsBalancesTabs from "../components/admin-reports-balances-tabs";
import AdminReportsInventoryTabs from "../components/admin-reports-inventory-tabs";

type ReportSection =
    | "Overview"
    | "Appointments"
    | "Revenue"
    | "Balances"
    | "Inventory";

export function ReportsScreen({ initialRole }: { initialRole: UserRole }) {
    const [role, setRole] = useState<UserRole>(initialRole);
    const [activeSection, setActiveSection] =
        useState<ReportSection>("Overview");

    const data = mockReportsData;
    const totalPaid = data.paymentMethods.reduce(
        (sum, row) => sum + row.amount,
        0,
    );

    if (role === "dentist") {
        return <DoctorReportsScreen role={role} onRoleChange={setRole} />;
    }

    if (role === "receptionist") {
        return (
            <ReceptionistReportsScreen
                role={role}
                onRoleChange={setRole}
                data={data}
            />
        );
    }

    // Admin full reports view
    const sections: ReportSection[] = [
        "Overview",
        "Appointments",
        "Revenue",
        "Balances",
        "Inventory",
    ];

    return (
        <AppShell
            activeItem="Reports"
            role={role}
            userName={dashboardUsers[role]}
            onRoleChange={setRole}
        >
            <header className="page-heading reports-heading">
                <div>
                    <p className="page-heading__eyebrow">
                        Operational &amp; financial
                    </p>
                    <h1>Reports</h1>
                    <p>
                        Branch summary for {data.todayDate}. All figures are
                        mock data for prototype review.
                    </p>
                </div>
                <button
                    type="button"
                    className="button button--secondary"
                    onClick={csvNotice}
                    aria-label="Export current report as CSV (mock)"
                >
                    <Download aria-hidden="true" />
                    Export CSV
                </button>
            </header>

            {/* Section tabs */}
            <div
                className="reports-tabs"
                role="tablist"
                aria-label="Report sections"
            >
                {sections.map((section) => (
                    <button
                        key={section}
                        type="button"
                        role="tab"
                        aria-selected={activeSection === section}
                        className={
                            activeSection === section
                                ? "reports-tab--active"
                                : ""
                        }
                        onClick={() => setActiveSection(section)}
                    >
                        {section}
                    </button>
                ))}
            </div>

            {/* ── OVERVIEW ── */}
            {activeSection === "Overview" && (
                <AdminReportsOverviewTab data={data} totalPaid={totalPaid} />
            )}

            {/* ── APPOINTMENTS ── */}
            {activeSection === "Appointments" && (
                <AdminReportsAppointmentTab data={data} />
            )}

            {/* ── REVENUE ── */}
            {activeSection === "Revenue" && (
                <AdminReportsRevenueTab data={data} totalPaid={totalPaid} />
            )}

            {/* ── BALANCES ── */}
            {activeSection === "Balances" && (
                <AdminReportsBalancesTabs data={data} />
            )}

            {/* ── INVENTORY ── */}
            {activeSection === "Inventory" && (
                <AdminReportsInventoryTabs data={data} />
            )}
        </AppShell>
    );
}
