import { Dispatch, SetStateAction } from "react";

function ChiefComplaint({
  isFinalized,
  chiefComplaint,
  setChiefComplaint,
}: {
  isFinalized: boolean;
  chiefComplaint: string;
  setChiefComplaint: Dispatch<SetStateAction<string>>;
}) {
  return (
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
  );
}

export default ChiefComplaint;
