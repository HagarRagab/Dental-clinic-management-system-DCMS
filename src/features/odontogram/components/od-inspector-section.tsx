import { Sparkles } from "lucide-react";
import {
  ConditionDefinition,
  ToothCondition,
  ToothRecord,
  ToothSurface,
} from "../odontogram.types";
import { ToothSurfaceMap } from "./tooth-surface-map";

function OdInspectorSection({
  getToothName,
  selectedToothNum,
  conditionDefinitions,
  selectedTooth,
  commonProceduresByCondition,
  handleSelectQuickProcedure,
  readOnly,
  updateSelectedTooth,
}: {
  getToothName: (toothNumber: number) => string;
  selectedToothNum: number;
  conditionDefinitions: Record<ToothCondition, ConditionDefinition>;
  selectedTooth: ToothRecord;
  commonProceduresByCondition: Record<string, string[]>;
  handleSelectQuickProcedure: (procName: string) => void;
  readOnly: boolean;
  updateSelectedTooth: (updater: (prev: ToothRecord) => ToothRecord) => void;
}) {
  function handleToggleSurface(surface: ToothSurface) {
    updateSelectedTooth((tooth) => ({
      ...tooth,
      surfaces: {
        ...tooth.surfaces,
        [surface]: !tooth.surfaces[surface],
      },
    }));
  }

  function handleConditionChange(condition: ToothCondition) {
    updateSelectedTooth((tooth) => {
      // If setting to missing, reset surfaces
      if (condition === "missing") {
        return {
          ...tooth,
          condition,
          surfaces: {
            occlusal: false,
            mesial: false,
            distal: false,
            buccal: false,
            lingual: false,
          },
        };
      }
      return {
        ...tooth,
        condition,
      };
    });
  }

  return (
    <aside
      className="od-inspector-section"
      aria-label="Tooth details and editing"
    >
      <div className="od-inspector-card">
        <div className="od-inspector-header">
          <div>
            <span className="od-inspector-eyebrow">Tooth Inspector</span>
            <h3>Tooth #{selectedToothNum}</h3>
            <p>{getToothName(selectedToothNum)}</p>
          </div>
          <span
            className="od-current-condition-badge"
            style={{
              backgroundColor: `${conditionDefinitions[selectedTooth.condition].color}18`,
              color: conditionDefinitions[selectedTooth.condition].color,
              borderColor: `${conditionDefinitions[selectedTooth.condition].color}40`,
            }}
          >
            {conditionDefinitions[selectedTooth.condition].label}
          </span>
        </div>

        {/* Condition Selection Palette */}
        <div className="od-form-block">
          <label className="od-form-label">Tooth Status / Condition</label>
          <div className="od-condition-palette">
            {Object.values(conditionDefinitions).map((cond) => {
              const isActive = selectedTooth.condition === cond.id;
              return (
                <button
                  key={cond.id}
                  type="button"
                  className={`od-condition-btn ${isActive ? "od-condition-btn--active" : ""}`}
                  style={{
                    borderColor: isActive ? cond.color : undefined,
                    backgroundColor: isActive ? `${cond.color}15` : undefined,
                  }}
                  onClick={() => handleConditionChange(cond.id)}
                  disabled={readOnly}
                >
                  <span
                    className="od-condition-btn__dot"
                    style={{
                      backgroundColor: cond.color,
                    }}
                  />
                  <span>{cond.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Surface Map */}
        <div className="od-form-block">
          <label className="od-form-label">
            Surface Restorations &amp; Lesions
          </label>
          <ToothSurfaceMap
            toothNumber={selectedToothNum}
            surfaces={selectedTooth.surfaces}
            condition={selectedTooth.condition}
            onToggleSurface={handleToggleSurface}
            readOnly={readOnly}
          />
        </div>

        {/* Quick Procedure Assignment */}
        {!readOnly && (
          <div className="od-form-block">
            <label className="od-form-label">
              <span>Quick Procedure Preset</span>
            </label>
            <div className="od-quick-procs">
              {commonProceduresByCondition[selectedTooth.condition]?.map(
                (proc) => (
                  <button
                    key={proc}
                    type="button"
                    className="od-quick-proc-btn"
                    onClick={() => handleSelectQuickProcedure(proc)}
                  >
                    <Sparkles size={11} aria-hidden="true" />
                    {proc}
                  </button>
                ),
              )}
            </div>
          </div>
        )}

        {/* Planned Procedure Input */}
        <div className="od-form-block">
          <label className="od-form-label" htmlFor="planned-proc-field">
            Planned Procedure
          </label>
          <input
            id="planned-proc-field"
            type="text"
            className="od-input"
            placeholder="e.g. Class II Composite Restoration"
            value={selectedTooth.plannedProcedure || ""}
            onChange={(e) =>
              updateSelectedTooth((t) => ({
                ...t,
                plannedProcedure: e.target.value,
              }))
            }
            readOnly={readOnly}
          />
        </div>

        {/* Completed Procedure */}
        <div className="od-form-block">
          <label className="od-form-label" htmlFor="completed-proc-field">
            Completed Procedure
          </label>
          <input
            id="completed-proc-field"
            type="text"
            className="od-input"
            placeholder="e.g. Root canal obturated"
            value={selectedTooth.completedProcedure || ""}
            onChange={(e) =>
              updateSelectedTooth((t) => ({
                ...t,
                completedProcedure: e.target.value,
              }))
            }
            readOnly={readOnly}
          />
        </div>

        {/* Clinical Notes for this tooth */}
        <div className="od-form-block">
          <label className="od-form-label" htmlFor="tooth-notes-field">
            Tooth Clinical Notes
          </label>
          <textarea
            id="tooth-notes-field"
            className="od-textarea"
            rows={2}
            placeholder="Observations, sensitivity, pulp vitality, margin integrity..."
            value={selectedTooth.notes || ""}
            onChange={(e) =>
              updateSelectedTooth((t) => ({
                ...t,
                notes: e.target.value,
              }))
            }
            readOnly={readOnly}
          />
        </div>

        {selectedTooth.lastUpdated && (
          <p className="od-tooth-meta">
            Last updated: <strong>{selectedTooth.lastUpdated}</strong>
          </p>
        )}
      </div>
    </aside>
  );
}

export default OdInspectorSection;
