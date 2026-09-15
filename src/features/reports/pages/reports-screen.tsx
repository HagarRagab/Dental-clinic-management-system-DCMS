"use client";

import {
  AlertTriangle,
  BarChart2,
  CalendarCheck2,
  CircleDollarSign,
  ClipboardList,
  Download,
  FileText,
  FileWarning,
  ShieldAlert,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import type { UserRole } from "@/types";
import {
  formatEgp,
  mockReportsData,
} from "@/features/reports/services/mock-reports-service";
import { dashboardUsers } from "@/features/dashboard/services/mock-dashboard-service";

type ReportSection =
  | "Overview"
  | "Appointments"
  | "Revenue"
  | "Balances"
  | "Inventory";

function csvNotice() {
  alert(
    "CSV export is a mock affordance. Real export will be available once the backend is implemented.",
  );
}

function alertStatusClass(
  status: "Low stock" | "Out of stock" | "Expiring",
) {
  if (status === "Out of stock") return "reports-alert--error";
  if (status === "Expiring") return "reports-alert--warning";
  return "reports-alert--caution";
}

export function ReportsScreen({ initialRole }: { initialRole: UserRole }) {
  const [role, setRole] = useState<UserRole>(initialRole);
  const [activeSection, setActiveSection] =
    useState<ReportSection>("Overview");

  const data = mockReportsData;
  const totalPaid = data.paymentMethods.reduce(
    (sum, row) => sum + row.amount,
    0,
  );

  if (role === "dentist") {
    return (
      <AppShell
        activeItem="Reports"
        role={role}
        userName={dashboardUsers[role]}
        onRoleChange={setRole}
      >
        <section
          className="permission-state"
          aria-labelledby="reports-access-title"
        >
          <span className="permission-state__icon">
            <ShieldAlert aria-hidden="true" />
          </span>
          <p className="page-heading__eyebrow">Restricted workspace</p>
          <h1 id="reports-access-title">Reports are not available</h1>
          <p>
            Operational and financial reports are available to Admins and
            authorised staff. Clinical summaries are part of the clinical
            workspace, not this reports module.
          </p>
        </section>
      </AppShell>
    );
  }

  if (role === "receptionist") {
    return (
      <AppShell
        activeItem="Reports"
        role={role}
        userName={dashboardUsers[role]}
        onRoleChange={setRole}
      >
        <header className="page-heading">
          <div>
            <p className="page-heading__eyebrow">Daily summary</p>
            <h1>Today&#39;s appointment overview</h1>
            <p>
              Receptionist view — today&#39;s schedule snapshot for{" "}
              {data.todayDate}.
            </p>
          </div>
        </header>

        <section className="reports-metrics" aria-label="Today's summary">
          <article>
            <span className="reports-metric__icon reports-metric__icon--primary">
              <CalendarCheck2 aria-hidden="true" />
            </span>
            <div>
              <span>Total appointments</span>
              <strong>{data.todayAppointmentsTotal}</strong>
              <small>{data.todayAppointmentsRemaining} remaining today</small>
            </div>
          </article>
          <article>
            <span className="reports-metric__icon reports-metric__icon--success">
              <ClipboardList aria-hidden="true" />
            </span>
            <div>
              <span>Completed visits</span>
              <strong>
                {
                  data.appointmentSummary.find(
                    (row) => row.status === "Completed",
                  )?.count
                }
              </strong>
              <small>
                {
                  data.appointmentSummary.find(
                    (row) => row.status === "Completed",
                  )?.percentage
                }
                % of schedule
              </small>
            </div>
          </article>
          <article>
            <span className="reports-metric__icon reports-metric__icon--warning">
              <Users aria-hidden="true" />
            </span>
            <div>
              <span>No-shows</span>
              <strong>
                {
                  data.appointmentSummary.find(
                    (row) => row.status === "No-show",
                  )?.count
                }
              </strong>
              <small>
                {
                  data.appointmentSummary.find(
                    (row) => row.status === "No-show",
                  )?.percentage
                }
                % of schedule
              </small>
            </div>
          </article>
        </section>

        <section className="reports-panel" aria-label="Appointment breakdown">
          <div className="panel-header">
            <div>
              <h2>Appointment status breakdown</h2>
              <p>Today&#39;s schedule by outcome</p>
            </div>
            <button
              type="button"
              className="button button--secondary"
              onClick={csvNotice}
              aria-label="Export appointments CSV (mock)"
            >
              <Download aria-hidden="true" />
              Export CSV
            </button>
          </div>
          <div className="reports-table-wrap">
            <table className="reports-table">
              <thead>
                <tr>
                  <th scope="col">Status</th>
                  <th scope="col">Count</th>
                  <th scope="col">Share</th>
                </tr>
              </thead>
              <tbody>
                {data.appointmentSummary.map((row) => (
                  <tr key={row.status}>
                    <td>
                      <span
                        className={`reports-appt-status reports-appt-status--${row.status.toLowerCase().replace("-", "")}`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td>
                      <strong>{row.count}</strong>
                    </td>
                    <td>
                      <div className="reports-bar-cell">
                        <div
                          className="reports-bar"
                          style={{ width: `${row.percentage}%` }}
                          aria-label={`${row.percentage}%`}
                        />
                        <span>{row.percentage}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </AppShell>
    );
  }

  // Admin full reports view
  const sections: ReportSection[] = [
    "Overview",
    "Appointments",
    "Revenue",
    "Balances",
    "Inventory",
  ];

  return (
    <AppShell
      activeItem="Reports"
      role={role}
      userName={dashboardUsers[role]}
      onRoleChange={setRole}
    >
      <header className="page-heading reports-heading">
        <div>
          <p className="page-heading__eyebrow">Operational &amp; financial</p>
          <h1>Reports</h1>
          <p>
            Branch summary for {data.todayDate}. All figures are mock data for
            prototype review.
          </p>
        </div>
        <button
          type="button"
          className="button button--secondary"
          onClick={csvNotice}
          aria-label="Export current report as CSV (mock)"
        >
          <Download aria-hidden="true" />
          Export CSV
        </button>
      </header>

      {/* Section tabs */}
      <div
        className="reports-tabs"
        role="tablist"
        aria-label="Report sections"
      >
        {sections.map((section) => (
          <button
            key={section}
            type="button"
            role="tab"
            aria-selected={activeSection === section}
            className={
              activeSection === section ? "reports-tab--active" : ""
            }
            onClick={() => setActiveSection(section)}
          >
            {section}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {activeSection === "Overview" && (
        <>
          <section className="reports-metrics" aria-label="Key metrics">
            <article>
              <span className="reports-metric__icon reports-metric__icon--primary">
                <CalendarCheck2 aria-hidden="true" />
              </span>
              <div>
                <span>Today&#39;s appointments</span>
                <strong>{data.todayAppointmentsTotal}</strong>
                <small>{data.todayAppointmentsRemaining} remaining</small>
              </div>
            </article>
            <article>
              <span className="reports-metric__icon reports-metric__icon--success">
                <CircleDollarSign aria-hidden="true" />
              </span>
              <div>
                <span>Today&#39;s revenue</span>
                <strong>{formatEgp(data.todayRevenue)}</strong>
                <small>Collected today</small>
              </div>
            </article>
            <article>
              <span className="reports-metric__icon reports-metric__icon--warning">
                <Wallet aria-hidden="true" />
              </span>
              <div>
                <span>Outstanding balances</span>
                <strong>{formatEgp(data.outstandingRevenue)}</strong>
                <small>{data.patientBalances.length} patients</small>
              </div>
            </article>
            <article>
              <span className="reports-metric__icon reports-metric__icon--error">
                <AlertTriangle aria-hidden="true" />
              </span>
              <div>
                <span>Inventory alerts</span>
                <strong>{data.inventoryAlerts.length}</strong>
                <small>Items needing review</small>
              </div>
            </article>
          </section>

          <div className="reports-two-col">
            {/* Appointment summary */}
            <section className="reports-panel" aria-label="Appointment summary">
              <div className="panel-header">
                <div>
                  <h2>Appointment outcomes</h2>
                  <p>Today&#39;s schedule by status</p>
                </div>
                <BarChart2 aria-hidden="true" />
              </div>
              <div className="reports-table-wrap">
                <table className="reports-table">
                  <thead>
                    <tr>
                      <th scope="col">Status</th>
                      <th scope="col">Count</th>
                      <th scope="col">Share</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.appointmentSummary.map((row) => (
                      <tr key={row.status}>
                        <td>
                          <span
                            className={`reports-appt-status reports-appt-status--${row.status.toLowerCase().replace("-", "")}`}
                          >
                            {row.status}
                          </span>
                        </td>
                        <td>
                          <strong>{row.count}</strong>
                        </td>
                        <td>
                          <div className="reports-bar-cell">
                            <div
                              className="reports-bar"
                              style={{ width: `${row.percentage}%` }}
                              aria-label={`${row.percentage}%`}
                            />
                            <span>{row.percentage}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Payment method summary */}
            <section className="reports-panel" aria-label="Payment methods">
              <div className="panel-header">
                <div>
                  <h2>Payment method summary</h2>
                  <p>Revenue by collection method</p>
                </div>
                <CircleDollarSign aria-hidden="true" />
              </div>
              <div className="reports-table-wrap">
                <table className="reports-table">
                  <thead>
                    <tr>
                      <th scope="col">Method</th>
                      <th scope="col">Transactions</th>
                      <th scope="col">Amount</th>
                      <th scope="col">Share</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.paymentMethods.map((row) => (
                      <tr key={row.method}>
                        <td>
                          <strong>{row.method}</strong>
                        </td>
                        <td>{row.count}</td>
                        <td>{formatEgp(row.amount)}</td>
                        <td>
                          <div className="reports-bar-cell">
                            <div
                              className="reports-bar reports-bar--teal"
                              style={{
                                width: `${Math.round((row.amount / totalPaid) * 100)}%`,
                              }}
                              aria-label={`${Math.round((row.amount / totalPaid) * 100)}%`}
                            />
                            <span>
                              {Math.round((row.amount / totalPaid) * 100)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={2}>
                        <strong>Total collected</strong>
                      </td>
                      <td colSpan={2}>
                        <strong>{formatEgp(totalPaid)}</strong>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </section>
          </div>
        </>
      )}

      {/* ── APPOINTMENTS ── */}
      {activeSection === "Appointments" && (
        <section className="reports-panel" aria-label="Appointment details">
          <div className="panel-header">
            <div>
              <h2>Appointment status breakdown</h2>
              <p>
                Full today&#39;s schedule detail — {data.todayDate}
              </p>
            </div>
            <button
              type="button"
              className="button button--secondary"
              onClick={csvNotice}
              aria-label="Export appointments CSV (mock)"
            >
              <Download aria-hidden="true" />
              Export CSV
            </button>
          </div>
          <div className="reports-table-wrap">
            <table className="reports-table">
              <thead>
                <tr>
                  <th scope="col">Status</th>
                  <th scope="col">Count</th>
                  <th scope="col">% of today</th>
                  <th scope="col">Visual share</th>
                </tr>
              </thead>
              <tbody>
                {data.appointmentSummary.map((row) => (
                  <tr key={row.status}>
                    <td>
                      <span
                        className={`reports-appt-status reports-appt-status--${row.status.toLowerCase().replace("-", "")}`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td>
                      <strong>{row.count}</strong>
                    </td>
                    <td>{row.percentage}%</td>
                    <td>
                      <div className="reports-bar-cell">
                        <div
                          className="reports-bar"
                          style={{ width: `${row.percentage}%` }}
                          aria-label={`${row.percentage}%`}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
                <tr className="reports-table__total">
                  <td>
                    <strong>Total</strong>
                  </td>
                  <td>
                    <strong>{data.todayAppointmentsTotal}</strong>
                  </td>
                  <td>100%</td>
                  <td />
                </tr>
              </tbody>
            </table>
          </div>
          <p className="reports-note">
            <FileText aria-hidden="true" />
            Completed/cancelled/no-show counts reflect today&#39;s appointments
            only. Historical reporting is available after backend implementation.
          </p>
        </section>
      )}

      {/* ── REVENUE ── */}
      {activeSection === "Revenue" && (
        <>
          <div className="reports-two-col">
            {/* Revenue by dentist */}
            <section
              className="reports-panel"
              aria-label="Revenue by dentist"
            >
              <div className="panel-header">
                <div>
                  <h2>Revenue by dentist</h2>
                  <p>Today&#39;s collected revenue per provider</p>
                </div>
                <button
                  type="button"
                  className="button button--secondary"
                  onClick={csvNotice}
                  aria-label="Export dentist revenue CSV (mock)"
                >
                  <Download aria-hidden="true" />
                  Export
                </button>
              </div>
              <div className="reports-table-wrap">
                <table className="reports-table">
                  <thead>
                    <tr>
                      <th scope="col">Dentist</th>
                      <th scope="col">Completed</th>
                      <th scope="col">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.dentistRevenue.map((row) => (
                      <tr key={row.dentist}>
                        <td>
                          <strong>{row.dentist}</strong>
                        </td>
                        <td>{row.completed} visits</td>
                        <td>{formatEgp(row.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td>
                        <strong>Total</strong>
                      </td>
                      <td>
                        <strong>
                          {data.dentistRevenue.reduce(
                            (s, r) => s + r.completed,
                            0,
                          )}{" "}
                          visits
                        </strong>
                      </td>
                      <td>
                        <strong>
                          {formatEgp(
                            data.dentistRevenue.reduce(
                              (s, r) => s + r.revenue,
                              0,
                            ),
                          )}
                        </strong>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </section>

            {/* Revenue by treatment */}
            <section
              className="reports-panel"
              aria-label="Revenue by treatment"
            >
              <div className="panel-header">
                <div>
                  <h2>Revenue by treatment</h2>
                  <p>Top services by collected revenue</p>
                </div>
                <button
                  type="button"
                  className="button button--secondary"
                  onClick={csvNotice}
                  aria-label="Export treatment revenue CSV (mock)"
                >
                  <Download aria-hidden="true" />
                  Export
                </button>
              </div>
              <div className="reports-table-wrap">
                <table className="reports-table">
                  <thead>
                    <tr>
                      <th scope="col">Treatment / service</th>
                      <th scope="col">Count</th>
                      <th scope="col">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.treatmentRevenue.map((row) => (
                      <tr key={row.treatment}>
                        <td>
                          <strong>{row.treatment}</strong>
                        </td>
                        <td>{row.count}</td>
                        <td>{formatEgp(row.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Payment method breakdown */}
          <section className="reports-panel" aria-label="Payment methods">
            <div className="panel-header">
              <div>
                <h2>Payment method summary</h2>
                <p>Revenue split by collection method</p>
              </div>
              <TrendingUp aria-hidden="true" />
            </div>
            <div className="reports-table-wrap">
              <table className="reports-table">
                <thead>
                  <tr>
                    <th scope="col">Method</th>
                    <th scope="col">Transactions</th>
                    <th scope="col">Amount collected</th>
                    <th scope="col">% of total</th>
                  </tr>
                </thead>
                <tbody>
                  {data.paymentMethods.map((row) => (
                    <tr key={row.method}>
                      <td>
                        <strong>{row.method}</strong>
                      </td>
                      <td>{row.count}</td>
                      <td>{formatEgp(row.amount)}</td>
                      <td>
                        {Math.round((row.amount / totalPaid) * 100)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={2}>
                      <strong>Total</strong>
                    </td>
                    <td>
                      <strong>{formatEgp(totalPaid)}</strong>
                    </td>
                    <td>100%</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>
        </>
      )}

      {/* ── BALANCES ── */}
      {activeSection === "Balances" && (
        <section
          className="reports-panel"
          aria-label="Outstanding patient balances"
        >
          <div className="panel-header">
            <div>
              <h2>Outstanding patient balances</h2>
              <p>
                Patients with unpaid or partially paid invoices as of{" "}
                {data.todayDate}
              </p>
            </div>
            <button
              type="button"
              className="button button--secondary"
              onClick={csvNotice}
              aria-label="Export balances CSV (mock)"
            >
              <Download aria-hidden="true" />
              Export CSV
            </button>
          </div>
          <div className="reports-table-wrap">
            <table className="reports-table">
              <thead>
                <tr>
                  <th scope="col">Patient</th>
                  <th scope="col">Invoice</th>
                  <th scope="col">Last visit</th>
                  <th scope="col">Outstanding</th>
                </tr>
              </thead>
              <tbody>
                {data.patientBalances.map((row) => (
                  <tr key={row.invoiceId}>
                    <td>
                      <strong>{row.patient}</strong>
                    </td>
                    <td>
                      <code className="reports-invoice-id">{row.invoiceId}</code>
                    </td>
                    <td>{row.lastVisit}</td>
                    <td>
                      <strong className="reports-balance">
                        {formatEgp(row.balance)}
                      </strong>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3}>
                    <strong>Total outstanding</strong>
                  </td>
                  <td>
                    <strong>
                      {formatEgp(
                        data.patientBalances.reduce(
                          (s, r) => s + r.balance,
                          0,
                        ),
                      )}
                    </strong>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          <p className="reports-note">
            <FileText aria-hidden="true" />
            Balance figures reflect the current mock data state. Real-time
            balances require backend integration.
          </p>
        </section>
      )}

      {/* ── INVENTORY ── */}
      {activeSection === "Inventory" && (
        <section
          className="reports-panel"
          aria-label="Inventory alerts report"
        >
          <div className="panel-header">
            <div>
              <h2>Inventory alerts</h2>
              <p>
                Items below minimum stock, out of stock, or approaching expiry
              </p>
            </div>
            <button
              type="button"
              className="button button--secondary"
              onClick={csvNotice}
              aria-label="Export inventory alerts CSV (mock)"
            >
              <Download aria-hidden="true" />
              Export CSV
            </button>
          </div>
          {data.inventoryAlerts.length === 0 ? (
            <p className="reports-empty">
              All tracked items are within safe levels.
            </p>
          ) : (
            <div className="reports-table-wrap">
              <table className="reports-table">
                <thead>
                  <tr>
                    <th scope="col">Item</th>
                    <th scope="col">Alert</th>
                    <th scope="col">Current stock</th>
                    <th scope="col">Supplier</th>
                  </tr>
                </thead>
                <tbody>
                  {data.inventoryAlerts.map((row, index) => (
                    <tr key={`${row.name}-${index}`}>
                      <td>
                        <strong>{row.name}</strong>
                      </td>
                      <td>
                        <span
                          className={`reports-alert-badge ${alertStatusClass(row.status)}`}
                        >
                          {row.status === "Out of stock" ? (
                            <AlertTriangle aria-hidden="true" />
                          ) : row.status === "Expiring" ? (
                            <FileWarning aria-hidden="true" />
                          ) : (
                            <AlertTriangle aria-hidden="true" />
                          )}
                          {row.status}
                        </span>
                      </td>
                      <td>
                        {row.currentStock} {row.unit}
                      </td>
                      <td>{row.supplier}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p className="reports-note">
            <FileText aria-hidden="true" />
            Stock levels shown are from the current mock inventory state. Visit
            the Inventory workspace to record adjustments.
          </p>
        </section>
      )}
    </AppShell>
  );
}
