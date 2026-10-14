import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ServicesScreen } from "../pages/services-screen";

describe("SERV-01: Services & Appointment Types Catalog", () => {
  it("restricts Receptionist and Dentist with permission-state view", () => {
    const { unmount } = render(<ServicesScreen initialRole="receptionist" />);
    expect(screen.getByText(/Services configuration is admin-only/i)).toBeInTheDocument();
    unmount();

    render(<ServicesScreen initialRole="dentist" />);
    expect(screen.getByText(/Services configuration is admin-only/i)).toBeInTheDocument();
  });

  it("renders clinical procedures and appointment templates tabs for Admin", () => {
    render(<ServicesScreen initialRole="admin" />);

    expect(screen.getByText(/Services & Appointment Types/i)).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Clinical Procedures & Pricing/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Appointment Templates/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Add procedure/i })).toBeInTheDocument();
  });
});
