import {
    Dispatch,
    SetStateAction,
    SubmitEvent,
    useMemo,
    useState,
} from "react";
import { Save } from "lucide-react";
import {
    NotificationEvent,
    NotificationTemplate,
    TemplateLanguage,
} from "../notification.types";

const notificationEvents: NotificationEvent[] = [
    "Appointment booking",
    "Appointment confirmation",
    "Appointment rescheduling",
    "Appointment cancellation",
    "Appointment reminder",
];

function TemplateWorkspace({
    setFeedback,
    templates,
    setTemplates,
    supportedTemplateVariables,
}: {
    setFeedback: Dispatch<SetStateAction<string>>;
    templates: NotificationTemplate[];
    setTemplates: Dispatch<SetStateAction<NotificationTemplate[]>>;
    supportedTemplateVariables: string[];
}) {
    const [selectedEvent, setSelectedEvent] = useState<NotificationEvent>(
        "Appointment reminder",
    );
    const [selectedLanguage, setSelectedLanguage] =
        useState<TemplateLanguage>("English");

    const selectedTemplate = useMemo(
        () =>
            templates.find(
                (template) =>
                    template.event === selectedEvent &&
                    template.language === selectedLanguage,
            ) ?? templates[0],
        [selectedEvent, selectedLanguage, templates],
    );

    function updateTemplate(update: Partial<NotificationTemplate>) {
        setTemplates((current) =>
            current.map((template) =>
                template.id === selectedTemplate.id
                    ? { ...template, ...update, updatedAt: "15 Sep 2026" }
                    : template,
            ),
        );
    }

    function saveTemplate(event: SubmitEvent<HTMLFormElement>) {
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

    return (
        <section
            className="template-workspace"
            aria-label="Notification template editor"
        >
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
                        className={
                            event === selectedEvent
                                ? "template-event--active"
                                : ""
                        }
                        onClick={() => setSelectedEvent(event)}
                        aria-pressed={event === selectedEvent}
                    >
                        <span>{event}</span>
                        <small>
                            {
                                templates.filter(
                                    (template) => template.event === event,
                                ).length
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
                    <div
                        className="template-language-switch"
                        role="group"
                        aria-label="Template language"
                    >
                        {(["English", "Arabic"] as TemplateLanguage[]).map(
                            (language) => (
                                <button
                                    key={language}
                                    type="button"
                                    className={
                                        language === selectedLanguage
                                            ? "template-language-switch__active"
                                            : ""
                                    }
                                    onClick={() =>
                                        setSelectedLanguage(language)
                                    }
                                >
                                    {language}
                                </button>
                            ),
                        )}
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
                                updateTemplate({
                                    active: !selectedTemplate.active,
                                })
                            }
                        >
                            {selectedTemplate.active
                                ? "Deactivate"
                                : "Activate"}
                        </button>
                        <button
                            type="submit"
                            className="button button--primary"
                        >
                            <Save aria-hidden="true" />
                            Save template
                        </button>
                    </div>
                </form>
            </article>
        </section>
    );
}

export default TemplateWorkspace;
