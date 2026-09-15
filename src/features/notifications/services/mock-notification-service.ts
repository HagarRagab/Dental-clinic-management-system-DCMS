import type {
    NotificationPreview,
    NotificationSetting,
    NotificationTemplate,
} from "@/features/notifications/notification.types";

export const mockNotificationSettings: NotificationSetting = {
    emailEnabled: true,
    reminderHoursBefore: 24,
    senderName: "DCMS Dental Clinic",
    replyToEmail: "reception@dcms.example",
};

export const mockNotificationTemplates: NotificationTemplate[] = [
    {
        id: "template-booking-en",
        event: "Appointment booking",
        language: "English",
        subject: "Your appointment is booked",
        body: "Hello {{patient_name}}, your appointment with {{dentist_name}} is booked for {{appointment_date}} at {{appointment_time}}.",
        active: true,
        updatedAt: "15 Sep 2026",
    },
    {
        id: "template-booking-ar",
        event: "Appointment booking",
        language: "Arabic",
        subject: "تم حجز موعدك",
        body: "مرحباً {{patient_name}}، تم حجز موعدك مع {{dentist_name}} يوم {{appointment_date}} الساعة {{appointment_time}}.",
        active: true,
        updatedAt: "15 Sep 2026",
    },
    {
        id: "template-reminder-en",
        event: "Appointment reminder",
        language: "English",
        subject: "Appointment reminder",
        body: "Hello {{patient_name}}, this is a reminder for your appointment at {{clinic_name}} on {{appointment_date}} at {{appointment_time}}.",
        active: true,
        updatedAt: "14 Sep 2026",
    },
    {
        id: "template-reminder-ar",
        event: "Appointment reminder",
        language: "Arabic",
        subject: "تذكير بالموعد",
        body: "مرحباً {{patient_name}}، هذا تذكير بموعدك في {{clinic_name}} يوم {{appointment_date}} الساعة {{appointment_time}}.",
        active: true,
        updatedAt: "14 Sep 2026",
    },
    {
        id: "template-cancel-en",
        event: "Appointment cancellation",
        language: "English",
        subject: "Appointment cancelled",
        body: "Hello {{patient_name}}, your appointment on {{appointment_date}} at {{appointment_time}} has been cancelled.",
        active: true,
        updatedAt: "12 Sep 2026",
    },
];

export const mockUpcomingNotifications: NotificationPreview[] = [
    {
        id: "preview-001",
        patient: "Mariam Adel",
        event: "Appointment reminder",
        scheduledFor: "16 Sep 2026 · 14:00",
        language: "English",
    },
    {
        id: "preview-002",
        patient: "Omar Nabil",
        event: "Appointment booking",
        scheduledFor: "15 Sep 2026 · 15:15",
        language: "Arabic",
    },
    {
        id: "preview-003",
        patient: "Laila Ahmed",
        event: "Appointment rescheduling",
        scheduledFor: "15 Sep 2026 · 16:30",
        language: "English",
    },
];

export const supportedTemplateVariables = [
    "{{patient_name}}",
    "{{dentist_name}}",
    "{{appointment_date}}",
    "{{appointment_time}}",
    "{{clinic_name}}",
];

