import { Download, FileText } from "lucide-react";
import { formatEgp } from "../services/mock-reports-service";
import { ReportsData } from "../reports.types";
import csvNotice from "./csvNotice";

function AdminReportsBalancesTabs({ data }: { data: ReportsData }) {
    return (
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
                                    <code className="reports-invoice-id">
                                        {row.invoiceId}
                                    </code>
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
    );
}

export default AdminReportsBalancesTabs;
