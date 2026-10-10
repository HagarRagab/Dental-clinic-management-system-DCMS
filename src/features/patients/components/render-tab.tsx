import { UserRole } from "@/types";
import { PatientProfile, PatientTab } from "../patient.types";
import {
  CalendarDays,
  CheckCircle2,
  FileText,
  ImageIcon,
  Stethoscope,
} from "lucide-react";
import Link from "next/link";
import { TreatmentPlansTab } from "@/features/treatment-plans/pages/treatment-plans-tab";
import PatientFinancialTab from "./patient-financial-tab";
import PatientOdontogramTab from "./patient-odontogram-tab";

function RenderTab({
  tab,
  patient,
  role,
}: {
  tab: PatientTab;
  patient: PatientProfile;
  role: UserRole;
}) {
  if (tab === "Overview")
    return (
      <div className="profile-overview">
        <section className="profile-section">
          <div className="profile-section__header">
            <div>
              <h2>Patient details</h2>
              <p>Operational information</p>
            </div>
            <button type="button" className="text-button text-button--compact">
              Edit details
            </button>
          </div>
          <dl className="patient-detail-grid">
            <div>
              <dt>Mobile</dt>
              <dd>{patient.mobile}</dd>
            </div>
            <div>
              <dt>Date of birth</dt>
              <dd>
                {patient.dateOfBirth} · {patient.age} years
              </dd>
            </div>
            <div>
              <dt>Gender</dt>
              <dd>{patient.gender}</dd>
            </div>
            <div>
              <dt>Address</dt>
              <dd>{patient.address}</dd>
            </div>
            <div>
              <dt>Emergency contact</dt>
              <dd>{patient.emergencyContact}</dd>
            </div>
            <div>
              <dt>Current medications</dt>
              <dd>
                {role === "receptionist"
                  ? "Restricted clinical information"
                  : patient.currentMedications}
              </dd>
            </div>
          </dl>
        </section>
        {role !== "receptionist" ? (
          <section className="profile-section profile-section--clinical">
            <div className="profile-section__header">
              <div>
                <h2>Clinical summary</h2>
                <p>Visible to authorized clinical users</p>
              </div>
              <Stethoscope aria-hidden="true" />
            </div>
            <div className="clinical-summary-grid">
              <div>
                <span>Allergies</span>
                <strong>{patient.allergies.join(", ")}</strong>
              </div>
              <div>
                <span>Last clinical record</span>
                <strong>8 September · Dr. Karim Mostafa</strong>
              </div>
              <div>
                <span>Open treatment plan</span>
                <strong>Root canal and crown restoration</strong>
              </div>
            </div>
          </section>
        ) : null}
      </div>
    );

  if (tab === "Appointments")
    return (
      <section className="profile-section">
        <div className="profile-section__header">
          <div>
            <h2>Appointments</h2>
            <p>Recent and upcoming visits</p>
          </div>
          {role !== "dentist" ? (
            <Link
              href={`/appointments/new?role=${role}&patientId=${patient.id || "mariam-adel"}`}
              className="button button--secondary profile-action-button"
              style={{ textDecoration: "none" }}
            >
              <CalendarDays aria-hidden="true" />
              New appointment
            </Link>
          ) : null}
        </div>
        <div className="patient-timeline">
          <article>
            <time>
              13 Sep
              <br />
              <strong>14:00</strong>
            </time>
            <div>
              <span className="status-badge status-badge--confirmed">
                Confirmed
              </span>
              <h3>Root canal follow-up</h3>
              <p>Dr. Karim Mostafa · Chair 2</p>
            </div>
          </article>
          <article>
            <time>
              08 Sep
              <br />
              <strong>10:30</strong>
            </time>
            <div>
              <span className="status-badge status-badge--confirmed">
                Completed
              </span>
              <h3>Root canal treatment</h3>
              <p>Dr. Karim Mostafa · Clinical record finalized</p>
            </div>
          </article>
          <article>
            <time>
              30 Aug
              <br />
              <strong>15:00</strong>
            </time>
            <div>
              <span className="status-badge status-badge--booked">
                Completed
              </span>
              <h3>Consultation</h3>
              <p>Dr. Salma Hassan</p>
            </div>
          </article>
        </div>
      </section>
    );

  if (tab === "Clinical Records")
    return (
      <section className="profile-section">
        <div className="profile-section__header">
          <div>
            <h2>Clinical records</h2>
            <p>Finalized records are protected from direct editing.</p>
          </div>
          {role === "dentist" ? (
            <Link
              href={`/clinical/current-visit?role=${role}`}
              className="button button--primary profile-action-button"
              style={{ textDecoration: "none" }}
            >
              <FileText aria-hidden="true" />
              New clinical record
            </Link>
          ) : (
            <span
              className="button button--primary profile-action-button"
              aria-disabled="true"
              title="Only dentists can create clinical records"
              style={{ opacity: 0.45, cursor: "not-allowed", textDecoration: "none" }}
            >
              <FileText aria-hidden="true" />
              New clinical record
            </span>
          )}
        </div>
        <div className="clinical-record-list">
          <article>
            <div>
              <span className="status-badge status-badge--confirmed">
                <CheckCircle2 aria-hidden="true" />
                Finalized
              </span>
              <h3>Root canal treatment</h3>
              <p>8 September 2026 · Dr. Karim Mostafa</p>
            </div>
            <Link
              href={`/clinical/current-visit?role=${role}&recordId=rec-001&view=finalized`}
              className="button button--secondary"
              style={{ textDecoration: "none" }}
            >
              View record
            </Link>
          </article>
          <article>
            <div>
              <span className="status-badge status-badge--booked">Draft</span>
              <h3>Follow-up preparation</h3>
              <p>13 September 2026 · Dr. Karim Mostafa</p>
            </div>
            {role === "dentist" ? (
              <Link
                href={`/clinical/current-visit?role=${role}&recordId=rec-002`}
                className="button button--secondary"
                style={{ textDecoration: "none" }}
              >
                Continue draft
              </Link>
            ) : (
              <span
                className="button button--secondary"
                aria-disabled="true"
                title="Only dentists can edit clinical records"
                style={{ opacity: 0.45, cursor: "not-allowed" }}
              >
                Continue draft
              </span>
            )}
          </article>
        </div>
      </section>
    );

  if (tab === "Treatment Plans") return <TreatmentPlansTab role={role} />;
  if (tab === "Odontogram") return <PatientOdontogramTab role={role} />;
  if (tab === "Invoices" || tab === "Payments" || tab === "Patient Statement")
    return <PatientFinancialTab tab={tab} patient={patient} />;
  return (
    <section className="profile-section">
      <div className="profile-section__header">
        <div>
          <h2>Clinical attachments</h2>
          <p>Private files. Access is recorded.</p>
        </div>
        <button
          type="button"
          className="button button--primary profile-action-button"
        >
          <ImageIcon aria-hidden="true" />
          Upload file
        </button>
      </div>
      <div className="attachment-list">
        <article>
          <ImageIcon aria-hidden="true" />
          <div>
            <strong>Periapical X-ray · Tooth 16</strong>
            <span>JPG · 1.8 MB · Uploaded 8 September</span>
          </div>
          <button type="button" className="button button--secondary">
            View
          </button>
        </article>
        <article>
          <FileText aria-hidden="true" />
          <div>
            <strong>Consent form</strong>
            <span>PDF · 412 KB · Uploaded 30 August</span>
          </div>
          <button type="button" className="button button--secondary">
            View
          </button>
        </article>
      </div>
    </section>
  );
}

export default RenderTab;
