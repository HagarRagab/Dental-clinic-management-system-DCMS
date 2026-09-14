"use client";

import {
    CheckCircle2,
    CircleDollarSign,
    FileLock2,
    Plus,
    ReceiptText,
    RotateCcw,
    ShieldAlert,
    WalletCards,
    XCircle,
} from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { AppShell } from "@/components/layout/app-shell";
import type {
    BillingInvoice,
    InvoiceItem,
    PaymentMethod,
} from "@/features/billing/billing.types";
import {
    formatEgp,
    invoiceBalance,
    invoicePaid,
    invoiceSubtotal,
    invoiceTotal,
    mockInvoices,
} from "@/features/billing/services/mock-billing-service";
import { dashboardUsers } from "@/features/dashboard/services/mock-dashboard-service";
import type { UserRole } from "@/types";

const quickServices: InvoiceItem[] = [
    {
        id: "service-cleaning",
        description: "Dental cleaning",
        quantity: 1,
        unitPrice: 900,
        source: "service",
    },
    {
        id: "service-xray",
        description: "Periapical X-ray",
        quantity: 1,
        unitPrice: 350,
        source: "service",
    },
];

function invoiceStatusClass(status: BillingInvoice["status"]) {
    return status.toLowerCase().replaceAll(" ", "-");
}

export function BillingScreen({ initialRole }: { initialRole: UserRole }) {
    const [role, setRole] = useState<UserRole>(initialRole);
    const [invoices, setInvoices] = useState<BillingInvoice[]>(mockInvoices);
    const [activeInvoiceId, setActiveInvoiceId] = useState("INV-1042");
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Card");
    const [paymentAmount, setPaymentAmount] = useState("1800");
    const [notice, setNotice] = useState("");

    const activeInvoice =
        invoices.find((invoice) => invoice.id === activeInvoiceId) ?? invoices[0];
    const balance = invoiceBalance(activeInvoice);
    const isDraft = activeInvoice.status === "Draft";
    const isVoided = activeInvoice.status === "Voided";
    const canCollectPayment = !isDraft && !isVoided && balance > 0;
    const metrics = useMemo(
        () => ({
            drafts: invoices.filter((invoice) => invoice.status === "Draft").length,
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

    function updateInvoice(update: (invoice: BillingInvoice) => BillingInvoice) {
        setInvoices((current) =>
            current.map((invoice) =>
                invoice.id === activeInvoiceId ? update(invoice) : invoice,
            ),
        );
    }

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

    function addService(item: InvoiceItem) {
        updateInvoice((invoice) => ({
            ...invoice,
            items: [
                ...invoice.items,
                { ...item, id: `${item.id}-${invoice.items.length + 1}` },
            ],
        }));
        setNotice(`${item.description} added to the draft.`);
    }

    function finalizeInvoice() {
        if (!activeInvoice.items.length) {
            setNotice("Add at least one service before finalizing this invoice.");
            return;
        }
        updateInvoice((invoice) => ({ ...invoice, status: "Finalized" }));
        setPaymentAmount(String(invoiceBalance(activeInvoice)));
        setNotice(`${activeInvoice.id} is finalized and now locked from editing.`);
    }

    function collectPayment(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const amount = Number(paymentAmount);
        if (!amount || amount <= 0 || amount > balance) {
            setNotice(`Enter an amount between 1 and ${formatEgp(balance)}.`);
            return;
        }
        updateInvoice((invoice) => {
            const payments = [
                ...invoice.payments,
                {
                    id: `payment-${Date.now()}`,
                    date: "13 Sep 2026",
                    method: paymentMethod,
                    amount,
                },
            ];
            const remaining =
                invoiceTotal(invoice) -
                payments.reduce((total, payment) => total + payment.amount, 0) -
                invoice.writeOff;
            return {
                ...invoice,
                payments,
                status: remaining === 0 ? "Paid" : "Partially paid",
            };
        });
        setPaymentAmount("");
        setNotice(`${formatEgp(amount)} recorded by ${paymentMethod}.`);
    }

    function adminAction(action: "void" | "refund" | "write-off") {
        if (action === "void") {
            updateInvoice((invoice) => ({ ...invoice, status: "Voided" }));
            setNotice(
                `${activeInvoice.id} was voided. This action would be written to the audit log.`,
            );
            return;
        }
        if (action === "refund") {
            updateInvoice((invoice) => ({
                ...invoice,
                payments: invoice.payments.slice(0, -1),
                status: "Finalized",
            }));
            setNotice(
                "The latest payment was refunded in this mock flow and the action was logged.",
            );
            return;
        }
        updateInvoice((invoice) => ({
            ...invoice,
            writeOff: invoiceBalance(invoice),
            status: "Paid",
        }));
        setNotice("Remaining balance written off. This action would be logged.");
    }

    if (role === "dentist") {
        return (
            <AppShell
                activeItem="Billing"
                role={role}
                userName={dashboardUsers[role]}
                onRoleChange={setRole}
            >
                <section className="permission-state" aria-labelledby="billing-access-title">
                    <span className="permission-state__icon"><ShieldAlert aria-hidden="true" /></span>
                    <p className="page-heading__eyebrow">Restricted workspace</p>
                    <h1 id="billing-access-title">Billing access is restricted</h1>
                    <p>Financial records are available to Admins and authorized Receptionists. Your clinical workspace remains available from the navigation.</p>
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
                    <Plus aria-hidden="true" />New draft invoice
                </button>
            </header>

            <section className="billing-metrics" aria-label="Billing summary">
                <article>
                    <span className="billing-metric__icon">
                        <ReceiptText aria-hidden="true" />
                    </span>
                    <div>
                        <span>Open drafts</span>
                        <strong>{metrics.drafts}</strong>
                    </div>
                </article>
                <article>
                    <span className="billing-metric__icon billing-metric__icon--success">
                        <CircleDollarSign aria-hidden="true" />
                    </span>
                    <div>
                        <span>Payments recorded</span>
                        <strong>{formatEgp(metrics.collected)}</strong>
                    </div>
                </article>
                <article>
                    <span className="billing-metric__icon billing-metric__icon--warning">
                        <WalletCards aria-hidden="true" />
                    </span>
                    <div>
                        <span>Outstanding balance</span>
                        <strong>{formatEgp(metrics.outstanding)}</strong>
                    </div>
                </article>
            </section>

            {notice ? (
                <p className="billing-notice" role="status">
                    <CheckCircle2 aria-hidden="true" />
                    {notice}
                </p>
            ) : null}

            <section className="billing-workspace" aria-label="Invoice workspace">
                <aside className="invoice-list-panel">
                    <div className="panel-header">
                        <div>
                            <h2>Recent invoices</h2>
                            <p>Patient billing records</p>
                        </div>
                    </div>
                    <div className="invoice-list">
                        {invoices.map((invoice) => (
                            <button
                                key={invoice.id}
                                type="button"
                                onClick={() => {
                                    setActiveInvoiceId(invoice.id);
                                    setNotice("");
                                }}
                                className={`invoice-list-item ${activeInvoiceId === invoice.id ? "invoice-list-item--active" : ""}`}
                                aria-pressed={activeInvoiceId === invoice.id}
                            >
                                <span>
                                    <strong>{invoice.id}</strong>
                                    <small>{invoice.patient}</small>
                                </span>
                                <span>
                                    <b>{formatEgp(invoiceBalance(invoice))}</b>
                                    <em className={`invoice-status invoice-status--${invoiceStatusClass(invoice.status)}`}>
                                        {invoice.status}
                                    </em>
                                </span>
                            </button>
                        ))}
                    </div>
                </aside>

                <article className="invoice-detail-panel">
                    <div className="invoice-detail-panel__header">
                        <div>
                            <p className="panel-kicker">
                                {isDraft ? "Editable draft" : "Financial record"}
                            </p>
                            <h2>{activeInvoice.id}</h2>
                            <p>
                                {activeInvoice.patient} · Created {activeInvoice.created}
                            </p>
                        </div>
                        <span className={`invoice-status invoice-status--${invoiceStatusClass(activeInvoice.status)}`}>
                            {activeInvoice.status}
                        </span>
                    </div>

                    {!isDraft ? (
                        <div className="invoice-lock-message">
                            <FileLock2 aria-hidden="true" />
                            <span>
                                <strong>Finalized invoices are immutable.</strong>{" "}
                                Use an Admin-only void, refund, or write-off
                                action to correct a financial record.
                            </span>
                        </div>
                    ) : null}

                    <div className="invoice-lines" role="table" aria-label="Invoice items">
                        <div className="invoice-lines__header" role="row">
                            <span role="columnheader">Item</span>
                            <span role="columnheader">Qty</span>
                            <span role="columnheader">Amount</span>
                        </div>
                        {activeInvoice.items.length ? (
                            activeInvoice.items.map((item) => (
                                <div key={item.id} className="invoice-line" role="row">
                                    <span role="cell">
                                        <strong>{item.description}</strong>
                                        <small>
                                            {item.source === "treatment"
                                                ? "Performed treatment"
                                                : "Service"}
                                        </small>
                                    </span>
                                    <span role="cell">{item.quantity}</span>
                                    <strong role="cell">
                                        {formatEgp(item.quantity * item.unitPrice)}
                                    </strong>
                                </div>
                            ))
                        ) : (
                            <p className="invoice-empty">
                                This draft has no line items yet.
                            </p>
                        )}
                    </div>

                    {isDraft ? (
                        <div className="invoice-add-service">
                            <span>Add to draft</span>
                            {quickServices.map((service) => (
                                <button
                                    key={service.id}
                                    type="button"
                                    onClick={() => addService(service)}
                                >
                                    <Plus aria-hidden="true" />
                                    {service.description}
                                </button>
                            ))}
                        </div>
                    ) : null}

                    <div className="invoice-totals" aria-label="Invoice total">
                        <span>
                            Subtotal <b>{formatEgp(invoiceSubtotal(activeInvoice))}</b>
                        </span>
                        <span>
                            Discount
                            <b>
                                {activeInvoice.discount
                                    ? `-${formatEgp(activeInvoice.discount)}`
                                    : "-"}
                            </b>
                        </span>
                        <span>
                            Tax <b>{activeInvoice.tax ? formatEgp(activeInvoice.tax) : "-"}</b>
                        </span>
                        {activeInvoice.writeOff ? (
                            <span>
                                Write-off <b>-{formatEgp(activeInvoice.writeOff)}</b>
                            </span>
                        ) : null}
                        <strong>
                            Total <b>{formatEgp(invoiceTotal(activeInvoice))}</b>
                        </strong>
                        <strong className="invoice-totals__balance">
                            Balance due <b>{formatEgp(Math.max(0, balance))}</b>
                        </strong>
                    </div>

                    {isDraft ? (
                        <div className="billing-actions">
                            <button
                                type="button"
                                className="button button--secondary"
                                onClick={() => {
                                    updateInvoice((invoice) => ({
                                        ...invoice,
                                        discount: invoice.discount ? 0 : 150,
                                    }));
                                    setNotice(
                                        activeInvoice.discount
                                            ? "Discount removed."
                                            : "A EGP 150 draft discount was applied.",
                                    );
                                }}
                            >
                                {activeInvoice.discount
                                    ? "Remove discount"
                                    : "Apply discount"}
                            </button>
                            <button
                                type="button"
                                className="button button--primary"
                                onClick={finalizeInvoice}
                            >
                                <FileLock2 aria-hidden="true" />Finalize invoice
                            </button>
                        </div>
                    ) : null}

                    {canCollectPayment ? (
                        <form className="payment-collection" onSubmit={collectPayment}>
                            <div className="payment-collection__header">
                                <div>
                                    <h3>Collect payment</h3>
                                    <p>Record a payment against this finalized invoice.</p>
                                </div>
                                <span>{formatEgp(balance)} due</span>
                            </div>
                            <div className="payment-form">
                                <label>
                                    <span>Payment method</span>
                                    <select
                                        value={paymentMethod}
                                        onChange={(event) =>
                                            setPaymentMethod(
                                                event.target.value as PaymentMethod,
                                            )
                                        }
                                    >
                                        <option>Cash</option>
                                        <option>Card</option>
                                        <option>Bank transfer</option>
                                    </select>
                                </label>
                                <label>
                                    <span>Amount (EGP)</span>
                                    <input
                                        type="number"
                                        min="1"
                                        max={balance}
                                        step="1"
                                        value={paymentAmount}
                                        onChange={(event) =>
                                            setPaymentAmount(event.target.value)
                                        }
                                        required
                                    />
                                </label>
                                <button className="button button--primary" type="submit">
                                    <WalletCards aria-hidden="true" />Record payment
                                </button>
                            </div>
                        </form>
                    ) : null}

                    {activeInvoice.payments.length ? (
                        <section className="payment-history" aria-labelledby="payment-history-title">
                            <h3 id="payment-history-title">Payments</h3>
                            {activeInvoice.payments.map((payment) => (
                                <article key={payment.id}>
                                    <span>
                                        <CheckCircle2 aria-hidden="true" />
                                        <span>
                                            <strong>{payment.method}</strong>
                                            <small>
                                                {payment.date}
                                                {payment.reference
                                                    ? ` · ${payment.reference}`
                                                    : ""}
                                            </small>
                                        </span>
                                    </span>
                                    <b>{formatEgp(payment.amount)}</b>
                                </article>
                            ))}
                        </section>
                    ) : null}

                    {role === "admin" && !isDraft && !isVoided ? (
                        <div className="admin-financial-actions">
                            <span>
                                <ShieldAlert aria-hidden="true" />Admin-only corrections
                            </span>
                            <button type="button" onClick={() => adminAction("void")}>
                                <XCircle aria-hidden="true" />Void invoice
                            </button>
                            {activeInvoice.payments.length ? (
                                <button type="button" onClick={() => adminAction("refund")}>
                                    <RotateCcw aria-hidden="true" />Refund latest payment
                                </button>
                            ) : null}
                            {balance > 0 ? (
                                <button type="button" onClick={() => adminAction("write-off")}>
                                    <ShieldAlert aria-hidden="true" />Write off balance
                                </button>
                            ) : null}
                        </div>
                    ) : null}
                </article>
            </section>
        </AppShell>
    );
}
