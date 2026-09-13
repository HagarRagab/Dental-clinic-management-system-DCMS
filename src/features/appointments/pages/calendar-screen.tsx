"use client";

import { ChevronLeft, ChevronRight, Filter, ListFilter, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { dashboardUsers } from "@/features/dashboard/services/mock-dashboard-service";
import { AppointmentDetailPanel } from "@/features/appointments/components/appointment-detail-panel";
import { CalendarAppointmentCard } from "@/features/appointments/components/calendar-appointment-card";
import { appointmentTypes, calendarDentists, mockAppointments } from "@/features/appointments/services/mock-calendar-service";
import type { CalendarAppointment } from "@/features/appointments/appointment.types";
import type { UserRole } from "@/types";

const timeSlots = ["13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"];

export function CalendarScreen({ initialRole }: { initialRole: UserRole }) {
  const [role, setRole] = useState<UserRole>(initialRole);
  const [view, setView] = useState<"day" | "week">("day");
  const [dentistFilter, setDentistFilter] = useState("All dentists");
  const [typeFilter, setTypeFilter] = useState("All appointment types");
  const [selected, setSelected] = useState<CalendarAppointment>(mockAppointments[0]);
  const dentists = role === "dentist" ? ["Dr. Karim Mostafa"] : dentistFilter === "All dentists" ? calendarDentists.slice(1) : [dentistFilter];
  const visibleAppointments = useMemo(() => mockAppointments.filter((appointment) => (dentistFilter === "All dentists" || appointment.dentist === dentistFilter) && (typeFilter === "All appointment types" || appointment.type === typeFilter)), [dentistFilter, typeFilter]);

  return <AppShell activeItem="Calendar" role={role} userName={dashboardUsers[role]} onRoleChange={setRole}><div className="calendar-page-heading"><div><p className="page-heading__eyebrow">Appointment management</p><h1>Calendar</h1><p>Keep the day moving without losing the clinical context.</p></div>{role !== "dentist" ? <button className="button button--primary page-heading__action" type="button"><Plus aria-hidden="true" />New appointment</button> : null}</div><section className="calendar-toolbar" aria-label="Calendar controls"><div className="calendar-toolbar__date"><button type="button" className="icon-button" aria-label="Previous day"><ChevronLeft aria-hidden="true" /></button><button type="button" className="calendar-date-button">Today <span>Saturday, 13 September</span></button><button type="button" className="icon-button" aria-label="Next day"><ChevronRight aria-hidden="true" /></button></div><div className="calendar-toolbar__filters"><div className="calendar-segmented" role="group" aria-label="Calendar view"><button type="button" className={view === "day" ? "calendar-segmented__active" : ""} onClick={() => setView("day")}>Day</button><button type="button" className={view === "week" ? "calendar-segmented__active" : ""} onClick={() => setView("week")}>Week</button></div>{role !== "dentist" ? <label className="calendar-filter"><Filter aria-hidden="true" /><select value={dentistFilter} onChange={(event) => setDentistFilter(event.target.value)} aria-label="Filter by dentist">{calendarDentists.map((dentist) => <option key={dentist}>{dentist}</option>)}</select></label> : null}<label className="calendar-filter"><ListFilter aria-hidden="true" /><select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} aria-label="Filter by appointment type">{appointmentTypes.map((type) => <option key={type}>{type}</option>)}</select></label></div></section><div className="calendar-layout"><section className="calendar-workspace" aria-label={`${view} appointment calendar`}><div className="calendar-legend"><span><i className="legend-dot legend-dot--confirmed" />Appointment status: Confirmed</span><span><i className="legend-dot legend-dot--booked" />Appointment status: Booked</span><span><i className="legend-dot legend-dot--waiting" />Visit state: Waiting</span></div><div className={`calendar-board calendar-board--${view}`}><div className="calendar-board__header"><span>Time</span>{dentists.map((dentist) => <strong key={dentist}>{view === "week" ? `${dentist.split(" ").slice(0, 2).join(" ")} · Sat 13` : dentist}</strong>)}</div><div className="calendar-board__body">{timeSlots.map((time) => <div className="calendar-time-row" key={time}><time>{time}</time>{dentists.map((dentist) => <div className="calendar-time-cell" key={`${time}-${dentist}`}>{visibleAppointments.filter((appointment) => appointment.dentist === dentist && appointment.start === time).map((appointment) => <CalendarAppointmentCard key={appointment.id} appointment={appointment} isSelected={selected.id === appointment.id} onSelect={setSelected} />)}</div>)}</div>)}</div></div></section><AppointmentDetailPanel appointment={selected} role={role} /></div></AppShell>;
}
