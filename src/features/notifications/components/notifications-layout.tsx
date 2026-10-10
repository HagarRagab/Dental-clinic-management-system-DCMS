import { Dispatch, SetStateAction } from "react";
import { Bell, Mail, Sparkles, ToggleLeft, ToggleRight } from "lucide-react";
import { NotificationPreview, NotificationSetting } from "../notification.types";

function NotificationsLayout({
    settings,
    setSettings,
    upcomingNotifications,
}: {
    settings: NotificationSetting;
    setSettings: Dispatch<SetStateAction<NotificationSetting>>;
    upcomingNotifications: NotificationPreview[];
}) {
    return (
        <section
            className="notifications-layout"
            aria-label="Notification settings workspace"
        >
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
                        <span>
                            Used for appointment booking, changes, and reminders
                        </span>
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
                                    reminderHoursBefore: Number(
                                        event.target.value,
                                    ),
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
                        Delivery-status tracking, retries, SMS, WhatsApp, and
                        advanced consent workflows remain outside the MVP UI.
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
                    {upcomingNotifications.map((notification) => (
                        <article key={notification.id}>
                            <span className="notification-preview-icon">
                                <Mail aria-hidden="true" />
                            </span>
                            <div>
                                <strong>{notification.patient}</strong>
                                <small>{notification.event}</small>
                                <small>
                                    {notification.scheduledFor} ·{" "}
                                    {notification.language}
                                </small>
                            </div>
                        </article>
                    ))}
                </div>
            </aside>
        </section>
    );
}

export default NotificationsLayout;
