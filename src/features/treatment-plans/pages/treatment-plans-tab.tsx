"use client";

import { useState, type FormEvent } from "react";
import {
  CheckCircle2,
  ChevronLeft,
  ClipboardList,
  Lock,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import type { UserRole } from "@/types";
import type { TreatmentPlan, TreatmentStep, TreatmentStepStatus } from "@/features/treatment-plans/treatment-plans.types";
import {
  buildNewPlan,
  formatEgp,
  mockTreatmentPlans,
} from "@/features/treatment-plans/services/mock-treatment-plans-service";

// ─── Helpers ─────────────────────────────────────────────────

function planStatusClass(status: TreatmentPlan["status"]): string {
  const map: Record<TreatmentPlan["status"], string> = {
    "Draft": "tp-status--draft",
    "Pending approval": "tp-status--pending-approval",
    "Approved": "tp-status--approved",
    "In progress": "tp-status--in-progress",
    "Completed": "tp-status--completed",
    "Cancelled": "tp-status--cancelled",
  };
  return `tp-status ${map[status]}`;
}

function stepStatusClass(status: TreatmentStepStatus): string {
  const map: Record<TreatmentStepStatus, string> = {
    "Planned": "tp-step-status--planned",
    "In progress": "tp-step-status--in-progress",
    "Completed": "tp-step-status--completed",
    "Skipped": "tp-step-status--skipped",
  };
  return `tp-step-status ${map[status]}`;
}

function completedSteps(plan: TreatmentPlan): number {
  return plan.steps.filter((s) => s.status === "Completed").length;
}

function progressPct(plan: TreatmentPlan): number {
  if (!plan.steps.length) return 0;
  return Math.round((completedSteps(plan) / plan.steps.length) * 100);
}

// ─── New Plan Modal ───────────────────────────────────────────

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
  const [steps, setSteps] = useState<DraftStep[]>([{ procedureName: "", estimatedFee: 0 }]);

  function addStep() {
    setSteps((prev) => [...prev, { procedureName: "", estimatedFee: 0 }]);
  }

  function removeStep(i: number) {
    setSteps((prev) => prev.filter((_, idx) => idx !== i));
  }

  function updateStep(i: number, field: keyof DraftStep, value: string | number) {
    setSteps((prev) => prev.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || steps.every((s) => !s.procedureName.trim())) return;
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

  const totalFee = steps.reduce((sum, s) => sum + (Number(s.estimatedFee) || 0), 0);
  const canSubmit = title.trim() && steps.some((s) => s.procedureName.trim());

  return (
    <div className="tp-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="tp-new-plan-title">
      <div className="tp-modal">
        <div className="tp-modal__header">
          <div>
            <h2 id="tp-new-plan-title">New Treatment Plan</h2>
            <p>Draft a multi-step plan for this patient. Mock only — not persisted.</p>
          </div>
          <button type="button" className="tp-modal__close" onClick={onClose} aria-label="Close modal">
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <form className="tp-modal__body" onSubmit={handleSubmit} noValidate>
          {/* Title */}
          <label className="tp-form-field">
            <span>Plan title <span aria-hidden="true" style={{ color: "#dc2626" }}>*</span></span>
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
            <input type="text" value={dentist} readOnly style={{ background: "#fafafa", color: "var(--muted)" }} />
          </label>

          {/* Steps editor */}
          <div className="tp-steps-editor">
            <div className="tp-steps-editor__header">
              <span>Treatment steps <span aria-hidden="true" style={{ color: "#dc2626" }}>*</span></span>
              <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>
                Total: {formatEgp(totalFee)}
              </span>
            </div>

            {steps.map((step, i) => (
              <div key={i} className="tp-step-row">
                <input
                  type="text"
                  value={step.procedureName}
                  onChange={(e) => updateStep(i, "procedureName", e.target.value)}
                  placeholder={`Step ${i + 1} — e.g. Root canal treatment`}
                  aria-label={`Step ${i + 1} name`}
                />
                <input
                  type="number"
                  min={0}
                  value={step.estimatedFee}
                  onChange={(e) => updateStep(i, "estimatedFee", e.target.value)}
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

            <button type="button" className="tp-add-step-btn" onClick={addStep}>
              <Plus size={14} aria-hidden="true" />
              Add step
            </button>
          </div>

          <p className="tp-modal__prototype-note">
            Plan will be saved as <strong>Draft</strong>. This is a prototype — data is not persisted on refresh.
          </p>

          <div className="tp-modal__actions">
            <button type="button" className="button button--secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="button button--primary" disabled={!canSubmit}>
              <ClipboardList size={15} aria-hidden="true" />
              Create Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Plan detail view ─────────────────────────────────────────

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
            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", color: "var(--primary)", fontSize: "13px", fontWeight: 600, padding: "0 0 8px", marginBottom: "4px" }}
            aria-label="Back to plans list"
          >
            <ChevronLeft size={16} aria-hidden="true" />
            All plans
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "4px" }}>
            <h2>{plan.title}</h2>
            <span className={planStatusClass(plan.status)}>{plan.status}</span>
          </div>
          {plan.description && <p>{plan.description}</p>}
          <p style={{ marginTop: "6px" }}>
            {plan.dentist} · Created {plan.createdDate}
            {plan.approvedDate ? ` · Approved ${plan.approvedDate}` : ""}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="tp-progress">
        <div className="tp-progress__label">
          <span>{completedSteps(plan)} of {plan.steps.length} steps completed</span>
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
          <span className="tp-financials__label">Estimated total</span>
          <span className="tp-financials__value">{formatEgp(plan.totalEstimatedFee)}</span>
        </div>
        <div className="tp-financials__item">
          <span className="tp-financials__label">Paid to date</span>
          <span className="tp-financials__value tp-financials__value--paid">{formatEgp(plan.totalPaidToDate)}</span>
        </div>
        <div className="tp-financials__item">
          <span className="tp-financials__label">Outstanding</span>
          <span className={`tp-financials__value${outstanding > 0 ? " tp-financials__value--owed" : ""}`}>
            {formatEgp(outstanding)}
          </span>
        </div>
      </div>

      {/* Steps */}
      <div className="tp-steps-card">
        <div className="tp-steps-card__header">
          <h3>Treatment steps</h3>
          {!canEdit && (
            <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: "var(--muted)" }}>
              <Lock size={12} aria-hidden="true" />
              Step details restricted
            </span>
          )}
        </div>

        {canEdit ? (
          <div className="tp-steps-wrap">
            <table className="tp-steps-table" aria-label="Treatment steps">
              <thead>
                <tr>
                  <th style={{ width: "44px" }}>#</th>
                  <th>Procedure</th>
                  <th>Tooth(s)</th>
                  <th>Status</th>
                  <th>Fee</th>
                  <th><span style={{ visibility: "hidden" }}>Action</span></th>
                </tr>
              </thead>
              <tbody>
                {plan.steps.map((step) => (
                  <tr key={step.id}>
                    <td>
                      <div className={`tp-step-num${step.status === "Completed" ? " tp-step-num--done" : ""}`}>
                        {step.status === "Completed" ? <CheckCircle2 size={14} aria-hidden="true" /> : step.stepNumber}
                      </div>
                    </td>
                    <td>
                      <span className="tp-step-name">{step.procedureName}</span>
                      {step.cdtCode && <span className="tp-step-code">{step.cdtCode}</span>}
                      {step.notes && <span className="tp-step-notes">{step.notes}</span>}
                      {step.completedDate && (
                        <span className="tp-step-code">Completed {step.completedDate}</span>
                      )}
                    </td>
                    <td className="tp-step-teeth">
                      {step.toothNumbers.length > 0
                        ? step.toothNumbers.map((t) => `#${t}`).join(", ")
                        : <span style={{ color: "#d1d5db" }}>—</span>}
                    </td>
                    <td>
                      <span className={stepStatusClass(step.status)}>{step.status}</span>
                    </td>
                    <td className="tp-step-fee">{formatEgp(step.estimatedFee)}</td>
                    <td>
                      {step.status === "Planned" && (
                        <button
                          type="button"
                          className="tp-step-action tp-step-action--complete"
                          onClick={() => onMarkStepDone(plan.id, step.id)}
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
                Step-level clinical details are restricted to authorised clinical staff.
                Financial summary is available above.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main tab component ───────────────────────────────────────

export function TreatmentPlansTab({ role }: { role: UserRole }) {
  const [plans, setPlans] = useState<TreatmentPlan[]>(mockTreatmentPlans);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [feedback, setFeedback] = useState("");

  const canCreate = role !== "receptionist";
  const dentistName =
    role === "dentist" ? "Dr. Karim Mostafa" : "Dr. Karim Mostafa"; // demo fixed name

  const selectedPlan = plans.find((p) => p.id === selectedPlanId) ?? null;

  function handlePlanCreated(plan: TreatmentPlan) {
    setPlans((prev) => [plan, ...prev]);
    setFeedback(`Plan "${plan.title}" created as Draft.`);
    setTimeout(() => setFeedback(""), 6000);
  }

  function handleMarkStepDone(planId: string, stepId: string) {
    setPlans((prev) =>
      prev.map((plan) => {
        if (plan.id !== planId) return plan;
        const updatedSteps = plan.steps.map((step) =>
          step.id === stepId
            ? { ...step, status: "Completed" as TreatmentStepStatus, completedDate: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) }
            : step
        );
        const allDone = updatedSteps.every((s) => s.status === "Completed" || s.status === "Skipped");
        return {
          ...plan,
          steps: updatedSteps,
          status: allDone ? "Completed" : plan.status === "Approved" ? "In progress" : plan.status,
        };
      })
    );
    setFeedback("Step marked as completed.");
    setTimeout(() => setFeedback(""), 4000);
  }

  return (
    <section className="profile-section">
      {/* Section header */}
      <div className="profile-section__header">
        <div>
          <h2>Treatment plans</h2>
          <p>Approved prices remain fixed for this patient. Prices are illustrative only.</p>
        </div>
        {canCreate && !selectedPlan && (
          <button
            type="button"
            className="button button--primary profile-action-button"
            onClick={() => setShowModal(true)}
          >
            <Plus size={15} aria-hidden="true" />
            Create plan
          </button>
        )}
        {selectedPlan && (
          <button
            type="button"
            className="button button--secondary profile-action-button"
            onClick={() => setSelectedPlanId(null)}
          >
            <ChevronLeft size={15} aria-hidden="true" />
            All plans
          </button>
        )}
      </div>

      {/* Feedback banner */}
      {feedback && (
        <div className="tp-feedback" role="status" style={{ marginBottom: "16px" }}>
          <CheckCircle2 size={15} aria-hidden="true" />
          <span>{feedback}</span>
          <button type="button" aria-label="Dismiss" onClick={() => setFeedback("")}>
            <X size={14} aria-hidden="true" />
          </button>
        </div>
      )}

      {/* Content: detail or list */}
      {selectedPlan ? (
        <PlanDetail
          plan={selectedPlan}
          role={role}
          onBack={() => setSelectedPlanId(null)}
          onMarkStepDone={handleMarkStepDone}
        />
      ) : (
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
                      <h3 className="tp-plan-card__title">{plan.title}</h3>
                      <span className={planStatusClass(plan.status)}>{plan.status}</span>
                    </div>
                    <p className="tp-plan-card__meta">
                      {plan.dentist} · Created {plan.createdDate}
                      {plan.approvedDate ? ` · Approved ${plan.approvedDate}` : ""}
                    </p>
                    {/* Show progress bar only to clinical roles */}
                    {role !== "receptionist" && (
                      <div className="tp-progress">
                        <div className="tp-progress__label">
                          <span>{completedSteps(plan)} of {plan.steps.length} steps</span>
                          <span>{pct}%</span>
                        </div>
                        <div className="tp-progress__bar">
                          <div
                            className={`tp-progress__fill${isComplete ? " tp-progress__fill--complete" : ""}`}
                            style={{ width: `${pct}%` }}
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
                      <span className="tp-plan-card__fee">{formatEgp(plan.totalEstimatedFee)}</span>
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
      )}

      {/* New Plan modal */}
      {showModal && (
        <NewPlanModal
          dentist={dentistName}
          onClose={() => setShowModal(false)}
          onSubmit={(plan) => {
            handlePlanCreated(plan);
            setShowModal(false);
          }}
        />
      )}
    </section>
  );
}
