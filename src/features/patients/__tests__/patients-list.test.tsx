import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PatientsListScreen } from "../pages/patients-list-screen";

describe("PAT-01: Patient Directory & Search Filtering", () => {
  it("renders patient directory table with mock patients", () => {
    render(<PatientsListScreen initialRole="receptionist" />);

    // Renders directory header
    expect(screen.getByRole("heading", { name: "Patients", level: 1 })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search by name or mobile…")).toBeInTheDocument();
    // Actual mock patient names from mock-patient-list-service.ts
    expect(screen.getByText(/Mariam Adel/i)).toBeInTheDocument();
    expect(screen.getByText(/Omar Hassan/i)).toBeInTheDocument();
  });

  it("filters patient directory by search term", () => {
    render(<PatientsListScreen initialRole="receptionist" />);

    const searchInput = screen.getByPlaceholderText("Search by name or mobile…");
    fireEvent.change(searchInput, { target: { value: "Mariam" } });

    expect(screen.getByText(/Mariam Adel/i)).toBeInTheDocument();
    expect(screen.queryByText(/Omar Hassan/i)).not.toBeInTheDocument();
  });

  it("renders Import CSV button for Admin but hides it for Receptionist", () => {
    const { unmount } = render(<PatientsListScreen initialRole="receptionist" />);
    expect(screen.queryByRole("button", { name: /Import CSV/i })).not.toBeInTheDocument();
    unmount();

    render(<PatientsListScreen initialRole="admin" />);
    expect(screen.getByRole("button", { name: /Import CSV/i })).toBeInTheDocument();
  });
});

