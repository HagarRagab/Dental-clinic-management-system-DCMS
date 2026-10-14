import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AuditLogsScreen } from "../pages/audit-logs-screen";

describe("RBAC-05: Audit Logs Role Restrictions & Activity Trail", () => {
  it("TEST-RBAC-05: restricts Receptionist and Dentist from audit logs", () => {
    const { unmount } = render(<AuditLogsScreen initialRole="receptionist" />);
    // Actual h1 from audit-logs-screen.tsx L103: "Audit logs are admin-only"
    expect(screen.getByRole("heading", { name: /Audit logs are admin-only/i })).toBeInTheDocument();
    unmount();

    render(<AuditLogsScreen initialRole="dentist" />);
    expect(screen.getByRole("heading", { name: /Audit logs are admin-only/i })).toBeInTheDocument();
  });

  it("renders audit trail events, filters, and search toolbar for Admin", () => {
    render(<AuditLogsScreen initialRole="admin" />);

    // Actual h1 from audit-logs-screen.tsx L127: "Audit logs"
    expect(screen.getByRole("heading", { name: /^Audit logs$/i, level: 1 })).toBeInTheDocument();
    // SummaryChips shows "Total events" chip (summary-chips.tsx L53)
    expect(screen.getByText(/Total events/i)).toBeInTheDocument();
    // Toolbar search placeholder from toolbar.tsx L49: "Search by action, user, entity…"
    expect(screen.getByPlaceholderText("Search by action, user, entity…")).toBeInTheDocument();
  });
});

