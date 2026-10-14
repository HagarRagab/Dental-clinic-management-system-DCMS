import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LoginForm } from "../components/login-form";

describe("AUTH-01 & AUTH-02: Authentication & Login Form Validation", () => {
  it("renders email and password inputs with demo credentials list", () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^Sign in$/i })).toBeInTheDocument();
    expect(screen.getByText(/admin@dcms.demo/i)).toBeInTheDocument();
  });

  it("TEST-AUTH-01: displays error when submitting with empty credentials", async () => {
    render(<LoginForm />);
    const submitBtn = screen.getByRole("button", { name: /^Sign in$/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Enter your email and password to continue/i)).toBeInTheDocument();
    });
  });

  it("TEST-AUTH-02: shows MFA verification challenge when logging in as Admin", async () => {
    render(<LoginForm />);
    const emailInput = screen.getByLabelText(/Email address/i);
    const passwordInput = screen.getByLabelText(/^Password$/i);

    fireEvent.change(emailInput, { target: { value: "admin@dcms.demo" } });
    fireEvent.change(passwordInput, { target: { value: "Admin123!" } });

    const submitBtn = screen.getByRole("button", { name: /^Sign in$/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/One more secure step/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Authenticator code/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Verify and continue/i })).toBeInTheDocument();
    });
  });
});
