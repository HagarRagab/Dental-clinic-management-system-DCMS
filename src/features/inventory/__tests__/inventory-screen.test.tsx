import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { InventoryScreen } from "../pages/inventory-screen";

describe("RBAC-04 & INV-01: Inventory Workspace Role Restrictions & Inventory Rules", () => {
  it("TEST-RBAC-04: restricts Receptionist and Dentist from Inventory workspace", () => {
    const { unmount } = render(<InventoryScreen initialRole="receptionist" />);
    expect(screen.getByText(/Inventory access is restricted/i)).toBeInTheDocument();
    unmount();

    render(<InventoryScreen initialRole="dentist" />);
    expect(screen.getByText(/Inventory access is restricted/i)).toBeInTheDocument();
  });

  it("TEST-INV-01: allows Admin to view stock inventory, alerts, and goods receipts", () => {
    render(<InventoryScreen initialRole="admin" />);

    expect(screen.getByRole("heading", { name: "Stock and supplies", level: 1 })).toBeInTheDocument();
    // Multiple "Adjust stock" buttons exist (header + item list); check at least one is present
    expect(screen.getAllByRole("button", { name: /Receive goods/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("button", { name: /Adjust stock/i }).length).toBeGreaterThan(0);
  });
});


