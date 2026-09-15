export type SettingsSection =
  | "Clinic"
  | "Language"
  | "Appointment types"
  | "Services"
  | "Working hours"
  | "Appointment rules"
  | "Billing"
  | "Notifications"
  | "Users"
  | "Security"
  | "Audit";

export type ClinicSettings = {
  name: string;
  specialty: string;
  address: string;
  phone: string;
  email: string;
  registrationNumber: string;
  taxId: string;
  website: string;
};

export type AppointmentTypeConfig = {
  id: string;
  name: string;
  defaultDurationMinutes: number;
  defaultPrice: number;
  active: boolean;
  color: string;
};

export type ServiceConfig = {
  id: string;
  name: string;
  category: string;
  defaultPrice: number;
  active: boolean;
};

export type WorkingDayConfig = {
  day: string;
  open: boolean;
  start: string;
  end: string;
  breakStart?: string;
  breakEnd?: string;
};

export type AppointmentRulesConfig = {
  defaultSlotMinutes: number;
  minAdvanceBookingHours: number;
  maxAdvanceBookingDays: number;
  allowDoubleBooking: boolean;
  requireAdminOverrideReason: boolean;
  autoConfirm: boolean;
  cancellationCutoffHours: number;
};

export type BillingConfig = {
  currency: string;
  taxRate: number;
  taxLabel: string;
  invoicePrefix: string;
  receiptPrefix: string;
  paymentTermsDays: number;
  allowPartialPayments: boolean;
};

export type UserConfig = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "receptionist" | "dentist";
  active: boolean;
  mfaEnabled: boolean;
};

export type SecurityConfig = {
  sessionTimeoutMinutes: number;
  passwordMinLength: number;
  requireUppercase: boolean;
  requireSpecialChar: boolean;
  mfaRequiredForAdmin: boolean;
  loginAttemptLockout: number;
};

export type MockSettingsData = {
  clinic: ClinicSettings;
  appointmentTypes: AppointmentTypeConfig[];
  services: ServiceConfig[];
  workingHours: WorkingDayConfig[];
  appointmentRules: AppointmentRulesConfig;
  billing: BillingConfig;
  users: UserConfig[];
  security: SecurityConfig;
};
