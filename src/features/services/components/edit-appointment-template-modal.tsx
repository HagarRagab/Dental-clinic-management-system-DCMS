import { Edit2, X } from "lucide-react";
import { Dispatch, SetStateAction, SubmitEvent } from "react";
import { AppointmentTypeConfig } from "../services.types";

function EditAppointmentTemplateModal({
    editingApptType,
    setAppointmentTypes,
    setFeedback,
    setEditingApptType,
}: {
    editingApptType: AppointmentTypeConfig;
    setAppointmentTypes: Dispatch<SetStateAction<AppointmentTypeConfig[]>>;
    setFeedback: Dispatch<SetStateAction<string>>;
    setEditingApptType: Dispatch<SetStateAction<AppointmentTypeConfig | null>>;
}) {
    function handleSaveEditApptType(e: SubmitEvent) {
        e.preventDefault();
        if (!editingApptType) return;

        setAppointmentTypes((prev) =>
            prev.map((a) =>
                a.id === editingApptType.id ? editingApptType : a,
            ),
        );
        setFeedback(`Appointment template "${editingApptType.name}" updated.`);
        setEditingApptType(null);
    }

    return (
        <div
            className="services-modal-backdrop"
            role="dialog"
            aria-modal="true"
        >
            <form className="services-modal" onSubmit={handleSaveEditApptType}>
                <div className="services-modal__header">
                    <span className="services-modal__icon">
                        <Edit2 aria-hidden="true" />
                    </span>
                    <div>
                        <h2>Edit Template ({editingApptType.name})</h2>
                        <p>
                            Modify slot duration, standard fee, or calendar
                            color
                        </p>
                    </div>
                    <button
                        type="button"
                        className="icon-button"
                        style={{ marginLeft: "auto" }}
                        onClick={() => setEditingApptType(null)}
                        aria-label="Close modal"
                    >
                        <X aria-hidden="true" />
                    </button>
                </div>
                <div className="services-modal__body">
                    <div>
                        <label className="services-field-label">
                            Template Name
                        </label>
                        <input
                            type="text"
                            className="text-input"
                            value={editingApptType.name}
                            onChange={(e) =>
                                setEditingApptType({
                                    ...editingApptType,
                                    name: e.target.value,
                                })
                            }
                            required
                        />
                    </div>

                    <div
                        className="services-form-grid-2"
                        style={{ marginTop: 12 }}
                    >
                        <div>
                            <label className="services-field-label">
                                Duration (Minutes)
                            </label>
                            <input
                                type="number"
                                className="text-input"
                                value={editingApptType.defaultDurationMinutes}
                                onChange={(e) =>
                                    setEditingApptType({
                                        ...editingApptType,
                                        defaultDurationMinutes: Number(
                                            e.target.value,
                                        ),
                                    })
                                }
                                min={10}
                                step={5}
                                required
                            />
                        </div>
                        <div>
                            <label className="services-field-label">
                                Standard Fee (EGP)
                            </label>
                            <input
                                type="number"
                                className="text-input"
                                value={editingApptType.defaultPrice}
                                onChange={(e) =>
                                    setEditingApptType({
                                        ...editingApptType,
                                        defaultPrice: Number(e.target.value),
                                    })
                                }
                                min={0}
                                step={50}
                                required
                            />
                        </div>
                    </div>

                    <div
                        className="services-form-grid-2"
                        style={{ marginTop: 12 }}
                    >
                        <div>
                            <label className="services-field-label">
                                Calendar Badge Color
                            </label>
                            <input
                                type="color"
                                className="text-input"
                                style={{ padding: 4, height: 42 }}
                                value={editingApptType.color}
                                onChange={(e) =>
                                    setEditingApptType({
                                        ...editingApptType,
                                        color: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div>
                            <label className="services-field-label">
                                Category
                            </label>
                            <input
                                type="text"
                                className="text-input"
                                value={editingApptType.category}
                                onChange={(e) =>
                                    setEditingApptType({
                                        ...editingApptType,
                                        category: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>
                    </div>

                    <div style={{ marginTop: 12 }}>
                        <label className="services-field-label">
                            Description
                        </label>
                        <textarea
                            className="text-input"
                            style={{ minHeight: 60, paddingTop: 8 }}
                            value={editingApptType.description}
                            onChange={(e) =>
                                setEditingApptType({
                                    ...editingApptType,
                                    description: e.target.value,
                                })
                            }
                        />
                    </div>
                </div>
                <div className="services-modal__actions">
                    <button
                        type="button"
                        className="button button--secondary"
                        onClick={() => setEditingApptType(null)}
                    >
                        Cancel
                    </button>
                    <button type="submit" className="button button--primary">
                        Save changes
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditAppointmentTemplateModal;
