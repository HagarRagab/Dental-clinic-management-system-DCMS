import { Dispatch, SetStateAction } from "react";
import { BillingInvoice } from "../billing.types";
import { formatEgp } from "../services/mock-billing-service";

function InvoiceListPanel({
    invoices,
    setActiveInvoiceId,
    setNotice,
    activeInvoiceId,
    invoiceBalance,
    invoiceStatusClass,
}: {
    invoices: BillingInvoice[];
    setActiveInvoiceId: Dispatch<SetStateAction<string>>;
    setNotice: Dispatch<SetStateAction<string>>;
    activeInvoiceId: string;
    invoiceBalance: (invoice: BillingInvoice) => number;
    invoiceStatusClass: (status: BillingInvoice["status"]) => string;
}) {
    return (
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
                            <em
                                className={`invoice-status invoice-status--${invoiceStatusClass(invoice.status)}`}
                            >
                                {invoice.status}
                            </em>
                        </span>
                    </button>
                ))}
            </div>
        </aside>
    );
}

export default InvoiceListPanel;
