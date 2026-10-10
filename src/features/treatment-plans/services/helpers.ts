import { TreatmentPlan, TreatmentStepStatus } from "../treatment-plans.types";

export function planStatusClass(status: TreatmentPlan["status"]): string {
    const map: Record<TreatmentPlan["status"], string> = {
        Draft: "tp-status--draft",
        "Pending approval": "tp-status--pending-approval",
        Approved: "tp-status--approved",
        "In progress": "tp-status--in-progress",
        Completed: "tp-status--completed",
        Cancelled: "tp-status--cancelled",
    };
    return `tp-status ${map[status]}`;
}

export function stepStatusClass(status: TreatmentStepStatus): string {
    const map: Record<TreatmentStepStatus, string> = {
        Planned: "tp-step-status--planned",
        "In progress": "tp-step-status--in-progress",
        Completed: "tp-step-status--completed",
        Skipped: "tp-step-status--skipped",
    };
    return `tp-step-status ${map[status]}`;
}

export function completedSteps(plan: TreatmentPlan): number {
    return plan.steps.filter((s) => s.status === "Completed").length;
}

export function progressPct(plan: TreatmentPlan): number {
    if (!plan.steps.length) return 0;
    return Math.round((completedSteps(plan) / plan.steps.length) * 100);
}
