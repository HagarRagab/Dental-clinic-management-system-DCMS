import { ConditionDefinition, ToothCondition } from "../odontogram.types";

function OdMetrics({
  conditionDefinitions,
  summary,
}: {
  conditionDefinitions: Record<ToothCondition, ConditionDefinition>;
  summary: any;
}) {
  return (
    <div className="od-metrics-strip" aria-label="Odontogram summary metrics">
      <div className="od-metric-pill">
        <span
          className="od-metric-dot"
          style={{
            background: conditionDefinitions.healthy.color,
          }}
        />
        <span>
          Sound: <strong>{summary.healthy}</strong>
        </span>
      </div>
      <div className="od-metric-pill">
        <span
          className="od-metric-dot"
          style={{
            background: conditionDefinitions.caries.color,
          }}
        />
        <span>
          Caries: <strong>{summary.caries}</strong>
        </span>
      </div>
      <div className="od-metric-pill">
        <span
          className="od-metric-dot"
          style={{
            background: conditionDefinitions.composite.color,
          }}
        />
        <span>
          Restored: <strong>{summary.restored}</strong>
        </span>
      </div>
      <div className="od-metric-pill">
        <span
          className="od-metric-dot"
          style={{
            background: conditionDefinitions["root-canal"].color,
          }}
        />
        <span>
          Endo/Crown: <strong>{summary.crownEndo}</strong>
        </span>
      </div>
      <div className="od-metric-pill">
        <span
          className="od-metric-dot"
          style={{
            background: conditionDefinitions.missing.color,
          }}
        />
        <span>
          Missing: <strong>{summary.missing}</strong>
        </span>
      </div>
    </div>
  );
}

export default OdMetrics;
