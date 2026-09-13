import type { LoginCredentials, MockAuthResult } from "@/features/auth/auth.types";

const demoAccounts = {
  "admin@dcms.demo": { password: "Admin123!", role: "admin", name: "Dr. Salma Hassan" },
  "reception@dcms.demo": { password: "Reception123!", role: "receptionist", name: "Nour Adel" },
  "dentist@dcms.demo": { password: "Dentist123!", role: "dentist", name: "Dr. Karim Mostafa" },
} as const;

export async function signInWithMockData(credentials: LoginCredentials): Promise<MockAuthResult> {
  await new Promise((resolve) => setTimeout(resolve, 650));
  const account = demoAccounts[credentials.email.toLowerCase() as keyof typeof demoAccounts];

  if (!account || account.password !== credentials.password) {
    return { status: "invalid" };
  }

  if (account.role === "admin") {
    return { status: "mfa-required", role: "admin", name: account.name };
  }

  return { status: "authenticated", role: account.role, name: account.name };
}
