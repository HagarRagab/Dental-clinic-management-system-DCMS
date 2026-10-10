"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { dashboardUsers } from "@/features/dashboard/services/mock-dashboard-service";
import { AppointmentDetailPanel } from "@/features/calendar/components/appointment-detail-panel";
import {
    appointmentTypes,
    calendarDentists,
    mockAppointments,
} from "@/features/calendar/services/mock-calendar-service";
import type { CalendarAppointment } from "@/features/calendar/calendar.types";
import type { UserRole } from "@/types";
import CalendarToolbar from "../components/calendar-toolbar";
import CalendarWorkspace from "../components/calendar-workspace";

export function CalendarScreen({ initialRole }: { initialRole: UserRole }) {
    const [role, setRole] = useState<UserRole>(initialRole);
    const [view, setView] = useState<"day" | "week">("day");
    const [dentistFilter, setDentistFilter] = useState("All dentists");
    const [typeFilter, setTypeFilter] = useState("All appointment types");
    const [selected, setSelected] = useState<CalendarAppointment>(
        mockAppointments[0],
    );

    return (
        <AppShell
            activeItem="Calendar"
            role={role}
            userName={dashboardUsers[role]}
            onRoleChange={setRole}
        >
            <div className="calendar-page-heading">
                <div>
                    <p className="page-heading__eyebrow">
                        Appointment management
                    </p>
                    <h1>Calendar</h1>
                    <p>
                        Keep the day moving without losing the clinical context.
                    </p>
                </div>
                {role !== "dentist" ? (
                    <Link
                        href={`/appointments/new?role=${role}`}
                        className="button button--primary page-heading__action"
                    >
                        <Plus aria-hidden="true" />
                        New appointment
                    </Link>
                ) : null}
            </div>

            <CalendarToolbar
                appointmentTypes={appointmentTypes}
                calendarDentists={calendarDentists}
                dentistFilter={dentistFilter}
                role={role}
                setDentistFilter={setDentistFilter}
                setTypeFilter={setTypeFilter}
                setView={setView}
                typeFilter={typeFilter}
                view={view}
            />

            <div className="calendar-layout">
                <CalendarWorkspace
                    appointments={mockAppointments}
                    calendarDentists={calendarDentists}
                    dentistFilter={dentistFilter}
                    role={role}
                    typeFilter={typeFilter}
                    view={view}
                    selected={selected}
                    setSelected={setSelected}
                />
                <AppointmentDetailPanel appointment={selected} role={role} />
            </div>
        </AppShell>
    );
}
