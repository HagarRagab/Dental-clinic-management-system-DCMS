"use client";

import {
  AlertTriangle,
  BadgeCheck,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  FileText,
  Globe,
  Info,
  Lock,
  Package,
  ReceiptText,
  Search,
  ShieldAlert,
  ShieldCheck,
  Stethoscope,
  X,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import type { UserRole } from "@/types";
import type { AuditEvent, AuditModule } from "@/features/audit-logs/audit-logs.types";
import { mockAuditEvents } from "@/features/audit-logs/services/mock-audit-logs-service";
import { dashboardUsers } from "@/features/dashboard/services/mock-dashboard-service";

type ModuleFilter = AuditModule | "All";
type ResultFilter = "All" | "Success" | "Denied" | "Warning";

function moduleIcon(module: AuditModule) {
  switch (module) {
    case "Clinical": return <Stethoscope aria-hidden="true" />;
    case "Billing": return <ReceiptText aria-hidden="true" />;
    case "Inventory": return <Package aria-hidden="true" />;
    case "Appointments": return <ClipboardList aria-hidden="true" />;
    case "Auth": return <Lock aria-hidden="true" />;
    case "Reports": return <FileText aria-hidden="true" />;
    case "Settings": return <Globe aria-hidden="true" />;
  }
}

function resultIcon(result: AuditEvent["result"]) {
  switch (result) {
    case "Success": return <CheckCircle2 aria-hidden="true" />;
    case "Denied": return <XCircle aria-hidden="true" />;
    case "Warning": return <AlertTriangle aria-hidden="true" />;
  }
}

function resultClass(result: AuditEvent["result"]) {
  switch (result) {
    case "Success": return "audit-result--success";
    case "Denied": return "audit-result--denied";
    case "Warning": return "audit-result--warning";
  }
}

function roleLabel(role: AuditEvent["userRole"]) {
  switch (role) {
    case "admin": return "Admin";
    case "receptionist": return "Receptionist";
    case "dentist": return "Dentist";
  }
}

const ALL_MODULES: ModuleFilter[] = ["All", "Clinical", "Billing", "Inventory", "Appointments", "Auth", "Reports", "Settings"];
const ALL_RESULTS: ResultFilter[] = ["All", "Success", "Warning", "Denied"];

export function AuditLogsScreen({ initialRole }: { initialRole: UserRole }) {
  const [role, setRole] = useState<UserRole>(initialRole);
  const [query, setQuery] = useState("");
  const [moduleFilter, setModuleFilter] = useState<ModuleFilter>("All");
  const [resultFilter, setResultFilter] = useState<ResultFilter>("All");
  const [selectedId, setSelectedId] = useState<string>(mockAuditEvents[0].id);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return mockAuditEvents.filter((ev) => {
      if (moduleFilter !== "All" && ev.module !== moduleFilter) return false;
      if (resultFilter !== "All" && ev.result !== resultFilter) return false;
      if (q && ![ev.action, ev.user, ev.entity, ev.module, ev.result]
        .join(" ").toLowerCase().includes(q)) return false;
      return true;
    });
  }, [query, moduleFilter, resultFilter]);

  const selected = mockAuditEvents.find((ev) => ev.id === selectedId) ?? filtered[0] ?? null;

  if (role !== "admin") {
    return (
      <AppShell activeItem="Audit logs" role={role} userName={dashboardUsers[role]} onRoleChange={setRole}>
        <section className="permission-state" aria-labelledby="audit-access-title">
          <span className="permission-state__icon"><ShieldAlert aria-hidden="true" /></span>
          <p className="page-heading__eyebrow">Restricted workspace</p>
          <h1 id="audit-access-title">Audit logs are admin-only</h1>
          <p>The audit log contains sensitive access and financial records. Only Admins may inspect audit events. Contact your system administrator if you believe you need access.</p>
        </section>
      </AppShell>
    );
  }

  return (
    <AppShell activeItem="Audit logs" role={role} userName={dashboardUsers[role]} onRoleChange={setRole}>
      <header className="page-heading">
        <div>
          <p className="page-heading__eyebrow">Compliance &amp; security</p>
          <h1>Audit logs</h1>
          <p>Immutable record of sensitive actions, access events, and administrative changes. Mock data — real persistence requires the backend.</p>
        </div>
      </header>

      {/* Summary chips */}
      <section className="audit-summary" aria-label="Event summary">
        {(["Success", "Warning", "Denied"] as const).map((r) => {
          const count = mockAuditEvents.filter((e) => e.result === r).length;
          return (
            <button
              key={r}
              type="button"
              className={`audit-chip audit-chip--${r.toLowerCase()}${resultFilter === r ? " audit-chip--active" : ""}`}
              onClick={() => setResultFilter(resultFilter === r ? "All" : r)}
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
          <strong>{mockAuditEvents.length}</strong>
          <span>Total events</span>
        </span>
      </section>

      {/* Toolbar */}
      <div className="audit-toolbar" role="search" aria-label="Filter audit events">
        <label className="audit-search">
          <Search aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by action, user, entity…"
            aria-label="Search audit events"
          />
        </label>
        <label className="audit-filter-label" aria-label="Filter by module">
          <span>Module</span>
          <select value={moduleFilter} onChange={(e) => setModuleFilter(e.target.value as ModuleFilter)} aria-label="Filter by module">
            {ALL_MODULES.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </label>
        <label className="audit-filter-label" aria-label="Filter by result">
          <span>Result</span>
          <select value={resultFilter} onChange={(e) => setResultFilter(e.target.value as ResultFilter)} aria-label="Filter by result">
            {ALL_RESULTS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </label>
        {(query || moduleFilter !== "All" || resultFilter !== "All") && (
          <button
            type="button"
            className="audit-clear"
            onClick={() => { setQuery(""); setModuleFilter("All"); setResultFilter("All"); }}
            aria-label="Clear filters"
          >
            <X aria-hidden="true" /> Clear
          </button>
        )}
      </div>

      <div className="audit-layout">
        {/* ── Event list ── */}
        <section className="audit-list-panel" aria-label="Audit event list">
          {filtered.length === 0 ? (
            <div className="audit-empty">
              <Search aria-hidden="true" />
              <strong>No events match your filters</strong>
              <span>Try clearing the search or changing the module/result filter.</span>
            </div>
          ) : (
            <ul className="audit-list" role="listbox" aria-label="Audit events">
              {filtered.map((ev) => (
                <li key={ev.id} role="option" aria-selected={ev.id === selectedId}>
                  <button
                    type="button"
                    className={`audit-row${ev.id === selectedId ? " audit-row--selected" : ""}`}
                    onClick={() => setSelectedId(ev.id)}
                  >
                    <span className={`audit-row__module-icon audit-module--${ev.module.toLowerCase()}`}>
                      {moduleIcon(ev.module)}
                    </span>
                    <span className="audit-row__body">
                      <span className="audit-row__action">{ev.action}</span>
                      <span className="audit-row__meta">
                        {ev.user} · {ev.module} · {ev.timestamp}
                      </span>
                    </span>
                    <span className={`audit-result ${resultClass(ev.result)}`}>
                      {resultIcon(ev.result)}
                      {ev.result}
                    </span>
                    <ChevronRight aria-hidden="true" className="audit-row__chevron" />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <p className="audit-list__count" aria-live="polite">
            Showing {filtered.length} of {mockAuditEvents.length} events
          </p>
        </section>

        {/* ── Detail panel ── */}
        <aside className="audit-detail-panel" aria-label="Audit event detail">
          {selected ? (
            <>
              <div className="audit-detail__header">
                <span className={`audit-detail__module-icon audit-module--${selected.module.toLowerCase()}`}>
                  {moduleIcon(selected.module)}
                </span>
                <div>
                  <p className="panel-kicker">{selected.module} · {selected.timestamp}</p>
                  <h2>{selected.action}</h2>
                </div>
              </div>

              <div className={`audit-detail__result ${resultClass(selected.result)}`}>
                {resultIcon(selected.result)}
                <strong>{selected.result}</strong>
              </div>

              <dl className="audit-detail-list">
                <div>
                  <dt>User</dt>
                  <dd>
                    <strong>{selected.user}</strong>
                    <span className="audit-role-badge">{roleLabel(selected.userRole)}</span>
                  </dd>
                </div>
                <div>
                  <dt>Entity</dt>
                  <dd>
                    {selected.entity}
                    {selected.entityId && <small>{selected.entityId}</small>}
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
                    <dd><code className="audit-ip">{selected.ipAddress}</code></dd>
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
                  <p>This event was blocked by role-based access control. No data was exposed.</p>
                </div>
              )}
              {selected.result === "Warning" && (
                <div className="audit-detail__notice audit-detail__notice--warning">
                  <AlertTriangle aria-hidden="true" />
                  <p>This event was permitted but flagged for Admin review. Verify the action was intentional.</p>
                </div>
              )}

              <div className="audit-detail__immutability">
                <BadgeCheck aria-hidden="true" />
                <p>Audit records are immutable. This entry cannot be edited or deleted.</p>
              </div>
            </>
          ) : (
            <div className="audit-detail__empty">
              <Info aria-hidden="true" />
              <p>Select an event from the list to view its full detail.</p>
            </div>
          )}
        </aside>
      </div>
    </AppShell>
  );
}
