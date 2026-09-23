"use client";

import { useState, useMemo, type FormEvent } from "react";
import {
  AlertTriangle,
  CalendarPlus,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  FileText,
  Search,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import type { UserRole } from "@/types";
import type { PatientListRow, PatientStatus } from "@/features/patients/patient.types";
import type { PatientSortField, SortDirection } from "@/features/patients/services/mock-patient-list-service";
import { mockPatientList, filterAndSortPatients } from "@/features/patients/services/mock-patient-list-service";
import { dashboardUsers } from "@/features/dashboard/services/mock-dashboard-service";

interface PatientsListScreenProps { initialRole: UserRole; }

// ─── Sort icon ───────────────────────────────────────────────
function SortIcon({ active, dir }: { active: boolean; dir: SortDirection }) {
  if (!active) return <ChevronsUpDown className="pl-sort-icon" aria-hidden="true" size={12} />;
  return dir === "asc"
    ? <ChevronUp className="pl-sort-icon pl-sort-icon--active" aria-hidden="true" size={12} />
    : <ChevronDown className="pl-sort-icon pl-sort-icon--active" aria-hidden="true" size={12} />;
}

// ─── New Patient modal ────────────────────────────────────────
function NewPatientModal({ onClose, onAdd }: { onClose: () => void; onAdd: (name: string) => void }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState<"Male" | "Female">("Female");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !mobile.trim()) return;
    onAdd(`${firstName.trim()} ${lastName.trim()}`);
    onClose();
  }

  return (
    <div className="pl-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="new-patient-title">
      <div className="pl-modal">
        <div className="pl-modal__header">
          <div>
            <h2 id="new-patient-title">New Patient</h2>
            <p>Register a new patient in the clinic. Mock only — not persisted.</p>
          </div>
          <button type="button" className="pl-modal__close" onClick={onClose} aria-label="Close modal">
            <X aria-hidden="true" size={18} />
          </button>
        </div>
        <form className="pl-modal__body" onSubmit={handleSubmit} noValidate>
          <div className="pl-form-row">
            <label className="pl-form-field">
              <span>First name <span aria-hidden="true" style={{ color: "#dc2626" }}>*</span></span>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. Sara"
                required
                autoFocus
              />
            </label>
            <label className="pl-form-field">
              <span>Last name <span aria-hidden="true" style={{ color: "#dc2626" }}>*</span></span>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="e.g. Khaled"
                required
              />
            </label>
          </div>
          <label className="pl-form-field">
            <span>Mobile <span aria-hidden="true" style={{ color: "#dc2626" }}>*</span></span>
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="e.g. 010 1234 5678"
              required
            />
          </label>
          <div className="pl-form-row">
            <label className="pl-form-field">
              <span>Date of birth</span>
              <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
            </label>
            <label className="pl-form-field">
              <span>Gender</span>
              <select value={gender} onChange={(e) => setGender(e.target.value as "Male" | "Female")}>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
              </select>
            </label>
          </div>
          <p className="pl-modal__prototype-note">
            This is a prototype — submitted records are not stored or persisted.
          </p>
          <div className="pl-modal__actions">
            <button type="button" className="button button--secondary" onClick={onClose}>Cancel</button>
            <button
              type="submit"
              className="button button--primary"
              disabled={!firstName.trim() || !lastName.trim() || !mobile.trim()}
            >
              <UserPlus aria-hidden="true" size={15} />
              Register Patient
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main screen ─────────────────────────────────────────────
export function PatientsListScreen({ initialRole }: PatientsListScreenProps) {
  const [role, setRole] = useState<UserRole>(initialRole);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<PatientStatus | "">("");
  const [genderFilter, setGenderFilter] = useState<"Male" | "Female" | "">("");
  const [sortField, setSortField] = useState<PatientSortField>("name");
  const [sortDir, setSortDir] = useState<SortDirection>("asc");
  const [showNewPatient, setShowNewPatient] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [unavailableNotice, setUnavailableNotice] = useState<string | null>(null);

  const patients = useMemo(
    () => filterAndSortPatients(mockPatientList, search, statusFilter, genderFilter, sortField, sortDir),
    [search, statusFilter, genderFilter, sortField, sortDir]
  );

  function handleSort(field: PatientSortField) {
    if (field === sortField) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  }

  function handleRowClick(patient: PatientListRow) {
    if (!patient.profileSlug) {
      setUnavailableNotice(`Full profile for ${patient.name} is not yet available in this prototype.`);
      setTimeout(() => setUnavailableNotice(null), 4000);
    }
  }

  function handlePatientAdded(name: string) {
    setFeedback(`Patient "${name}" registered successfully. Refresh or sync with backend to persist.`);
    setTimeout(() => setFeedback(""), 6000);
  }

  const showClinicalCol = role !== "receptionist";
  const showBalance = role !== "dentist";
  const canManage = role === "admin" || role === "receptionist";

  return (
    <AppShell activeItem="Patients" role={role} userName={dashboardUsers[role]} onRoleChange={setRole}>
      {/* ── Page heading ─────────────────────────────────── */}
      <header className="page-heading">
        <div>
          <p className="page-heading__eyebrow">Patient directory</p>
          <h1>Patients</h1>
          <p>Browse, search, and manage patient records. {mockPatientList.length} patients in prototype list.</p>
        </div>
        {canManage && (
          <div className="page-heading__action">
            <button
              type="button"
              className="button button--primary"
              onClick={() => setShowNewPatient(true)}
            >
              <UserPlus aria-hidden="true" />
              New Patient
            </button>
          </div>
        )}
      </header>

      {/* ── Feedback banner ───────────────────────────────── */}
      {feedback && (
        <p className="pl-feedback" role="status">
          <CheckCircle2 aria-hidden="true" size={15} />
          <span>{feedback}</span>
          <button type="button" aria-label="Dismiss" onClick={() => setFeedback("")}>
            <X aria-hidden="true" size={14} />
          </button>
        </p>
      )}

      {/* ── Toolbar ──────────────────────────────────────── */}
      <div className="pl-toolbar">
        <label className="pl-toolbar__search">
          <Search aria-hidden="true" size={15} />
          <input
            type="search"
            placeholder="Search by name or mobile…"
            aria-label="Search patients"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <select
          aria-label="Filter by status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as PatientStatus | "")}
        >
          <option value="">All statuses</option>
          <option value="Active">Active</option>
          <option value="New">New</option>
          <option value="Inactive">Inactive</option>
        </select>
        <select
          aria-label="Filter by gender"
          value={genderFilter}
          onChange={(e) => setGenderFilter(e.target.value as "Male" | "Female" | "")}
        >
          <option value="">All genders</option>
          <option value="Female">Female</option>
          <option value="Male">Male</option>
        </select>
        <span className="pl-toolbar__count" role="status" aria-live="polite">
          {patients.length} patient{patients.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── Profile unavailable toast ─────────────────────── */}
      {unavailableNotice && (
        <div className="pl-notice" role="status" aria-live="assertive">
          <AlertTriangle size={14} aria-hidden="true" />
          {unavailableNotice}
        </div>
      )}

      {/* ── Table card ───────────────────────────────────── */}
      <div className="pl-card">
        <div className="pl-table-wrap">
          <table className="pl-table" aria-label="Patient list">
            <thead>
              <tr>
                <th
                  className="pl-th--sortable"
                  onClick={() => handleSort("name")}
                  aria-sort={sortField === "name" ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
                >
                  Patient <SortIcon active={sortField === "name"} dir={sortDir} />
                </th>
                <th>Mobile</th>
                <th
                  className="pl-th--sortable"
                  onClick={() => handleSort("dob")}
                  aria-sort={sortField === "dob" ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
                >
                  DOB / Age <SortIcon active={sortField === "dob"} dir={sortDir} />
                </th>
                {showClinicalCol && (
                  <th
                    className="pl-th--sortable"
                    onClick={() => handleSort("lastVisitDate")}
                    aria-sort={sortField === "lastVisitDate" ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
                  >
                    Last Visit <SortIcon active={sortField === "lastVisitDate"} dir={sortDir} />
                  </th>
                )}
                <th
                  className="pl-th--sortable"
                  onClick={() => handleSort("nextAppointment")}
                  aria-sort={sortField === "nextAppointment" ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
                >
                  Next Appointment <SortIcon active={sortField === "nextAppointment"} dir={sortDir} />
                </th>
                {showBalance && (
                  <th
                    className="pl-th--sortable"
                    onClick={() => handleSort("balance")}
                    aria-sort={sortField === "balance" ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
                  >
                    Balance <SortIcon active={sortField === "balance"} dir={sortDir} />
                  </th>
                )}
                <th>Status</th>
                <th><span className="pl-visually-hidden">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {patients.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <div className="pl-empty">
                      <Users size={32} aria-hidden="true" />
                      <p>No patients match your filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                patients.map((patient) => (
                  <tr
                    key={patient.id}
                    className={patient.profileSlug ? "pl-row--clickable" : undefined}
                    onClick={!patient.profileSlug ? () => handleRowClick(patient) : undefined}
                  >
                    {/* Patient name + avatar */}
                    <td>
                      <div className="pl-patient-cell">
                        <div className="pl-avatar" aria-hidden="true">{patient.initials}</div>
                        <div className="pl-patient-cell__info">
                          <strong>{patient.name}</strong>
                          {patient.alerts.length > 0 && (
                            <span className="pl-alert-pill" title={patient.alerts.join("; ")}>
                              <AlertTriangle size={10} aria-hidden="true" />
                              {patient.alerts[0].length > 32 ? patient.alerts[0].slice(0, 32) + "…" : patient.alerts[0]}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    {/* Mobile */}
                    <td className="pl-td--muted">{patient.mobile}</td>
                    {/* DOB */}
                    <td className="pl-td--muted">{patient.dob} · {patient.age}y</td>
                    {/* Last visit — clinical roles only */}
                    {showClinicalCol && (
                      <td>
                        {patient.lastVisitDate ? (
                          <>
                            <span className="pl-td--primary">{patient.lastVisitDate}</span>
                            <span className="pl-td--sub">{patient.lastVisitType}</span>
                          </>
                        ) : (
                          <span className="pl-td--empty">—</span>
                        )}
                      </td>
                    )}
                    {/* Next appointment */}
                    <td>
                      {patient.nextAppointment ? (
                        <>
                          <span className="pl-td--primary">{patient.nextAppointment.date} · {patient.nextAppointment.time}</span>
                          <span className="pl-td--sub">{patient.nextAppointment.type}</span>
                        </>
                      ) : (
                        <span className="pl-td--empty">—</span>
                      )}
                    </td>
                    {/* Balance — non-dentist */}
                    {showBalance && (
                      <td className={patient.balanceNumeric > 0 ? "pl-balance--owed" : "pl-balance--clear"}>
                        {patient.balance}
                      </td>
                    )}
                    {/* Status badge */}
                    <td>
                      <span className={`pl-status pl-status--${patient.status.toLowerCase()}`}>
                        {patient.status}
                      </span>
                    </td>
                    {/* Row actions */}
                    <td>
                      <div className="pl-row-actions">
                        {patient.profileSlug ? (
                          <Link
                            href={`/patients/${patient.profileSlug}?role=${role}`}
                            className="pl-action-btn pl-action-btn--primary"
                            aria-label={`Open profile for ${patient.name}`}
                          >
                            <FileText size={13} aria-hidden="true" />
                            Profile
                          </Link>
                        ) : null}
                        {canManage && (
                          <button type="button" className="pl-action-btn" aria-label={`Book appointment for ${patient.name}`}>
                            <CalendarPlus size={13} aria-hidden="true" />
                            Book
                          </button>
                        )}
                        {role === "dentist" && patient.profileSlug && (
                          <Link href="/clinical/current-visit?role=dentist" className="pl-action-btn" aria-label={`Open visit for ${patient.name}`}>
                            Open visit
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── New Patient modal ─────────────────────────────── */}
      {showNewPatient && (
        <NewPatientModal
          onClose={() => setShowNewPatient(false)}
          onAdd={handlePatientAdded}
        />
      )}
    </AppShell>
  );
}
