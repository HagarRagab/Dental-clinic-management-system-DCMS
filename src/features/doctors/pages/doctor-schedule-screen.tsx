"use client";

import {
    AlertTriangle,
    CalendarClock,
    CheckCircle2,
    Clock3,
    Coffee,
    History,
    Plus,
    Search,
    ShieldAlert,
    Stethoscope,
    UserRound,
    X,
} from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { dashboardUsers } from "@/features/dashboard/services/mock-dashboard-service";
import type {
    BlockedSlot,
    DoctorProfile,
} from "@/features/doctors/doctor-schedule.types";
import {
    mockAvailability,
    mockBlockedSlots,
    mockDoctors,
} from "@/features/doctors/services/mock-doctor-schedule-service";
import type { UserRole } from "@/types";

function doctorStatusClass(status: DoctorProfile["status"]) {
    return status.toLowerCase().replaceAll(" ", "-");
}

function slotStatusClass(status: string) {
    return status.toLowerCase();
}

export function DoctorScheduleScreen({
    initialRole,
}: {
    initialRole: UserRole;
}) {
    const [role, setRole] = useState<UserRole>(initialRole);
    const [doctors, setDoctors] = useState<DoctorProfile[]>(mockDoctors);
    const [blockedSlots, setBlockedSlots] =
        useState<BlockedSlot[]>(mockBlockedSlots);
    const [selectedDoctorId, setSelectedDoctorId] = useState("doctor-karim");
    const [doctorQuery, setDoctorQuery] = useState("");
    const [feedback, setFeedback] = useState("");

    const selectedDoctor =
        doctors.find((doctor) => doctor.id === selectedDoctorId) ?? doctors[0];
    const selectedBlockedSlots = blockedSlots.filter(
        (slot) => slot.doctorId === selectedDoctor.id,
    );
    const filteredDoctors = useMemo(() => {
        const normalizedQuery = doctorQuery.trim().toLowerCase();
        if (!normalizedQuery) {
            return doctors;
        }
        return doctors.filter((doctor) =>
            [doctor.name, doctor.specialty, doctor.branch, doctor.status].some(
                (value) => value.toLowerCase().includes(normalizedQuery),
            ),
        );
    }, [doctorQuery, doctors]);
    const totalAppointments = doctors.reduce(
        (sum, doctor) => sum + doctor.appointmentCountToday,
        0,
    );
    const activeDoctors = doctors.filter(
        (doctor) => doctor.status === "Active",
    ).length;
    const blockedToday = blockedSlots.filter(
        (slot) => slot.date === "15 Sep 2026",
    ).length;

    function updateWorkingDay(
        dayName: string,
        field: "start" | "end" | "isOpen",
        value: string | boolean,
    ) {
        setDoctors((current) =>
            current.map((doctor) =>
                doctor.id === selectedDoctor.id
                    ? {
                          ...doctor,
                          workingDays: doctor.workingDays.map((day) =>
                              day.day === dayName
                                  ? { ...day, [field]: value }
                                  : day,
                          ),
                      }
                    : doctor,
            ),
        );
        setFeedback(
            `${selectedDoctor.name}'s ${dayName} schedule was updated.`,
        );
    }

    function addBlockedSlot(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const start = String(form.get("start"));
        const end = String(form.get("end"));
        const reason = String(form.get("reason") || "").trim();
        if (!start || !end || start >= end || !reason) {
            setFeedback(
                "Enter a valid time range and reason for the blocked slot.",
            );
            return;
        }
        const slot: BlockedSlot = {
            id: `blocked-${Date.now()}`,
            doctorId: selectedDoctor.id,
            date: String(form.get("date")),
            start,
            end,
            type: "Blocked time",
            reason,
        };
        setBlockedSlots((current) => [slot, ...current]);
        setFeedback(
            `${selectedDoctor.name} is blocked on ${slot.date} from ${start} to ${end}.`,
        );
        event.currentTarget.reset();
    }

    if (role !== "admin") {
        return (
            <AppShell
                activeItem="Doctors"
                role={role}
                userName={dashboardUsers[role]}
                onRoleChange={setRole}
            >
                <section
                    className="permission-state"
                    aria-labelledby="doctor-access-title"
                >
                    <span className="permission-state__icon">
                        <ShieldAlert aria-hidden="true" />
                    </span>
                    <p className="page-heading__eyebrow">
                        Restricted workspace
                    </p>
                    <h1 id="doctor-access-title">
                        Doctor schedule settings are restricted
                    </h1>
                    <p>
                        Working hours, leave, and blocked slots affect
                        appointment availability, so they are managed by Admins
                        in the MVP.
                    </p>
                </section>
            </AppShell>
        );
    }

    return (
        <AppShell
            activeItem="Doctors"
            role={role}
            userName={dashboardUsers[role]}
            onRoleChange={setRole}
        >
            <header className="page-heading doctor-heading">
                <div>
                    <p className="page-heading__eyebrow">Doctor schedule</p>
                    <h1>Doctors and availability</h1>
                    <p>
                        Configure working hours, breaks, leave, and blocked time
                        without touching appointment history.
                    </p>
                </div>
                <button
                    type="button"
                    className="button button--primary page-heading__action"
                    onClick={() =>
                        document
                            .getElementById("blocked-time-form")
                            ?.scrollIntoView({
                                behavior: "smooth",
                                block: "start",
                            })
                    }
                >
                    <Plus aria-hidden="true" />
                    Block time
                </button>
            </header>

            <section
                className="doctor-metrics"
                aria-label="Doctor schedule summary"
            >
                <article>
                    <span className="doctor-metric__icon">
                        <Stethoscope aria-hidden="true" />
                    </span>
                    <div>
                        <span>Active dentists</span>
                        <strong>{activeDoctors}</strong>
                        <small>{doctors.length} total profiles</small>
                    </div>
                </article>
                <article>
                    <span className="doctor-metric__icon doctor-metric__icon--warning">
                        <CalendarClock aria-hidden="true" />
                    </span>
                    <div>
                        <span>Appointments today</span>
                        <strong>{totalAppointments}</strong>
                        <small>Across all dentists</small>
                    </div>
                </article>
                <article>
                    <span className="doctor-metric__icon doctor-metric__icon--neutral">
                        <Clock3 aria-hidden="true" />
                    </span>
                    <div>
                        <span>Blocked periods</span>
                        <strong>{blockedToday}</strong>
                        <small>Today</small>
                    </div>
                </article>
            </section>

            {feedback ? (
                <p className="doctor-feedback" role="status">
                    <CheckCircle2 aria-hidden="true" />
                    {feedback}
                    <button
                        type="button"
                        aria-label="Dismiss schedule message"
                        onClick={() => setFeedback("")}
                    >
                        <X aria-hidden="true" />
                    </button>
                </p>
            ) : null}

            <section
                className="doctor-schedule-layout"
                aria-label="Doctor schedule workspace"
            >
                <aside className="doctor-list-panel">
                    <div className="panel-header doctor-panel-header">
                        <div>
                            <h2>Dentists</h2>
                            <p>Select a doctor to configure availability</p>
                        </div>
                        <div className="doctor-search">
                            <Search aria-hidden="true" />
                            <input
                                type="search"
                                value={doctorQuery}
                                onChange={(event) =>
                                    setDoctorQuery(event.target.value)
                                }
                                placeholder="Search doctors"
                                aria-label="search doctors"
                            />
                        </div>
                    </div>
                    <div className="doctor-list">
                        {filteredDoctors.map((doctor) => (
                            <button
                                key={doctor.id}
                                type="button"
                                className={`doctor-list-item ${selectedDoctor.id === doctor.id ? "doctor-list-item--active" : ""}`}
                                onClick={() => {
                                    setSelectedDoctorId(doctor.id);
                                    setFeedback("");
                                }}
                                aria-pressed={selectedDoctor.id === doctor.id}
                            >
                                <span className="doctor-avatar">
                                    {doctor.initials}
                                </span>
                                <span>
                                    <strong>{doctor.name}</strong>
                                    <small>{doctor.specialty}</small>
                                </span>
                                <em
                                    className={`doctor-status doctor-status--${doctorStatusClass(doctor.status)}`}
                                >
                                    {doctor.status}
                                </em>
                            </button>
                        ))}
                    </div>
                </aside>

                <article className="doctor-profile-panel">
                    <div className="doctor-profile-header">
                        <div className="doctor-profile-identity">
                            <span className="doctor-profile-avatar">
                                {selectedDoctor.initials}
                            </span>
                            <div>
                                <p className="panel-kicker">Selected doctor</p>
                                <h2>{selectedDoctor.name}</h2>
                                <p>
                                    {selectedDoctor.specialty} -{" "}
                                    {selectedDoctor.branch}
                                </p>
                            </div>
                        </div>
                        <span
                            className={`doctor-status doctor-status--${doctorStatusClass(selectedDoctor.status)}`}
                        >
                            {selectedDoctor.status}
                        </span>
                    </div>

                    <div className="doctor-profile-summary">
                        <div>
                            <span>Appointments today</span>
                            <strong>
                                {selectedDoctor.appointmentCountToday}
                            </strong>
                        </div>
                        <div>
                            <span>Next available</span>
                            <strong>{selectedDoctor.nextAvailable}</strong>
                        </div>
                    </div>

                    <section
                        className="working-hours-panel"
                        aria-labelledby="working-hours-title"
                    >
                        <div className="panel-header">
                            <div>
                                <h2 id="working-hours-title">Working hours</h2>
                                <p>Per-day availability for the main branch</p>
                            </div>
                        </div>
                        <div className="working-hours-list">
                            {selectedDoctor.workingDays.map((day) => (
                                <article key={day.day}>
                                    <label className="working-day-toggle">
                                        <input
                                            type="checkbox"
                                            checked={day.isOpen}
                                            onChange={(event) =>
                                                updateWorkingDay(
                                                    day.day,
                                                    "isOpen",
                                                    event.target.checked,
                                                )
                                            }
                                        />
                                        <span>{day.day}</span>
                                    </label>
                                    <label>
                                        <span className="sr-only text-sm">
                                            {day.day} start time
                                        </span>
                                        <input
                                            type="time"
                                            value={day.start}
                                            disabled={!day.isOpen}
                                            onChange={(event) =>
                                                updateWorkingDay(
                                                    day.day,
                                                    "start",
                                                    event.target.value,
                                                )
                                            }
                                        />
                                    </label>
                                    <label>
                                        <span className="sr-only text-sm">
                                            {day.day} end time
                                        </span>
                                        <input
                                            type="time"
                                            value={day.end}
                                            disabled={!day.isOpen}
                                            onChange={(event) =>
                                                updateWorkingDay(
                                                    day.day,
                                                    "end",
                                                    event.target.value,
                                                )
                                            }
                                        />
                                    </label>
                                    <span className="working-break">
                                        <Coffee aria-hidden="true" />
                                        {day.breakStart && day.breakEnd
                                            ? `${day.breakStart} - ${day.breakEnd}`
                                            : "No break"}
                                    </span>
                                </article>
                            ))}
                        </div>
                    </section>
                </article>
            </section>

            <section className="doctor-lower-grid">
                <article className="availability-panel">
                    <div className="panel-header">
                        <div>
                            <h2>Appointment availability</h2>
                            <p>Today, 15 Sep 2026</p>
                        </div>
                        <UserRound aria-hidden="true" />
                    </div>
                    <div
                        className="availability-slots"
                        aria-label="Availability slots"
                    >
                        {(mockAvailability[selectedDoctor.id] ?? []).map(
                            (slot) => (
                                <button
                                    key={`${slot.time}-${slot.note}`}
                                    type="button"
                                    className={`availability-slot availability-slot--${slotStatusClass(slot.status)}`}
                                >
                                    <strong>{slot.time}</strong>
                                    <span>{slot.status}</span>
                                    <small>{slot.note}</small>
                                </button>
                            ),
                        )}
                    </div>
                </article>

                <article className="blocked-panel">
                    <div className="panel-header">
                        <div>
                            <h2>Leave and blocked slots</h2>
                            <p>Admin-controlled availability exceptions</p>
                        </div>
                        <AlertTriangle aria-hidden="true" />
                    </div>
                    <div className="blocked-list">
                        {selectedBlockedSlots.map((slot) => (
                            <article key={slot.id}>
                                <span className="blocked-list__icon">
                                    <History aria-hidden="true" />
                                </span>
                                <div>
                                    <strong>{slot.type}</strong>
                                    <small>
                                        {slot.date} - {slot.start} to {slot.end}
                                    </small>
                                    <small>{slot.reason}</small>
                                </div>
                            </article>
                        ))}
                        {!selectedBlockedSlots.length ? (
                            <p className="doctor-empty-copy">
                                No blocked time is recorded for this doctor.
                            </p>
                        ) : null}
                    </div>
                </article>
            </section>

            <form
                id="blocked-time-form"
                className="doctor-action-panel doctor-action-panel--persistent"
                onSubmit={addBlockedSlot}
            >
                <div>
                    <p className="panel-kicker">Blocked time</p>
                    <h2>Block availability for {selectedDoctor.name}</h2>
                    <p>Blocked periods prevent normal appointment booking.</p>
                </div>
                <div className="doctor-form-grid">
                    <label>
                        <span>Date</span>
                        <select name="date" defaultValue="15 Sep 2026">
                            <option>15 Sep 2026</option>
                            <option>16 Sep 2026</option>
                            <option>17 Sep 2026</option>
                        </select>
                    </label>
                    <label>
                        <span>Start</span>
                        <input
                            name="start"
                            type="time"
                            defaultValue="12:00"
                            required
                        />
                    </label>
                    <label>
                        <span>End</span>
                        <input
                            name="end"
                            type="time"
                            defaultValue="12:30"
                            required
                        />
                    </label>
                    <label>
                        <span>Reason</span>
                        <input
                            name="reason"
                            type="text"
                            placeholder="Reason"
                            required
                        />
                    </label>
                </div>
                <div className="doctor-action-panel__actions">
                    <button type="reset" className="button button--secondary">
                        Clear
                    </button>
                    <button type="submit" className="button button--primary">
                        <CalendarClock aria-hidden="true" />
                        Save blocked time
                    </button>
                </div>
            </form>
        </AppShell>
    );
}
