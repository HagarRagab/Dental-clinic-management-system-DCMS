import { AlertTriangle, CalendarPlus, FileText, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PatientListRow, PatientSortField } from "../patient.types";
import SortIcon from "./SortIcon";
import { UserRole } from "@/types";

function PatientTableRow({
  role,
  setSortDir,
  setSortField,
  setUnavailableNotice,
  sortField,
  sortDir,
  patients,
  canManage,
}: {
  role: UserRole;
  setSortDir: React.Dispatch<React.SetStateAction<"asc" | "desc">>;
  setSortField: React.Dispatch<React.SetStateAction<PatientSortField>>;
  setUnavailableNotice: React.Dispatch<React.SetStateAction<string | null>>;
  sortField: PatientSortField;
  sortDir: "asc" | "desc";
  patients: PatientListRow[];
  canManage: boolean;
}) {
  const router = useRouter();

  const showClinicalCol = role !== "receptionist";
  const showBalance = role !== "dentist";

  function handleSort(field: PatientSortField) {
    if (field === sortField) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  }

  function handleRowClick(patient: PatientListRow) {
    const slug = patient.profileSlug || patient.id;
    if (slug) {
      router.push(`/patients/${slug}?role=${role}`);
    } else {
      setUnavailableNotice(
        `Full profile for ${patient.name} is not yet available in this prototype.`,
      );
      setTimeout(() => setUnavailableNotice(null), 4000);
    }
  }

  return (
    <div className="pl-card">
      <div className="pl-table-wrap">
        <table className="pl-table" aria-label="Patient list">
          <thead>
            <tr>
              <th
                className="pl-th--sortable"
                onClick={() => handleSort("name")}
                aria-sort={
                  sortField === "name"
                    ? sortDir === "asc"
                      ? "ascending"
                      : "descending"
                    : "none"
                }
              >
                Patient <SortIcon active={sortField === "name"} dir={sortDir} />
              </th>
              <th>Mobile</th>
              <th
                className="pl-th--sortable"
                onClick={() => handleSort("dob")}
                aria-sort={
                  sortField === "dob"
                    ? sortDir === "asc"
                      ? "ascending"
                      : "descending"
                    : "none"
                }
              >
                DOB / Age{" "}
                <SortIcon active={sortField === "dob"} dir={sortDir} />
              </th>
              {showClinicalCol && (
                <th
                  className="pl-th--sortable"
                  onClick={() => handleSort("lastVisitDate")}
                  aria-sort={
                    sortField === "lastVisitDate"
                      ? sortDir === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                >
                  Last Visit{" "}
                  <SortIcon
                    active={sortField === "lastVisitDate"}
                    dir={sortDir}
                  />
                </th>
              )}
              <th
                className="pl-th--sortable"
                onClick={() => handleSort("nextAppointment")}
                aria-sort={
                  sortField === "nextAppointment"
                    ? sortDir === "asc"
                      ? "ascending"
                      : "descending"
                    : "none"
                }
              >
                Next Appointment{" "}
                <SortIcon
                  active={sortField === "nextAppointment"}
                  dir={sortDir}
                />
              </th>
              {showBalance && (
                <th
                  className="pl-th--sortable"
                  onClick={() => handleSort("balance")}
                  aria-sort={
                    sortField === "balance"
                      ? sortDir === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                >
                  Balance{" "}
                  <SortIcon active={sortField === "balance"} dir={sortDir} />
                </th>
              )}
              <th>Status</th>
              <th>
                <span className="pl-visually-hidden">Actions</span>
              </th>
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
                <tr key={patient.id}>
                  {/* Patient name + avatar */}
                  <td>
                    <div className="pl-patient-cell">
                      <div className="pl-avatar" aria-hidden="true">
                        {patient.initials}
                      </div>
                      <div className="pl-patient-cell__info">
                        <strong>{patient.name}</strong>
                        {patient.alerts.length > 0 && (
                          <span
                            className="pl-alert-pill"
                            title={patient.alerts.join("; ")}
                          >
                            <AlertTriangle size={10} aria-hidden="true" />
                            {patient.alerts[0].length > 32
                              ? patient.alerts[0].slice(0, 32) + "…"
                              : patient.alerts[0]}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  {/* Mobile */}
                  <td className="pl-td--muted">{patient.mobile}</td>
                  {/* DOB */}
                  <td className="pl-td--muted">
                    {patient.dob} · {patient.age}y
                  </td>
                  {/* Last visit — clinical roles only */}
                  {showClinicalCol && (
                    <td>
                      {patient.lastVisitDate ? (
                        <>
                          <span className="pl-td--primary">
                            {patient.lastVisitDate}
                          </span>
                          <span className="pl-td--sub">
                            {patient.lastVisitType}
                          </span>
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
                        <span className="pl-td--primary">
                          {patient.nextAppointment.date} ·{" "}
                          {patient.nextAppointment.time}
                        </span>
                        <span className="pl-td--sub">
                          {patient.nextAppointment.type}
                        </span>
                      </>
                    ) : (
                      <span className="pl-td--empty">—</span>
                    )}
                  </td>
                  {/* Balance — non-dentist */}
                  {showBalance && (
                    <td
                      className={
                        patient.balanceNumeric > 0
                          ? "pl-balance--owed"
                          : "pl-balance--clear"
                      }
                    >
                      {patient.balance}
                    </td>
                  )}
                  {/* Status badge */}
                  <td>
                    <span
                      className={`pl-status pl-status--${patient.status.toLowerCase()}`}
                    >
                      {patient.status}
                    </span>
                  </td>
                  {/* Row actions */}
                  <td>
                    <div
                      className="pl-row-actions"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Link
                        href={`/patients/${patient.profileSlug || patient.id}?role=${role}`}
                        className="pl-action-btn pl-action-btn--primary"
                        aria-label={`Open profile for ${patient.name}`}
                      >
                        <FileText size={13} aria-hidden="true" />
                        Profile
                      </Link>
                      {canManage && (
                        <Link
                          href={`/appointments/new?role=${role}&patientId=${patient.profileSlug || patient.id}`}
                          className="pl-action-btn"
                          aria-label={`Book appointment for ${patient.name}`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <CalendarPlus size={13} aria-hidden="true" />
                          Book
                        </Link>
                      )}
                      {role === "dentist" && (
                        <Link
                          href="/clinical/current-visit?role=dentist"
                          className="pl-action-btn"
                          aria-label={`Open visit for ${patient.name}`}
                        >
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
  );
}

export default PatientTableRow;
