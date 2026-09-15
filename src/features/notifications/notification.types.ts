export type NotificationEvent =
    | "Appointment booking"
    | "Appointment confirmation"
    | "Appointment rescheduling"
    | "Appointment cancellation"
    | "Appointment reminder";

export type TemplateLanguage = "English" | "Arabic";

export type NotificationTemplate = {
    id: string;
    event: NotificationEvent;
    language: TemplateLanguage;
    subject: string;
    body: string;
    active: boolean;
    updatedAt: string;
};

export type NotificationSetting = {
    emailEnabled: boolean;
    reminderHoursBefore: number;
    senderName: string;
    replyToEmail: string;
};

export type NotificationPreview = {
    id: string;
    patient: string;
    event: NotificationEvent;
    scheduledFor: string;
    language: TemplateLanguage;
};

