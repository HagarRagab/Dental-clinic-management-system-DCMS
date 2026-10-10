import { Dispatch, SetStateAction, SubmitEvent } from "react";
import { Edit2, X } from "lucide-react";
import { ClinicalProcedure } from "../services.types";

function EditProcedureModal({
    editingProcedure,
    setProcedures,
    setFeedback,
    setEditingProcedure,
}: {
    editingProcedure: ClinicalProcedure;
    setProcedures: Dispatch<SetStateAction<ClinicalProcedure[]>>;
    setFeedback: Dispatch<SetStateAction<string>>;
    setEditingProcedure: Dispatch<SetStateAction<ClinicalProcedure | null>>;
}) {
    function handleSaveEditProcedure(e: SubmitEvent) {
        e.preventDefault();
        if (!editingProcedure) return;

        setProcedures((prev) =>
            prev.map((p) =>
                p.id === editingProcedure.id ? editingProcedure : p,
            ),
        );
        setFeedback(
            `Procedure "${editingProcedure.name}" updated successfully.`,
        );
        setEditingProcedure(null);
    }

    return (
        <div
            className="services-modal-backdrop"
            role="dialog"
            aria-modal="true"
        >
            <form className="services-modal" onSubmit={handleSaveEditProcedure}>
                <div className="services-modal__header">
                    <span className="services-modal__icon">
                        <Edit2 aria-hidden="true" />
                    </span>
                    <div>
                        <h2>Edit Procedure ({editingProcedure.code})</h2>
                        <p>
                            Modify procedure name, fee, or clinical requirements
                        </p>
                    </div>
                    <button
                        type="button"
                        className="icon-button"
                        style={{ marginLeft: "auto" }}
                        onClick={() => setEditingProcedure(null)}
                        aria-label="Close modal"
                    >
                        <X aria-hidden="true" />
                    </button>
                </div>
                <div className="services-modal__body">
                    <div>
                        <label className="services-field-label">
                            Procedure Name
                        </label>
                        <input
                            type="text"
                            className="text-input"
                            value={editingProcedure.name}
                            onChange={(e) =>
                                setEditingProcedure({
                                    ...editingProcedure,
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
                                Default Fee (EGP)
                            </label>
                            <input
                                type="number"
                                className="text-input"
                                value={editingProcedure.defaultPrice}
                                onChange={(e) =>
                                    setEditingProcedure({
                                        ...editingProcedure,
                                        defaultPrice: Number(e.target.value),
                                    })
                                }
                                min={0}
                                step={50}
                                required
                            />
                        </div>
                        <div>
                            <label className="services-field-label">
                                Duration (Minutes)
                            </label>
                            <input
                                type="number"
                                className="text-input"
                                value={editingProcedure.durationMinutes}
                                onChange={(e) =>
                                    setEditingProcedure({
                                        ...editingProcedure,
                                        durationMinutes: Number(e.target.value),
                                    })
                                }
                                min={5}
                                step={5}
                                required
                            />
                        </div>
                    </div>

                    <div style={{ marginTop: 12 }}>
                        <label className="services-field-label">
                            Clinical Description
                        </label>
                        <textarea
                            className="text-input"
                            style={{ minHeight: 70, paddingTop: 8 }}
                            value={editingProcedure.description}
                            onChange={(e) =>
                                setEditingProcedure({
                                    ...editingProcedure,
                                    description: e.target.value,
                                })
                            }
                        />
                    </div>

                    <div style={{ marginTop: 14 }}>
                        <label className="checkbox-row">
                            <input
                                type="checkbox"
                                checked={editingProcedure.requiresToothTarget}
                                onChange={(e) =>
                                    setEditingProcedure({
                                        ...editingProcedure,
                                        requiresToothTarget: e.target.checked,
                                    })
                                }
                            />
                            <span>
                                Requires specific tooth selection on odontogram
                            </span>
                        </label>
                    </div>
                </div>
                <div className="services-modal__actions">
                    <button
                        type="button"
                        className="button button--secondary"
                        onClick={() => setEditingProcedure(null)}
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

export default EditProcedureModal;
