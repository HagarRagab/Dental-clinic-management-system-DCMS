"use client";

import { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  History,
  Info,
  RotateCcw,
  Save,
  Sparkles,
  Stethoscope,
  X,
} from "lucide-react";
import type {
  OdontogramChartData,
  ToothCondition,
  ToothRecord,
  ToothSurface,
} from "@/features/odontogram/odontogram.types";
import {
  allTeeth,
  buildInitialMariamAdelChart,
  calculateChartSummary,
  commonProceduresByCondition,
  conditionDefinitions,
  getToothName,
  lowerArchTeeth,
  upperArchTeeth,
} from "@/features/odontogram/services/mock-odontogram-service";
import { ToothSurfaceMap } from "@/features/odontogram/components/tooth-surface-map";

interface OdontogramEditorModalProps {
  initialChart?: OdontogramChartData;
  initialToothNumber?: number;
  onClose: () => void;
  onSave: (chart: OdontogramChartData) => void;
  readOnly?: boolean;
}

export function OdontogramEditorModal({
  initialChart,
  initialToothNumber = 16,
  onClose,
  onSave,
  readOnly = false,
}: OdontogramEditorModalProps) {
  const [chart, setChart] = useState<OdontogramChartData>(
    initialChart || buildInitialMariamAdelChart()
  );
  const [selectedToothNum, setSelectedToothNum] = useState<number>(initialToothNumber);
  const [feedback, setFeedback] = useState("");

  const selectedTooth: ToothRecord =
    chart.teeth[selectedToothNum] || {
      toothNumber: selectedToothNum,
      condition: "healthy",
      surfaces: { occlusal: false, mesial: false, distal: false, buccal: false, lingual: false },
    };

  const summary = calculateChartSummary(chart);

  function updateSelectedTooth(updater: (prev: ToothRecord) => ToothRecord) {
    if (readOnly) return;
    setChart((current) => ({
      ...current,
      teeth: {
        ...current.teeth,
        [selectedToothNum]: {
          ...updater(selectedTooth),
          lastUpdated: new Date().toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
        },
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
          surfaces: { occlusal: false, mesial: false, distal: false, buccal: false, lingual: false },
        };
      }
      return {
        ...tooth,
        condition,
      };
    });
  }

  function handleToggleSurface(surface: ToothSurface) {
    updateSelectedTooth((tooth) => ({
      ...tooth,
      surfaces: {
        ...tooth.surfaces,
        [surface]: !tooth.surfaces[surface],
      },
    }));
  }

  function handleSelectQuickProcedure(procName: string) {
    updateSelectedTooth((tooth) => ({
      ...tooth,
      plannedProcedure: procName,
    }));
  }

  function handleSave() {
    onSave(chart);
    setFeedback("Odontogram chart updated successfully.");
    setTimeout(() => setFeedback(""), 4000);
  }

  function handleReset() {
    if (confirm("Reset odontogram back to initial baseline? Any unsaved changes will be lost.")) {
      setChart(buildInitialMariamAdelChart());
      setFeedback("Chart reset to initial baseline.");
      setTimeout(() => setFeedback(""), 4000);
    }
  }

  return (
    <div
      className="od-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="od-modal-title"
    >
      <div className="od-modal">
        {/* Modal Header */}
        <header className="od-modal__header">
          <div className="od-modal__title-group">
            <div className="od-modal__icon">
              <Stethoscope aria-hidden="true" size={20} />
            </div>
            <div>
              <h2 id="od-modal-title" className="od-modal__title">
                Interactive Odontogram Charting
              </h2>
              <p className="od-modal__subtitle">
                Patient: <strong>{chart.patientName}</strong> · Adult Dentition (FDI Two-Digit Notation)
              </p>
            </div>
          </div>

          <div className="od-modal__header-actions">
            {!readOnly && (
              <>
                <button
                  type="button"
                  className="button button--secondary button--compact"
                  onClick={handleReset}
                  title="Reset to baseline"
                >
                  <RotateCcw size={14} aria-hidden="true" />
                  Reset
                </button>
                <button
                  type="button"
                  className="button button--primary button--compact"
                  onClick={handleSave}
                >
                  <Save size={14} aria-hidden="true" />
                  Save Chart
                </button>
              </>
            )}
            <button
              type="button"
              className="od-modal__close-btn"
              onClick={onClose}
              aria-label="Close odontogram editor"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>
        </header>

        {/* Feedback notification toast */}
        {feedback && (
          <div className="od-feedback-toast" role="status">
            <CheckCircle2 size={16} aria-hidden="true" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Summary Metrics Strip */}
        <div className="od-metrics-strip" aria-label="Odontogram summary metrics">
          <div className="od-metric-pill">
            <span className="od-metric-dot" style={{ background: conditionDefinitions.healthy.color }} />
            <span>Sound: <strong>{summary.healthy}</strong></span>
          </div>
          <div className="od-metric-pill">
            <span className="od-metric-dot" style={{ background: conditionDefinitions.caries.color }} />
            <span>Caries: <strong>{summary.caries}</strong></span>
          </div>
          <div className="od-metric-pill">
            <span className="od-metric-dot" style={{ background: conditionDefinitions.composite.color }} />
            <span>Restored: <strong>{summary.restored}</strong></span>
          </div>
          <div className="od-metric-pill">
            <span className="od-metric-dot" style={{ background: conditionDefinitions["root-canal"].color }} />
            <span>Endo/Crown: <strong>{summary.crownEndo}</strong></span>
          </div>
          <div className="od-metric-pill">
            <span className="od-metric-dot" style={{ background: conditionDefinitions.missing.color }} />
            <span>Missing: <strong>{summary.missing}</strong></span>
          </div>
        </div>

        {/* Main Editor Body */}
        <div className="od-modal__body">
          {/* Left Column: Dual Arch Charting Grid */}
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
                  const cond = tooth ? conditionDefinitions[tooth.condition] : conditionDefinitions.healthy;

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
                        style={{ backgroundColor: cond.color }}
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
                  const cond = tooth ? conditionDefinitions[tooth.condition] : conditionDefinitions.healthy;

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
                        style={{ backgroundColor: cond.color }}
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
                    <span className="od-legend-dot" style={{ backgroundColor: c.color }} />
                    <span className="od-legend-code">[{c.shortCode}]</span>
                    <span className="od-legend-name">{c.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Tooth Inspector & Surface Editor */}
          <aside className="od-inspector-section" aria-label="Tooth details and editing">
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
                        <span className="od-condition-btn__dot" style={{ backgroundColor: cond.color }} />
                        <span>{cond.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Interactive Surface Map */}
              <div className="od-form-block">
                <label className="od-form-label">Surface Restorations &amp; Lesions</label>
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
                    {commonProceduresByCondition[selectedTooth.condition]?.map((proc) => (
                      <button
                        key={proc}
                        type="button"
                        className="od-quick-proc-btn"
                        onClick={() => handleSelectQuickProcedure(proc)}
                      >
                        <Sparkles size={11} aria-hidden="true" />
                        {proc}
                      </button>
                    ))}
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
                    updateSelectedTooth((t) => ({ ...t, plannedProcedure: e.target.value }))
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
                    updateSelectedTooth((t) => ({ ...t, completedProcedure: e.target.value }))
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
                    updateSelectedTooth((t) => ({ ...t, notes: e.target.value }))
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
        </div>

        {/* Modal Footer */}
        <footer className="od-modal__footer">
          <div className="od-audit-note">
            <Info size={14} aria-hidden="true" />
            <span>
              Clinical Odontogram records are versioned in patient history. Real EHR sync in Phase 2.
            </span>
          </div>
          <div className="od-modal__footer-actions">
            <button type="button" className="button button--secondary" onClick={onClose}>
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
      </div>
    </div>
  );
}
