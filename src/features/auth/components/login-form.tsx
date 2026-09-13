"use client";

import { Eye, EyeOff, KeyRound, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/text-input";
import { useLoginForm } from "@/features/auth/hooks/use-login-form";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { values, error, isSubmitting, result, updateValue, submit } = useLoginForm();

  if (result?.status === "mfa-required") {
    return (
      <section className="auth-card" aria-labelledby="mfa-title">
        <div className="auth-card__icon"><ShieldCheck aria-hidden="true" /></div>
        <p className="eyebrow">Admin verification</p>
        <h1 id="mfa-title">One more secure step</h1>
        <p className="auth-card__description">
          Welcome back, {result.name}. Enter the code from your authenticator app to continue.
        </p>
        <label className="field-label" htmlFor="totp-code">Authenticator code</label>
        <TextInput id="totp-code" inputMode="numeric" autoComplete="one-time-code" placeholder="000000" />
        <Button fullWidth type="button">Verify and continue</Button>
        <button className="text-button" type="button"><KeyRound aria-hidden="true" /> Use a recovery code</button>
      </section>
    );
  }

  if (result?.status === "authenticated") {
    return (
      <section className="auth-card" aria-labelledby="welcome-title">
        <div className="auth-card__icon auth-card__icon--success"><ShieldCheck aria-hidden="true" /></div>
        <p className="eyebrow">Mock sign-in complete</p>
        <h1 id="welcome-title">Welcome, {result.name}</h1>
        <p className="auth-card__description">
          You are signed in as a {result.role}. Dashboard routing will be connected in the next screen.
        </p>
        <Button fullWidth type="button">Continue to dashboard</Button>
      </section>
    );
  }

  return (
    <section className="auth-card" aria-labelledby="login-title">
      <div className="auth-card__icon"><LockKeyhole aria-hidden="true" /></div>
      <p className="eyebrow">Dental Clinic Management System</p>
      <h1 id="login-title">Welcome back</h1>
      <p className="auth-card__description">Sign in to manage your clinic day with clarity and care.</p>

      <form
        className="login-form"
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
        noValidate
      >
        <div className="field-group">
          <label className="field-label" htmlFor="email">Email address</label>
          <div className="input-with-icon">
            <Mail aria-hidden="true" />
            <TextInput
              id="email"
              type="email"
              autoComplete="email"
              placeholder="name@clinic.com"
              value={values.email}
              onChange={(event) => updateValue("email", event.target.value)}
            />
          </div>
        </div>

        <div className="field-group">
          <div className="field-label-row">
            <label className="field-label" htmlFor="password">Password</label>
            <button type="button" className="link-button">Forgot password?</button>
          </div>
          <div className="input-with-icon input-with-icon--trailing">
            <LockKeyhole aria-hidden="true" />
            <TextInput
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={values.password}
              onChange={(event) => updateValue("password", event.target.value)}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
            </button>
          </div>
        </div>

        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={values.rememberDevice}
            onChange={(event) => updateValue("rememberDevice", event.target.checked)}
          />
          <span>Remember this device</span>
        </label>

        {error ? <p className="form-error" role="alert">{error}</p> : null}

        <Button fullWidth type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <div className="demo-accounts" aria-label="Mock account credentials">
        <p>Demo accounts</p>
        <span>admin@dcms.demo · Admin123!</span>
        <span>reception@dcms.demo · Reception123!</span>
        <span>dentist@dcms.demo · Dentist123!</span>
      </div>
    </section>
  );
}
