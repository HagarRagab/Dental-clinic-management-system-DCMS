import type { UserRole } from "@/types";

export type LoginCredentials = {
  email: string;
  password: string;
  rememberDevice: boolean;
};

export type MockAuthResult =
  | { status: "authenticated"; role: UserRole; name: string }
  | { status: "mfa-required"; role: "admin"; name: string }
  | { status: "invalid" };
