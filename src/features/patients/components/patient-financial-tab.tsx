import { useState } from "react";
import { InvoicePdfModal } from "@/features/billing/components/invoice-pdf-modal";
import { CheckCircle2, Printer, ReceiptText } from "lucide-react";
import { BillingInvoice } from "@/features/billing/billing.types";
import { PatientProfile, PatientTab } from "../patient.types";
import { mockInvoices } from "@/features/billing/services/mock-billing-service";

function PatientFinancialTab({
  tab,
  patient,
}: {
  tab: PatientTab;
  patient: PatientProfile;
}) {
  const [previewInvoice, setPreviewInvoice] = useState<BillingInvoice | null>(
    null,
  );
  const [notice, setNotice] = useState("");

  function handleExportCsv() {
    setNotice("Financial ledger exported to CSV. Simulated in prototype.");
    setTimeout(() => setNotice(""), 4000);
  }

  return (
    <section className="profile-section">
      <div className="profile-section__header">
        <div>
          <h2>{tab}</h2>
          <p>
            {tab === "Patient Statement"
              ? "Chronological financial activity"
              : "Patient billing activity"}
          </p>
        </div>
        <div className="profile-section__actions flex gap-2">
          {tab === "Invoices" ? (
            <button
              type="button"
              className="button button--secondary profile-action-button"
              onClick={() => {
                const inv =
                  mockInvoices.find((i) => i.id === "INV-1019") ||
                  mockInvoices[0];
                setPreviewInvoice(inv);
              }}
            >
              <Printer aria-hidden="true" size={14} />
              Print statement
            </button>
          ) : (
            <button
              type="button"
              className="button button--secondary profile-action-button"
              onClick={handleExportCsv}
            >
              <ReceiptText aria-hidden="true" />
              Export CSV
            </button>
          )}
        </div>
      </div>

      {notice ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: 8,
            color: "#15803d",
            fontSize: 13,
            fontWeight: 500,
            padding: "10px 14px",
            marginBottom: 16,
          }}
          role="status"
        >
          <CheckCircle2 size={14} aria-hidden="true" />
          <span>{notice}</span>
        </div>
      ) : null}

      <div className="financial-summary">
        <div>
          <span>Outstanding balance</span>
          <strong>{patient.balance}</strong>
        </div>
        <div>
          <span>Total invoiced</span>
          <strong>EGP 8,200</strong>
        </div>
        <div>
          <span>Total paid</span>
          <strong>EGP 6,750</strong>
        </div>
      </div>

      <div className="financial-ledger">
        <article>
          <span>13 Sep</span>
          <div>
            <strong>Invoice #INV-1042</strong>
            <small>Draft · Root canal follow-up</small>
          </div>
          <b>EGP 1,450</b>
        </article>
        <article>
          <span>08 Sep</span>
          <div>
            <strong>Card payment</strong>
            <small>Receipt #RCT-891 · Invoice #INV-1019</small>
          </div>
          <div className="flex items-center gap-2.5">
            <b className="financial-ledger__positive">EGP 4,500</b>
            <button
              type="button"
              className="button button--secondary button--compact py-[3px] px-2 text-[11px] min-h-[28px]"
              onClick={() => {
                const inv =
                  mockInvoices.find((i) => i.id === "INV-1019") ||
                  mockInvoices[1];
                setPreviewInvoice(inv);
              }}
              aria-label="View and print receipt for payment of EGP 4,500"
            >
              <Printer aria-hidden="true" size={11} />
              <span>Receipt</span>
            </button>
          </div>
        </article>
        <article>
          <span>30 Aug</span>
          <div>
            <strong>Cash payment</strong>
            <small>Receipt #RCT-840 · Consultation</small>
          </div>
          <b className="financial-ledger__positive">EGP 2,250</b>
        </article>
      </div>

      {previewInvoice ? (
        <InvoicePdfModal
          invoice={previewInvoice}
          onClose={() => setPreviewInvoice(null)}
        />
      ) : null}
    </section>
  );
}

export default PatientFinancialTab;
