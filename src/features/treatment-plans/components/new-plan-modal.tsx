import { SubmitEvent, useState } from "react";
import { ClipboardList, Plus, Trash2, X } from "lucide-react";
import { TreatmentPlan, TreatmentStepStatus } from "../treatment-plans.types";
import { buildNewPlan } from "../services/mock-treatment-plans-service";
import { formatEgp } from "@/features/treatment-plans/services/mock-treatment-plans-service";

type DraftStep = { procedureName: string; estimatedFee: number };

function NewPlanModal({
    dentist,
    onClose,
    onSubmit,
}: {
    dentist: string;
    onClose: () => void;
    onSubmit: (plan: TreatmentPlan) => void;
}) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [steps, setSteps] = useState<DraftStep[]>([
        { procedureName: "", estimatedFee: 0 },
    ]);

    function addStep() {
        setSteps((prev) => [...prev, { procedureName: "", estimatedFee: 0 }]);
    }

    function removeStep(i: number) {
        setSteps((prev) => prev.filter((_, idx) => idx !== i));
    }

    function updateStep(
        i: number,
        field: keyof DraftStep,
        value: string | number,
    ) {
        setSteps((prev) =>
            prev.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)),
        );
    }

    function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!title.trim() || steps.every((s) => !s.procedureName.trim()))
            return;
        const validSteps = steps
            .filter((s) => s.procedureName.trim())
            .map((s) => ({
                procedureName: s.procedureName.trim(),
                estimatedFee: Number(s.estimatedFee) || 0,
                toothNumbers: [] as number[],
                status: "Planned" as TreatmentStepStatus,
            }));
        const plan = buildNewPlan(title, description, dentist, validSteps);
        onSubmit(plan);
    }

    const totalFee = steps.reduce(
        (sum, s) => sum + (Number(s.estimatedFee) || 0),
        0,
    );
    const canSubmit = title.trim() && steps.some((s) => s.procedureName.trim());

    return (
        <div
            className="tp-modal-backdrop"
            role="dialog"
            aria-modal="true"
            aria-labelledby="tp-new-plan-title"
        >
            <div className="tp-modal">
                <div className="tp-modal__header">
                    <div>
                        <h2 id="tp-new-plan-title">New Treatment Plan</h2>
                        <p>
                            Draft a multi-step plan for this patient. Mock only
                            — not persisted.
                        </p>
                    </div>
                    <button
                        type="button"
                        className="tp-modal__close"
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        <X size={18} aria-hidden="true" />
                    </button>
                </div>

                <form
                    className="tp-modal__body"
                    onSubmit={handleSubmit}
                    noValidate
                >
                    {/* Title */}
                    <label className="tp-form-field">
                        <span>
                            Plan title{" "}
                            <span
                                aria-hidden="true"
                                style={{ color: "#dc2626" }}
                            >
                                *
                            </span>
                        </span>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Root canal and crown restoration"
                            required
                            autoFocus
                        />
                    </label>

                    {/* Description */}
                    <label className="tp-form-field">
                        <span>Description (optional)</span>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Brief overview of the planned treatment…"
                        />
                    </label>

                    {/* Dentist (read-only) */}
                    <label className="tp-form-field">
                        <span>Responsible dentist</span>
                        <input
                            type="text"
                            value={dentist}
                            readOnly
                            style={{
                                background: "#fafafa",
                                color: "var(--muted)",
                            }}
                        />
                    </label>

                    {/* Steps editor */}
                    <div className="tp-steps-editor">
                        <div className="tp-steps-editor__header">
                            <span>
                                Treatment steps{" "}
                                <span
                                    aria-hidden="true"
                                    style={{ color: "#dc2626" }}
                                >
                                    *
                                </span>
                            </span>
                            <span
                                style={{
                                    fontWeight: 400,
                                    textTransform: "none",
                                    letterSpacing: 0,
                                }}
                            >
                                Total: {formatEgp(totalFee)}
                            </span>
                        </div>

                        {steps.map((step, i) => (
                            <div key={i} className="tp-step-row">
                                <input
                                    type="text"
                                    value={step.procedureName}
                                    onChange={(e) =>
                                        updateStep(
                                            i,
                                            "procedureName",
                                            e.target.value,
                                        )
                                    }
                                    placeholder={`Step ${i + 1} — e.g. Root canal treatment`}
                                    aria-label={`Step ${i + 1} name`}
                                />
                                <input
                                    type="number"
                                    min={0}
                                    value={step.estimatedFee}
                                    onChange={(e) =>
                                        updateStep(
                                            i,
                                            "estimatedFee",
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Fee"
                                    aria-label={`Step ${i + 1} fee (EGP)`}
                                    style={{ textAlign: "right" }}
                                />
                                {steps.length > 1 && (
                                    <button
                                        type="button"
                                        className="tp-step-row__remove"
                                        onClick={() => removeStep(i)}
                                        aria-label={`Remove step ${i + 1}`}
                                    >
                                        <Trash2 size={14} aria-hidden="true" />
                                    </button>
                                )}
                            </div>
                        ))}

                        <button
                            type="button"
                            className="tp-add-step-btn"
                            onClick={addStep}
                        >
                            <Plus size={14} aria-hidden="true" />
                            Add step
                        </button>
                    </div>

                    <p className="tp-modal__prototype-note">
                        Plan will be saved as <strong>Draft</strong>. This is a
                        prototype — data is not persisted on refresh.
                    </p>

                    <div className="tp-modal__actions">
                        <button
                            type="button"
                            className="button button--secondary"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="button button--primary"
                            disabled={!canSubmit}
                        >
                            <ClipboardList size={15} aria-hidden="true" />
                            Create Plan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default NewPlanModal;
