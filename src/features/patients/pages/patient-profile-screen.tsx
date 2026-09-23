"use client";

import Link from "next/link";
import { AlertTriangle, CalendarClock, ChevronLeft, FileText, Phone, WalletCards } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { PatientProfileTabs } from "@/features/patients/components/patient-profile-tabs";
import { mariamAdel } from "@/features/patients/services/mock-patient-service";
import type { PatientTab } from "@/features/patients/patient.types";
import { dashboardUsers } from "@/features/dashboard/services/mock-dashboard-service";
import type { UserRole } from "@/types";

export function PatientProfileScreen({ initialRole }: { initialRole: UserRole }) {
  const [role, setRole] = useState<UserRole>(initialRole);
  const [activeTab, setActiveTab] = useState<PatientTab>("Overview");
  const patient = mariamAdel;
  const defaultTabs: Record<UserRole, PatientTab> = { admin: "Overview", receptionist: "Overview", dentist: "Overview" };
  function changeRole(nextRole: UserRole) { setRole(nextRole); setActiveTab(defaultTabs[nextRole]); }
  return <AppShell activeItem="Patients" role={role} userName={dashboardUsers[role]} onRoleChange={changeRole}><div className="patient-breadcrumb"><Link href={`/patients?role=${role}`}><ChevronLeft aria-hidden="true" />Patients</Link><span>/</span><strong>{patient.name}</strong></div><header className="patient-profile-header"><div className="patient-profile-header__identity"><span className="patient-profile-avatar">{patient.initials}</span><div><div className="patient-profile-title"><h1>{patient.name}</h1><span className="patient-profile-id">Patient #P-10284</span></div><p>{patient.gender} · {patient.age} years · {patient.mobile}</p><div className="patient-profile-tags"><span className="patient-tag"><Phone aria-hidden="true" />{patient.mobile}</span>{patient.allergies.map((allergy) => <span key={allergy} className="patient-tag patient-tag--alert"><AlertTriangle aria-hidden="true" />{allergy} allergy</span>)}</div></div></div><div className="patient-profile-header__actions">{role !== "dentist" ? <button type="button" className="button button--secondary"><WalletCards aria-hidden="true" />Collect payment</button> : null}{role === "dentist" ? <Link href="/clinical/current-visit?role=dentist" className="button button--primary" style={{ textDecoration: "none" }}>Open current visit</Link> : <button type="button" className="button button--primary">New appointment</button>}</div></header><section className="patient-next-appointment"><span className="patient-next-appointment__icon"><CalendarClock aria-hidden="true" /></span><div><span>Next appointment</span><strong>{patient.nextAppointment.date} · {patient.nextAppointment.time}</strong><small>{patient.nextAppointment.type} with {patient.nextAppointment.dentist}</small></div><span className="status-badge status-badge--confirmed">Confirmed</span></section><PatientProfileTabs activeTab={activeTab} onChange={setActiveTab} patient={patient} role={role} /></AppShell>;
}
