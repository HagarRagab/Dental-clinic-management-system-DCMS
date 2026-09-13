import { CalendarDays, HeartPulse, ShieldCheck } from "lucide-react";
import { LoginForm } from "@/features/auth/components/login-form";

export function LoginScreen() {
  return (
    <main className="auth-layout">
      <section className="auth-brand" aria-label="DCMS product introduction">
        <div className="brand-mark"><HeartPulse aria-hidden="true" /></div>
        <p className="brand-name">DCMS</p>
        <h2>Every clinic day, under control.</h2>
        <p>
          A focused workspace for appointments, patient care, and everyday clinic operations.
        </p>
        <div className="brand-points">
          <span><CalendarDays aria-hidden="true" /> A clearer day at reception</span>
          <span><ShieldCheck aria-hidden="true" /> Sensitive clinical data, protected</span>
        </div>
      </section>
      <div className="auth-form-area">
        <LoginForm />
      </div>
    </main>
  );
}
