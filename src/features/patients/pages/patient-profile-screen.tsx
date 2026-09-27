"use client";

import Link from "next/link";
import { AlertTriangle, CalendarClock, ChevronLeft, Phone, WalletCards } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { PatientProfileTabs } from "@/features/patients/components/patient-profile-tabs";
import { getPatientProfileById, mariamAdel } from "@/features/patients/services/mock-patient-service";
import type { PatientTab } from "@/features/patients/patient.types";
import { dashboardUsers } from "@/features/dashboard/services/mock-dashboard-service";
import type { UserRole } from "@/types";

interface PatientProfileScreenProps {
  initialRole: UserRole;
  patientId?: string;
}

export function PatientProfileScreen({ initialRole, patientId }: PatientProfileScreenProps) {
  const [role, setRole] = useState<UserRole>(initialRole);
  const [activeTab, setActiveTab] = useState<PatientTab>("Overview");

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
      <AppShell activeItem="Patients" role={role} userName={dashboardUsers[role]} onRoleChange={changeRole}>
        <div className="patient-breadcrumb">
          <Link href={`/patients?role=${role}`}>
            <ChevronLeft aria-hidden="true" />
            Patients
          </Link>
          <span>/</span>
          <strong>Not Found</strong>
        </div>
        <div className="profile-section" style={{ textAlign: "center", padding: "48px 24px", marginTop: "24px" }}>
          <AlertTriangle size={36} color="#dc2626" style={{ margin: "0 auto 16px" }} aria-hidden="true" />
          <h1 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "8px" }}>Patient Profile Not Found</h1>
          <p style={{ color: "#6b7280", maxWidth: "420px", margin: "0 auto 24px" }}>
            The patient record requested (<code>{patientId}</code>) could not be located in the clinic system.
          </p>
          <Link
            href={`/patients?role=${role}`}
            className="button button--primary"
            style={{ textDecoration: "none", display: "inline-flex" }}
          >
            Return to Patient Directory
          </Link>
        </div>
      </AppShell>
    );
  }

  const patientDisplayId = patient.id ? `Patient #${patient.id.toUpperCase()}` : "Patient #P-10284";

  return (
    <AppShell activeItem="Patients" role={role} userName={dashboardUsers[role]} onRoleChange={changeRole}>
      {/* ── Breadcrumb ────────────────────────────────────── */}
      <div className="patient-breadcrumb">
        <Link href={`/patients?role=${role}`}>
          <ChevronLeft aria-hidden="true" />
          Patients
        </Link>
        <span>/</span>
        <strong>{patient.name}</strong>
      </div>

      {/* ── Patient Header ────────────────────────────────── */}
      <header className="patient-profile-header">
        <div className="patient-profile-header__identity">
          <span className="patient-profile-avatar">{patient.initials}</span>
          <div>
            <div className="patient-profile-title">
              <h1>{patient.name}</h1>
              <span className="patient-profile-id">{patientDisplayId}</span>
            </div>
            <p>{patient.gender} · {patient.age} years · {patient.mobile}</p>
            <div className="patient-profile-tags">
              <span className="patient-tag">
                <Phone aria-hidden="true" size={13} />
                {patient.mobile}
              </span>
              {patient.allergies.map((allergy) => {
                const isSafe = allergy.toLowerCase().includes("no known");
                return (
                  <span
                    key={allergy}
                    className={`patient-tag ${isSafe ? "" : "patient-tag--alert"}`}
                  >
                    {!isSafe && <AlertTriangle aria-hidden="true" size={13} />}
                    {allergy}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        <div className="patient-profile-header__actions">
          {role !== "dentist" && (
            <button type="button" className="button button--secondary">
              <WalletCards aria-hidden="true" size={15} />
              Collect payment
            </button>
          )}
          {role === "dentist" ? (
            <Link
              href="/clinical/current-visit?role=dentist"
              className="button button--primary"
              style={{ textDecoration: "none" }}
            >
              Open current visit
            </Link>
          ) : (
            <button type="button" className="button button--primary">
              New appointment
            </button>
          )}
        </div>
      </header>

      {/* ── Next Appointment Banner ───────────────────────── */}
      <section className="patient-next-appointment">
        <span className="patient-next-appointment__icon">
          <CalendarClock aria-hidden="true" />
        </span>
        <div>
          <span>Next appointment</span>
          {patient.nextAppointment ? (
            <>
              <strong>{patient.nextAppointment.date} · {patient.nextAppointment.time}</strong>
              <small>{patient.nextAppointment.type} with {patient.nextAppointment.dentist}</small>
            </>
          ) : (
            <>
              <strong>No upcoming appointment scheduled</strong>
              <small>Use &quot;New appointment&quot; to book a visit for this patient</small>
            </>
          )}
        </div>
        {patient.nextAppointment ? (
          <span className="status-badge status-badge--confirmed">Confirmed</span>
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
