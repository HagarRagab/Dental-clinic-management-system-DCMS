import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { NewAppointmentScreen } from "../pages/new-appointment-screen";

describe("APPT-01, APPT-02, APPT-03: Appointment Booking Workflow & RBAC", () => {
  it("TEST-APPT-02: restricts Dentists with permission-state view", () => {
    render(<NewAppointmentScreen initialRole="dentist" />);
    // Actual h1 text from new-appointment-screen.tsx L70
    expect(screen.getByRole("heading", { name: /Appointment booking is restricted/i })).toBeInTheDocument();
    // Actual paragraph text from L73-75
    expect(screen.getByText(/Receptionists and Admins/i)).toBeInTheDocument();
  });

  it("TEST-APPT-01: allows Receptionist to see the 3-step progress indicator and patient selector", () => {
    render(<NewAppointmentScreen initialRole="receptionist" />);

    // Step indicator labels from new-appointment-screen.tsx L128/132/136
    // "Patient" appears in step <strong>, the <h2> heading, and nav. Use getAllByText.
    expect(screen.getAllByText("Patient").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Appointment").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Review").length).toBeGreaterThan(0);

    // Patient selector search input — placeholder from patient-selector.tsx L117
    expect(screen.getByPlaceholderText("Search patients")).toBeInTheDocument();

    // Heading from patient-selector.tsx L100
    expect(screen.getByRole("heading", { name: /^Patient$/i, level: 2 })).toBeInTheDocument();
  });

  it("TEST-APPT-01: skips to step 2 when initialPatientId is provided — shows Appointment details", () => {
    render(<NewAppointmentScreen initialRole="receptionist" initialPatientId="pt-001" />);
    // booking-form-surface.tsx L64-65: step 2 shows "Appointment details" heading
    expect(screen.getByRole("heading", { name: /Appointment details/i })).toBeInTheDocument();
  });

  it("TEST-APPT-03: Override with reason button is absent for Receptionist (no conflict state shown)", () => {
    render(<NewAppointmentScreen initialRole="receptionist" initialPatientId="pt-001" />);
    // The "Override with reason" button only appears in a booking conflict for admin
    expect(screen.queryByText(/Override with reason/i)).not.toBeInTheDocument();
  });
});
