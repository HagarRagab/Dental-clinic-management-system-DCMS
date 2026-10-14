import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ClinicalWorkspaceScreen } from "../pages/clinical-workspace-screen";

describe("RBAC-02 & CLIN-01: Clinical Records Workspace & Privacy Restriction", () => {
  it("TEST-RBAC-02: restricts Receptionists from clinical records with permission-state", () => {
    render(<ClinicalWorkspaceScreen initialRole="receptionist" />);

    // Actual h1 from clinical-workspace-screen.tsx L113-115: "Clinical records are restricted"
    expect(screen.getByRole("heading", { name: /Clinical records are restricted/i })).toBeInTheDocument();
    // Actual paragraph L117-120
    expect(
      screen.getByText(/Receptionist accounts are restricted from accessing detailed clinical notes/i)
    ).toBeInTheDocument();
    // Return to Calendar link from L122-127
    expect(screen.getByRole("link", { name: /Return to Calendar/i })).toBeInTheDocument();
  });

  it("TEST-CLIN-01: allows Dentist to view clinical records, SOAP notes, and Odontogram chart", () => {
    render(<ClinicalWorkspaceScreen initialRole="dentist" />);

    // "Mariam Adel" appears in breadcrumb link and patient header — use getAllByText
    expect(screen.getAllByText(/Mariam Adel/i).length).toBeGreaterThan(0);

    // Section headings — chief-complaint.tsx L16: "Chief complaint"
    expect(screen.getByRole("heading", { name: /Chief complaint/i })).toBeInTheDocument();
    // interactive-od-chart.tsx L31: "Odontogram chart"
    expect(screen.getByRole("heading", { name: /Odontogram chart/i })).toBeInTheDocument();
    // clinical-workspace-screen.tsx L301: "Finalize clinical record"
    expect(screen.getByRole("button", { name: /Finalize clinical record/i })).toBeInTheDocument();
  });

  it("shows Admin supervisory audit banner when viewing clinical records as Admin", () => {
    render(<ClinicalWorkspaceScreen initialRole="admin" />);

    // clinical-workspace-screen.tsx L156: "Admin Supervisory View"
    expect(screen.getByText(/Admin Supervisory View/i)).toBeInTheDocument();
    // L158: "Clinical access is monitored and logged in the system audit trail."
    expect(screen.getByText(/Clinical access is monitored and logged in the system audit trail/i)).toBeInTheDocument();
  });
});

