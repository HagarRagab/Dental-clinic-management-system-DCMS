"use client";

import Link from "next/link";
import {
    ArrowLeft,
    CalendarCheck2,
    Check,
    ChevronRight,
    Clock3,
    ShieldAlert,
} from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { PatientSelector } from "@/features/appointments/components/patient-selector";
import { SlotPicker } from "@/features/appointments/components/slot-picker";
import {
    availableSlots,
    bookingAppointmentTypes,
    bookingDentists,
    bookingPatients,
    type BookingPatient,
} from "@/features/appointments/services/mock-booking-service";
import { dashboardUsers } from "@/features/dashboard/services/mock-dashboard-service";
import type { UserRole } from "@/types";

type BookingStep = 1 | 2 | 3;
type BookingForm = {
    dentist: string;
    appointmentType: string;
    date: string;
    duration: string;
    room: string;
    notes: string;
    slot: string;
};
const initialForm: BookingForm = {
    dentist: "Dr. Karim Mostafa",
    appointmentType: "Root canal follow-up",
    date: "2026-09-13",
    duration: "30",
    room: "Chair 2",
    notes: "",
    slot: "14:30",
};

export function NewAppointmentScreen({
    initialRole,
}: {
    initialRole: UserRole;
}) {
    const [role, setRole] = useState<UserRole>(initialRole);
    const [step, setStep] = useState<BookingStep>(1);
    const [patient, setPatient] = useState<BookingPatient | null>(
        bookingPatients[0],
    );
    const [form, setForm] = useState<BookingForm>(initialForm);
    const [submitted, setSubmitted] = useState(false);
    const [showOverride, setShowOverride] = useState(false);
    const update = <K extends keyof BookingForm>(
        key: K,
        value: BookingForm[K],
    ) => setForm((current) => ({ ...current, [key]: value }));
    const isConflict =
        form.slot === "15:00" && form.dentist === "Dr. Karim Mostafa";
    const canContinue =
        patient &&
        form.dentist &&
        form.appointmentType &&
        form.date &&
        form.slot;

    if (submitted)
        return (
            <AppShell
                activeItem="Calendar"
                role={role}
                userName={dashboardUsers[role]}
                onRoleChange={setRole}
            >
                <section
                    className="booking-success"
                    aria-labelledby="booking-success-title"
                >
                    <span className="booking-success__icon">
                        <Check aria-hidden="true" />
                    </span>
                    <p className="page-heading__eyebrow">Appointment booked</p>
                    <h1 id="booking-success-title">
                        {patient?.name} is on the schedule.
                    </h1>
                    <p>
                        Root canal follow-up with {form.dentist} on Saturday, 13
                        September at {form.slot}.
                    </p>
                    <div className="booking-success__actions">
                        <Link
                            href={`/calendar?role=${role}`}
                            className="button button--primary"
                        >
                            View calendar
                        </Link>
                        <button
                            type="button"
                            className="button button--secondary"
                            onClick={() => {
                                setSubmitted(false);
                                setStep(1);
                            }}
                        >
                            Book another
                        </button>
                    </div>
                </section>
            </AppShell>
        );

    return (
        <AppShell
            activeItem="Calendar"
            role={role}
            userName={dashboardUsers[role]}
            onRoleChange={setRole}
        >
            <div className="booking-header">
                <div>
                    <Link href={`/calendar?role=${role}`} className="back-link">
                        <ArrowLeft aria-hidden="true" />
                        Calendar
                    </Link>
                    <p className="page-heading__eyebrow">
                        Appointment management
                    </p>
                    <h1>New appointment</h1>
                    <p>
                        Book a patient into a valid slot in a few focused steps.
                    </p>
                </div>
            </div>
            <ol
                className="booking-steps"
                aria-label="Appointment booking progress"
            >
                <li className={step >= 1 ? "booking-steps__active" : ""}>
                    <span>1</span>
                    <strong>Patient</strong>
                </li>
                <li className={step >= 2 ? "booking-steps__active" : ""}>
                    <span>2</span>
                    <strong>Appointment</strong>
                </li>
                <li className={step >= 3 ? "booking-steps__active" : ""}>
                    <span>3</span>
                    <strong>Review</strong>
                </li>
            </ol>
            <div className="booking-layout">
                <section className="booking-form-surface">
                    {step === 1 ? (
                        <PatientSelector
                            patients={bookingPatients}
                            selectedPatient={patient}
                            onSelect={setPatient}
                        />
                    ) : null}
                    {step === 2 ? (
                        <section aria-labelledby="appointment-details-title">
                            <div className="form-section__header">
                                <div>
                                    <h2 id="appointment-details-title">
                                        Appointment details
                                    </h2>
                                    <p>
                                        Only available times are shown for this
                                        dentist.
                                    </p>
                                </div>
                            </div>
                            <div className="form-grid">
                                <label className="field-group">
                                    <span className="field-label">Dentist</span>
                                    <select
                                        className="select-input"
                                        value={form.dentist}
                                        onChange={(event) =>
                                            update(
                                                "dentist",
                                                event.target.value,
                                            )
                                        }
                                    >
                                        {bookingDentists.map((dentist) => (
                                            <option key={dentist}>
                                                {dentist}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                                <label className="field-group">
                                    <span className="field-label">
                                        Appointment type
                                    </span>
                                    <select
                                        className="select-input"
                                        value={form.appointmentType}
                                        onChange={(event) =>
                                            update(
                                                "appointmentType",
                                                event.target.value,
                                            )
                                        }
                                    >
                                        {bookingAppointmentTypes.map((type) => (
                                            <option key={type}>{type}</option>
                                        ))}
                                    </select>
                                </label>
                                <label className="field-group">
                                    <span className="field-label">Date</span>
                                    <input
                                        className="text-input"
                                        type="date"
                                        value={form.date}
                                        onChange={(event) =>
                                            update("date", event.target.value)
                                        }
                                    />
                                </label>
                                <label className="field-group">
                                    <span className="field-label">
                                        Duration
                                    </span>
                                    <select
                                        className="select-input"
                                        value={form.duration}
                                        onChange={(event) =>
                                            update(
                                                "duration",
                                                event.target.value,
                                            )
                                        }
                                    >
                                        <option value="30">30 minutes</option>
                                        <option value="60">60 minutes</option>
                                    </select>
                                </label>
                                <label className="field-group">
                                    <span className="field-label">
                                        Room or chair
                                    </span>
                                    <select
                                        className="select-input"
                                        value={form.room}
                                        onChange={(event) =>
                                            update("room", event.target.value)
                                        }
                                    >
                                        <option>Chair 2</option>
                                        <option>Chair 1</option>
                                        <option>Not assigned</option>
                                    </select>
                                </label>
                                <label className="field-group">
                                    <span className="field-label">
                                        Notes <em>Optional</em>
                                    </span>
                                    <input
                                        className="text-input"
                                        value={form.notes}
                                        onChange={(event) =>
                                            update("notes", event.target.value)
                                        }
                                        placeholder="Short booking note"
                                    />
                                </label>
                            </div>
                            <div className="booking-slots">
                                <div>
                                    <h3>Available times</h3>
                                    <p>Saturday, 13 September</p>
                                </div>
                                <SlotPicker
                                    slots={availableSlots}
                                    selectedSlot={form.slot}
                                    onSelect={(slot) => update("slot", slot)}
                                />
                            </div>
                            {isConflict ? (
                                <div className="booking-conflict" role="alert">
                                    <ShieldAlert aria-hidden="true" />
                                    <div>
                                        <strong>
                                            Chair 2 is already occupied at
                                            15:00.
                                        </strong>
                                        <span>
                                            Select another time or chair to
                                            continue.
                                        </span>
                                    </div>
                                    {role === "admin" ? (
                                        <button
                                            type="button"
                                            className="text-button text-button--compact"
                                            onClick={() =>
                                                setShowOverride(
                                                    (current) => !current,
                                                )
                                            }
                                        >
                                            {showOverride
                                                ? "Override enabled"
                                                : "Override with reason"}
                                        </button>
                                    ) : null}
                                </div>
                            ) : null}
                        </section>
                    ) : null}
                    {step === 3 ? (
                        <section
                            className="booking-review"
                            aria-labelledby="booking-review-title"
                        >
                            <div className="form-section__header">
                                <div>
                                    <h2 id="booking-review-title">
                                        Review appointment
                                    </h2>
                                    <p>
                                        Check the details before confirming the
                                        booking.
                                    </p>
                                </div>
                            </div>
                            <div className="booking-review__patient">
                                <span>
                                    {patient?.name
                                        .split(" ")
                                        .map((part) => part[0])
                                        .join("")}
                                </span>
                                <div>
                                    <strong>{patient?.name}</strong>
                                    <small>
                                        {patient?.mobile} · {patient?.dob}
                                    </small>
                                </div>
                            </div>
                            <dl className="booking-review__details">
                                <div>
                                    <dt>Dentist</dt>
                                    <dd>{form.dentist}</dd>
                                </div>
                                <div>
                                    <dt>Appointment</dt>
                                    <dd>{form.appointmentType}</dd>
                                </div>
                                <div>
                                    <dt>Date and time</dt>
                                    <dd>
                                        Saturday, 13 September · {form.slot}
                                    </dd>
                                </div>
                                <div>
                                    <dt>Duration</dt>
                                    <dd>{form.duration} minutes</dd>
                                </div>
                                <div>
                                    <dt>Room</dt>
                                    <dd>{form.room}</dd>
                                </div>
                                {form.notes ? (
                                    <div>
                                        <dt>Notes</dt>
                                        <dd>{form.notes}</dd>
                                    </div>
                                ) : null}
                            </dl>
                            <div className="booking-confirm-note">
                                <CalendarCheck2 aria-hidden="true" />
                                <span>
                                    The appointment will be created as{" "}
                                    <strong>Booked</strong>. A confirmation
                                    email will be sent when notifications are
                                    connected.
                                </span>
                            </div>
                        </section>
                    ) : null}
                    <footer className="booking-form-footer">
                        <button
                            type="button"
                            className="button button--secondary"
                            onClick={() =>
                                setStep(
                                    (current) =>
                                        Math.max(1, current - 1) as BookingStep,
                                )
                            }
                            disabled={step === 1}
                        >
                            Back
                        </button>
                        {step < 3 ? (
                            <button
                                type="button"
                                className="button button--primary"
                                disabled={
                                    !canContinue ||
                                    (isConflict && !showOverride)
                                }
                                onClick={() =>
                                    setStep(
                                        (current) =>
                                            (current + 1) as BookingStep,
                                    )
                                }
                            >
                                Continue <ChevronRight aria-hidden="true" />
                            </button>
                        ) : (
                            <button
                                type="button"
                                className="button button--primary"
                                onClick={() => setSubmitted(true)}
                            >
                                Confirm booking
                            </button>
                        )}
                    </footer>
                </section>
                <aside
                    className="booking-summary"
                    aria-labelledby="booking-summary-title"
                >
                    <div className="booking-summary__header">
                        <Clock3 aria-hidden="true" />
                        <h2 id="booking-summary-title">Booking summary</h2>
                    </div>
                    <div>
                        <span>Patient</span>
                        <strong>{patient?.name ?? "Select patient"}</strong>
                    </div>
                    <div>
                        <span>Appointment</span>
                        <strong>{form.appointmentType}</strong>
                    </div>
                    <div>
                        <span>When</span>
                        <strong>{form.slot} · Sat 13 Sep</strong>
                    </div>
                    <div>
                        <span>Chair</span>
                        <strong>{form.room}</strong>
                    </div>
                    {patient?.alert ? (
                        <p className="booking-summary__alert">
                            <ShieldAlert aria-hidden="true" />
                            {patient.alert}
                        </p>
                    ) : null}
                </aside>
            </div>
        </AppShell>
    );
}
