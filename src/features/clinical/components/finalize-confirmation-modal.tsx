import { Lock } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { ClinicalVisitRecord } from "../clinical.types";
import { UserRole } from "@/types";

function FinalizeConfirmationModal({
  setVisit,
  chiefComplaint,
  subjectiveNotes,
  objectiveFindings,
  primaryDiagnosis,
  diagnosisCode,
  selectedTooth,
  prescriptions,
  nextVisit,
  setShowFinalizeModal,
  setFeedback,
  dashboardUsers,
}: {
  setVisit: Dispatch<SetStateAction<ClinicalVisitRecord>>;
  chiefComplaint: string;
  subjectiveNotes: string;
  objectiveFindings: string;
  primaryDiagnosis: string;
  diagnosisCode: string;
  selectedTooth: number;
  prescriptions: string;
  nextVisit: string;
  setShowFinalizeModal: Dispatch<SetStateAction<boolean>>;
  setFeedback: Dispatch<SetStateAction<string>>;
  dashboardUsers: Record<UserRole, string>;
}) {
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
    setFeedback(
      "Clinical record finalized and locked. The record is now immutable.",
    );
  }

  return (
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
            Any subsequent corrections or additions will require a timestamped
            addendum attributed to your clinician profile.
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
  );
}

export default FinalizeConfirmationModal;
