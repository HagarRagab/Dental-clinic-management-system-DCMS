import { Dispatch, SetStateAction, useMemo } from "react";
import { Clock, Edit2 } from "lucide-react";
import { formatEgp } from "../services/mock-services-service";
import { AppointmentTypeConfig, ServicesStatusFilter } from "../services.types";

function AppointmentTemplates({
    appointmentTypes,
    searchQuery,
    statusFilter,
    setEditingApptType,
    setFeedback,
    setAppointmentTypes,
}: {
    appointmentTypes: AppointmentTypeConfig[];
    searchQuery: string;
    statusFilter: ServicesStatusFilter;
    setEditingApptType: Dispatch<SetStateAction<AppointmentTypeConfig | null>>;
    setFeedback: Dispatch<SetStateAction<string>>;
    setAppointmentTypes: Dispatch<SetStateAction<AppointmentTypeConfig[]>>;
}) {
    // Filtered Appointment Types
    const filteredAppointmentTypes = useMemo(() => {
        return appointmentTypes.filter((apt) => {
            const matchesSearch =
                apt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                apt.description
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());
            const matchesStatus =
                statusFilter === "all"
                    ? true
                    : statusFilter === "active"
                      ? apt.active
                      : !apt.active;
            return matchesSearch && matchesStatus;
        });
    }, [appointmentTypes, searchQuery, statusFilter]);

    // Appointment types handlers
    function toggleApptTypeActive(id: string) {
        setAppointmentTypes((prev) =>
            prev.map((a) => {
                if (a.id === id) {
                    const updated = !a.active;
                    setFeedback(
                        `Appointment template "${a.name}" marked as ${updated ? "active" : "inactive"}.`,
                    );
                    return { ...a, active: updated };
                }
                return a;
            }),
        );
    }

    return (
        <section
            className="services-card"
            aria-label="Appointment templates catalog"
        >
            <div className="services-table-wrapper">
                <table className="services-table">
                    <thead>
                        <tr>
                            <th>Color</th>
                            <th>Template name</th>
                            <th>Category</th>
                            <th>Default duration</th>
                            <th>Standard fee</th>
                            <th>Chair required</th>
                            <th>Status</th>
                            <th style={{ textAlign: "right" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAppointmentTypes.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="services-empty-cell">
                                    No appointment templates match your search
                                    filters.
                                </td>
                            </tr>
                        ) : (
                            filteredAppointmentTypes.map((apt) => (
                                <tr
                                    key={apt.id}
                                    className={
                                        !apt.active
                                            ? "services-row--inactive"
                                            : ""
                                    }
                                >
                                    <td>
                                        <span
                                            className="services-color-dot"
                                            style={{
                                                backgroundColor: apt.color,
                                            }}
                                            aria-label={`Color ${apt.color}`}
                                        />
                                    </td>
                                    <td>
                                        <div className="services-proc-name">
                                            <strong>{apt.name}</strong>
                                            {apt.description && (
                                                <small>{apt.description}</small>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <span className="services-category-pill">
                                            {apt.category}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="services-duration">
                                            <Clock aria-hidden="true" />{" "}
                                            {apt.defaultDurationMinutes} min
                                        </span>
                                    </td>
                                    <td>
                                        <strong className="services-price">
                                            {apt.defaultPrice > 0
                                                ? formatEgp(apt.defaultPrice)
                                                : "Free / No charge"}
                                        </strong>
                                    </td>
                                    <td>
                                        <span className="services-tooth-tag">
                                            {apt.requiresChair
                                                ? "Operatory chair"
                                                : "Desk consultation"}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            type="button"
                                            className={`services-toggle-btn ${
                                                apt.active
                                                    ? "services-toggle-btn--active"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                toggleApptTypeActive(apt.id)
                                            }
                                            aria-label={`Toggle ${apt.name} active status`}
                                        >
                                            {apt.active ? "Active" : "Inactive"}
                                        </button>
                                    </td>
                                    <td style={{ textAlign: "right" }}>
                                        <div className="services-row-actions">
                                            <button
                                                type="button"
                                                className="icon-button"
                                                aria-label={`Edit ${apt.name}`}
                                                onClick={() =>
                                                    setEditingApptType(apt)
                                                }
                                            >
                                                <Edit2 aria-hidden="true" />
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
                    Showing {filteredAppointmentTypes.length} of{" "}
                    {appointmentTypes.length} templates
                </span>
            </div>
        </section>
    );
}

export default AppointmentTemplates;
