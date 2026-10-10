import { Dispatch, SetStateAction, SubmitEvent, useState } from "react";
import { Plus, X } from "lucide-react";
import { ClinicalProcedure, ServiceCategory } from "../services.types";

function AddProcedureModal({
    setProcedures,
    setShowAddProcModal,
    setFeedback,
    serviceCategories,
}: {
    setProcedures: Dispatch<SetStateAction<ClinicalProcedure[]>>;
    setShowAddProcModal: Dispatch<SetStateAction<boolean>>;
    setFeedback: Dispatch<SetStateAction<string>>;
    serviceCategories: ServiceCategory[];
}) {
    // New Procedure Form State
    const [procCode, setProcCode] = useState("");
    const [procName, setProcName] = useState("");
    const [procCategory, setProcCategory] = useState<
        Exclude<ServiceCategory, "All">
    >("Diagnostic & Preventive");
    const [procPrice, setProcPrice] = useState(500);
    const [procDuration, setProcDuration] = useState(30);
    const [procDescription, setProcDescription] = useState("");
    const [procToothTarget, setProcToothTarget] = useState(true);

    function handleAddProcedure(e: SubmitEvent) {
        e.preventDefault();
        if (!procName.trim() || !procCode.trim()) return;

        const newProc: ClinicalProcedure = {
            id: `proc-${Date.now()}`,
            code: procCode.trim().toUpperCase(),
            name: procName.trim(),
            category: procCategory,
            defaultPrice: Number(procPrice) || 0,
            durationMinutes: Number(procDuration) || 15,
            description: procDescription.trim(),
            requiresToothTarget: procToothTarget,
            active: true,
        };

        setProcedures((prev) => [newProc, ...prev]);
        setShowAddProcModal(false);
        setProcCode("");
        setProcName("");
        setProcDescription("");
        setFeedback(
            `New procedure "${newProc.name}" (${newProc.code}) added to catalog.`,
        );
    }

    return (
        <div
            className="services-modal-backdrop"
            role="dialog"
            aria-modal="true"
        >
            <form className="services-modal" onSubmit={handleAddProcedure}>
                <div className="services-modal__header">
                    <span className="services-modal__icon">
                        <Plus aria-hidden="true" />
                    </span>
                    <div>
                        <h2>Add Clinical Procedure</h2>
                        <p>Register a new procedure in the treatment catalog</p>
                    </div>
                    <button
                        type="button"
                        className="icon-button"
                        style={{ marginLeft: "auto" }}
                        onClick={() => setShowAddProcModal(false)}
                        aria-label="Close modal"
                    >
                        <X aria-hidden="true" />
                    </button>
                </div>
                <div className="services-modal__body">
                    <div className="services-form-grid-2">
                        <div>
                            <label className="services-field-label">
                                CDT / Procedure Code
                            </label>
                            <input
                                type="text"
                                className="text-input"
                                value={procCode}
                                onChange={(e) => setProcCode(e.target.value)}
                                placeholder="e.g. D2391"
                                required
                            />
                        </div>
                        <div>
                            <label className="services-field-label">
                                Category
                            </label>
                            <select
                                className="text-input"
                                value={procCategory}
                                onChange={(e) =>
                                    setProcCategory(
                                        e.target.value as Exclude<
                                            ServiceCategory,
                                            "All"
                                        >,
                                    )
                                }
                            >
                                {serviceCategories
                                    .filter(
                                        (
                                            c,
                                        ): c is Exclude<
                                            ServiceCategory,
                                            "All"
                                        > => c !== "All",
                                    )
                                    .map((c) => (
                                        <option key={c} value={c}>
                                            {c}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    </div>

                    <div style={{ marginTop: 12 }}>
                        <label className="services-field-label">
                            Procedure Name
                        </label>
                        <input
                            type="text"
                            className="text-input"
                            value={procName}
                            onChange={(e) => setProcName(e.target.value)}
                            placeholder="e.g. Composite Resin Restoration — 1 Surface"
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
                                value={procPrice}
                                onChange={(e) =>
                                    setProcPrice(Number(e.target.value))
                                }
                                min={0}
                                step={50}
                                required
                            />
                        </div>
                        <div>
                            <label className="services-field-label">
                                Estimated Duration (Minutes)
                            </label>
                            <input
                                type="number"
                                className="text-input"
                                value={procDuration}
                                onChange={(e) =>
                                    setProcDuration(Number(e.target.value))
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
                            value={procDescription}
                            onChange={(e) => setProcDescription(e.target.value)}
                            placeholder="Brief clinical description or notes..."
                        />
                    </div>

                    <div style={{ marginTop: 14 }}>
                        <label className="checkbox-row">
                            <input
                                type="checkbox"
                                checked={procToothTarget}
                                onChange={(e) =>
                                    setProcToothTarget(e.target.checked)
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
                        onClick={() => setShowAddProcModal(false)}
                    >
                        Cancel
                    </button>
                    <button type="submit" className="button button--primary">
                        Create procedure
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddProcedureModal;
