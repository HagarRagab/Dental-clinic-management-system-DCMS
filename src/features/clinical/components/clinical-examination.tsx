import { Dispatch, SetStateAction } from "react";

function ClinicalExamination({
  isFinalized,
  subjectiveNotes,
  setSubjectiveNotes,
  objectiveFindings,
  setObjectiveFindings,
}: {
  isFinalized: boolean;
  subjectiveNotes: string;
  setSubjectiveNotes: Dispatch<SetStateAction<string>>;
  objectiveFindings: string;
  setObjectiveFindings: Dispatch<SetStateAction<string>>;
}) {
  return (
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

      <div className="clinical-form-group mt-3.5">
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
  );
}

export default ClinicalExamination;
