import type { BillingInvoice, InvoiceItem } from "@/features/billing/billing.types";

export const defaultInvoiceItems: InvoiceItem[] = [
  { id: "line-1", description: "Root canal follow-up", quantity: 1, unitPrice: 1450, source: "treatment" },
  { id: "line-2", description: "Periapical X-ray", quantity: 1, unitPrice: 350, source: "service" },
];

export const mockInvoices: BillingInvoice[] = [
  { id: "INV-1042", patient: "Mariam Adel", created: "13 Sep 2026", status: "Draft", items: defaultInvoiceItems, discount: 0, tax: 0, payments: [], writeOff: 0 },
  { id: "INV-1019", patient: "Mariam Adel", created: "08 Sep 2026", status: "Paid", items: [{ id: "line-3", description: "Root canal treatment", quantity: 1, unitPrice: 4500, source: "treatment" }], discount: 0, tax: 0, payments: [{ id: "payment-1", date: "08 Sep 2026", method: "Card", amount: 4500, reference: "AUTH-2038" }], writeOff: 0 },
  { id: "INV-1004", patient: "Omar Nabil", created: "05 Sep 2026", status: "Partially paid", items: [{ id: "line-4", description: "Crown fitting", quantity: 1, unitPrice: 3200, source: "treatment" }], discount: 200, tax: 0, payments: [{ id: "payment-2", date: "05 Sep 2026", method: "Cash", amount: 1500 }], writeOff: 0 },
];

export function invoiceSubtotal(invoice: BillingInvoice) { return invoice.items.reduce((total, item) => total + item.quantity * item.unitPrice, 0); }
export function invoiceTotal(invoice: BillingInvoice) { return invoiceSubtotal(invoice) - invoice.discount + invoice.tax; }
export function invoicePaid(invoice: BillingInvoice) { return invoice.payments.reduce((total, payment) => total + payment.amount, 0); }
export function invoiceBalance(invoice: BillingInvoice) { return invoiceTotal(invoice) - invoicePaid(invoice) - invoice.writeOff; }
export function formatEgp(value: number) { return new Intl.NumberFormat("en-EG", { style: "currency", currency: "EGP", maximumFractionDigits: 0 }).format(value).replace("EGP", "EGP "); }
