import { SubmitEvent, useState } from "react";
import { Info } from "lucide-react";
import { BillingConfig } from "../settings.types";

function Billing({
    showSaved,
    settingsData,
}: {
    showSaved: () => void;
    settingsData: BillingConfig;
}) {
    const [billing, setBilling] = useState(settingsData);

    function handleBillingSave(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        setBilling({
            currency: String(fd.get("currency") ?? billing.currency),
            taxRate: Number(fd.get("taxRate") ?? billing.taxRate),
            taxLabel: String(fd.get("taxLabel") ?? billing.taxLabel),
            invoicePrefix: String(
                fd.get("invoicePrefix") ?? billing.invoicePrefix,
            ),
            receiptPrefix: String(
                fd.get("receiptPrefix") ?? billing.receiptPrefix,
            ),
            paymentTermsDays: Number(
                fd.get("paymentTermsDays") ?? billing.paymentTermsDays,
            ),
            allowPartialPayments: fd.get("allowPartialPayments") === "on",
        });
        showSaved();
    }

    return (
        <form className="settings-form" onSubmit={handleBillingSave}>
            <div className="settings-form__grid">
                <label>
                    <span>Currency</span>
                    <select name="currency" defaultValue={billing.currency}>
                        <option value="EGP">EGP — Egyptian Pound</option>
                        <option value="USD">USD — US Dollar</option>
                        <option value="EUR">EUR — Euro</option>
                    </select>
                </label>
                <label>
                    <span>Tax rate (%)</span>
                    <input
                        name="taxRate"
                        type="number"
                        min={0}
                        max={100}
                        step={0.01}
                        defaultValue={billing.taxRate}
                    />
                </label>
                <label>
                    <span>Tax label</span>
                    <input
                        name="taxLabel"
                        type="text"
                        defaultValue={billing.taxLabel}
                        placeholder="e.g. VAT"
                    />
                </label>
                <label>
                    <span>Payment terms (days)</span>
                    <input
                        name="paymentTermsDays"
                        type="number"
                        min={0}
                        defaultValue={billing.paymentTermsDays}
                    />
                </label>
                <label>
                    <span>Invoice prefix</span>
                    <input
                        name="invoicePrefix"
                        type="text"
                        defaultValue={billing.invoicePrefix}
                    />
                </label>
                <label>
                    <span>Receipt prefix</span>
                    <input
                        name="receiptPrefix"
                        type="text"
                        defaultValue={billing.receiptPrefix}
                    />
                </label>
            </div>
            <div className="settings-toggles">
                <label className="settings-toggle-row">
                    <span>
                        <strong>Allow partial payments</strong>
                        <small>Patients can pay invoices in instalments</small>
                    </span>
                    <input
                        name="allowPartialPayments"
                        type="checkbox"
                        role="switch"
                        defaultChecked={billing.allowPartialPayments}
                    />
                </label>
            </div>
            <div className="settings-phase2 settings-phase2--inline">
                <Info aria-hidden="true" />
                <p>
                    Egyptian e-invoicing and e-receipt obligations, credit
                    notes, and formal tax compliance require a dedicated legal
                    and backend review before activation.
                </p>
            </div>
            <div className="settings-form__actions">
                <button type="submit" className="button button--primary">
                    Save billing settings
                </button>
            </div>
        </form>
    );
}

export default Billing;
