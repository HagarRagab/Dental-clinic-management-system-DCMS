"use client";

import { CalendarPlus } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { AppointmentList } from "@/features/dashboard/components/appointment-list";
import { DashboardAside } from "@/features/dashboard/components/dashboard-aside";
import { MetricCard } from "@/features/dashboard/components/metric-card";
import { dashboardUsers, getMockDashboard } from "@/features/dashboard/services/mock-dashboard-service";
import type { UserRole } from "@/types";

export function DashboardScreen({ initialRole }: { initialRole: UserRole }) {
  const [role, setRole] = useState<UserRole>(initialRole);
  const dashboard = getMockDashboard(role);
  return <AppShell activeItem={role === "dentist" ? "Today" : "Dashboard"} role={role} userName={dashboardUsers[role]} onRoleChange={setRole}><div className="page-heading"><div><p className="page-heading__eyebrow">Saturday, 13 September</p><h1>{dashboard.title}</h1><p>{dashboard.description}</p></div>{role !== "dentist" ? <button className="button button--primary page-heading__action" type="button"><CalendarPlus aria-hidden="true" /> New appointment</button> : null}</div><section className="metric-grid" aria-label="Today at a glance">{dashboard.metrics.map((metric) => <MetricCard key={metric.label} {...metric} />)}</section><div className="dashboard-grid"><AppointmentList appointments={dashboard.appointments} role={role} /><DashboardAside role={role} /></div></AppShell>;
}
