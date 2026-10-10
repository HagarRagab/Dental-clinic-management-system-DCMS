import { AlertTriangle, BadgeCheck } from "lucide-react";
import { ClinicalVisitRecord } from "../clinical.types";

function ClinicalPatientHeader({ visit }: { visit: ClinicalVisitRecord }) {
  return (
    <header className="clinical-patient-header">
      <div className="clinical-patient-header__info">
        <span className="patient-profile-avatar">
          {visit.patientName
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </span>
        <div>
          <div className="patient-profile-title">
            <h1>{visit.patientName}</h1>
            <span className="patient-profile-id">
              Patient #{visit.patientId}
            </span>
            <span className="clinical-status-pill clinical-status-pill--active">
              {visit.appointment.visitState}
            </span>
          </div>
          <p>
            {visit.patientGender} · {visit.patientAge} years ·{" "}
            {visit.patientMobile}
          </p>
          <div className="patient-profile-tags">
            {visit.allergies.map((allergy) => (
              <span key={allergy} className="patient-tag patient-tag--alert">
                <AlertTriangle aria-hidden="true" />
                Allergy: {allergy}
              </span>
            ))}
            {visit.medicalAlerts.map((alert) => (
              <span key={alert} className="patient-tag">
                <BadgeCheck aria-hidden="true" />
                {alert}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="clinical-patient-header__visit-meta">
        <div>
          <span className="clinical-meta-label">Attending dentist</span>
          <strong>{visit.appointment.dentist}</strong>
        </div>
        <div>
          <span className="clinical-meta-label">Chair / Operatory</span>
          <strong>{visit.appointment.chair}</strong>
        </div>
        <div>
          <span className="clinical-meta-label">Appointment</span>
          <strong>
            {visit.appointment.time} · {visit.appointment.type}
          </strong>
          <small>Arrived {visit.appointment.arrivedMinutesAgo} min ago</small>
        </div>
      </div>
    </header>
  );
}

export default ClinicalPatientHeader;
