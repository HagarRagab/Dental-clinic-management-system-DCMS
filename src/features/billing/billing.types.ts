export type PaymentMethod = "Cash" | "Card" | "Bank transfer";
export type InvoiceStatus = "Draft" | "Finalized" | "Partially paid" | "Paid" | "Voided";
export type InvoiceItem = { id: string; description: string; quantity: number; unitPrice: number; source: "treatment" | "service" };
export type Payment = { id: string; date: string; method: PaymentMethod; amount: number; reference?: string };
export type BillingInvoice = { id: string; patient: string; created: string; status: InvoiceStatus; items: InvoiceItem[]; discount: number; tax: number; payments: Payment[]; writeOff: number };
