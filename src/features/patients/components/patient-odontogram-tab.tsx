import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { OdontogramEditorModal } from "@/features/odontogram/components/odontogram-editor-modal";
import {
  buildInitialMariamAdelChart,
  calculateChartSummary,
  conditionDefinitions,
} from "@/features/odontogram/services/mock-odontogram-service";
import { UserRole } from "@/types";
import { OdontogramChartData } from "@/features/odontogram/odontogram.types";

function PatientOdontogramTab({ role }: { role: UserRole }) {
  const [chartData, setChartData] = useState<OdontogramChartData>(
    buildInitialMariamAdelChart(),
  );
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedTooth, setSelectedTooth] = useState(16);
  const [feedback, setFeedback] = useState("");

  function handleOpenEditor(toothNum = 16) {
    setSelectedTooth(toothNum);
    setIsEditorOpen(true);
  }

  function handleSaveChart(newChart: OdontogramChartData) {
    setChartData(newChart);
    setIsEditorOpen(false);
    setFeedback("Odontogram chart updated successfully.");
    setTimeout(() => setFeedback(""), 4000);
  }

  const summary = calculateChartSummary(chartData);

  return (
    <section className="profile-section odontogram-preview">
      <div className="profile-section__header">
        <div>
          <h2>Odontogram</h2>
          <p>
            FDI adult permanent tooth chart · Click any tooth or &quot;Open
            odontogram&quot; to inspect surfaces and assign conditions.
          </p>
        </div>
        <button
          type="button"
          className="button button--secondary"
          onClick={() => handleOpenEditor(16)}
        >
          Open odontogram
        </button>
      </div>

      {feedback && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: 8,
            color: "#15803d",
            fontSize: 13,
            fontWeight: 500,
            padding: "8px 14px",
            marginBottom: 16,
          }}
          role="status"
        >
          <CheckCircle2 size={14} aria-hidden="true" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Quick Metrics Strip */}
      <div
        className="od-metrics-strip"
        style={{ padding: "0 0 16px 0", borderBottom: "none" }}
      >
        <div className="od-metric-pill">
          <span
            className="od-metric-dot"
            style={{ background: conditionDefinitions.healthy.color }}
          />
          <span>
            Sound: <strong>{summary.healthy}</strong>
          </span>
        </div>
        <div className="od-metric-pill">
          <span
            className="od-metric-dot"
            style={{ background: conditionDefinitions.caries.color }}
          />
          <span>
            Caries: <strong>{summary.caries}</strong>
          </span>
        </div>
        <div className="od-metric-pill">
          <span
            className="od-metric-dot"
            style={{ background: conditionDefinitions.composite.color }}
          />
          <span>
            Restored: <strong>{summary.restored}</strong>
          </span>
        </div>
        <div className="od-metric-pill">
          <span
            className="od-metric-dot"
            style={{ background: conditionDefinitions["root-canal"].color }}
          />
          <span>
            Endo/Crown: <strong>{summary.crownEndo}</strong>
          </span>
        </div>
        <div className="od-metric-pill">
          <span
            className="od-metric-dot"
            style={{ background: conditionDefinitions.missing.color }}
          />
          <span>
            Missing: <strong>{summary.missing}</strong>
          </span>
        </div>
      </div>

      {/* Tooth chart preview grid */}
      <div className="tooth-chart">
        <div>
          {[18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28].map(
            (tooth) => {
              const rec = chartData.teeth[tooth];
              let condClass = "tooth";
              if (rec?.condition === "root-canal" || rec?.condition === "crown")
                condClass = "tooth tooth--completed";
              else if (rec?.condition === "caries")
                condClass = "tooth tooth--planned";
              else if (
                rec?.condition === "composite" ||
                rec?.condition === "amalgam"
              )
                condClass = "tooth tooth--completed";
              return (
                <button
                  key={tooth}
                  type="button"
                  className={condClass}
                  onClick={() => handleOpenEditor(tooth)}
                  aria-label={`Tooth ${tooth} (${rec ? conditionDefinitions[rec.condition]?.label : "Healthy"})`}
                  title={`Tooth ${tooth} - ${rec ? conditionDefinitions[rec.condition]?.label : "Healthy"}. Click to open editor.`}
                >
                  {tooth}
                </button>
              );
            },
          )}
        </div>
        <div>
          {[48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38].map(
            (tooth) => {
              const rec = chartData.teeth[tooth];
              let condClass = "tooth";
              if (rec?.condition === "root-canal" || rec?.condition === "crown")
                condClass = "tooth tooth--completed";
              else if (rec?.condition === "caries")
                condClass = "tooth tooth--planned";
              else if (
                rec?.condition === "composite" ||
                rec?.condition === "amalgam"
              )
                condClass = "tooth tooth--completed";
              return (
                <button
                  key={tooth}
                  type="button"
                  className={condClass}
                  onClick={() => handleOpenEditor(tooth)}
                  aria-label={`Tooth ${tooth} (${rec ? conditionDefinitions[rec.condition]?.label : "Healthy"})`}
                  title={`Tooth ${tooth} - ${rec ? conditionDefinitions[rec.condition]?.label : "Healthy"}. Click to open editor.`}
                >
                  {tooth}
                </button>
              );
            },
          )}
        </div>
      </div>

      <p className="tooth-chart__legend">
        <span>
          <i className="legend-dot legend-dot--confirmed" />
          Treated / Restored
        </span>
        <span>
          <i className="legend-dot legend-dot--booked" />
          Active condition / Caries
        </span>
      </p>

      {isEditorOpen && (
        <OdontogramEditorModal
          initialChart={chartData}
          initialToothNumber={selectedTooth}
          onClose={() => setIsEditorOpen(false)}
          onSave={handleSaveChart}
          readOnly={role === "receptionist"}
        />
      )}
    </section>
  );
}

export default PatientOdontogramTab;
