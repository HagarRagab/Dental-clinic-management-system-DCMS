import type { LucideIcon } from "lucide-react";
import type { UserRole } from "@/types";

export type DashboardMetric = { label: string; value: string; detail: string; tone: "primary" | "warning" | "success" | "neutral"; icon: LucideIcon };
export type AppointmentPreview = { time: string; patient: string; service: string; dentist?: string; appointmentStatus: "Confirmed" | "Booked"; visitState: "Waiting" | "Not arrived" | "In progress" };
export type DashboardConfig = { title: string; description: string; metrics: DashboardMetric[]; appointments: AppointmentPreview[]; role: UserRole };
