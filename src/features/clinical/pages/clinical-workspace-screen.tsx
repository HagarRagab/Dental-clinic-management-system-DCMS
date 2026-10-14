"use client";

import Link from "next/link";
import {
  BadgeCheck,
  CheckCircle2,
  ChevronLeft,
  FileCheck2,
  Lock,
  Plus,
  Save,
  ShieldAlert,
  Stethoscope,
  X,
} from "lucide-react";
import { useState, type SubmitEvent } from "react";
import { AppShell } from "@/components/layout/app-shell";
import type { UserRole } from "@/types";
import type { ClinicalVisitRecord } from "@/features/clinical/clinical.types";
import {
  commonDiagnoses,
  commonProcedures,
  defaultClinicalVisit,
} from "@/features/clinical/services/mock-clinical-service";
import { dashboardUsers } from "@/features/dashboard/services/mock-dashboard-service";
import ClinicalPatientHeader from "../components/clinical-patient-header";
import ChiefComplaint from "../components/chief-complaint";
import ClinicalExamination from "../components/clinical-examination";
import Diagnosis from "../components/diagnosis";
import InteractiveOdChart from "../components/interactive-od-chart";
import ClinicalAttachments from "../components/clinical-attachments";
import TreatmentPlanReference from "../components/treatment-plan-reference";
import Amendments from "../components/amendments";
import Procedures from "../components/procedures";
import AttachmentPreviewModal from "../components/attachment-preview-modal";
import Prescriptions from "../components/prescriptions";
import AddAmendmentModal from "../components/add-amendment-modal";
import FinalizeConfirmationModal from "../components/finalize-confirmation-modal";

export function ClinicalWorkspaceScreen({
  initialRole,
}: {
  initialRole: UserRole;
}) {
  const [role, setRole] = useState<UserRole>(initialRole);
  const [visit, setVisit] = useState<ClinicalVisitRecord>(defaultClinicalVisit);
  const [feedback, setFeedback] = useState<string>("");
  const [showFinalizeModal, setShowFinalizeModal] = useState(false);
  const [showAmendmentModal, setShowAmendmentModal] = useState(false);
  const [previewAttachment, setPreviewAttachment] = useState<string | null>(
    null,
  );

  const isFinalized = visit.status === "Finalized";

  // Form input states
  const [chiefComplaint, setChiefComplaint] = useState(visit.chiefComplaint);
  const [subjectiveNotes, setSubjectiveNotes] = useState(visit.subjectiveNotes);
  const [objectiveFindings, setObjectiveFindings] = useState(
    visit.objectiveFindings,
  );
  const [primaryDiagnosis, setPrimaryDiagnosis] = useState(
    visit.diagnosis.primary,
  );
  const [diagnosisCode, setDiagnosisCode] = useState(
    visit.diagnosis.code || "",
  );
  const [prescriptions, setPrescriptions] = useState(visit.prescriptions);
  const [nextVisit, setNextVisit] = useState(visit.nextVisitRecommendation);
  const [selectedTooth, setSelectedTooth] = useState<number>(
    visit.selectedTooth,
  );
  // New procedure form state
  const [newProcTooth, setNewProcTooth] = useState<number>(16);

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
          <h1 id="clinical-restricted-title">
            Clinical records are restricted
          </h1>
          <p>
            Receptionist accounts are restricted from accessing detailed
            clinical notes, dental diagnoses, odontogram charts, and clinical
            attachments in accordance with medical privacy standards.
          </p>
          <div className="mt-5 flex justify-center">
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
      <ClinicalPatientHeader visit={visit} />

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
            <strong>
              Finalized Clinical Record · Immutable Legal Document
            </strong>
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
          <ChiefComplaint
            chiefComplaint={chiefComplaint}
            isFinalized={isFinalized}
            setChiefComplaint={setChiefComplaint}
          />
          {/* Section 2: Clinical Examination & SOAP Notes */}
          <ClinicalExamination
            isFinalized={isFinalized}
            objectiveFindings={objectiveFindings}
            setObjectiveFindings={setObjectiveFindings}
            setSubjectiveNotes={setSubjectiveNotes}
            subjectiveNotes={subjectiveNotes}
          />
          {/* Section 3: Diagnosis */}
          <Diagnosis
            isFinalized={isFinalized}
            primaryDiagnosis={primaryDiagnosis}
            setPrimaryDiagnosis={setPrimaryDiagnosis}
            commonDiagnoses={commonDiagnoses}
            diagnosisCode={diagnosisCode}
            setDiagnosisCode={setDiagnosisCode}
            selectedTooth={selectedTooth}
          />
          {/* Section 4: Procedures / Treatment Performed */}
          <Procedures
            commonProcedures={commonProcedures}
            isFinalized={isFinalized}
            newProcTooth={newProcTooth}
            setFeedback={setFeedback}
            setNewProcTooth={setNewProcTooth}
            setVisit={setVisit}
            visit={visit}
          />
          {/* Section 5: Prescriptions & Recommendations */}
          <Prescriptions
            isFinalized={isFinalized}
            nextVisit={nextVisit}
            prescriptions={prescriptions}
            setNextVisit={setNextVisit}
            setPrescriptions={setPrescriptions}
          />
          {/* Section 6: Amendments / Addenda (Shows whenever amendments exist or when finalized) */}
          {(isFinalized || visit.amendments.length > 0) && (
            <Amendments
              isFinalized={isFinalized}
              setShowAmendmentModal={setShowAmendmentModal}
              visit={visit}
            />
          )}
        </div>

        {/* Right Column: Charting & References */}
        <div className="clinical-side-column">
          {/* Treatment Plan Reference */}
          <TreatmentPlanReference visit={visit} />

          {/* Interactive Odontogram Chart */}
          <InteractiveOdChart
            isFinalized={isFinalized}
            selectedTooth={selectedTooth}
            setNewProcTooth={setNewProcTooth}
            setSelectedTooth={setSelectedTooth}
          />

          {/* Clinical Attachments */}
          <ClinicalAttachments
            setPreviewAttachment={setPreviewAttachment}
            visit={visit}
          />

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
                  className="button button--primary button--full mt-2.5"
                  onClick={() => setShowFinalizeModal(true)}
                >
                  <FileCheck2 aria-hidden="true" />
                  Finalize clinical record
                </button>
                <p className="clinical-actions-note">
                  <Lock aria-hidden="true" />
                  Finalizing will permanently lock notes into an immutable legal
                  health record.
                </p>
              </>
            ) : (
              <div className="clinical-locked-status">
                <BadgeCheck aria-hidden="true" />
                <strong>Record finalized and locked</strong>
                <p>Corrections must be made as an audited addendum.</p>
                <button
                  type="button"
                  className="button button--secondary button--full mt-3"
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
        <FinalizeConfirmationModal
          chiefComplaint={chiefComplaint}
          dashboardUsers={dashboardUsers}
          diagnosisCode={diagnosisCode}
          nextVisit={nextVisit}
          objectiveFindings={objectiveFindings}
          prescriptions={prescriptions}
          primaryDiagnosis={primaryDiagnosis}
          selectedTooth={selectedTooth}
          setFeedback={setFeedback}
          setShowFinalizeModal={setShowFinalizeModal}
          setVisit={setVisit}
          subjectiveNotes={subjectiveNotes}
        />
      )}

      {/* Add Amendment Modal */}
      {showAmendmentModal && (
        <AddAmendmentModal
          dashboardUsers={dashboardUsers}
          role={role}
          setFeedback={setFeedback}
          setShowAmendmentModal={setShowAmendmentModal}
          setVisit={setVisit}
        />
      )}

      {/* Attachment Preview Modal */}
      {previewAttachment && (
        <AttachmentPreviewModal
          previewAttachment={previewAttachment}
          setPreviewAttachment={setPreviewAttachment}
        />
      )}
    </AppShell>
  );
}
