"use client";

import Link from "next/link";
import {
  AlertTriangle,
  BadgeCheck,
  CalendarClock,
  CheckCircle2,
  ChevronLeft,
  ClipboardList,
  FileCheck2,
  FileText,
  History,
  Image as ImageIcon,
  Lock,
  Plus,
  Save,
  ShieldAlert,
  Stethoscope,
  Trash2,
  X,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { AppShell } from "@/components/layout/app-shell";
import type { UserRole } from "@/types";
import type {
  ClinicalAmendment,
  ClinicalVisitRecord,
  PerformedProcedure,
} from "@/features/clinical/clinical.types";
import {
  commonDiagnoses,
  commonProcedures,
  defaultClinicalVisit,
} from "@/features/clinical/services/mock-clinical-service";
import { dashboardUsers } from "@/features/dashboard/services/mock-dashboard-service";

const adultUpperTeeth = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
const adultLowerTeeth = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

export function ClinicalWorkspaceScreen({ initialRole }: { initialRole: UserRole }) {
  const [role, setRole] = useState<UserRole>(initialRole);
  const [visit, setVisit] = useState<ClinicalVisitRecord>(defaultClinicalVisit);
  const [feedback, setFeedback] = useState<string>("");
  const [showFinalizeModal, setShowFinalizeModal] = useState(false);
  const [showAmendmentModal, setShowAmendmentModal] = useState(false);
  const [showAddProcedure, setShowAddProcedure] = useState(false);
  const [previewAttachment, setPreviewAttachment] = useState<string | null>(null);

  const isFinalized = visit.status === "Finalized";

  // Form input states
  const [chiefComplaint, setChiefComplaint] = useState(visit.chiefComplaint);
  const [subjectiveNotes, setSubjectiveNotes] = useState(visit.subjectiveNotes);
  const [objectiveFindings, setObjectiveFindings] = useState(visit.objectiveFindings);
  const [primaryDiagnosis, setPrimaryDiagnosis] = useState(visit.diagnosis.primary);
  const [diagnosisCode, setDiagnosisCode] = useState(visit.diagnosis.code || "");
  const [prescriptions, setPrescriptions] = useState(visit.prescriptions);
  const [nextVisit, setNextVisit] = useState(visit.nextVisitRecommendation);
  const [selectedTooth, setSelectedTooth] = useState<number>(visit.selectedTooth);

  // New procedure form state
  const [newProcName, setNewProcName] = useState(commonProcedures[0]);
  const [newProcTooth, setNewProcTooth] = useState<number>(16);
  const [newProcMaterials, setNewProcMaterials] = useState("");
  const [newProcNotes, setNewProcNotes] = useState("");
  const [newProcCost, setNewProcCost] = useState(500);

  // Amendment form state
  const [amendmentReason, setAmendmentReason] = useState("Additional clinical observation");
  const [amendmentNote, setAmendmentNote] = useState("");

  function handleToothClick(tooth: number) {
    if (isFinalized) return;
    setSelectedTooth(tooth);
    setNewProcTooth(tooth);
  }

  function handleSaveDraft() {
    setVisit((prev) => ({
      ...prev,
      chiefComplaint,
      subjectiveNotes,
      objectiveFindings,
      diagnosis: {
        ...prev.diagnosis,
        primary: primaryDiagnosis,
        code: diagnosisCode,
        affectedTeeth: [selectedTooth],
      },
      prescriptions,
      nextVisitRecommendation: nextVisit,
      selectedTooth,
      status: "Draft",
    }));
    setFeedback("Draft clinical notes saved locally.");
  }

  function handleFinalizeRecord() {
    const timestamp = new Date().toLocaleString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    setVisit((prev) => ({
      ...prev,
      chiefComplaint,
      subjectiveNotes,
      objectiveFindings,
      diagnosis: {
        ...prev.diagnosis,
        primary: primaryDiagnosis,
        code: diagnosisCode,
        affectedTeeth: [selectedTooth],
      },
      prescriptions,
      nextVisitRecommendation: nextVisit,
      selectedTooth,
      status: "Finalized",
      finalizedAt: timestamp,
      finalizedBy: dashboardUsers.dentist,
    }));

    setShowFinalizeModal(false);
    setFeedback("Clinical record finalized and locked. The record is now immutable.");
  }

  function handleAddProcedure(e: FormEvent) {
    e.preventDefault();
    if (isFinalized) return;

    const newProc: PerformedProcedure = {
      id: `proc-${Date.now()}`,
      procedure: newProcName,
      tooth: newProcTooth,
      materials: newProcMaterials || undefined,
      notes: newProcNotes || undefined,
      cost: Number(newProcCost) || 0,
    };

    setVisit((prev) => ({
      ...prev,
      treatmentsPerformed: [...prev.treatmentsPerformed, newProc],
    }));

    setNewProcMaterials("");
    setNewProcNotes("");
    setShowAddProcedure(false);
    setFeedback(`Procedure "${newProcName}" recorded.`);
  }

  function handleRemoveProcedure(id: string) {
    if (isFinalized) return;
    setVisit((prev) => ({
      ...prev,
      treatmentsPerformed: prev.treatmentsPerformed.filter((p) => p.id !== id),
    }));
    setFeedback("Procedure removed from draft visit.");
  }

  function handleAddAmendment(e: FormEvent) {
    e.preventDefault();
    if (!amendmentNote.trim()) return;

    const timestamp = new Date().toLocaleString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const newAmendment: ClinicalAmendment = {
      id: `amend-${Date.now()}`,
      timestamp,
      dentist: dashboardUsers[role] || "Attending Clinician",
      reason: amendmentReason,
      note: amendmentNote.trim(),
    };

    setVisit((prev) => ({
      ...prev,
      amendments: [...prev.amendments, newAmendment],
    }));

    setAmendmentNote("");
    setShowAmendmentModal(false);
    setFeedback("Addendum appended to finalized record with audit timestamp.");
  }

  // 1. Receptionist view: RESTRICTED
  if (role === "receptionist") {
    return (
      <AppShell
        activeItem="Clinical records"
        role={role}
        userName={dashboardUsers[role]}
        onRoleChange={setRole}
      >
        <section
          className="permission-state"
          aria-labelledby="clinical-restricted-title"
        >
          <span className="permission-state__icon">
            <ShieldAlert aria-hidden="true" />
          </span>
          <p className="page-heading__eyebrow">Restricted clinical workspace</p>
          <h1 id="clinical-restricted-title">Clinical records are restricted</h1>
          <p>
            Receptionist accounts are restricted from accessing detailed
            clinical notes, dental diagnoses, odontogram charts, and clinical
            attachments in accordance with medical privacy standards.
          </p>
          <div style={{ marginTop: 20 }}>
            <Link
              href="/calendar?role=receptionist"
              className="button button--secondary"
            >
              Return to Calendar
            </Link>
          </div>
        </section>
      </AppShell>
    );
  }

  return (
    <AppShell
      activeItem="Clinical records"
      role={role}
      userName={dashboardUsers[role]}
      onRoleChange={setRole}
    >
      {/* Breadcrumbs */}
      <div className="patient-breadcrumb">
        <Link href={`/patients/mariam-adel?role=${role}`}>
          <ChevronLeft aria-hidden="true" />
          Mariam Adel
        </Link>
        <span>/</span>
        <strong>Current Visit (13 Sep 2026)</strong>
      </div>

      {/* Admin Audit banner */}
      {role === "admin" && (
        <div className="clinical-admin-banner" role="status">
          <Stethoscope aria-hidden="true" />
          <div>
            <strong>Admin Supervisory View</strong>
            <span>
              Clinical access is monitored and logged in the system audit trail.
              Attending dentist: {visit.appointment.dentist}.
            </span>
          </div>
        </div>
      )}

      {/* Patient header card */}
      <header className="clinical-patient-header">
        <div className="clinical-patient-header__info">
          <span className="patient-profile-avatar">{visit.patientName.split(" ").map((n) => n[0]).join("")}</span>
          <div>
            <div className="patient-profile-title">
              <h1>{visit.patientName}</h1>
              <span className="patient-profile-id">Patient #{visit.patientId}</span>
              <span className="clinical-status-pill clinical-status-pill--active">
                {visit.appointment.visitState}
              </span>
            </div>
            <p>
              {visit.patientGender} · {visit.patientAge} years · {visit.patientMobile}
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
            <strong>{visit.appointment.time} · {visit.appointment.type}</strong>
            <small>Arrived {visit.appointment.arrivedMinutesAgo} min ago</small>
          </div>
        </div>
      </header>

      {/* Feedback banner */}
      {feedback && (
        <p className="clinical-feedback" role="status">
          <CheckCircle2 aria-hidden="true" />
          <span>{feedback}</span>
          <button
            type="button"
            aria-label="Dismiss feedback message"
            onClick={() => setFeedback("")}
          >
            <X aria-hidden="true" />
          </button>
        </p>
      )}

      {/* Finalized Record Banner */}
      {isFinalized && (
        <div className="clinical-finalized-banner">
          <BadgeCheck aria-hidden="true" />
          <div>
            <strong>Finalized Clinical Record · Immutable Legal Document</strong>
            <p>
              Finalized by {visit.finalizedBy} on {visit.finalizedAt}. Original
              findings and procedures cannot be modified directly. Addenda may
              be appended below.
            </p>
          </div>
          <button
            type="button"
            className="button button--secondary"
            onClick={() => setShowAmendmentModal(true)}
          >
            <Plus aria-hidden="true" />
            Add Addendum
          </button>
        </div>
      )}

      {/* Main Clinical Layout */}
      <div className="clinical-workspace-grid">
        {/* Left Column: Clinical Documentation */}
        <div className="clinical-main-column">
          {/* Section 1: Chief Complaint */}
          <section className="clinical-card">
            <div className="clinical-card__header">
              <div>
                <h2>Chief complaint</h2>
                <p>Patient statement and presenting symptom</p>
              </div>
            </div>
            {isFinalized ? (
              <p className="clinical-readonly-text">{chiefComplaint}</p>
            ) : (
              <textarea
                className="clinical-textarea"
                rows={2}
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
                placeholder="Describe presenting symptoms..."
              />
            )}
          </section>

          {/* Section 2: Clinical Examination & SOAP Notes */}
          <section className="clinical-card">
            <div className="clinical-card__header">
              <div>
                <h2>Clinical findings &amp; SOAP notes</h2>
                <p>Subjective history, objective assessment and examination</p>
              </div>
            </div>

            <div className="clinical-form-group">
              <label htmlFor="subjective-notes">
                <strong>Subjective (Patient history &amp; symptoms)</strong>
              </label>
              {isFinalized ? (
                <p className="clinical-readonly-text" id="subjective-notes">
                  {subjectiveNotes}
                </p>
              ) : (
                <textarea
                  id="subjective-notes"
                  className="clinical-textarea"
                  rows={3}
                  value={subjectiveNotes}
                  onChange={(e) => setSubjectiveNotes(e.target.value)}
                />
              )}
            </div>

            <div className="clinical-form-group" style={{ marginTop: 14 }}>
              <label htmlFor="objective-findings">
                <strong>Objective (Clinical &amp; radiographic findings)</strong>
              </label>
              {isFinalized ? (
                <p className="clinical-readonly-text" id="objective-findings">
                  {objectiveFindings}
                </p>
              ) : (
                <textarea
                  id="objective-findings"
                  className="clinical-textarea"
                  rows={3}
                  value={objectiveFindings}
                  onChange={(e) => setObjectiveFindings(e.target.value)}
                />
              )}
            </div>
          </section>

          {/* Section 3: Diagnosis */}
          <section className="clinical-card">
            <div className="clinical-card__header">
              <div>
                <h2>Diagnosis</h2>
                <p>Clinical diagnosis and affected tooth</p>
              </div>
            </div>

            <div className="clinical-diagnosis-row">
              <div style={{ flex: 1 }}>
                <label className="clinical-field-label" htmlFor="primary-diag">
                  Primary diagnosis
                </label>
                {isFinalized ? (
                  <p className="clinical-readonly-text" id="primary-diag">
                    {primaryDiagnosis}
                  </p>
                ) : (
                  <select
                    id="primary-diag"
                    className="clinical-select"
                    value={primaryDiagnosis}
                    onChange={(e) => setPrimaryDiagnosis(e.target.value)}
                  >
                    {commonDiagnoses.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div style={{ width: 140 }}>
                <label className="clinical-field-label" htmlFor="icd-code">
                  ICD / Code
                </label>
                {isFinalized ? (
                  <p className="clinical-readonly-text" id="icd-code">
                    {diagnosisCode || "None"}
                  </p>
                ) : (
                  <input
                    id="icd-code"
                    type="text"
                    className="clinical-input"
                    value={diagnosisCode}
                    onChange={(e) => setDiagnosisCode(e.target.value)}
                    placeholder="e.g. K04.5"
                  />
                )}
              </div>

              <div style={{ width: 130 }}>
                <label className="clinical-field-label">Tooth target</label>
                <div className="clinical-tooth-target">
                  Tooth #{selectedTooth}
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Procedures / Treatment Performed */}
          <section className="clinical-card">
            <div className="clinical-card__header">
              <div>
                <h2>Treatment performed this visit</h2>
                <p>Documented clinical procedures and administered materials</p>
              </div>
              {!isFinalized && (
                <button
                  type="button"
                  className="button button--secondary button--compact"
                  onClick={() => setShowAddProcedure(!showAddProcedure)}
                >
                  <Plus aria-hidden="true" />
                  Add procedure
                </button>
              )}
            </div>

            {/* New Procedure Form */}
            {showAddProcedure && !isFinalized && (
              <form
                className="clinical-add-procedure-form"
                onSubmit={handleAddProcedure}
              >
                <h3>Record new procedure</h3>
                <div className="clinical-form-grid-2">
                  <div>
                    <label className="clinical-field-label">Procedure name</label>
                    <select
                      className="clinical-select"
                      value={newProcName}
                      onChange={(e) => setNewProcName(e.target.value)}
                    >
                      {commonProcedures.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="clinical-field-label">Tooth number</label>
                    <input
                      type="number"
                      className="clinical-input"
                      value={newProcTooth}
                      onChange={(e) => setNewProcTooth(Number(e.target.value))}
                      min={11}
                      max={48}
                    />
                  </div>
                </div>

                <div style={{ marginTop: 10 }}>
                  <label className="clinical-field-label">Materials &amp; Anesthesia</label>
                  <input
                    type="text"
                    className="clinical-input"
                    value={newProcMaterials}
                    onChange={(e) => setNewProcMaterials(e.target.value)}
                    placeholder="e.g. Mepivacaine 3%, Ca(OH)2 paste, Cavit seal"
                  />
                </div>

                <div style={{ marginTop: 10 }}>
                  <label className="clinical-field-label">Procedure notes</label>
                  <input
                    type="text"
                    className="clinical-input"
                    value={newProcNotes}
                    onChange={(e) => setNewProcNotes(e.target.value)}
                    placeholder="Clinical observations or details"
                  />
                </div>

                <div className="clinical-form-actions">
                  <button
                    type="button"
                    className="button button--secondary button--compact"
                    onClick={() => setShowAddProcedure(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="button button--primary button--compact"
                  >
                    Save procedure
                  </button>
                </div>
              </form>
            )}

            <div className="clinical-procedure-list">
              {visit.treatmentsPerformed.map((proc, index) => (
                <article key={proc.id} className="clinical-procedure-item">
                  <span className="clinical-proc-index">{index + 1}</span>
                  <div className="clinical-proc-body">
                    <div className="clinical-proc-title">
                      <strong>{proc.procedure}</strong>
                      {proc.tooth && (
                        <span className="clinical-tooth-badge">
                          Tooth #{proc.tooth}
                        </span>
                      )}
                    </div>
                    {proc.anesthesia && (
                      <p className="clinical-proc-sub">
                        <strong>Anesthesia:</strong> {proc.anesthesia}
                      </p>
                    )}
                    {proc.materials && (
                      <p className="clinical-proc-sub">
                        <strong>Materials:</strong> {proc.materials}
                      </p>
                    )}
                    {proc.notes && (
                      <p className="clinical-proc-sub">{proc.notes}</p>
                    )}
                  </div>
                  {!isFinalized && (
                    <button
                      type="button"
                      className="icon-button"
                      aria-label={`Remove procedure ${proc.procedure}`}
                      onClick={() => handleRemoveProcedure(proc.id)}
                    >
                      <Trash2 aria-hidden="true" />
                    </button>
                  )}
                </article>
              ))}
            </div>
          </section>

          {/* Section 5: Prescriptions & Recommendations */}
          <section className="clinical-card">
            <div className="clinical-card__header">
              <div>
                <h2>Post-op instructions &amp; Next visit</h2>
                <p>Medication advice and planned next phase</p>
              </div>
            </div>

            <div className="clinical-form-group">
              <label htmlFor="prescriptions-field">
                <strong>Prescriptions &amp; instructions</strong>
              </label>
              {isFinalized ? (
                <p className="clinical-readonly-text" id="prescriptions-field">
                  {prescriptions || "None recorded"}
                </p>
              ) : (
                <textarea
                  id="prescriptions-field"
                  className="clinical-textarea"
                  rows={2}
                  value={prescriptions}
                  onChange={(e) => setPrescriptions(e.target.value)}
                />
              )}
            </div>

            <div className="clinical-form-group" style={{ marginTop: 12 }}>
              <label htmlFor="next-visit-field">
                <strong>Next visit recommendation</strong>
              </label>
              {isFinalized ? (
                <p className="clinical-readonly-text" id="next-visit-field">
                  {nextVisit}
                </p>
              ) : (
                <input
                  id="next-visit-field"
                  type="text"
                  className="clinical-input"
                  value={nextVisit}
                  onChange={(e) => setNextVisit(e.target.value)}
                />
              )}
            </div>
          </section>

          {/* Section 6: Amendments / Addenda (Shows whenever amendments exist or when finalized) */}
          {(isFinalized || visit.amendments.length > 0) && (
            <section className="clinical-card">
              <div className="clinical-card__header">
                <div>
                  <h2>Addenda &amp; Amendments</h2>
                  <p>Audited post-finalization annotations</p>
                </div>
                {isFinalized && (
                  <button
                    type="button"
                    className="button button--secondary button--compact"
                    onClick={() => setShowAmendmentModal(true)}
                  >
                    <Plus aria-hidden="true" />
                    Add addendum
                  </button>
                )}
              </div>

              {visit.amendments.length === 0 ? (
                <p className="clinical-empty-note">
                  No addenda recorded. Use &quot;Add Addendum&quot; to append a timestamped correction or note.
                </p>
              ) : (
                <div className="clinical-amendment-list">
                  {visit.amendments.map((amend) => (
                    <article key={amend.id} className="clinical-amendment-item">
                      <div className="clinical-amendment-meta">
                        <History aria-hidden="true" />
                        <strong>{amend.reason}</strong>
                        <span>
                          {amend.dentist} · {amend.timestamp}
                        </span>
                      </div>
                      <p className="clinical-amendment-text">{amend.note}</p>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>

        {/* Right Column: Charting & References */}
        <div className="clinical-side-column">
          {/* Treatment Plan Reference */}
          <section className="clinical-card">
            <div className="clinical-card__header">
              <div>
                <h2>Treatment plan reference</h2>
                <p>Plan #{visit.treatmentPlanRef.planId}</p>
              </div>
            </div>
            <div className="clinical-plan-summary">
              <strong>{visit.treatmentPlanRef.title}</strong>
              <div className="clinical-plan-progress">
                <div className="clinical-plan-bar" style={{ width: "66%" }} />
              </div>
              <small>{visit.treatmentPlanRef.progress}</small>
              <div className="clinical-plan-next">
                <span>Next planned phase:</span>
                <strong>{visit.treatmentPlanRef.nextPlannedStep}</strong>
              </div>
            </div>
          </section>

          {/* Interactive Odontogram Chart */}
          <section className="clinical-card">
            <div className="clinical-card__header">
              <div>
                <h2>Odontogram chart</h2>
                <p>Selected tooth: #{selectedTooth}</p>
              </div>
            </div>
            <div className="clinical-odontogram">
              <div className="clinical-arch-label">Upper Arch (Maxillary)</div>
              <div className="clinical-tooth-row">
                {adultUpperTeeth.map((t) => {
                  const isSelected = selectedTooth === t;
                  const isTreated = t === 16;
                  return (
                    <button
                      key={t}
                      type="button"
                      className={`clinical-tooth-btn ${
                        isSelected ? "clinical-tooth-btn--selected" : ""
                      } ${isTreated ? "clinical-tooth-btn--treated" : ""}`}
                      onClick={() => handleToothClick(t)}
                      aria-label={`Tooth ${t}`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>

              <div className="clinical-arch-label" style={{ marginTop: 12 }}>
                Lower Arch (Mandibular)
              </div>
              <div className="clinical-tooth-row">
                {adultLowerTeeth.map((t) => {
                  const isSelected = selectedTooth === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      className={`clinical-tooth-btn ${
                        isSelected ? "clinical-tooth-btn--selected" : ""
                      }`}
                      onClick={() => handleToothClick(t)}
                      aria-label={`Tooth ${t}`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>

              <div className="clinical-odontogram-legend">
                <span>
                  <i className="clinical-dot clinical-dot--treated" /> Active tooth (#16)
                </span>
                <span>
                  <i className="clinical-dot clinical-dot--selected" /> Selected
                </span>
              </div>
            </div>
          </section>

          {/* Clinical Attachments */}
          <section className="clinical-card">
            <div className="clinical-card__header">
              <div>
                <h2>Radiographs &amp; Attachments</h2>
                <p>{visit.attachments.length} files attached</p>
              </div>
            </div>

            <div className="clinical-attachment-list">
              {visit.attachments.map((att) => (
                <div key={att.id} className="clinical-attachment-card">
                  <div className="clinical-att-icon">
                    {att.category === "X-Ray" ? (
                      <ImageIcon aria-hidden="true" />
                    ) : (
                      <FileText aria-hidden="true" />
                    )}
                  </div>
                  <div className="clinical-att-details">
                    <strong>{att.title}</strong>
                    <small>
                      {att.category} · {att.size} · {att.date}
                    </small>
                  </div>
                  <button
                    type="button"
                    className="button button--secondary button--compact"
                    onClick={() => setPreviewAttachment(att.title)}
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Actions panel */}
          <section className="clinical-actions-card">
            {!isFinalized ? (
              <>
                <button
                  type="button"
                  className="button button--secondary button--full"
                  onClick={handleSaveDraft}
                >
                  <Save aria-hidden="true" />
                  Save draft
                </button>
                <button
                  type="button"
                  className="button button--primary button--full"
                  style={{ marginTop: 10 }}
                  onClick={() => setShowFinalizeModal(true)}
                >
                  <FileCheck2 aria-hidden="true" />
                  Finalize clinical record
                </button>
                <p className="clinical-actions-note">
                  <Lock aria-hidden="true" />
                  Finalizing will permanently lock notes into an immutable legal health record.
                </p>
              </>
            ) : (
              <div className="clinical-locked-status">
                <BadgeCheck aria-hidden="true" />
                <strong>Record finalized and locked</strong>
                <p>Corrections must be made as an audited addendum.</p>
                <button
                  type="button"
                  className="button button--secondary button--full"
                  style={{ marginTop: 12 }}
                  onClick={() => setShowAmendmentModal(true)}
                >
                  <Plus aria-hidden="true" />
                  Add addendum
                </button>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Finalize Confirmation Modal */}
      {showFinalizeModal && (
        <div className="clinical-modal-backdrop" role="dialog" aria-modal="true">
          <div className="clinical-modal">
            <div className="clinical-modal__header">
              <span className="clinical-modal__icon">
                <Lock aria-hidden="true" />
              </span>
              <div>
                <h2>Finalize clinical record?</h2>
                <p>Action cannot be undone</p>
              </div>
            </div>
            <div className="clinical-modal__body">
              <p>
                Once finalized, this clinical record becomes a permanent medical
                record and cannot be directly edited or deleted.
              </p>
              <p>
                Any subsequent corrections or additions will require a
                timestamped addendum attributed to your clinician profile.
              </p>
            </div>
            <div className="clinical-modal__actions">
              <button
                type="button"
                className="button button--secondary"
                onClick={() => setShowFinalizeModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="button button--primary"
                onClick={handleFinalizeRecord}
              >
                Confirm &amp; Finalize
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Amendment Modal */}
      {showAmendmentModal && (
        <div className="clinical-modal-backdrop" role="dialog" aria-modal="true">
          <form className="clinical-modal" onSubmit={handleAddAmendment}>
            <div className="clinical-modal__header">
              <span className="clinical-modal__icon">
                <History aria-hidden="true" />
              </span>
              <div>
                <h2>Add Addendum / Amendment</h2>
                <p>Audited correction to finalized record</p>
              </div>
            </div>
            <div className="clinical-modal__body">
              <label className="clinical-field-label">Reason for amendment</label>
              <select
                className="clinical-select"
                value={amendmentReason}
                onChange={(e) => setAmendmentReason(e.target.value)}
              >
                <option value="Additional clinical observation">Additional clinical observation</option>
                <option value="Typographical correction">Typographical correction</option>
                <option value="Telephone follow-up note">Telephone follow-up note</option>
                <option value="Histology / Lab report update">Histology / Lab report update</option>
                <option value="Prescription modification">Prescription modification</option>
              </select>

              <div style={{ marginTop: 12 }}>
                <label className="clinical-field-label">Addendum text</label>
                <textarea
                  className="clinical-textarea"
                  rows={4}
                  value={amendmentNote}
                  onChange={(e) => setAmendmentNote(e.target.value)}
                  placeholder="Enter the addendum details. This will be stored as an immutable entry..."
                  required
                />
              </div>
            </div>
            <div className="clinical-modal__actions">
              <button
                type="button"
                className="button button--secondary"
                onClick={() => setShowAmendmentModal(false)}
              >
                Cancel
              </button>
              <button type="submit" className="button button--primary">
                Append Addendum
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Attachment Preview Modal */}
      {previewAttachment && (
        <div className="clinical-modal-backdrop" role="dialog" aria-modal="true">
          <div className="clinical-modal">
            <div className="clinical-modal__header">
              <span className="clinical-modal__icon">
                <ImageIcon aria-hidden="true" />
              </span>
              <div>
                <h2>{previewAttachment}</h2>
                <p>Clinical radiograph viewer (Mock)</p>
              </div>
              <button
                type="button"
                className="icon-button"
                style={{ marginLeft: "auto" }}
                onClick={() => setPreviewAttachment(null)}
                aria-label="Close radiograph preview"
              >
                <X aria-hidden="true" />
              </button>
            </div>
            <div className="clinical-modal__body clinical-xray-preview">
              <div className="clinical-xray-placeholder">
                <ImageIcon aria-hidden="true" />
                <strong>Radiograph Preview: {previewAttachment}</strong>
                <span>High-resolution diagnostic digital X-ray image loaded</span>
              </div>
            </div>
            <div className="clinical-modal__actions">
              <button
                type="button"
                className="button button--secondary"
                onClick={() => setPreviewAttachment(null)}
              >
                Close viewer
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
