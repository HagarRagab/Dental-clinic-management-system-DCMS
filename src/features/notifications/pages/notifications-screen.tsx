"use client";

import {
    Bell,
    CheckCircle2,
    Clock3,
    Languages,
    Mail,
    Save,
    ShieldAlert,
    Sparkles,
    ToggleLeft,
    ToggleRight,
} from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { dashboardUsers } from "@/features/dashboard/services/mock-dashboard-service";
import type {
    NotificationEvent,
    NotificationTemplate,
    TemplateLanguage,
} from "@/features/notifications/notification.types";
import {
    mockNotificationSettings,
    mockNotificationTemplates,
    mockUpcomingNotifications,
    supportedTemplateVariables,
} from "@/features/notifications/services/mock-notification-service";
import type { UserRole } from "@/types";

const notificationEvents: NotificationEvent[] = [
    "Appointment booking",
    "Appointment confirmation",
    "Appointment rescheduling",
    "Appointment cancellation",
    "Appointment reminder",
];

export function NotificationsScreen({ initialRole }: { initialRole: UserRole }) {
    const [role, setRole] = useState<UserRole>(initialRole);
    const [settings, setSettings] = useState(mockNotificationSettings);
    const [templates, setTemplates] = useState<NotificationTemplate[]>(
        mockNotificationTemplates,
    );
    const [selectedEvent, setSelectedEvent] =
        useState<NotificationEvent>("Appointment reminder");
    const [selectedLanguage, setSelectedLanguage] =
        useState<TemplateLanguage>("English");
    const [feedback, setFeedback] = useState("");

    const selectedTemplate = useMemo(
        () =>
            templates.find(
                (template) =>
                    template.event === selectedEvent &&
                    template.language === selectedLanguage,
            ) ?? templates[0],
        [selectedEvent, selectedLanguage, templates],
    );
    const activeTemplateCount = templates.filter((template) => template.active).length;

    function updateTemplate(update: Partial<NotificationTemplate>) {
        setTemplates((current) =>
            current.map((template) =>
                template.id === selectedTemplate.id
                    ? { ...template, ...update, updatedAt: "15 Sep 2026" }
                    : template,
            ),
        );
    }

    function saveTemplate(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const subject = String(form.get("subject") || "").trim();
        const body = String(form.get("body") || "").trim();
        if (!subject || !body) {
            setFeedback("Add both a subject and message body before saving.");
            return;
        }
        updateTemplate({ subject, body });
        setFeedback(`${selectedLanguage} template saved for ${selectedEvent}.`);
    }

    if (role !== "admin") {
        return (
            <AppShell
                activeItem="Notifications"
                role={role}
                userName={dashboardUsers[role]}
                onRoleChange={setRole}
            >
                <section className="permission-state" aria-labelledby="notifications-access-title">
                    <span className="permission-state__icon">
                        <ShieldAlert aria-hidden="true" />
                    </span>
                    <p className="page-heading__eyebrow">Restricted workspace</p>
                    <h1 id="notifications-access-title">Notification settings are restricted</h1>
                    <p>
                        Email templates and reminder timing are managed by Admins in the
                        MVP so patient communications stay consistent.
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
                        Configure MVP email messages for appointment communications in
                        Arabic and English.
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

            <section className="notifications-metrics" aria-label="Notification summary">
                <article>
                    <span className="notifications-metric__icon">
                        <Mail aria-hidden="true" />
                    </span>
                    <div>
                        <span>Channel</span>
                        <strong>Email</strong>
                        <small>SMS and WhatsApp are Phase 2</small>
                    </div>
                </article>
                <article>
                    <span className="notifications-metric__icon notifications-metric__icon--warning">
                        <Clock3 aria-hidden="true" />
                    </span>
                    <div>
                        <span>Default reminder</span>
                        <strong>{settings.reminderHoursBefore} hours</strong>
                        <small>Before appointment time</small>
                    </div>
                </article>
                <article>
                    <span className="notifications-metric__icon notifications-metric__icon--neutral">
                        <Languages aria-hidden="true" />
                    </span>
                    <div>
                        <span>Active templates</span>
                        <strong>{activeTemplateCount}</strong>
                        <small>Arabic and English supported</small>
                    </div>
                </article>
            </section>

            {feedback ? (
                <p className="notifications-feedback" role="status">
                    <CheckCircle2 aria-hidden="true" />
                    {feedback}
                </p>
            ) : null}

            <section className="notifications-layout" aria-label="Notification settings workspace">
                <article className="notifications-settings-panel">
                    <div className="panel-header">
                        <div>
                            <h2>Email configuration</h2>
                            <p>Clinic-wide sender and reminder rules</p>
                        </div>
                        <Bell aria-hidden="true" />
                    </div>
                    <div className="notification-toggle-row">
                        <div>
                            <strong>Email channel</strong>
                            <span>Used for appointment booking, changes, and reminders</span>
                        </div>
                        <button
                            type="button"
                            className="notification-toggle"
                            aria-pressed={settings.emailEnabled}
                            onClick={() =>
                                setSettings((current) => ({
                                    ...current,
                                    emailEnabled: !current.emailEnabled,
                                }))
                            }
                        >
                            {settings.emailEnabled ? (
                                <ToggleRight aria-hidden="true" />
                            ) : (
                                <ToggleLeft aria-hidden="true" />
                            )}
                            {settings.emailEnabled ? "Enabled" : "Disabled"}
                        </button>
                    </div>
                    <div className="notification-settings-grid">
                        <label>
                            <span>Reminder timing</span>
                            <select
                                value={settings.reminderHoursBefore}
                                onChange={(event) =>
                                    setSettings((current) => ({
                                        ...current,
                                        reminderHoursBefore: Number(event.target.value),
                                    }))
                                }
                            >
                                <option value={48}>48 hours before</option>
                                <option value={24}>24 hours before</option>
                                <option value={2}>2 hours before</option>
                            </select>
                        </label>
                        <label>
                            <span>Sender name</span>
                            <input
                                type="text"
                                value={settings.senderName}
                                onChange={(event) =>
                                    setSettings((current) => ({
                                        ...current,
                                        senderName: event.target.value,
                                    }))
                                }
                            />
                        </label>
                        <label>
                            <span>Reply-to email</span>
                            <input
                                type="email"
                                value={settings.replyToEmail}
                                onChange={(event) =>
                                    setSettings((current) => ({
                                        ...current,
                                        replyToEmail: event.target.value,
                                    }))
                                }
                            />
                        </label>
                    </div>
                    <div className="notification-scope-note">
                        <Sparkles aria-hidden="true" />
                        <span>
                            Delivery-status tracking, retries, SMS, WhatsApp, and advanced
                            consent workflows remain outside the MVP UI.
                        </span>
                    </div>
                </article>

                <aside className="notifications-preview-panel">
                    <div className="panel-header">
                        <div>
                            <h2>Upcoming email queue</h2>
                            <p>Mock preview of scheduled appointment messages</p>
                        </div>
                    </div>
                    <div className="notification-preview-list">
                        {mockUpcomingNotifications.map((notification) => (
                            <article key={notification.id}>
                                <span className="notification-preview-icon">
                                    <Mail aria-hidden="true" />
                                </span>
                                <div>
                                    <strong>{notification.patient}</strong>
                                    <small>{notification.event}</small>
                                    <small>
                                        {notification.scheduledFor} · {notification.language}
                                    </small>
                                </div>
                            </article>
                        ))}
                    </div>
                </aside>
            </section>

            <section className="template-workspace" aria-label="Notification template editor">
                <aside className="template-event-list">
                    <div className="panel-header">
                        <div>
                            <h2>Template events</h2>
                            <p>MVP appointment email triggers</p>
                        </div>
                    </div>
                    {notificationEvents.map((event) => (
                        <button
                            key={event}
                            type="button"
                            className={event === selectedEvent ? "template-event--active" : ""}
                            onClick={() => setSelectedEvent(event)}
                            aria-pressed={event === selectedEvent}
                        >
                            <span>{event}</span>
                            <small>
                                {
                                    templates.filter((template) => template.event === event)
                                        .length
                                }{" "}
                                templates
                            </small>
                        </button>
                    ))}
                </aside>

                <article className="template-editor-panel">
                    <div className="template-editor-header">
                        <div>
                            <p className="panel-kicker">{selectedEvent}</p>
                            <h2>{selectedLanguage} template</h2>
                            <p>Last updated {selectedTemplate.updatedAt}</p>
                        </div>
                        <div className="template-language-switch" role="group" aria-label="Template language">
                            {(["English", "Arabic"] as TemplateLanguage[]).map((language) => (
                                <button
                                    key={language}
                                    type="button"
                                    className={
                                        language === selectedLanguage
                                            ? "template-language-switch__active"
                                            : ""
                                    }
                                    onClick={() => setSelectedLanguage(language)}
                                >
                                    {language}
                                </button>
                            ))}
                        </div>
                    </div>

                    <form className="template-form" onSubmit={saveTemplate}>
                        <label>
                            <span>Subject</span>
                            <input
                                name="subject"
                                type="text"
                                key={`${selectedTemplate.id}-subject`}
                                defaultValue={selectedTemplate.subject}
                                dir={selectedLanguage === "Arabic" ? "rtl" : "ltr"}
                                required
                            />
                        </label>
                        <label>
                            <span>Message body</span>
                            <textarea
                                name="body"
                                key={`${selectedTemplate.id}-body`}
                                defaultValue={selectedTemplate.body}
                                dir={selectedLanguage === "Arabic" ? "rtl" : "ltr"}
                                rows={7}
                                required
                            />
                        </label>
                        <div className="template-variables">
                            <span>Variables</span>
                            <div>
                                {supportedTemplateVariables.map((variable) => (
                                    <code key={variable}>{variable}</code>
                                ))}
                            </div>
                        </div>
                        <div className="template-form__actions">
                            <button
                                type="button"
                                className="button button--secondary"
                                onClick={() =>
                                    updateTemplate({ active: !selectedTemplate.active })
                                }
                            >
                                {selectedTemplate.active ? "Deactivate" : "Activate"}
                            </button>
                            <button type="submit" className="button button--primary">
                                <Save aria-hidden="true" />
                                Save template
                            </button>
                        </div>
                    </form>
                </article>
            </section>
        </AppShell>
    );
}

