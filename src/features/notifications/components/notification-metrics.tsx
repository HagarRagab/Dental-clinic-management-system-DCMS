import { Clock3, Languages, Mail } from "lucide-react";
import { NotificationTemplate } from "../notification.types";

function NotificationMetrics({
    templates,
    reminderHoursBefore,
}: {
    templates: NotificationTemplate[];
    reminderHoursBefore: number;
}) {
    const activeTemplateCount = templates.filter(
        (template) => template.active,
    ).length;

    return (
        <section
            className="notifications-metrics"
            aria-label="Notification summary"
        >
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
                    <strong>{reminderHoursBefore} hours</strong>
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
    );
}

export default NotificationMetrics;
