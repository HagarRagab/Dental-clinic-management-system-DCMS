"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import type {
  OdontogramChartData,
  ToothRecord,
} from "@/features/odontogram/odontogram.types";
import {
  buildInitialMariamAdelChart,
  calculateChartSummary,
  commonProceduresByCondition,
  conditionDefinitions,
  getToothName,
  lowerArchTeeth,
  upperArchTeeth,
} from "@/features/odontogram/services/mock-odontogram-service";
import OdModalHeader from "./od-modal-header";
import OdMetrics from "./od-metrics";
import OdArchSection from "./od-arch-section";
import OdInspectorSection from "./od-inspector-section";
import OdModalFooter from "./od-modal-footer";

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
    initialChart || buildInitialMariamAdelChart(),
  );
  const [selectedToothNum, setSelectedToothNum] =
    useState<number>(initialToothNumber);
  const [feedback, setFeedback] = useState("");

  const selectedTooth: ToothRecord = chart.teeth[selectedToothNum] || {
    toothNumber: selectedToothNum,
    condition: "healthy",
    surfaces: {
      occlusal: false,
      mesial: false,
      distal: false,
      buccal: false,
      lingual: false,
    },
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

  return (
    <div
      className="od-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="od-modal-title"
    >
      <div className="od-modal">
        {/* Modal Header */}
        <OdModalHeader
          buildInitialChart={buildInitialMariamAdelChart}
          chart={chart}
          handleSave={handleSave}
          onClose={onClose}
          readOnly={readOnly}
          setChart={setChart}
          setFeedback={setFeedback}
        />

        {/* Feedback notification toast */}
        {feedback && (
          <div className="od-feedback-toast" role="status">
            <CheckCircle2 size={16} aria-hidden="true" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Summary Metrics Strip */}
        <OdMetrics
          conditionDefinitions={conditionDefinitions}
          summary={summary}
        />

        {/* Main Editor Body */}
        <div className="od-modal__body">
          {/* Left Column: Dual Arch Charting Grid */}
          <OdArchSection
            chart={chart}
            conditionDefinitions={conditionDefinitions}
            getToothName={getToothName}
            lowerArchTeeth={lowerArchTeeth}
            selectedToothNum={selectedToothNum}
            setSelectedToothNum={setSelectedToothNum}
            upperArchTeeth={upperArchTeeth}
          />

          {/* Right Column: Tooth Inspector & Surface Editor */}
          <OdInspectorSection
            getToothName={getToothName}
            selectedToothNum={selectedToothNum}
            conditionDefinitions={conditionDefinitions}
            selectedTooth={selectedTooth}
            commonProceduresByCondition={commonProceduresByCondition}
            handleSelectQuickProcedure={handleSelectQuickProcedure}
            readOnly={readOnly}
            updateSelectedTooth={updateSelectedTooth}
          />
        </div>

        {/* Modal Footer */}
        <OdModalFooter
          handleSave={handleSave}
          onClose={onClose}
          readOnly={readOnly}
        />
      </div>
    </div>
  );
}
