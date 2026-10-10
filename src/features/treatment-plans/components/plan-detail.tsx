import { CheckCircle2, ChevronLeft, Lock } from "lucide-react";
import { UserRole } from "@/types";
import { TreatmentPlan } from "../treatment-plans.types";
import {
    completedSteps,
    planStatusClass,
    progressPct,
    stepStatusClass,
} from "../services/helpers";
import { formatEgp } from "../services/mock-treatment-plans-service";

function PlanDetail({
    plan,
    role,
    onBack,
    onMarkStepDone,
}: {
    plan: TreatmentPlan;
    role: UserRole;
    onBack: () => void;
    onMarkStepDone: (planId: string, stepId: string) => void;
}) {
    const canEdit = role !== "receptionist";
    const outstanding = plan.totalEstimatedFee - plan.totalPaidToDate;
    const pct = progressPct(plan);

    return (
        <div className="tp-detail">
            {/* Back + header */}
            <div className="tp-detail__header">
                <div className="tp-detail__title-block">
                    <button
                        type="button"
                        onClick={onBack}
                        style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            color: "var(--primary)",
                            fontSize: "13px",
                            fontWeight: 600,
                            padding: "0 0 8px",
                            marginBottom: "4px",
                        }}
                        aria-label="Back to plans list"
                    >
                        <ChevronLeft size={16} aria-hidden="true" />
                        All plans
                    </button>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            flexWrap: "wrap",
                            marginBottom: "4px",
                        }}
                    >
                        <h2>{plan.title}</h2>
                        <span className={planStatusClass(plan.status)}>
                            {plan.status}
                        </span>
                    </div>
                    {plan.description && <p>{plan.description}</p>}
                    <p style={{ marginTop: "6px" }}>
                        {plan.dentist} · Created {plan.createdDate}
                        {plan.approvedDate
                            ? ` · Approved ${plan.approvedDate}`
                            : ""}
                    </p>
                </div>
            </div>

            {/* Progress bar */}
            <div className="tp-progress">
                <div className="tp-progress__label">
                    <span>
                        {completedSteps(plan)} of {plan.steps.length} steps
                        completed
                    </span>
                    <span>{pct}%</span>
                </div>
                <div className="tp-progress__bar">
                    <div
                        className={`tp-progress__fill${pct === 100 ? " tp-progress__fill--complete" : ""}`}
                        style={{ width: `${pct}%` }}
                        role="progressbar"
                        aria-valuenow={pct}
                        aria-valuemin={0}
                        aria-valuemax={100}
                    />
                </div>
            </div>

            {/* Financial summary */}
            <div className="tp-financials">
                <div className="tp-financials__item">
                    <span className="tp-financials__label">
                        Estimated total
                    </span>
                    <span className="tp-financials__value">
                        {formatEgp(plan.totalEstimatedFee)}
                    </span>
                </div>
                <div className="tp-financials__item">
                    <span className="tp-financials__label">Paid to date</span>
                    <span className="tp-financials__value tp-financials__value--paid">
                        {formatEgp(plan.totalPaidToDate)}
                    </span>
                </div>
                <div className="tp-financials__item">
                    <span className="tp-financials__label">Outstanding</span>
                    <span
                        className={`tp-financials__value${outstanding > 0 ? " tp-financials__value--owed" : ""}`}
                    >
                        {formatEgp(outstanding)}
                    </span>
                </div>
            </div>

            {/* Steps */}
            <div className="tp-steps-card">
                <div className="tp-steps-card__header">
                    <h3>Treatment steps</h3>
                    {!canEdit && (
                        <span
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",
                                fontSize: "12px",
                                color: "var(--muted)",
                            }}
                        >
                            <Lock size={12} aria-hidden="true" />
                            Step details restricted
                        </span>
                    )}
                </div>

                {canEdit ? (
                    <div className="tp-steps-wrap">
                        <table
                            className="tp-steps-table"
                            aria-label="Treatment steps"
                        >
                            <thead>
                                <tr>
                                    <th style={{ width: "44px" }}>#</th>
                                    <th>Procedure</th>
                                    <th>Tooth(s)</th>
                                    <th>Status</th>
                                    <th>Fee</th>
                                    <th>
                                        <span style={{ visibility: "hidden" }}>
                                            Action
                                        </span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {plan.steps.map((step) => (
                                    <tr key={step.id}>
                                        <td>
                                            <div
                                                className={`tp-step-num${step.status === "Completed" ? " tp-step-num--done" : ""}`}
                                            >
                                                {step.status === "Completed" ? (
                                                    <CheckCircle2
                                                        size={14}
                                                        aria-hidden="true"
                                                    />
                                                ) : (
                                                    step.stepNumber
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <span className="tp-step-name">
                                                {step.procedureName}
                                            </span>
                                            {step.cdtCode && (
                                                <span className="tp-step-code">
                                                    {step.cdtCode}
                                                </span>
                                            )}
                                            {step.notes && (
                                                <span className="tp-step-notes">
                                                    {step.notes}
                                                </span>
                                            )}
                                            {step.completedDate && (
                                                <span className="tp-step-code">
                                                    Completed{" "}
                                                    {step.completedDate}
                                                </span>
                                            )}
                                        </td>
                                        <td className="tp-step-teeth">
                                            {step.toothNumbers.length > 0 ? (
                                                step.toothNumbers
                                                    .map((t) => `#${t}`)
                                                    .join(", ")
                                            ) : (
                                                <span
                                                    style={{ color: "#d1d5db" }}
                                                >
                                                    —
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            <span
                                                className={stepStatusClass(
                                                    step.status,
                                                )}
                                            >
                                                {step.status}
                                            </span>
                                        </td>
                                        <td className="tp-step-fee">
                                            {formatEgp(step.estimatedFee)}
                                        </td>
                                        <td>
                                            {step.status === "Planned" && (
                                                <button
                                                    type="button"
                                                    className="tp-step-action tp-step-action--complete"
                                                    onClick={() =>
                                                        onMarkStepDone(
                                                            plan.id,
                                                            step.id,
                                                        )
                                                    }
                                                    aria-label={`Mark step ${step.stepNumber} as completed`}
                                                >
                                                    Mark done
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    /* Receptionist: see only financial summary, no step details */
                    <div style={{ padding: "16px" }}>
                        <div className="tp-clinical-restricted">
                            <Lock size={16} aria-hidden="true" />
                            <span>
                                Step-level clinical details are restricted to
                                authorised clinical staff. Financial summary is
                                available above.
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PlanDetail;
