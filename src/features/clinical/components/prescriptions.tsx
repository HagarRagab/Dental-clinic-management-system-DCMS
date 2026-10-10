import { Dispatch, SetStateAction } from "react";

function Prescriptions({
  isFinalized,
  prescriptions,
  setPrescriptions,
  nextVisit,
  setNextVisit,
}: {
  isFinalized: boolean;
  prescriptions: string;
  setPrescriptions: Dispatch<SetStateAction<string>>;
  nextVisit: string;
  setNextVisit: Dispatch<SetStateAction<string>>;
}) {
  return (
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
  );
}

export default Prescriptions;
