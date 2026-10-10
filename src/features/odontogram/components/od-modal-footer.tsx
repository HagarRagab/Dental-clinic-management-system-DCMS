import { Info, Save } from "lucide-react";

function OdModalFooter({
  readOnly,
  handleSave,
  onClose,
}: {
  readOnly: boolean;
  handleSave: () => void;
  onClose: () => void;
}) {
  return (
    <footer className="od-modal__footer">
      <div className="od-audit-note">
        <Info size={14} aria-hidden="true" />
        <span>
          Clinical Odontogram records are versioned in patient history. Real EHR
          sync in Phase 2.
        </span>
      </div>
      <div className="od-modal__footer-actions">
        <button
          type="button"
          className="button button--secondary"
          onClick={onClose}
        >
          {readOnly ? "Close" : "Cancel"}
        </button>
        {!readOnly && (
          <button
            type="button"
            className="button button--primary"
            onClick={handleSave}
          >
            <Save size={15} aria-hidden="true" />
            Save Odontogram
          </button>
        )}
      </div>
    </footer>
  );
}

export default OdModalFooter;
