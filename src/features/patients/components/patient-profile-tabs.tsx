"use client";

import type {
  PatientProfile,
  PatientTab,
} from "@/features/patients/patient.types";
import type { UserRole } from "@/types";
import RenderTab from "./render-tab";

type PatientProfileTabsProps = {
  activeTab: PatientTab;
  onChange: (tab: PatientTab) => void;
  patient: PatientProfile;
  role: UserRole;
};

const allTabs: PatientTab[] = [
  "Overview",
  "Appointments",
  "Clinical Records",
  "Treatment Plans",
  "Odontogram",
  "Invoices",
  "Payments",
  "Patient Statement",
  "Attachments",
];
const receptionistTabs: PatientTab[] = [
  "Overview",
  "Appointments",
  "Treatment Plans",
  "Invoices",
  "Payments",
  "Patient Statement",
];
const dentistTabs: PatientTab[] = [
  "Overview",
  "Appointments",
  "Clinical Records",
  "Treatment Plans",
  "Odontogram",
  "Attachments",
];

export function PatientProfileTabs({
  activeTab,
  onChange,
  patient,
  role,
}: PatientProfileTabsProps) {
  const availableTabs =
    role === "admin"
      ? allTabs
      : role === "receptionist"
        ? receptionistTabs
        : dentistTabs;
  return (
    <>
      <div
        className="patient-tabs"
        role="tablist"
        aria-label="Patient record sections"
      >
        {availableTabs.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            className={activeTab === tab ? "patient-tabs__active" : ""}
            onClick={() => onChange(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <section
        className="patient-tab-panel"
        role="tabpanel"
        aria-label={activeTab}
      >
        <RenderTab tab={activeTab} patient={patient} role={role} />
      </section>
    </>
  );
}
