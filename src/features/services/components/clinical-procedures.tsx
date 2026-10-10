import { Clock, Edit2, Trash2 } from "lucide-react";
import { Dispatch, SetStateAction, useMemo } from "react";
import {
    ClinicalProcedure,
    ServiceCategory,
    ServicesStatusFilter,
} from "../services.types";
import { formatEgp } from "../services/mock-services-service";

function ClinicalProcedures({
    procedures,
    searchQuery,
    selectedCategory,
    statusFilter,
    setProcedures,
    setFeedback,
    setEditingProcedure,
}: {
    procedures: ClinicalProcedure[];
    searchQuery: string;
    selectedCategory: ServiceCategory;
    statusFilter: ServicesStatusFilter;
    setProcedures: Dispatch<SetStateAction<ClinicalProcedure[]>>;
    setFeedback: Dispatch<SetStateAction<string>>;
    setEditingProcedure: Dispatch<SetStateAction<ClinicalProcedure | null>>;
}) {
    // Procedures handlers
    function toggleProcedureActive(id: string) {
        setProcedures((prev) =>
            prev.map((p) => {
                if (p.id === id) {
                    const updated = !p.active;
                    setFeedback(
                        `Procedure "${p.name}" marked as ${updated ? "active" : "inactive"}.`,
                    );
                    return { ...p, active: updated };
                }
                return p;
            }),
        );
    }

    function handleDeleteProcedure(id: string, name: string) {
        if (!confirm(`Are you sure you want to delete procedure "${name}"?`))
            return;
        setProcedures((prev) => prev.filter((p) => p.id !== id));
        setFeedback(`Procedure "${name}" removed from catalog.`);
    }

    // Filtered Procedures
    const filteredProcedures = useMemo(() => {
        return procedures.filter((proc) => {
            const matchesSearch =
                proc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                proc.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                proc.description
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());
            const matchesCategory =
                selectedCategory === "All" ||
                proc.category === selectedCategory;
            const matchesStatus =
                statusFilter === "all"
                    ? true
                    : statusFilter === "active"
                      ? proc.active
                      : !proc.active;
            return matchesSearch && matchesCategory && matchesStatus;
        });
    }, [procedures, searchQuery, selectedCategory, statusFilter]);

    return (
        <section
            className="services-card"
            aria-label="Clinical procedures catalog"
        >
            <div className="services-table-wrapper">
                <table className="services-table">
                    <thead>
                        <tr>
                            <th style={{ width: 100 }}>Code</th>
                            <th>Procedure name</th>
                            <th>Category</th>
                            <th>Duration</th>
                            <th>Default fee</th>
                            <th>Tooth target</th>
                            <th>Status</th>
                            <th style={{ textAlign: "right" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProcedures.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="services-empty-cell">
                                    No clinical procedures match your search
                                    filters.
                                </td>
                            </tr>
                        ) : (
                            filteredProcedures.map((proc) => (
                                <tr
                                    key={proc.id}
                                    className={
                                        !proc.active
                                            ? "services-row--inactive"
                                            : ""
                                    }
                                >
                                    <td>
                                        <code className="services-code-pill">
                                            {proc.code}
                                        </code>
                                    </td>
                                    <td>
                                        <div className="services-proc-name">
                                            <strong>{proc.name}</strong>
                                            {proc.description && (
                                                <small>
                                                    {proc.description}
                                                </small>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <span className="services-category-pill">
                                            {proc.category}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="services-duration">
                                            <Clock aria-hidden="true" />{" "}
                                            {proc.durationMinutes} min
                                        </span>
                                    </td>
                                    <td>
                                        <strong className="services-price">
                                            {formatEgp(proc.defaultPrice)}
                                        </strong>
                                    </td>
                                    <td>
                                        <span className="services-tooth-tag">
                                            {proc.requiresToothTarget
                                                ? "Specific tooth"
                                                : "General arch"}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            type="button"
                                            className={`services-toggle-btn ${
                                                proc.active
                                                    ? "services-toggle-btn--active"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                toggleProcedureActive(proc.id)
                                            }
                                            aria-label={`Toggle ${proc.name} active status`}
                                        >
                                            {proc.active
                                                ? "Active"
                                                : "Inactive"}
                                        </button>
                                    </td>
                                    <td style={{ textAlign: "right" }}>
                                        <div className="services-row-actions">
                                            <button
                                                type="button"
                                                className="icon-button"
                                                aria-label={`Edit ${proc.name}`}
                                                onClick={() =>
                                                    setEditingProcedure(proc)
                                                }
                                            >
                                                <Edit2 aria-hidden="true" />
                                            </button>
                                            <button
                                                type="button"
                                                className="icon-button services-delete-btn"
                                                aria-label={`Delete ${proc.name}`}
                                                onClick={() =>
                                                    handleDeleteProcedure(
                                                        proc.id,
                                                        proc.name,
                                                    )
                                                }
                                            >
                                                <Trash2 aria-hidden="true" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <div className="services-footer-bar">
                <span>
                    Showing {filteredProcedures.length} of {procedures.length}{" "}
                    procedures
                </span>
            </div>
        </section>
    );
}

export default ClinicalProcedures;
