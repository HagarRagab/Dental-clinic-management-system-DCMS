"use client";

import { useState } from "react";
import { signInWithMockData } from "@/features/auth/services/mock-auth-service";
import type { LoginCredentials, MockAuthResult } from "@/features/auth/auth.types";

const initialValues: LoginCredentials = { email: "", password: "", rememberDevice: false };

export function useLoginForm() {
  const [values, setValues] = useState<LoginCredentials>(initialValues);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<MockAuthResult | null>(null);

  function updateValue<K extends keyof LoginCredentials>(key: K, value: LoginCredentials[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function submit() {
    setError(null);
    if (!values.email.trim() || !values.password) {
      setError("Enter your email and password to continue.");
      return;
    }

    setIsSubmitting(true);
    const response = await signInWithMockData(values);
    setIsSubmitting(false);
    setResult(response);

    if (response.status === "invalid") {
      setError("The email or password is incorrect. Please try again.");
    }
  }

  return { values, error, isSubmitting, result, updateValue, submit };
}
