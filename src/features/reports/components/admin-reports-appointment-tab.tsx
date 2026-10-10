import { Download, FileText } from "lucide-react";
import { ReportsData } from "../reports.types";
import csvNotice from "./csvNotice";

function AdminReportsAppointmentTab({ data }: { data: ReportsData }) {
    return (
        <section className="reports-panel" aria-label="Appointment details">
            <div className="panel-header">
                <div>
                    <h2>Appointment status breakdown</h2>
                    <p>Full today&#39;s schedule detail — {data.todayDate}</p>
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
                                            style={{
                                                width: `${row.percentage}%`,
                                            }}
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
                Completed/cancelled/no-show counts reflect today&#39;s
                appointments only. Historical reporting is available after
                backend implementation.
            </p>
        </section>
    );
}

export default AdminReportsAppointmentTab;
