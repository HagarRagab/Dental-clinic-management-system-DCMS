import { Globe, ReceiptText, ShieldCheck, Stethoscope } from "lucide-react";

function Audit() {
    return (
        <div className="settings-table-section">
            <div className="settings-audit-info">
                <article>
                    <span className="settings-audit-info__icon">
                        <ShieldCheck aria-hidden="true" />
                    </span>
                    <div>
                        <strong>Audit log retention</strong>
                        <p>
                            Target: 7 years for clinical events, 5 years for
                            financial events. Configurable retention periods
                            require backend implementation and Egyptian
                            data-residency review.
                        </p>
                    </div>
                </article>
                <article>
                    <span className="settings-audit-info__icon">
                        <Stethoscope aria-hidden="true" />
                    </span>
                    <div>
                        <strong>Clinical record access logging</strong>
                        <p>
                            All clinical record views, attachment downloads, and
                            admin overrides will be logged server-side. The
                            Audit Logs screen provides the searchable view.
                        </p>
                    </div>
                </article>
                <article>
                    <span className="settings-audit-info__icon">
                        <ReceiptText aria-hidden="true" />
                    </span>
                    <div>
                        <strong>Financial audit trail</strong>
                        <p>
                            Invoice void, refund, and write-off actions are
                            immutable. The financial audit feed is accessible in
                            the Audit Logs screen.
                        </p>
                    </div>
                </article>
                <article>
                    <span className="settings-audit-info__icon">
                        <Globe aria-hidden="true" />
                    </span>
                    <div>
                        <strong>Legal &amp; compliance boundary</strong>
                        <p>
                            Egyptian data-residency, e-invoicing obligations,
                            and consent requirements are open items. Technical
                            controls do not imply legal compliance. A legal
                            review is required before go-live.
                        </p>
                    </div>
                </article>
            </div>
            <p className="settings-phase2__note" style={{ marginTop: 16 }}>
                Audit retention configuration, scheduled exports, and DSAR
                tooling will be available after the backend is implemented.
            </p>
        </div>
    );
}

export default Audit;
