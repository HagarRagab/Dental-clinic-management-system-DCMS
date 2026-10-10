import { Download, TrendingUp } from "lucide-react";
import { ReportsData } from "../reports.types";
import { formatEgp } from "../services/mock-reports-service";
import csvNotice from "./csvNotice";

function AdminReportsRevenueTab({
    data,
    totalPaid,
}: {
    data: ReportsData;
    totalPaid: number;
}) {
    return (
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
                                        {Math.round(
                                            (row.amount / totalPaid) * 100,
                                        )}
                                        %
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
    );
}

export default AdminReportsRevenueTab;
