import { AlertTriangle, Phone, WalletCards } from "lucide-react";
import Link from "next/link";
import type { UserRole } from "@/types";
import { PatientProfile } from "../patient.types";

function PatientProfileHeader({
  patient,
  patientDisplayId,
  role,
  targetPatientId,
}: {
  patient: PatientProfile;
  patientDisplayId: string;
  role: UserRole;
  targetPatientId: string;
}) {
  return (
    <header className="patient-profile-header">
      <div className="patient-profile-header__identity">
        <span className="patient-profile-avatar">{patient.initials}</span>
        <div>
          <div className="patient-profile-title">
            <h1>{patient.name}</h1>
            <span className="patient-profile-id">{patientDisplayId}</span>
          </div>
          <p>
            {patient.gender} · {patient.age} years · {patient.mobile}
          </p>
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
          <Link
            href={`/appointments/new?role=${role}&patientId=${targetPatientId}`}
            className="button button--primary"
            style={{ textDecoration: "none" }}
          >
            New appointment
          </Link>
        )}
      </div>
    </header>
  );
}

export default PatientProfileHeader;
