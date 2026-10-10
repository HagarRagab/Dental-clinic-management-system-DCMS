import {
    AlertTriangle,
    BarChart2,
    CalendarCheck2,
    CircleDollarSign,
    Wallet,
} from "lucide-react";
import { ReportsData } from "../reports.types";
import { formatEgp } from "../services/mock-reports-service";

function AdminReportsOverviewTab({
    data,
    totalPaid,
}: {
    data: ReportsData;
    totalPaid: number;
}) {
    return (
        <>
            <section className="reports-metrics" aria-label="Key metrics">
                <article>
                    <span className="reports-metric__icon reports-metric__icon--primary">
                        <CalendarCheck2 aria-hidden="true" />
                    </span>
                    <div>
                        <span>Today&#39;s appointments</span>
                        <strong>{data.todayAppointmentsTotal}</strong>
                        <small>
                            {data.todayAppointmentsRemaining} remaining
                        </small>
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
                <section
                    className="reports-panel"
                    aria-label="Appointment summary"
                >
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
                                                    style={{
                                                        width: `${row.percentage}%`,
                                                    }}
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
                                                    {Math.round(
                                                        (row.amount /
                                                            totalPaid) *
                                                            100,
                                                    )}
                                                    %
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
    );
}

export default AdminReportsOverviewTab;
