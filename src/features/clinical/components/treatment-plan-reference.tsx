import type { ClinicalVisitRecord } from "../clinical.types";

function TreatmentPlanReference({ visit }: { visit: ClinicalVisitRecord }) {
  return (
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
  );
}

export default TreatmentPlanReference;
