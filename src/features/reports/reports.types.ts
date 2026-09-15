export type ReportMetric = {
  label: string;
  value: string;
  detail?: string;
};

export type AppointmentSummaryRow = {
  status: "Completed" | "Cancelled" | "No-show" | "Booked" | "Confirmed";
  count: number;
  percentage: number;
};

export type PaymentMethodRow = {
  method: "Cash" | "Card" | "Bank transfer";
  amount: number;
  count: number;
};

export type DentistRevenueRow = {
  dentist: string;
  completed: number;
  revenue: number;
};

export type TreatmentRevenueRow = {
  treatment: string;
  count: number;
  revenue: number;
};

export type PatientBalanceRow = {
  patient: string;
  invoiceId: string;
  balance: number;
  lastVisit: string;
};

export type InventoryAlertRow = {
  name: string;
  status: "Low stock" | "Out of stock" | "Expiring";
  currentStock: number;
  unit: string;
  supplier: string;
};

export type ReportsData = {
  todayDate: string;
  todayAppointmentsTotal: number;
  todayAppointmentsRemaining: number;
  todayRevenue: number;
  outstandingRevenue: number;
  appointmentSummary: AppointmentSummaryRow[];
  paymentMethods: PaymentMethodRow[];
  dentistRevenue: DentistRevenueRow[];
  treatmentRevenue: TreatmentRevenueRow[];
  patientBalances: PatientBalanceRow[];
  inventoryAlerts: InventoryAlertRow[];
};
