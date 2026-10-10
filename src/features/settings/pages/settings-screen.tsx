"use client";

import { CheckCircle2, ShieldAlert, X } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import type { UserRole } from "@/types";
import type { SettingsSection } from "@/features/settings/settings.types";
import { dashboardUsers } from "@/features/dashboard/services/mock-dashboard-service";
import { navEntries } from "../services/nav-entries";
import SidebarNav from "../components/sidebar-nav";
import ClinicInformation from "../components/clinic-info";
import Language from "../components/language";
import AppointmentTypes from "../components/appointment-types";
import Services from "../components/services";
import WorkingHours from "../components/working-hours";
import AppointmentRules from "../components/appointment-rules";
import Billing from "../components/billing";
import Notifications from "../components/notifications";
import Users from "../components/users";
import Security from "../components/security";
import Audit from "../components/audit";
import { mockSettingsData } from "../services/mock-settings-service";

export function SettingsScreen({ initialRole }: { initialRole: UserRole }) {
    const [role, setRole] = useState<UserRole>(initialRole);
    const [active, setActive] = useState<SettingsSection>("Clinic");
    const [feedback, setFeedback] = useState("");

    function showSaved() {
        setFeedback(
            "Settings saved (mock — changes are local only and reset on refresh).",
        );
    }

    const activeEntry = navEntries.find((n) => n.section === active)!;

    if (role !== "admin") {
        return (
            <AppShell
                activeItem="Settings"
                role={role}
                userName={dashboardUsers[role]}
                onRoleChange={setRole}
            >
                <section
                    className="permission-state"
                    aria-labelledby="settings-access-title"
                >
                    <span className="permission-state__icon">
                        <ShieldAlert aria-hidden="true" />
                    </span>
                    <p className="page-heading__eyebrow">
                        Restricted workspace
                    </p>
                    <h1 id="settings-access-title">Settings are admin-only</h1>
                    <p>
                        Clinic configuration is available to Admins only.
                        Contact your system administrator if you need a setting
                        changed.
                    </p>
                </section>
            </AppShell>
        );
    }

    return (
        <AppShell
            activeItem="Settings"
            role={role}
            userName={dashboardUsers[role]}
            onRoleChange={setRole}
        >
            <header className="page-heading">
                <div>
                    <p className="page-heading__eyebrow">
                        Clinic configuration
                    </p>
                    <h1>Settings</h1>
                    <p>
                        Manage clinic-wide configuration. Changes are local and
                        reset on refresh until a backend is connected.
                    </p>
                </div>
            </header>

            {feedback ? (
                <p className="settings-feedback" role="status">
                    <CheckCircle2 aria-hidden="true" />
                    {feedback}
                    <button
                        type="button"
                        aria-label="Dismiss message"
                        onClick={() => setFeedback("")}
                    >
                        <X aria-hidden="true" />
                    </button>
                </p>
            ) : null}

            <div className="settings-layout">
                {/* ── Sidebar nav ── */}
                <SidebarNav active={active} setActive={setActive} />

                {/* ── Detail panel ── */}
                <div className="settings-detail">
                    <div className="settings-detail__header">
                        <span className="settings-detail__icon">
                            <activeEntry.icon aria-hidden="true" />
                        </span>
                        <div>
                            <h2>{activeEntry.label}</h2>
                            <p>{activeEntry.description}</p>
                        </div>
                    </div>

                    {/* ── Clinic information ── */}
                    {active === "Clinic" && (
                        <ClinicInformation
                            showSaved={showSaved}
                            settingsData={mockSettingsData.clinic}
                        />
                    )}

                    {/* ── Language ── */}
                    {active === "Language" && <Language />}

                    {/* ── Appointment types ── */}
                    {active === "Appointment types" && (
                        <AppointmentTypes
                            settingsData={mockSettingsData.appointmentTypes}
                        />
                    )}

                    {/* ── Services ── */}
                    {active === "Services" && (
                        <Services settingsData={mockSettingsData.services} />
                    )}

                    {/* ── Working hours ── */}
                    {active === "Working hours" && (
                        <WorkingHours
                            settingsData={mockSettingsData.workingHours}
                        />
                    )}

                    {/* ── Appointment rules ── */}
                    {active === "Appointment rules" && (
                        <AppointmentRules
                            showSaved={showSaved}
                            settingsData={mockSettingsData.appointmentRules}
                        />
                    )}

                    {/* ── Billing ── */}
                    {active === "Billing" && (
                        <Billing
                            showSaved={showSaved}
                            settingsData={mockSettingsData.billing}
                        />
                    )}

                    {/* ── Notifications ── */}
                    {active === "Notifications" && <Notifications />}

                    {/* ── Users ── */}
                    {active === "Users" && (
                        <Users settingsData={mockSettingsData.users} />
                    )}

                    {/* ── Security ── */}
                    {active === "Security" && (
                        <Security
                            showSaved={showSaved}
                            settingsData={mockSettingsData.security}
                        />
                    )}

                    {/* ── Audit ── */}
                    {active === "Audit" && <Audit />}
                </div>
            </div>
        </AppShell>
    );
}
