import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AppShell } from "@/components/layout/app-shell";

describe("RBAC-01: AppShell Role-Based Navigation & Permissions", () => {
  it("renders Admin navigation items (including Inventory, Doctors, Notifications, Reports, Settings, Audit logs)", () => {
    render(
      <AppShell
        activeItem="Dashboard"
        role="admin"
        userName="Dr. Salma Hassan"
        onRoleChange={() => {}}
      >
        <div>Admin Content</div>
      </AppShell>
    );

    // Sidebar nav links
    expect(screen.getAllByRole("link", { name: /Dashboard/i })[0]).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /Calendar/i })[0]).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /Patients/i })[0]).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /Billing/i })[0]).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /Inventory/i })[0]).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /Doctors/i })[0]).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /Notifications/i })[0]).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /Reports/i })[0]).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /Settings/i })[0]).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /Audit logs/i })[0]).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /Services/i })[0]).toBeInTheDocument();
  });

  it("renders Receptionist navigation and restricts clinical/supervisory tools", () => {
    render(
      <AppShell
        activeItem="Dashboard"
        role="receptionist"
        userName="Nour Adel"
        onRoleChange={() => {}}
      >
        <div>Receptionist Content</div>
      </AppShell>
    );

    expect(screen.getAllByRole("link", { name: /Dashboard/i })[0]).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /Calendar/i })[0]).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /Patients/i })[0]).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /Billing/i })[0]).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /Reports/i })[0]).toBeInTheDocument();

    // Must NOT have admin-only tools
    expect(screen.queryByRole("link", { name: /Inventory/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Doctors/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Notifications/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Settings/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Audit logs/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Services/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Clinical records/i })).not.toBeInTheDocument();
  });

  it("renders Dentist navigation and restricts billing/inventory/admin tools", () => {
    render(
      <AppShell
        activeItem="Today"
        role="dentist"
        userName="Dr. Karim Mostafa"
        onRoleChange={() => {}}
      >
        <div>Dentist Content</div>
      </AppShell>
    );

    expect(screen.getAllByRole("link", { name: /Today/i })[0]).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /Calendar/i })[0]).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /Patients/i })[0]).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /Clinical records/i })[0]).toBeInTheDocument();

    // Must NOT have financial/admin links
    expect(screen.queryByRole("link", { name: /Billing/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Reports/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Inventory/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Settings/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Audit logs/i })).not.toBeInTheDocument();
  });
});
