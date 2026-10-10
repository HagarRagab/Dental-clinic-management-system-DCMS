"use client";

import { ArrowLeft, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import {
    availableSlots,
    bookingAppointmentTypes,
    bookingDentists,
    bookingPatients,
    getBookingPatientById,
} from "@/features/appointments/services/mock-booking-service";
import { dashboardUsers } from "@/features/dashboard/services/mock-dashboard-service";
import type { UserRole } from "@/types";
import { BookingForm, BookingPatient, BookingStep } from "../appointment.types";
import BookingFormSurface from "../components/booking-form-surface";
import BookingSummary from "../components/booking-summary";
import BookingSuccess from "../components/booking-success";
import { useRouter } from "next/navigation";

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
    initialPatientId,
}: {
    initialRole: UserRole;
    initialPatientId?: string;
}) {
    const [role, setRole] = useState<UserRole>(initialRole);
    const preselected = initialPatientId
        ? getBookingPatientById(initialPatientId)
        : null;
    const [step, setStep] = useState<BookingStep>(preselected ? 2 : 1);
    const [patient, setPatient] = useState<BookingPatient | null>(
        preselected || bookingPatients[0] || null,
    );
    const [form, setForm] = useState<BookingForm>(initialForm);
    const [submitted, setSubmitted] = useState(false);

    const router = useRouter();

    if (role === "dentist") {
        return (
            <AppShell
                activeItem="New Appointment"
                role={role}
                userName={dashboardUsers[role]}
                onRoleChange={setRole}
            >
                <section
                    className="permission-state"
                    aria-labelledby="booking-access-title"
                >
                    <span className="permission-state__icon">
                        <ShieldAlert aria-hidden="true" />
                    </span>
                    <p className="page-heading__eyebrow">
                        Restricted workspace
                    </p>
                    <h1 id="booking-access-title">
                        Appointment booking is restricted
                    </h1>
                    <p>
                        Appointment booking and scheduling are managed by
                        Receptionists and Admins. Your clinical workspace and
                        schedule view remain available from the navigation.
                    </p>
                </section>
            </AppShell>
        );
    }

    if (submitted)
        return (
            <AppShell
                activeItem="New Appointment"
                role={role}
                userName={dashboardUsers[role]}
                onRoleChange={setRole}
            >
                <BookingSuccess
                    form={form}
                    patient={patient}
                    role={role}
                    setStep={setStep}
                    setSubmitted={setSubmitted}
                />
            </AppShell>
        );

    return (
        <AppShell
            activeItem="New Appointment"
            role={role}
            userName={dashboardUsers[role]}
            onRoleChange={setRole}
        >
            <div className="booking-header">
                <div>
                    <button onClick={() => router.back()} className="back-link">
                        <ArrowLeft aria-hidden="true" />
                        Back
                    </button>
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
                <BookingFormSurface
                    availableSlots={availableSlots}
                    bookingAppointmentTypes={bookingAppointmentTypes}
                    bookingDentists={bookingDentists}
                    bookingPatients={bookingPatients}
                    form={form}
                    setForm={setForm}
                    patient={patient}
                    setPatient={setPatient}
                    step={step}
                    setStep={setStep}
                    role={role}
                    setSubmitted={setSubmitted}
                />

                <BookingSummary form={form} patient={patient} />
            </div>
        </AppShell>
    );
}
