import { Dispatch, JSX, SetStateAction } from "react";
import { ChevronRight, Search } from "lucide-react";
import { AuditEvent, AuditModule } from "../audit-logs.types";

function EventList({
    filtered,
    selectedId,
    setSelectedId,
    moduleIcon,
    resultClass,
    auditEvents,
}: {
    filtered: AuditEvent[];
    selectedId: string;
    setSelectedId: Dispatch<SetStateAction<string>>;
    moduleIcon: (module: AuditModule) => JSX.Element;
    resultClass: (
        result: AuditEvent["result"],
    ) =>
        | "audit-result--success"
        | "audit-result--denied"
        | "audit-result--warning";
    auditEvents: AuditEvent[];
}) {
    return (
        <section className="audit-list-panel" aria-label="Audit event list">
            {filtered.length === 0 ? (
                <div className="audit-empty">
                    <Search aria-hidden="true" />
                    <strong>No events match your filters</strong>
                    <span>
                        Try clearing the search or changing the module/result
                        filter.
                    </span>
                </div>
            ) : (
                <ul
                    className="audit-list"
                    role="listbox"
                    aria-label="Audit events"
                >
                    {filtered.map((ev) => (
                        <li
                            key={ev.id}
                            role="option"
                            aria-selected={ev.id === selectedId}
                        >
                            <button
                                type="button"
                                className={`audit-row${ev.id === selectedId ? " audit-row--selected" : ""}`}
                                onClick={() => setSelectedId(ev.id)}
                            >
                                <span
                                    className={`audit-row__module-icon audit-module--${ev.module.toLowerCase()}`}
                                >
                                    {moduleIcon(ev.module)}
                                </span>
                                <span className="audit-row__body">
                                    <span className="audit-row__action">
                                        {ev.action}
                                    </span>
                                    <span className="audit-row__meta">
                                        {ev.user} · {ev.module} · {ev.timestamp}
                                    </span>
                                </span>
                                <span
                                    className={`audit-result ${resultClass(ev.result)}`}
                                >
                                    {ev.result}
                                </span>
                                <ChevronRight
                                    aria-hidden="true"
                                    className="audit-row__chevron"
                                />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
            <p className="audit-list__count" aria-live="polite">
                Showing {filtered.length} of {auditEvents.length} events
            </p>
        </section>
    );
}

export default EventList;
