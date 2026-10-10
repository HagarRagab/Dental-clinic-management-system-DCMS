import { History, Plus } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { ClinicalVisitRecord } from "../clinical.types";

function Amendments({
  isFinalized,
  setShowAmendmentModal,
  visit,
}: {
  isFinalized: boolean;
  setShowAmendmentModal: Dispatch<SetStateAction<boolean>>;
  visit: ClinicalVisitRecord;
}) {
  return (
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
          No addenda recorded. Use &quot;Add Addendum&quot; to append a
          timestamped correction or note.
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
  );
}

export default Amendments;
