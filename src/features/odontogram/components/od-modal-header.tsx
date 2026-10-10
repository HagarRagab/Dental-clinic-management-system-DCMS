import { RotateCcw, Save, Stethoscope, X } from "lucide-react";
import { OdontogramChartData } from "../odontogram.types";
import { Dispatch, SetStateAction } from "react";

function OdModalHeader({
    setChart,
    setFeedback,
    buildInitialChart,
    readOnly,
    chart,
    handleSave,
    onClose,
}: {
    setFeedback: Dispatch<SetStateAction<string>>;
    buildInitialChart: () => OdontogramChartData;
    readOnly: boolean;
    chart: OdontogramChartData;
    setChart: Dispatch<SetStateAction<OdontogramChartData>>;
    handleSave: () => void;
    onClose: () => void;
}) {
    function handleReset() {
        if (
            confirm(
                "Reset odontogram back to initial baseline? Any unsaved changes will be lost.",
            )
        ) {
            setChart(buildInitialChart());
            setFeedback("Chart reset to initial baseline.");
            setTimeout(() => setFeedback(""), 4000);
        }
    }

    return (
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
                        Patient: <strong>{chart.patientName}</strong> · Adult
                        Dentition (FDI Two-Digit Notation)
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
    );
}

export default OdModalHeader;
