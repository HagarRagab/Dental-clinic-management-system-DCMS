import {
    AlertTriangle,
    CheckCircle2,
    ShieldCheck,
    XCircle,
} from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { AuditEvent, AuditResultFilter } from "../audit-logs.types";

function resultIcon(result: AuditEvent["result"]) {
    switch (result) {
        case "Success":
            return <CheckCircle2 aria-hidden="true" />;
        case "Denied":
            return <XCircle aria-hidden="true" />;
        case "Warning":
            return <AlertTriangle aria-hidden="true" />;
    }
}

function SummaryChips({
    auditEvents,
    resultFilter,
    setResultFilter,
}: {
    auditEvents: AuditEvent[];
    resultFilter: AuditResultFilter;
    setResultFilter: Dispatch<SetStateAction<AuditResultFilter>>;
}) {
    return (
        <section className="audit-summary" aria-label="Event summary">
            {(["Success", "Warning", "Denied"] as const).map((r) => {
                const count = auditEvents.filter((e) => e.result === r).length;
                return (
                    <button
                        key={r}
                        type="button"
                        className={`audit-chip audit-chip--${r.toLowerCase()}${resultFilter === r ? " audit-chip--active" : ""}`}
                        onClick={() =>
                            setResultFilter(resultFilter === r ? "All" : r)
                        }
                        aria-pressed={resultFilter === r}
                    >
                        {resultIcon(r)}
                        <strong>{count}</strong>
                        <span>{r}</span>
                    </button>
                );
            })}
            <span className="audit-chip audit-chip--total">
                <ShieldCheck aria-hidden="true" />
                <strong>{auditEvents.length}</strong>
                <span>Total events</span>
            </span>
        </section>
    );
}

export default SummaryChips;
