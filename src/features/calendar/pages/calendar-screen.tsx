"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { dashboardUsers } from "@/features/dashboard/services/mock-dashboard-service";
import { AppointmentDetailPanel } from "@/features/calendar/components/appointment-detail-panel";
import {
    appointmentTypes,
    calendarDentists,
    getPatientSlugByName,
    mockAppointments,
} from "@/features/calendar/services/mock-calendar-service";
import type {
    AppointmentStatus,
    CalendarAppointment,
    VisitState,
} from "@/features/calendar/calendar.types";
import type { UserRole } from "@/types";
import CalendarToolbar from "../components/calendar-toolbar";
import CalendarWorkspace from "../components/calendar-workspace";

export function CalendarScreen({ initialRole }: { initialRole: UserRole }) {
    const router = useRouter();
    const [role, setRole] = useState<UserRole>(initialRole);
    const [view, setView] = useState<"day" | "week">("day");
    const [dentistFilter, setDentistFilter] = useState("All dentists");
    const [typeFilter, setTypeFilter] = useState("All appointment types");
    // Default to mock-data date: Saturday 13 Sep 2026
    const [currentDate, setCurrentDate] = useState<Date>(
        () => new Date(2026, 8, 13),
    );
    const [appointments, setAppointments] =
        useState<CalendarAppointment[]>(mockAppointments);
    const [selected, setSelected] = useState<CalendarAppointment>(
        mockAppointments[0],
    );

    /** Mutate one appointment and keep the `selected` panel in sync. */
    const updateAppointment = useCallback(
        (
            id: string,
            patch: Partial<
                Pick<CalendarAppointment, "appointmentStatus" | "visitState">
            >,
        ) => {
            setAppointments((prev) =>
                prev.map((apt) =>
                    apt.id === id ? { ...apt, ...patch } : apt,
                ),
            );
            setSelected((prev) =>
                prev.id === id ? { ...prev, ...patch } : prev,
            );
        },
        [],
    );

    const handleVisitAction = useCallback(
        (appointment: CalendarAppointment) => {
            if (appointment.visitState === "Not arrived") {
                updateAppointment(appointment.id, { visitState: "Waiting" as VisitState });
            } else if (appointment.visitState === "Waiting") {
                updateAppointment(appointment.id, {
                    visitState: "In progress" as VisitState,
                });
            } else if (appointment.visitState === "In progress") {
                updateAppointment(appointment.id, {
                    visitState: "Finished" as VisitState,
                    appointmentStatus: "Completed" as AppointmentStatus,
                });
            }
        },
        [updateAppointment],
    );

    const handleCancel = useCallback(
        (id: string) => {
            updateAppointment(id, {
                appointmentStatus: "Cancelled" as AppointmentStatus,
            });
        },
        [updateAppointment],
    );

    const handleMarkNoShow = useCallback(
        (id: string) => {
            updateAppointment(id, {
                appointmentStatus: "No Show" as AppointmentStatus,
                visitState: "Finished" as VisitState,
            });
        },
        [updateAppointment],
    );

    const handleReschedule = useCallback(
        (appointment: CalendarAppointment) => {
            updateAppointment(appointment.id, {
                appointmentStatus: "Rescheduled" as AppointmentStatus,
            });
            router.push(
                `/appointments/new?role=${role}&patient=${encodeURIComponent(appointment.patient)}&reschedule=${appointment.id}`,
            );
        },
        [role, router, updateAppointment],
    );

    const handleOpenPatient = useCallback(
        (appointment: CalendarAppointment) => {
            const slug = getPatientSlugByName(appointment.patient);
            router.push(`/patients/${slug}?role=${role}`);
        },
        [role, router],
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
                currentDate={currentDate}
                dentistFilter={dentistFilter}
                role={role}
                setCurrentDate={setCurrentDate}
                setDentistFilter={setDentistFilter}
                setTypeFilter={setTypeFilter}
                setView={setView}
                typeFilter={typeFilter}
                view={view}
            />

            <div className="calendar-layout">
                <CalendarWorkspace
                    appointments={appointments}
                    calendarDentists={calendarDentists}
                    dentistFilter={dentistFilter}
                    role={role}
                    typeFilter={typeFilter}
                    view={view}
                    selected={selected}
                    setSelected={setSelected}
                />
                <AppointmentDetailPanel
                    appointment={selected}
                    role={role}
                    onVisitAction={handleVisitAction}
                    onCancel={handleCancel}
                    onMarkNoShow={handleMarkNoShow}
                    onReschedule={handleReschedule}
                    onOpenPatient={handleOpenPatient}
                />
            </div>
        </AppShell>
    );
}
