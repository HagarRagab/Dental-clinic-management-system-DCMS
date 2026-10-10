import { Dispatch, SetStateAction, SubmitEvent, useState } from "react";
import { BillingInvoice, InvoiceItem, PaymentMethod } from "../billing.types";
import {
    CheckCircle2,
    FileLock2,
    Plus,
    Printer,
    RotateCcw,
    ShieldAlert,
    WalletCards,
    XCircle,
} from "lucide-react";
import {
    formatEgp,
    invoiceSubtotal,
    invoiceTotal,
} from "../services/mock-billing-service";

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

function InvoiceDetailPanel({
    invoiceBalance,
    activeInvoice,
    setNotice,
    setInvoices,
    activeInvoiceId,
    invoiceStatusClass,
    setShowPdfModal,
    role,
}: {
    invoiceBalance: (invoice: BillingInvoice) => number;
    activeInvoice: BillingInvoice;
    setNotice: Dispatch<SetStateAction<string>>;
    setInvoices: Dispatch<SetStateAction<BillingInvoice[]>>;
    activeInvoiceId: string;
    invoiceStatusClass: (status: BillingInvoice["status"]) => string;
    setShowPdfModal: Dispatch<SetStateAction<boolean>>;
    role: string;
}) {
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Card");
    const [paymentAmount, setPaymentAmount] = useState("1800");

    const balance = invoiceBalance(activeInvoice);
    const isDraft = activeInvoice.status === "Draft";
    const isVoided = activeInvoice.status === "Voided";
    const canCollectPayment = !isDraft && !isVoided && balance > 0;

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
            setNotice(
                "Add at least one service before finalizing this invoice.",
            );
            return;
        }
        updateInvoice((invoice) => ({ ...invoice, status: "Finalized" }));
        setPaymentAmount(String(invoiceBalance(activeInvoice)));
        setNotice(
            `${activeInvoice.id} is finalized and now locked from editing.`,
        );
    }

    function collectPayment(event: SubmitEvent<HTMLFormElement>) {
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
        setNotice(
            "Remaining balance written off. This action would be logged.",
        );
    }

    function updateInvoice(
        update: (invoice: BillingInvoice) => BillingInvoice,
    ) {
        setInvoices((current) =>
            current.map((invoice) =>
                invoice.id === activeInvoiceId ? update(invoice) : invoice,
            ),
        );
    }

    return (
        <article className="invoice-detail-panel">
            <div className="invoice-detail-panel__header">
                <div>
                    <p className="panel-kicker">
                        {isDraft ? "Editable draft" : "Financial record"}
                    </p>
                    <h2>{activeInvoice.id}</h2>
                    <p>
                        {activeInvoice.patient} · Created{" "}
                        {activeInvoice.created}
                    </p>
                </div>
                <div className="invoice-detail-panel__header-actions">
                    <span
                        className={`invoice-status invoice-status--${invoiceStatusClass(activeInvoice.status)}`}
                    >
                        {activeInvoice.status}
                    </span>
                    {!isDraft ? (
                        <button
                            type="button"
                            className="button button--secondary button--compact invoice-print-btn"
                            onClick={() => setShowPdfModal(true)}
                            aria-label={`Print or preview PDF for invoice ${activeInvoice.id}`}
                        >
                            <Printer aria-hidden="true" size={14} />
                            <span>Print / PDF</span>
                        </button>
                    ) : null}
                </div>
            </div>

            {!isDraft ? (
                <div className="invoice-lock-message">
                    <FileLock2 aria-hidden="true" />
                    <span>
                        <strong>Finalized invoices are immutable.</strong> Use
                        an Admin-only void, refund, or write-off action to
                        correct a financial record.
                    </span>
                </div>
            ) : null}

            <div
                className="invoice-lines"
                role="table"
                aria-label="Invoice items"
            >
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
                    Tax{" "}
                    <b>
                        {activeInvoice.tax ? formatEgp(activeInvoice.tax) : "-"}
                    </b>
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
                        <FileLock2 aria-hidden="true" />
                        Finalize invoice
                    </button>
                </div>
            ) : null}

            {canCollectPayment ? (
                <form className="payment-collection" onSubmit={collectPayment}>
                    <div className="payment-collection__header">
                        <div>
                            <h3>Collect payment</h3>
                            <p>
                                Record a payment against this finalized invoice.
                            </p>
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
                        <button
                            className="button button--primary"
                            type="submit"
                        >
                            <WalletCards aria-hidden="true" />
                            Record payment
                        </button>
                    </div>
                </form>
            ) : null}

            {activeInvoice.payments.length ? (
                <section
                    className="payment-history"
                    aria-labelledby="payment-history-title"
                >
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
                            <div className="payment-history__actions">
                                <b>{formatEgp(payment.amount)}</b>
                                <button
                                    type="button"
                                    className="invoice-receipt-btn"
                                    onClick={() => setShowPdfModal(true)}
                                    aria-label={`View and print receipt for ${payment.method} payment of ${formatEgp(payment.amount)}`}
                                >
                                    <Printer aria-hidden="true" size={11} />
                                    <span>Receipt</span>
                                </button>
                            </div>
                        </article>
                    ))}
                </section>
            ) : null}

            {role === "admin" && !isDraft && !isVoided ? (
                <div className="admin-financial-actions">
                    <span>
                        <ShieldAlert aria-hidden="true" />
                        Admin-only corrections
                    </span>
                    <button type="button" onClick={() => adminAction("void")}>
                        <XCircle aria-hidden="true" />
                        Void invoice
                    </button>
                    {activeInvoice.payments.length ? (
                        <button
                            type="button"
                            onClick={() => adminAction("refund")}
                        >
                            <RotateCcw aria-hidden="true" />
                            Refund latest payment
                        </button>
                    ) : null}
                    {balance > 0 ? (
                        <button
                            type="button"
                            onClick={() => adminAction("write-off")}
                        >
                            <ShieldAlert aria-hidden="true" />
                            Write off balance
                        </button>
                    ) : null}
                </div>
            ) : null}
        </article>
    );
}

export default InvoiceDetailPanel;
