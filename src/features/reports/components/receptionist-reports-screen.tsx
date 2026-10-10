import { Dispatch, SetStateAction } from "react";
import { CalendarCheck2, ClipboardList, Download, Users } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import type { UserRole } from "@/types";
import { dashboardUsers } from "@/features/dashboard/services/mock-dashboard-service";
import { ReportsData } from "../reports.types";
import csvNotice from "./csvNotice";

function ReceptionistReportsScreen({
    role,
    onRoleChange,
    data,
}: {
    role: UserRole;
    onRoleChange: Dispatch<SetStateAction<UserRole>>;
    data: ReportsData;
}) {
    return (
        <AppShell
            activeItem="Reports"
            role={role}
            userName={dashboardUsers[role]}
            onRoleChange={onRoleChange}
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
                        <small>
                            {data.todayAppointmentsRemaining} remaining today
                        </small>
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

            <section
                className="reports-panel"
                aria-label="Appointment breakdown"
            >
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
        </AppShell>
    );
}

export default ReceptionistReportsScreen;
