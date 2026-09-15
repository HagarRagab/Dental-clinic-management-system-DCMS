import type { ReportsData } from "@/features/reports/reports.types";

export const mockReportsData: ReportsData = {
  todayDate: "Saturday, 13 September 2026",
  todayAppointmentsTotal: 28,
  todayAppointmentsRemaining: 6,
  todayRevenue: 18450,
  outstandingRevenue: 6200,

  appointmentSummary: [
    { status: "Completed", count: 17, percentage: 61 },
    { status: "Cancelled", count: 3, percentage: 11 },
    { status: "No-show", count: 2, percentage: 7 },
    { status: "Confirmed", count: 4, percentage: 14 },
    { status: "Booked", count: 2, percentage: 7 },
  ],

  paymentMethods: [
    { method: "Cash", amount: 7800, count: 6 },
    { method: "Card", amount: 8650, count: 9 },
    { method: "Bank transfer", amount: 2000, count: 2 },
  ],

  dentistRevenue: [
    { dentist: "Dr. Karim Mostafa", completed: 10, revenue: 11200 },
    { dentist: "Dr. Salma Hassan", completed: 7, revenue: 7250 },
  ],

  treatmentRevenue: [
    { treatment: "Root canal treatment", count: 3, revenue: 13500 },
    { treatment: "Crown fitting", count: 2, revenue: 6400 },
    { treatment: "Root canal follow-up", count: 4, revenue: 5800 },
    { treatment: "Periapical X-ray", count: 5, revenue: 1750 },
    { treatment: "Consultation", count: 3, revenue: 1500 },
    { treatment: "Cleaning", count: 5, revenue: 2250 },
  ],

  patientBalances: [
    { patient: "Omar Nabil", invoiceId: "INV-1004", balance: 1500, lastVisit: "05 Sep 2026" },
    { patient: "Hana Youssef", invoiceId: "INV-0991", balance: 2800, lastVisit: "01 Sep 2026" },
    { patient: "Youssef Tarek", invoiceId: "INV-0978", balance: 900, lastVisit: "28 Aug 2026" },
    { patient: "Laila Ahmed", invoiceId: "INV-0965", balance: 1000, lastVisit: "22 Aug 2026" },
  ],

  inventoryAlerts: [
    { name: "Nitrile examination gloves", status: "Low stock", currentStock: 42, unit: "pairs", supplier: "Medline Supplies" },
    { name: "Universal composite resin", status: "Low stock", currentStock: 7, unit: "syringes", supplier: "Cairo Dental Trade" },
    { name: "Universal composite resin", status: "Expiring", currentStock: 7, unit: "syringes", supplier: "Cairo Dental Trade" },
    { name: "Fluoride varnish", status: "Out of stock", currentStock: 0, unit: "boxes", supplier: "OralCare Egypt" },
  ],
};

export function formatEgp(value: number) {
  return new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 0,
  })
    .format(value)
    .replace("EGP", "EGP ");
}
