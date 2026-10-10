"use client";

import { CheckCircle2, Plus, ShieldAlert, X } from "lucide-react";
import { useState } from "react";
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
import DoctorMetrics from "../components.tsx/doctor-metrics";
import DoctorListPanel from "../components.tsx/doctor-list-panel";
import DoctorProfilePanel from "../components.tsx/doctor-profile-panel";
import AvailabilityPanel from "../components.tsx/availability-panel";
import BlockedPanel from "../components.tsx/blocked-panel";
import BlockedTimeForm from "../components.tsx/blocked-time-form";

function doctorStatusClass(status: DoctorProfile["status"]) {
    return status.toLowerCase().replaceAll(" ", "-");
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
    const [feedback, setFeedback] = useState("");

    const selectedDoctor =
        doctors.find((doctor) => doctor.id === selectedDoctorId) ?? doctors[0];
    const selectedBlockedSlots = blockedSlots.filter(
        (slot) => slot.doctorId === selectedDoctor.id,
    );

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

            <DoctorMetrics doctors={doctors} blockedSlots={blockedSlots} />

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
                <DoctorListPanel
                    doctorStatusClass={doctorStatusClass}
                    doctors={doctors}
                    selectedDoctor={selectedDoctor}
                    setFeedback={setFeedback}
                    setSelectedDoctorId={setSelectedDoctorId}
                />

                <DoctorProfilePanel
                    setDoctors={setDoctors}
                    setFeedback={setFeedback}
                    selectedDoctor={selectedDoctor}
                    doctorStatusClass={doctorStatusClass}
                />
            </section>

            <section className="doctor-lower-grid">
                <AvailabilityPanel
                    availabilityData={mockAvailability}
                    selectedDoctor={selectedDoctor}
                />

                <BlockedPanel selectedBlockedSlots={selectedBlockedSlots} />
            </section>

            <BlockedTimeForm
                setFeedback={setFeedback}
                selectedDoctor={selectedDoctor}
                setBlockedSlots={setBlockedSlots}
            />
        </AppShell>
    );
}
