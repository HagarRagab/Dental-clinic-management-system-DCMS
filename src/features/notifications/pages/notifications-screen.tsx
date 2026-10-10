"use client";

import { CheckCircle2, Save, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { dashboardUsers } from "@/features/dashboard/services/mock-dashboard-service";
import type { NotificationTemplate } from "@/features/notifications/notification.types";
import {
    mockNotificationSettings,
    mockNotificationTemplates,
    mockUpcomingNotifications,
    supportedTemplateVariables,
} from "@/features/notifications/services/mock-notification-service";
import type { UserRole } from "@/types";
import NotificationMetrics from "../components/notification-metrics";
import NotificationsLayout from "../components/notifications-layout";
import TemplateWorkspace from "../components/template-workspace";

export function NotificationsScreen({
    initialRole,
}: {
    initialRole: UserRole;
}) {
    const [role, setRole] = useState<UserRole>(initialRole);
    const [settings, setSettings] = useState(mockNotificationSettings);
    const [templates, setTemplates] = useState<NotificationTemplate[]>(
        mockNotificationTemplates,
    );
    const [feedback, setFeedback] = useState("");

    if (role !== "admin") {
        return (
            <AppShell
                activeItem="Notifications"
                role={role}
                userName={dashboardUsers[role]}
                onRoleChange={setRole}
            >
                <section
                    className="permission-state"
                    aria-labelledby="notifications-access-title"
                >
                    <span className="permission-state__icon">
                        <ShieldAlert aria-hidden="true" />
                    </span>
                    <p className="page-heading__eyebrow">
                        Restricted workspace
                    </p>
                    <h1 id="notifications-access-title">
                        Notification settings are restricted
                    </h1>
                    <p>
                        Email templates and reminder timing are managed by
                        Admins in the MVP so patient communications stay
                        consistent.
                    </p>
                </section>
            </AppShell>
        );
    }

    return (
        <AppShell
            activeItem="Notifications"
            role={role}
            userName={dashboardUsers[role]}
            onRoleChange={setRole}
        >
            <header className="page-heading notifications-heading">
                <div>
                    <p className="page-heading__eyebrow">Email notifications</p>
                    <h1>Templates and reminders</h1>
                    <p>
                        Configure MVP email messages for appointment
                        communications in Arabic and English.
                    </p>
                </div>
                <button
                    type="button"
                    className="button button--primary page-heading__action"
                    onClick={() => setFeedback("Notification settings saved.")}
                >
                    <Save aria-hidden="true" />
                    Save settings
                </button>
            </header>

            <NotificationMetrics
                templates={templates}
                reminderHoursBefore={settings.reminderHoursBefore}
            />

            {feedback ? (
                <p className="notifications-feedback" role="status">
                    <CheckCircle2 aria-hidden="true" />
                    {feedback}
                </p>
            ) : null}

            <NotificationsLayout
                settings={settings}
                setSettings={setSettings}
                upcomingNotifications={mockUpcomingNotifications}
            />

            <TemplateWorkspace
                setFeedback={setFeedback}
                setTemplates={setTemplates}
                templates={templates}
                supportedTemplateVariables={supportedTemplateVariables}
            />
        </AppShell>
    );
}
