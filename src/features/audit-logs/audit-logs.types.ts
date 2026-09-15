export type AuditModule =
  | "Clinical"
  | "Billing"
  | "Inventory"
  | "Appointments"
  | "Auth"
  | "Reports"
  | "Settings";

export type AuditResult = "Success" | "Denied" | "Warning";

export type AuditEvent = {
  id: string;
  timestamp: string;
  user: string;
  userRole: "admin" | "receptionist" | "dentist";
  action: string;
  module: AuditModule;
  entity: string;
  entityId?: string;
  result: AuditResult;
  detail: string;
  ipAddress?: string;
};
