"use client";

import { CheckCircle2, Plus, ShieldAlert } from "lucide-react";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { InvoicePdfModal } from "@/features/billing/components/invoice-pdf-modal";
import type { BillingInvoice } from "@/features/billing/billing.types";
import {
    invoiceBalance,
    invoicePaid,
    mockInvoices,
} from "@/features/billing/services/mock-billing-service";
import { dashboardUsers } from "@/features/dashboard/services/mock-dashboard-service";
import type { UserRole } from "@/types";
import { BillingMetrics } from "../components/billing-metrics";
import InvoiceListPanel from "../components/invoice-list-panel";
import InvoiceDetailPanel from "../components/invoice-detail-panel";

function invoiceStatusClass(status: BillingInvoice["status"]) {
    return status.toLowerCase().replaceAll(" ", "-");
}

export function BillingScreen({ initialRole }: { initialRole: UserRole }) {
    const [role, setRole] = useState<UserRole>(initialRole);
    const [invoices, setInvoices] = useState<BillingInvoice[]>(mockInvoices);
    const [activeInvoiceId, setActiveInvoiceId] = useState("INV-1042");
    const [notice, setNotice] = useState("");
    const [showPdfModal, setShowPdfModal] = useState(false);

    const activeInvoice =
        invoices.find((invoice) => invoice.id === activeInvoiceId) ??
        invoices[0];

    const metrics = useMemo(
        () => ({
            drafts: invoices.filter((invoice) => invoice.status === "Draft")
                .length,
            collected: invoices.reduce(
                (total, invoice) => total + invoicePaid(invoice),
                0,
            ),
            outstanding: invoices.reduce(
                (total, invoice) =>
                    total + Math.max(0, invoiceBalance(invoice)),
                0,
            ),
        }),
        [invoices],
    );

    function createDraft() {
        const id = `INV-${1043 + invoices.length}`;
        const draft: BillingInvoice = {
            id,
            patient: "Mariam Adel",
            created: "13 Sep 2026",
            status: "Draft",
            items: [],
            discount: 0,
            tax: 0,
            payments: [],
            writeOff: 0,
        };
        setInvoices((current) => [draft, ...current]);
        setActiveInvoiceId(id);
        setNotice("New draft created for Mariam Adel.");
    }

    if (role === "dentist") {
        return (
            <AppShell
                activeItem="Billing"
                role={role}
                userName={dashboardUsers[role]}
                onRoleChange={setRole}
            >
                <section
                    className="permission-state"
                    aria-labelledby="billing-access-title"
                >
                    <span className="permission-state__icon">
                        <ShieldAlert aria-hidden="true" />
                    </span>
                    <p className="page-heading__eyebrow">
                        Restricted workspace
                    </p>
                    <h1 id="billing-access-title">
                        Billing access is restricted
                    </h1>
                    <p>
                        Financial records are available to Admins and authorized
                        Receptionists. Your clinical workspace remains available
                        from the navigation.
                    </p>
                </section>
            </AppShell>
        );
    }

    return (
        <AppShell
            activeItem="Billing"
            role={role}
            userName={dashboardUsers[role]}
            onRoleChange={setRole}
        >
            <header className="page-heading billing-heading">
                <div>
                    <p className="page-heading__eyebrow">Patient billing</p>
                    <h1>Invoices and payments</h1>
                    <p>
                        Prepare accurate drafts, then lock the financial record
                        before payment collection.
                    </p>
                </div>
                <button
                    type="button"
                    className="button button--primary page-heading__action"
                    onClick={createDraft}
                >
                    <Plus aria-hidden="true" />
                    New draft invoice
                </button>
            </header>

            <BillingMetrics {...metrics} />

            {notice ? (
                <p className="billing-notice" role="status">
                    <CheckCircle2 aria-hidden="true" />
                    {notice}
                </p>
            ) : null}

            <section
                className="billing-workspace"
                aria-label="Invoice workspace"
            >
                <InvoiceListPanel
                    activeInvoiceId={activeInvoiceId}
                    invoiceBalance={invoiceBalance}
                    invoiceStatusClass={invoiceStatusClass}
                    invoices={invoices}
                    setActiveInvoiceId={setActiveInvoiceId}
                    setNotice={setNotice}
                />

                <InvoiceDetailPanel
                    activeInvoice={activeInvoice}
                    activeInvoiceId={activeInvoiceId}
                    invoiceBalance={invoiceBalance}
                    invoiceStatusClass={invoiceStatusClass}
                    role={role}
                    setInvoices={setInvoices}
                    setNotice={setNotice}
                    setShowPdfModal={setShowPdfModal}
                />
            </section>
            {showPdfModal ? (
                <InvoicePdfModal
                    invoice={activeInvoice}
                    onClose={() => setShowPdfModal(false)}
                />
            ) : null}
        </AppShell>
    );
}
