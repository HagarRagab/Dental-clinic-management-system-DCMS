import {
    Building2,
    CalendarClock,
    CalendarDays,
    ClipboardList,
    Globe,
    Languages,
    Lock,
    ReceiptText,
    Settings,
    ShieldCheck,
    Users,
} from "lucide-react";
import { SettingsSection } from "../settings.types";

export type NavEntry = {
    section: SettingsSection;
    icon: typeof Settings;
    label: string;
    description: string;
};

export const navEntries: NavEntry[] = [
    {
        section: "Clinic",
        icon: Building2,
        label: "Clinic information",
        description: "Name, address, contact, registration",
    },
    {
        section: "Language",
        icon: Languages,
        label: "Language & region",
        description: "Display language, date format",
    },
    {
        section: "Appointment types",
        icon: CalendarDays,
        label: "Appointment types",
        description: "Types, durations, default prices",
    },
    {
        section: "Services",
        icon: ClipboardList,
        label: "Services & procedures",
        description: "Service catalogue and pricing",
    },
    {
        section: "Working hours",
        icon: CalendarClock,
        label: "Working hours",
        description: "Branch open hours and breaks",
    },
    {
        section: "Appointment rules",
        icon: CalendarDays,
        label: "Appointment rules",
        description: "Booking windows, conflicts, confirmations",
    },
    {
        section: "Billing",
        icon: ReceiptText,
        label: "Billing & tax",
        description: "Currency, tax, invoice numbering",
    },
    {
        section: "Notifications",
        icon: Globe,
        label: "Notification templates",
        description: "Email events and sender settings",
    },
    {
        section: "Users",
        icon: Users,
        label: "User management",
        description: "Staff accounts and roles",
    },
    {
        section: "Security",
        icon: Lock,
        label: "Security",
        description: "Passwords, MFA, session timeouts",
    },
    {
        section: "Audit",
        icon: ShieldCheck,
        label: "Audit settings",
        description: "Retention, export, compliance notes",
    },
];
