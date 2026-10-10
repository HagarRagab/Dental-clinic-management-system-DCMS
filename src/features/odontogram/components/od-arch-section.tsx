import { Dispatch, SetStateAction } from "react";
import {
  ConditionDefinition,
  OdontogramChartData,
  ToothCondition,
} from "../odontogram.types";

function OdArchSection({
  upperArchTeeth,
  chart,
  selectedToothNum,
  conditionDefinitions,
  setSelectedToothNum,
  getToothName,
  lowerArchTeeth,
}: {
  upperArchTeeth: number[];
  chart: OdontogramChartData;
  selectedToothNum: number;
  conditionDefinitions: Record<ToothCondition, ConditionDefinition>;
  setSelectedToothNum: Dispatch<SetStateAction<number>>;
  getToothName: (num: number) => string;
  lowerArchTeeth: number[];
}) {
  return (
    <div className="od-arch-section">
      {/* Upper Arch (Maxillary) */}
      <div className="od-arch-block">
        <div className="od-arch-header">
          <h3>Upper Arch (Maxillary)</h3>
          <span>Right (Q1) — Midline — Left (Q2)</span>
        </div>
        <div className="od-tooth-grid">
          {upperArchTeeth.map((num) => {
            const tooth = chart.teeth[num];
            const isSelected = selectedToothNum === num;
            const cond = tooth
              ? conditionDefinitions[tooth.condition]
              : conditionDefinitions.healthy;

            return (
              <button
                key={num}
                type="button"
                className={`od-tooth-btn ${isSelected ? "od-tooth-btn--selected" : ""}`}
                onClick={() => setSelectedToothNum(num)}
                aria-label={`Select ${getToothName(num)}`}
                aria-pressed={isSelected}
              >
                <span className="od-tooth-num">{num}</span>
                <span
                  className="od-tooth-indicator"
                  style={{
                    backgroundColor: cond.color,
                  }}
                  title={`${cond.label}${tooth?.notes ? `: ${tooth.notes}` : ""}`}
                />
                <span className="od-tooth-badge">{cond.shortCode}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Midline divider */}
      <div className="od-arch-divider">
        <span>Occlusal Plane</span>
      </div>

      {/* Lower Arch (Mandibular) */}
      <div className="od-arch-block">
        <div className="od-arch-header">
          <h3>Lower Arch (Mandibular)</h3>
          <span>Right (Q4) — Midline — Left (Q3)</span>
        </div>
        <div className="od-tooth-grid">
          {lowerArchTeeth.map((num) => {
            const tooth = chart.teeth[num];
            const isSelected = selectedToothNum === num;
            const cond = tooth
              ? conditionDefinitions[tooth.condition]
              : conditionDefinitions.healthy;

            return (
              <button
                key={num}
                type="button"
                className={`od-tooth-btn ${isSelected ? "od-tooth-btn--selected" : ""}`}
                onClick={() => setSelectedToothNum(num)}
                aria-label={`Select ${getToothName(num)}`}
                aria-pressed={isSelected}
              >
                <span className="od-tooth-num">{num}</span>
                <span
                  className="od-tooth-indicator"
                  style={{
                    backgroundColor: cond.color,
                  }}
                  title={`${cond.label}${tooth?.notes ? `: ${tooth.notes}` : ""}`}
                />
                <span className="od-tooth-badge">{cond.shortCode}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Condition Legend */}
      <div className="od-legend-card">
        <h4>Condition Codes</h4>
        <div className="od-legend-grid">
          {Object.values(conditionDefinitions).map((c) => (
            <div key={c.id} className="od-legend-item">
              <span
                className="od-legend-dot"
                style={{
                  backgroundColor: c.color,
                }}
              />
              <span className="od-legend-code">[{c.shortCode}]</span>
              <span className="od-legend-name">{c.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OdArchSection;
