"use client";

import { useState, useMemo } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  FileSpreadsheet,
  Search,
  UserPlus,
  X,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import type { UserRole } from "@/types";
import type {
  PatientListRow,
  PatientSortField,
  PatientStatus,
  SortDirection,
} from "@/features/patients/patient.types";
import {
  mockPatientList,
  filterAndSortPatients,
} from "@/features/patients/services/mock-patient-list-service";
import { dashboardUsers } from "@/features/dashboard/services/mock-dashboard-service";
import { CsvPatientImportModal } from "@/features/patients/components/csv-patient-import-modal";
import NewPatientModal from "../components/new-patient-modal";
import PatientTableRow from "../components/patient-table-row";

interface PatientsListScreenProps {
  initialRole: UserRole;
}

// ─── Main screen ─────────────────────────────────────────────
export function PatientsListScreen({ initialRole }: PatientsListScreenProps) {
  const [role, setRole] = useState<UserRole>(initialRole);
  const [patientList, setPatientList] =
    useState<PatientListRow[]>(mockPatientList);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<PatientStatus | "">("");
  const [genderFilter, setGenderFilter] = useState<"Male" | "Female" | "">("");
  const [sortField, setSortField] = useState<PatientSortField>("name");
  const [sortDir, setSortDir] = useState<SortDirection>("asc");
  const [showNewPatient, setShowNewPatient] = useState(false);
  const [showCsvImport, setShowCsvImport] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [unavailableNotice, setUnavailableNotice] = useState<string | null>(
    null,
  );

  const patients = useMemo(
    () =>
      filterAndSortPatients(
        patientList,
        search,
        statusFilter,
        genderFilter,
        sortField,
        sortDir,
      ),
    [patientList, search, statusFilter, genderFilter, sortField, sortDir],
  );

  function handlePatientAdded(name: string) {
    const id = `pt-${String(patientList.length + 1).padStart(3, "0")}`;
    const initials =
      name
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase() || "PT";

    const newRow: PatientListRow = {
      id,
      name,
      initials,
      mobile: "010 0000 0000",
      dob: "1995-01-01",
      age: 31,
      gender: "Female",
      status: "Active",
      lastVisitDate: null,
      lastVisitType: null,
      nextAppointment: null,
      balance: "EGP 0",
      balanceNumeric: 0,
      alerts: [],
      profileSlug: id,
    };
    setPatientList((prev) => [newRow, ...prev]);
    setFeedback(
      `Patient "${name}" registered successfully. Added to patient list.`,
    );
    setTimeout(() => setFeedback(""), 6000);
  }

  const canManage = role === "admin" || role === "receptionist";

  return (
    <AppShell
      activeItem="Patients"
      role={role}
      userName={dashboardUsers[role]}
      onRoleChange={setRole}
    >
      {/* ── Page heading ─────────────────────────────────── */}
      <header className="page-heading">
        <div>
          <p className="page-heading__eyebrow">Patient directory</p>
          <h1>Patients</h1>
          <p>
            Browse, search, and manage patient records. {patientList.length}{" "}
            patients in prototype list.
          </p>
        </div>
        {canManage && (
          <div
            className="page-heading__action"
            style={{ display: "flex", gap: "8px" }}
          >
            {role === "admin" && (
              <button
                type="button"
                className="button button--secondary"
                onClick={() => setShowCsvImport(true)}
              >
                <FileSpreadsheet aria-hidden="true" size={15} />
                Import CSV
              </button>
            )}
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
          <button
            type="button"
            aria-label="Dismiss"
            onClick={() => setFeedback("")}
          >
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
          onChange={(e) =>
            setStatusFilter(e.target.value as PatientStatus | "")
          }
        >
          <option value="">All statuses</option>
          <option value="Active">Active</option>
          <option value="New">New</option>
          <option value="Inactive">Inactive</option>
        </select>
        <select
          aria-label="Filter by gender"
          value={genderFilter}
          onChange={(e) =>
            setGenderFilter(e.target.value as "Male" | "Female" | "")
          }
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
      <PatientTableRow
        canManage={canManage}
        patients={patients}
        role={role}
        setSortDir={setSortDir}
        setSortField={setSortField}
        setUnavailableNotice={setUnavailableNotice}
        sortDir={sortDir}
        sortField={sortField}
      />

      {/* ── New Patient modal ─────────────────────────────── */}
      {showNewPatient && (
        <NewPatientModal
          onClose={() => setShowNewPatient(false)}
          onAdd={handlePatientAdded}
        />
      )}

      {/* ── Bulk CSV Import modal ──────────────────────────── */}
      {showCsvImport && (
        <CsvPatientImportModal
          existingPatients={patientList}
          onClose={() => setShowCsvImport(false)}
          onImport={(imported) => {
            setPatientList((prev) => [...imported, ...prev]);
            setFeedback(
              `Successfully imported ${imported.length} ${imported.length === 1 ? "patient" : "patients"} from CSV.`,
            );
            setTimeout(() => setFeedback(""), 6000);
          }}
        />
      )}
    </AppShell>
  );
}
