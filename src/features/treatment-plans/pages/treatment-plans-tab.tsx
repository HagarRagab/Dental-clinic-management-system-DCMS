"use client";

import { useState } from "react";
import { CheckCircle2, ChevronLeft, Plus, X } from "lucide-react";
import type { UserRole } from "@/types";
import type {
    TreatmentPlan,
    TreatmentStepStatus,
} from "@/features/treatment-plans/treatment-plans.types";
import { mockTreatmentPlans } from "@/features/treatment-plans/services/mock-treatment-plans-service";
import NewPlanModal from "../components/new-plan-modal";

import PlanDetail from "../components/plan-detail";
import ContentDetail from "../components/content-detail";

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
                        ? {
                              ...step,
                              status: "Completed" as TreatmentStepStatus,
                              completedDate: new Date().toLocaleDateString(
                                  "en-GB",
                                  {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                  },
                              ),
                          }
                        : step,
                );
                const allDone = updatedSteps.every(
                    (s) => s.status === "Completed" || s.status === "Skipped",
                );
                return {
                    ...plan,
                    steps: updatedSteps,
                    status: allDone
                        ? "Completed"
                        : plan.status === "Approved"
                          ? "In progress"
                          : plan.status,
                };
            }),
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
                    <p>
                        Approved prices remain fixed for this patient. Prices
                        are illustrative only.
                    </p>
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
                <div
                    className="tp-feedback"
                    role="status"
                    style={{ marginBottom: "16px" }}
                >
                    <CheckCircle2 size={15} aria-hidden="true" />
                    <span>{feedback}</span>
                    <button
                        type="button"
                        aria-label="Dismiss"
                        onClick={() => setFeedback("")}
                    >
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
                <ContentDetail
                    plans={plans}
                    setShowModal={setShowModal}
                    canCreate={canCreate}
                    role={role}
                    setSelectedPlanId={setSelectedPlanId}
                />
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
