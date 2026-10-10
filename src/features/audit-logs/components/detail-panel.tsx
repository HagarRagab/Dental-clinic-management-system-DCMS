import { JSX } from "react";
import { AlertTriangle, BadgeCheck, Info, XCircle } from "lucide-react";
import { AuditEvent, AuditModule } from "../audit-logs.types";

function roleLabel(role: AuditEvent["userRole"]) {
    switch (role) {
        case "admin":
            return "Admin";
        case "receptionist":
            return "Receptionist";
        case "dentist":
            return "Dentist";
    }
}

function DetailPanel({
    moduleIcon,
    auditEvents,
    selectedId,
    filtered,
    resultClass,
}: {
    moduleIcon: (module: AuditModule) => JSX.Element;
    auditEvents: AuditEvent[];
    selectedId: string;
    filtered: AuditEvent[];
    resultClass: (
        result: AuditEvent["result"],
    ) =>
        | "audit-result--success"
        | "audit-result--denied"
        | "audit-result--warning";
}) {
    const selected =
        auditEvents.find((ev) => ev.id === selectedId) ?? filtered[0] ?? null;

    return (
        <aside className="audit-detail-panel" aria-label="Audit event detail">
            {selected ? (
                <>
                    <div className="audit-detail__header">
                        <span
                            className={`audit-detail__module-icon audit-module--${selected.module.toLowerCase()}`}
                        >
                            {moduleIcon(selected.module)}
                        </span>
                        <div>
                            <p className="panel-kicker">
                                {selected.module} · {selected.timestamp}
                            </p>
                            <h2>{selected.action}</h2>
                        </div>
                    </div>

                    <div
                        className={`audit-detail__result ${resultClass(selected.result)}`}
                    >
                        <strong>{selected.result}</strong>
                    </div>

                    <dl className="audit-detail-list">
                        <div>
                            <dt>User</dt>
                            <dd>
                                <strong>{selected.user}</strong>
                                <span className="audit-role-badge">
                                    {roleLabel(selected.userRole)}
                                </span>
                            </dd>
                        </div>
                        <div>
                            <dt>Entity</dt>
                            <dd>
                                {selected.entity}
                                {selected.entityId && (
                                    <small>{selected.entityId}</small>
                                )}
                            </dd>
                        </div>
                        <div>
                            <dt>Module</dt>
                            <dd>{selected.module}</dd>
                        </div>
                        <div>
                            <dt>Timestamp</dt>
                            <dd>{selected.timestamp}</dd>
                        </div>
                        {selected.ipAddress && (
                            <div>
                                <dt>IP address</dt>
                                <dd>
                                    <code className="audit-ip">
                                        {selected.ipAddress}
                                    </code>
                                </dd>
                            </div>
                        )}
                    </dl>

                    <div className="audit-detail__narrative">
                        <p className="panel-kicker">Event detail</p>
                        <p>{selected.detail}</p>
                    </div>

                    {selected.result === "Denied" && (
                        <div className="audit-detail__notice audit-detail__notice--denied">
                            <XCircle aria-hidden="true" />
                            <p>
                                This event was blocked by role-based access
                                control. No data was exposed.
                            </p>
                        </div>
                    )}
                    {selected.result === "Warning" && (
                        <div className="audit-detail__notice audit-detail__notice--warning">
                            <AlertTriangle aria-hidden="true" />
                            <p>
                                This event was permitted but flagged for Admin
                                review. Verify the action was intentional.
                            </p>
                        </div>
                    )}

                    <div className="audit-detail__immutability">
                        <BadgeCheck aria-hidden="true" />
                        <p>
                            Audit records are immutable. This entry cannot be
                            edited or deleted.
                        </p>
                    </div>
                </>
            ) : (
                <div className="audit-detail__empty">
                    <Info aria-hidden="true" />
                    <p>
                        Select an event from the list to view its full detail.
                    </p>
                </div>
            )}
        </aside>
    );
}

export default DetailPanel;
