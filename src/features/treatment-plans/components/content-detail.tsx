import { Dispatch, SetStateAction } from "react";
import { ClipboardList, Plus } from "lucide-react";
import {
    completedSteps,
    planStatusClass,
    progressPct,
} from "../services/helpers";
import { formatEgp } from "@/features/treatment-plans/services/mock-treatment-plans-service";
import { TreatmentPlan } from "../treatment-plans.types";
import { UserRole } from "@/types";

function ContentDetail({
    plans,
    setShowModal,
    canCreate,
    role,
    setSelectedPlanId,
}: {
    plans: TreatmentPlan[];
    setShowModal: Dispatch<SetStateAction<boolean>>;
    canCreate: boolean;
    role: UserRole;
    setSelectedPlanId: Dispatch<SetStateAction<string | null>>;
}) {
    return (
        <div className="tp-list">
            {plans.length === 0 ? (
                <div className="tp-empty">
                    <ClipboardList size={32} aria-hidden="true" />
                    <p>No treatment plans yet for this patient.</p>
                    {canCreate && (
                        <button
                            type="button"
                            className="button button--primary"
                            onClick={() => setShowModal(true)}
                        >
                            <Plus size={15} aria-hidden="true" />
                            Create first plan
                        </button>
                    )}
                </div>
            ) : (
                plans.map((plan) => {
                    const pct = progressPct(plan);
                    const isComplete = plan.status === "Completed";
                    return (
                        <div key={plan.id} className="tp-plan-card">
                            <div className="tp-plan-card__body">
                                <div className="tp-plan-card__top">
                                    <h3 className="tp-plan-card__title">
                                        {plan.title}
                                    </h3>
                                    <span
                                        className={planStatusClass(plan.status)}
                                    >
                                        {plan.status}
                                    </span>
                                </div>
                                <p className="tp-plan-card__meta">
                                    {plan.dentist} · Created {plan.createdDate}
                                    {plan.approvedDate
                                        ? ` · Approved ${plan.approvedDate}`
                                        : ""}
                                </p>
                                {/* Show progress bar only to clinical roles */}
                                {role !== "receptionist" && (
                                    <div className="tp-progress">
                                        <div className="tp-progress__label">
                                            <span>
                                                {completedSteps(plan)} of{" "}
                                                {plan.steps.length} steps
                                            </span>
                                            <span>{pct}%</span>
                                        </div>
                                        <div className="tp-progress__bar">
                                            <div
                                                className={`tp-progress__fill${isComplete ? " tp-progress__fill--complete" : ""}`}
                                                style={{
                                                    width: `${pct}%`,
                                                }}
                                                role="progressbar"
                                                aria-valuenow={pct}
                                                aria-valuemin={0}
                                                aria-valuemax={100}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="tp-plan-card__actions">
                                <div>
                                    <span className="tp-plan-card__fee">
                                        {formatEgp(plan.totalEstimatedFee)}
                                    </span>
                                    <span className="tp-plan-card__fee-sub">
                                        {formatEgp(plan.totalPaidToDate)} paid
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    className="button button--secondary"
                                    onClick={() => setSelectedPlanId(plan.id)}
                                    aria-label={`Open plan: ${plan.title}`}
                                >
                                    Open plan
                                </button>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
}

export default ContentDetail;
