"use client";

import { useState } from "react";
import { CheckCircle2, Download, Printer, Stethoscope, X } from "lucide-react";
import type { BillingInvoice } from "@/features/billing/billing.types";
import {
  formatEgp,
  invoiceBalance,
  invoicePaid,
  invoiceSubtotal,
  invoiceTotal,
} from "@/features/billing/services/mock-billing-service";

interface InvoicePdfModalProps {
  invoice: BillingInvoice;
  onClose: () => void;
}

export function InvoicePdfModal({ invoice, onClose }: InvoicePdfModalProps) {
  const [downloadNotice, setDownloadNotice] = useState("");

  const subtotal = invoiceSubtotal(invoice);
  const total = invoiceTotal(invoice);
  const paid = invoicePaid(invoice);
  const balance = invoiceBalance(invoice);

  function handlePrint() {
    window.print();
  }

  function handleDownload() {
    setDownloadNotice(`Invoice PDF generated (${invoice.id}.pdf). File download simulated in prototype.`);
    setTimeout(() => setDownloadNotice(""), 4500);
  }

  return (
    <div
      className="invoice-pdf-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="invoice-pdf-title"
    >
      <div className="invoice-pdf-modal">
        {/* Modal Action Bar (Hidden on print) */}
        <div className="invoice-pdf-modal__toolbar">
          <div className="invoice-pdf-modal__toolbar-title">
            <span id="invoice-pdf-title">Invoice Preview — {invoice.id}</span>
            {downloadNotice && (
              <span className="invoice-pdf-modal__toast" role="status">
                <CheckCircle2 size={14} aria-hidden="true" />
                {downloadNotice}
              </span>
            )}
          </div>
          <div className="invoice-pdf-modal__toolbar-actions">
            <button
              type="button"
              className="button button--secondary button--compact"
              onClick={handleDownload}
            >
              <Download size={14} aria-hidden="true" />
              Download PDF
            </button>
            <button
              type="button"
              className="button button--primary button--compact"
              onClick={handlePrint}
            >
              <Printer size={14} aria-hidden="true" />
              Print / Save PDF
            </button>
            <button
              type="button"
              className="invoice-pdf-modal__close-btn"
              onClick={onClose}
              aria-label="Close invoice preview"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Printable Document Sheet */}
        <div className="invoice-document-scroll">
          <article className="invoice-document">
            {/* Document Header */}
            <header className="invoice-document__header">
              <div className="invoice-document__brand">
                <div className="invoice-document__logo">
                  <Stethoscope aria-hidden="true" size={24} />
                </div>
                <div>
                  <h1 className="invoice-document__clinic-name">DCMS Dental Clinic</h1>
                  <p className="invoice-document__clinic-sub">Specialized Dental Care &amp; Oral Surgery</p>
                  <p className="invoice-document__clinic-address">
                    14 El-Tahrir St., Dokki, Giza · Tel: +20 2 3761 0000
                  </p>
                </div>
              </div>
              <div className="invoice-document__meta">
                <h2 className="invoice-document__type">INVOICE &amp; RECEIPT</h2>
                <dl className="invoice-document__meta-list">
                  <div>
                    <dt>Invoice No:</dt>
                    <dd><strong>{invoice.id}</strong></dd>
                  </div>
                  <div>
                    <dt>Date:</dt>
                    <dd>{invoice.created}</dd>
                  </div>
                  <div>
                    <dt>Status:</dt>
                    <dd>
                      <span className={`invoice-status invoice-status--${invoice.status.toLowerCase().replaceAll(" ", "-")}`}>
                        {invoice.status}
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>
            </header>

            <hr className="invoice-document__divider" />

            {/* Bill To Info */}
            <section className="invoice-document__party-grid">
              <div className="invoice-document__party">
                <span className="invoice-document__party-label">Billed To</span>
                <strong className="invoice-document__party-name">{invoice.patient}</strong>
                <p className="invoice-document__party-detail">Patient ID: #P-10284</p>
                <p className="invoice-document__party-detail">Mobile: +20 100 248 1920</p>
              </div>
              <div className="invoice-document__party invoice-document__party--right">
                <span className="invoice-document__party-label">Clinic Registration</span>
                <p className="invoice-document__party-detail">Tax Registration: 482-910-384</p>
                <p className="invoice-document__party-detail">Commercial Registry: 104829</p>
                <p className="invoice-document__party-detail">Currency: Egyptian Pound (EGP)</p>
              </div>
            </section>

            {/* Itemized Table */}
            <table className="invoice-document__table" aria-label="Invoice line items">
              <thead>
                <tr>
                  <th style={{ width: "36px" }}>#</th>
                  <th>Service / Treatment Description</th>
                  <th>Category</th>
                  <th style={{ textAlign: "center", width: "60px" }}>Qty</th>
                  <th style={{ textAlign: "right", width: "110px" }}>Unit Price</th>
                  <th style={{ textAlign: "right", width: "110px" }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: "20px", color: "var(--muted)" }}>
                      No items listed on this invoice.
                    </td>
                  </tr>
                ) : (
                  invoice.items.map((item, index) => (
                    <tr key={item.id}>
                      <td style={{ color: "var(--muted)" }}>{index + 1}</td>
                      <td>
                        <strong>{item.description}</strong>
                      </td>
                      <td style={{ color: "var(--muted)", textTransform: "capitalize" }}>
                        {item.source}
                      </td>
                      <td style={{ textAlign: "center" }}>{item.quantity}</td>
                      <td style={{ textAlign: "right" }}>{formatEgp(item.unitPrice)}</td>
                      <td style={{ textAlign: "right", fontWeight: 600 }}>
                        {formatEgp(item.quantity * item.unitPrice)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Financial Summary */}
            <div className="invoice-document__summary-layout">
              {/* Payment Details Section */}
              <div className="invoice-document__payments">
                <span className="invoice-document__party-label">Payment History &amp; Receipts</span>
                {invoice.payments.length === 0 ? (
                  <p className="invoice-document__no-payments">No payments recorded against this invoice.</p>
                ) : (
                  <table className="invoice-document__payment-table">
                    <thead>
                      <tr>
                        <th>Receipt Ref</th>
                        <th>Date</th>
                        <th>Method</th>
                        <th style={{ textAlign: "right" }}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.payments.map((p) => (
                        <tr key={p.id}>
                          <td>
                            <code>{p.reference || p.id}</code>
                          </td>
                          <td>{p.date}</td>
                          <td>{p.method}</td>
                          <td style={{ textAlign: "right", fontWeight: 600, color: "#15803d" }}>
                            {formatEgp(p.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Calculations Card */}
              <div className="invoice-document__totals">
                <div className="invoice-document__totals-row">
                  <span>Subtotal</span>
                  <strong>{formatEgp(subtotal)}</strong>
                </div>
                {invoice.discount > 0 && (
                  <div className="invoice-document__totals-row">
                    <span>Discount</span>
                    <strong style={{ color: "#dc2626" }}>-{formatEgp(invoice.discount)}</strong>
                  </div>
                )}
                <div className="invoice-document__totals-row">
                  <span>Tax (VAT 0% - Medical)</span>
                  <strong>{formatEgp(invoice.tax)}</strong>
                </div>
                {invoice.writeOff > 0 && (
                  <div className="invoice-document__totals-row">
                    <span>Write-off</span>
                    <strong style={{ color: "#b45309" }}>-{formatEgp(invoice.writeOff)}</strong>
                  </div>
                )}
                <div className="invoice-document__totals-row invoice-document__totals-row--total">
                  <span>Total Due</span>
                  <strong>{formatEgp(total)}</strong>
                </div>
                <div className="invoice-document__totals-row">
                  <span>Total Paid</span>
                  <strong style={{ color: "#15803d" }}>{formatEgp(paid)}</strong>
                </div>
                <div className="invoice-document__totals-row invoice-document__totals-row--balance">
                  <span>Remaining Balance</span>
                  <strong style={{ color: balance > 0 ? "#dc2626" : "#15803d" }}>
                    {formatEgp(Math.max(0, balance))}
                  </strong>
                </div>
              </div>
            </div>

            <hr className="invoice-document__divider" />

            {/* Document Footer & Compliance Note */}
            <footer className="invoice-document__footer">
              <p className="invoice-document__immutability-note">
                Finalized clinic document. Financial entries are recorded in the audit log.
              </p>
              <p className="invoice-document__compliance-note">
                Notice: Clinical prototype invoice. Official Egyptian Tax Authority (ETA) e-invoice / e-receipt
                API transmission and cryptographic signing will be integrated in Phase 2.
              </p>
            </footer>
          </article>
        </div>
      </div>
    </div>
  );
}
