import type { TreatmentPlan, TreatmentStep } from "@/features/treatment-plans/treatment-plans.types";

// ─── Mariam Adel mock plans ───────────────────────────────────

export const mockTreatmentPlans: TreatmentPlan[] = [
  {
    id: "tp-001",
    patientId: "pt-001",
    patientName: "Mariam Adel",
    title: "Root canal and crown restoration",
    description:
      "Full endodontic treatment of tooth 16 followed by porcelain-fused-to-metal crown. Two-stage plan approved by patient on 8 September.",
    createdDate: "8 Sep 2026",
    approvedDate: "8 Sep 2026",
    dentist: "Dr. Karim Mostafa",
    status: "Approved",
    totalEstimatedFee: 6500,
    totalPaidToDate: 5050,
    currency: "EGP",
    steps: [
      {
        id: "step-001-1",
        stepNumber: 1,
        procedureName: "Root canal treatment — tooth 16",
        cdtCode: "D3330",
        toothNumbers: [16],
        estimatedFee: 3500,
        status: "Completed",
        completedDate: "8 Sep 2026",
        notes: "Three canals treated. Obturation complete. Post-op instructions given.",
        linkedVisitId: "visit-001",
      },
      {
        id: "step-001-2",
        stepNumber: 2,
        procedureName: "Build-up and temporary crown — tooth 16",
        cdtCode: "D2950",
        toothNumbers: [16],
        estimatedFee: 800,
        status: "Completed",
        completedDate: "8 Sep 2026",
        notes: "Composite build-up placed. Temporary acrylic crown fitted.",
      },
      {
        id: "step-001-3",
        stepNumber: 3,
        procedureName: "Porcelain-fused-to-metal crown — tooth 16",
        cdtCode: "D2750",
        toothNumbers: [16],
        estimatedFee: 2200,
        status: "Planned",
        notes: "Lab work pending. Shade: A2. Seating appointment to be booked.",
      },
    ],
  },
  {
    id: "tp-002",
    patientId: "pt-001",
    patientName: "Mariam Adel",
    title: "Initial scaling and oral hygiene review",
    description: "Full-mouth scaling, polishing, and patient oral hygiene instruction session.",
    createdDate: "30 Aug 2026",
    approvedDate: "30 Aug 2026",
    dentist: "Dr. Salma Hassan",
    status: "Completed",
    totalEstimatedFee: 800,
    totalPaidToDate: 800,
    currency: "EGP",
    steps: [
      {
        id: "step-002-1",
        stepNumber: 1,
        procedureName: "Full-mouth scaling and polishing",
        cdtCode: "D1110",
        toothNumbers: [],
        estimatedFee: 800,
        status: "Completed",
        completedDate: "30 Aug 2026",
        notes: "Moderate calculus removed. Oral hygiene score improved. Patient advised to use interdental brushes.",
      },
    ],
  },
];

// ─── Factory helper for new plans ────────────────────────────
export function buildNewPlan(
  title: string,
  description: string,
  dentist: string,
  steps: Omit<TreatmentStep, "id" | "stepNumber">[]
): TreatmentPlan {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  return {
    id: `tp-${Date.now()}`,
    patientId: "pt-001",
    patientName: "Mariam Adel",
    title: title.trim(),
    description: description.trim() || undefined,
    createdDate: dateStr,
    dentist,
    status: "Draft",
    totalEstimatedFee: steps.reduce((sum, s) => sum + s.estimatedFee, 0),
    totalPaidToDate: 0,
    currency: "EGP",
    steps: steps.map((s, i) => ({
      ...s,
      id: `step-${Date.now()}-${i}`,
      stepNumber: i + 1,
    })),
  };
}

export function formatEgp(amount: number): string {
  return `EGP ${amount.toLocaleString("en-EG")}`;
}
