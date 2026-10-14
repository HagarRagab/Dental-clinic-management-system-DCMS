import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BillingScreen } from "../pages/billing-screen";

describe("RBAC-03, BILL-01, BILL-02: Billing Management & Calculations", () => {
  it("TEST-RBAC-03: restricts Dentist from billing workspace", () => {
    render(<BillingScreen initialRole="dentist" />);

    // Actual h1 from billing-screen.tsx L87-89: "Billing access is restricted"
    expect(screen.getByRole("heading", { name: /Billing access is restricted/i })).toBeInTheDocument();
    // Actual paragraph L91-93
    expect(screen.getByText(/Financial records are available to Admins and authorized Receptionists/i)).toBeInTheDocument();
  });

  it("TEST-BILL-01: renders invoice list and financial overview for Receptionist", () => {
    render(<BillingScreen initialRole="receptionist" />);

    // Actual h1 from billing-screen.tsx L110: "Invoices and payments"
    expect(screen.getByRole("heading", { name: /Invoices and payments/i })).toBeInTheDocument();
    // Metrics labels from billing-metrics.tsx L20/29/38
    expect(screen.getByText(/Open drafts/i)).toBeInTheDocument();
    expect(screen.getByText(/Payments recorded/i)).toBeInTheDocument();
    expect(screen.getByText(/Outstanding balance/i)).toBeInTheDocument();
  });

  it("TEST-BILL-02: displays new draft invoice action button", () => {
    render(<BillingScreen initialRole="receptionist" />);

    // Actual button text from billing-screen.tsx L122: "New draft invoice"
    expect(screen.getByRole("button", { name: /New draft invoice/i })).toBeInTheDocument();
  });
});

