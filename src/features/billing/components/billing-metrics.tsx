import { CircleDollarSign, ReceiptText, WalletCards } from "lucide-react";
import { formatEgp } from "@/features/billing/services/mock-billing-service";

export function BillingMetrics({
    drafts,
    collected,
    outstanding,
}: {
    drafts: number;
    collected: number;
    outstanding: number;
}) {
    return (
        <section className="billing-metrics" aria-label="Billing summary">
            <article>
                <span className="billing-metric__icon">
                    <ReceiptText aria-hidden="true" />
                </span>
                <div>
                    <span>Open drafts</span>
                    <strong>{drafts}</strong>
                </div>
            </article>
            <article>
                <span className="billing-metric__icon billing-metric__icon--success">
                    <CircleDollarSign aria-hidden="true" />
                </span>
                <div>
                    <span>Payments recorded</span>
                    <strong>{formatEgp(collected)}</strong>
                </div>
            </article>
            <article>
                <span className="billing-metric__icon billing-metric__icon--warning">
                    <WalletCards aria-hidden="true" />
                </span>
                <div>
                    <span>Outstanding balance</span>
                    <strong>{formatEgp(outstanding)}</strong>
                </div>
            </article>
        </section>
    );
}
