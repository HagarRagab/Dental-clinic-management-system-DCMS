"use client";

import Link from "next/link";
import { AlertTriangle, CalendarClock, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { PatientProfileTabs } from "@/features/patients/components/patient-profile-tabs";
import {
  getPatientProfileById,
  mariamAdel,
} from "@/features/patients/services/mock-patient-service";
import type { PatientTab } from "@/features/patients/patient.types";
import { dashboardUsers } from "@/features/dashboard/services/mock-dashboard-service";
import type { UserRole } from "@/types";
import PatientProfileHeader from "../components/patient-profile-header";

interface PatientProfileScreenProps {
  initialRole: UserRole;
  patientId?: string;
}

export function PatientProfileScreen({
  initialRole,
  patientId,
}: PatientProfileScreenProps) {
  const [role, setRole] = useState<UserRole>(initialRole);
  const [activeTab, setActiveTab] = useState<PatientTab>("Overview");
  const router = useRouter();

  const patient = patientId ? getPatientProfileById(patientId) : mariamAdel;

  const defaultTabs: Record<UserRole, PatientTab> = {
    admin: "Overview",
    receptionist: "Overview",
    dentist: "Overview",
  };

  function changeRole(nextRole: UserRole) {
    setRole(nextRole);
    setActiveTab(defaultTabs[nextRole]);
  }

  if (!patient) {
    return (
      <AppShell
        activeItem="Patients"
        role={role}
        userName={dashboardUsers[role]}
        onRoleChange={changeRole}
      >
        <div className="patient-breadcrumb">
          <Link href={`/patients?role=${role}`}>
            <ChevronLeft aria-hidden="true" />
            Patients
          </Link>
          <span>/</span>
          <strong>Not Found</strong>
        </div>
        <div className="profile-section text-center py-12 px-6 mt-6">
          <AlertTriangle
            size={36}
            className="text-red-600 mx-auto mb-4"
            aria-hidden="true"
          />
          <h1 className="text-xl font-bold mb-2">Patient Profile Not Found</h1>
          <p className="text-gray-500 max-w-[420px] mx-auto mb-6">
            The patient record requested (<code>{patientId}</code>) could not be
            located in the clinic system.
          </p>
          <Link
            href={`/patients?role=${role}`}
            className="button button--primary no-underline inline-flex"
          >
            Return to Patient Directory
          </Link>
        </div>
      </AppShell>
    );
  }

  const patientDisplayId = patient.id
    ? `Patient #${patient.id.toUpperCase()}`
    : "Patient #P-10284";

  const targetPatientId = patient.id || patientId || "mariam-adel";

  return (
    <AppShell
      activeItem="Patients"
      role={role}
      userName={dashboardUsers[role]}
      onRoleChange={changeRole}
    >
      {/* ── Breadcrumb ────────────────────────────────────── */}
      <div className="patient-breadcrumb">
        <button type="button" onClick={() => router.back()} className="breadcrumb-back-button">
          <ChevronLeft aria-hidden="true" />
          Back
        </button>
        <span>/</span>
        <strong>{patient.name}</strong>
      </div>

      {/* ── Patient Header ────────────────────────────────── */}
      <PatientProfileHeader
        patient={patient}
        patientDisplayId={patientDisplayId}
        role={role}
        targetPatientId={targetPatientId}
      />

      {/* ── Next Appointment Banner ───────────────────────── */}
      <section className="patient-next-appointment">
        <span className="patient-next-appointment__icon">
          <CalendarClock aria-hidden="true" />
        </span>
        <div>
          <span>Next appointment</span>
          {patient.nextAppointment ? (
            <>
              <strong>
                {patient.nextAppointment.date} · {patient.nextAppointment.time}
              </strong>
              <small>
                {patient.nextAppointment.type} with{" "}
                {patient.nextAppointment.dentist}
              </small>
            </>
          ) : (
            <>
              <strong>No upcoming appointment scheduled</strong>
              <small>
                {role !== "dentist" ? (
                  <Link
                    href={`/appointments/new?role=${role}&patientId=${targetPatientId}`}
                    style={{
                      fontWeight: 600,
                      textDecoration: "underline",
                      color: "inherit",
                    }}
                  >
                    Click here to book a new appointment
                  </Link>
                ) : (
                  'Use "New appointment" to book a visit for this patient'
                )}
              </small>
            </>
          )}
        </div>
        {patient.nextAppointment ? (
          <span className="status-badge status-badge--confirmed">
            Confirmed
          </span>
        ) : (
          <span className="status-badge status-badge--scheduled">None</span>
        )}
      </section>

      {/* ── Tabs & Content ────────────────────────────────── */}
      <PatientProfileTabs
        activeTab={activeTab}
        onChange={setActiveTab}
        patient={patient}
        role={role}
      />
    </AppShell>
  );
}
