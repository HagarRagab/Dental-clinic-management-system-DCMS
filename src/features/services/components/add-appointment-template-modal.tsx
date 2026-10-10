import { Dispatch, SetStateAction, SubmitEvent, useState } from "react";
import { Calendar, X } from "lucide-react";
import { AppointmentTypeConfig } from "../services.types";

function AddAppointmentTemplateModal({
    setAppointmentTypes,
    setShowAddApptModal,
    setFeedback,
}: {
    setAppointmentTypes: Dispatch<SetStateAction<AppointmentTypeConfig[]>>;
    setShowAddApptModal: Dispatch<SetStateAction<boolean>>;
    setFeedback: Dispatch<SetStateAction<string>>;
}) {
    // New Appointment Type Form State
    const [aptName, setAptName] = useState("");
    const [aptCategory, setAptCategory] = useState("General");
    const [aptDuration, setAptDuration] = useState(30);
    const [aptPrice, setAptPrice] = useState(400);
    const [aptColor, setAptColor] = useState("#0f766e");
    const [aptDesc, setAptDesc] = useState("");

    function handleAddApptType(e: SubmitEvent) {
        e.preventDefault();
        if (!aptName.trim()) return;

        const newApt: AppointmentTypeConfig = {
            id: `apt-${Date.now()}`,
            name: aptName.trim(),
            category: aptCategory.trim(),
            defaultDurationMinutes: Number(aptDuration) || 20,
            defaultPrice: Number(aptPrice) || 0,
            color: aptColor,
            description: aptDesc.trim(),
            active: true,
            requiresChair: true,
        };

        setAppointmentTypes((prev) => [...prev, newApt]);
        setShowAddApptModal(false);
        setAptName("");
        setAptDesc("");
        setFeedback(`Appointment template "${newApt.name}" created.`);
    }

    return (
        <div
            className="services-modal-backdrop"
            role="dialog"
            aria-modal="true"
        >
            <form className="services-modal" onSubmit={handleAddApptType}>
                <div className="services-modal__header">
                    <span className="services-modal__icon">
                        <Calendar aria-hidden="true" />
                    </span>
                    <div>
                        <h2>Add Appointment Template</h2>
                        <p>Define a new booking duration and default rate</p>
                    </div>
                    <button
                        type="button"
                        className="icon-button"
                        style={{ marginLeft: "auto" }}
                        onClick={() => setShowAddApptModal(false)}
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
                            value={aptName}
                            onChange={(e) => setAptName(e.target.value)}
                            placeholder="e.g. Implant Consultation"
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
                                value={aptDuration}
                                onChange={(e) =>
                                    setAptDuration(Number(e.target.value))
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
                                value={aptPrice}
                                onChange={(e) =>
                                    setAptPrice(Number(e.target.value))
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
                                value={aptColor}
                                onChange={(e) => setAptColor(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="services-field-label">
                                Category
                            </label>
                            <input
                                type="text"
                                className="text-input"
                                value={aptCategory}
                                onChange={(e) => setAptCategory(e.target.value)}
                                placeholder="e.g. Consultation, Surgery"
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
                            value={aptDesc}
                            onChange={(e) => setAptDesc(e.target.value)}
                            placeholder="What is included in this appointment..."
                        />
                    </div>
                </div>
                <div className="services-modal__actions">
                    <button
                        type="button"
                        className="button button--secondary"
                        onClick={() => setShowAddApptModal(false)}
                    >
                        Cancel
                    </button>
                    <button type="submit" className="button button--primary">
                        Save template
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddAppointmentTemplateModal;
