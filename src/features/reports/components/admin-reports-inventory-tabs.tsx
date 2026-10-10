import { AlertTriangle, Download, FileText, FileWarning } from "lucide-react";
import csvNotice from "./csvNotice";
import { ReportsData } from "../reports.types";

function alertStatusClass(status: "Low stock" | "Out of stock" | "Expiring") {
    if (status === "Out of stock") return "reports-alert--error";
    if (status === "Expiring") return "reports-alert--warning";
    return "reports-alert--caution";
}

function AdminReportsInventoryTabs({ data }: { data: ReportsData }) {
    return (
        <section className="reports-panel" aria-label="Inventory alerts report">
            <div className="panel-header">
                <div>
                    <h2>Inventory alerts</h2>
                    <p>
                        Items below minimum stock, out of stock, or approaching
                        expiry
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
                Stock levels shown are from the current mock inventory state.
                Visit the Inventory workspace to record adjustments.
            </p>
        </section>
    );
}

export default AdminReportsInventoryTabs;
