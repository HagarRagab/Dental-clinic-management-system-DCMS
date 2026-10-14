import { Plus, Trash2 } from "lucide-react";
import { Dispatch, SetStateAction, type SubmitEvent, useState } from "react";
import { ClinicalVisitRecord, PerformedProcedure } from "../clinical.types";

const newProcCost = 500;

function Procedures({
  commonProcedures,
  isFinalized,
  newProcTooth,
  setVisit,
  setFeedback,
  setNewProcTooth,
  visit,
}: {
  commonProcedures: string[];
  isFinalized: boolean;
  newProcTooth: number;
  setVisit: Dispatch<SetStateAction<ClinicalVisitRecord>>;
  setFeedback: Dispatch<SetStateAction<string>>;
  setNewProcTooth: Dispatch<SetStateAction<number>>;
  visit: ClinicalVisitRecord;
}) {
  const [showAddProcedure, setShowAddProcedure] = useState(false);
  const [newProcName, setNewProcName] = useState(commonProcedures[0]);
  const [newProcMaterials, setNewProcMaterials] = useState("");
  const [newProcNotes, setNewProcNotes] = useState("");

  function handleAddProcedure(e: SubmitEvent) {
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

  return (
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

          <div className="mt-2.5">
            <label className="clinical-field-label">
              Materials &amp; Anesthesia
            </label>
            <input
              type="text"
              className="clinical-input"
              value={newProcMaterials}
              onChange={(e) => setNewProcMaterials(e.target.value)}
              placeholder="e.g. Mepivacaine 3%, Ca(OH)2 paste, Cavit seal"
            />
          </div>

          <div className="mt-2.5">
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
              {proc.notes && <p className="clinical-proc-sub">{proc.notes}</p>}
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
  );
}

export default Procedures;
