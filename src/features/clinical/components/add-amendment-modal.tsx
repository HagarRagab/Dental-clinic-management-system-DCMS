import { History } from "lucide-react";
import { Dispatch, SetStateAction, type SubmitEvent, useState } from "react";
import { ClinicalAmendment, ClinicalVisitRecord } from "../clinical.types";
import { UserRole } from "@/types";

function AddAmendmentModal({
  dashboardUsers,
  role,
  setVisit,
  setShowAmendmentModal,
  setFeedback,
}: {
  dashboardUsers: Record<UserRole, string>;
  role: "admin" | "dentist";
  setVisit: Dispatch<SetStateAction<ClinicalVisitRecord>>;
  setShowAmendmentModal: Dispatch<SetStateAction<boolean>>;
  setFeedback: Dispatch<SetStateAction<string>>;
}) {
  // Amendment form state
  const [amendmentReason, setAmendmentReason] = useState(
    "Additional clinical observation",
  );
  const [amendmentNote, setAmendmentNote] = useState("");

  function handleAddAmendment(e: SubmitEvent) {
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

  return (
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
            <option value="Additional clinical observation">
              Additional clinical observation
            </option>
            <option value="Typographical correction">
              Typographical correction
            </option>
            <option value="Telephone follow-up note">
              Telephone follow-up note
            </option>
            <option value="Histology / Lab report update">
              Histology / Lab report update
            </option>
            <option value="Prescription modification">
              Prescription modification
            </option>
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
  );
}

export default AddAmendmentModal;
