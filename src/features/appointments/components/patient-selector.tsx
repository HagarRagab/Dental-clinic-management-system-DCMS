import { AlertTriangle, Plus, Search, UserRound } from "lucide-react";
import { useMemo, useState } from "react";
import type { BookingPatient } from "@/features/appointments/services/mock-booking-service";

export function PatientSelector({
    patients,
    selectedPatient,
    onSelect,
}: {
    patients: BookingPatient[];
    selectedPatient: BookingPatient | null;
    onSelect: (patient: BookingPatient) => void;
}) {
    const [query, setQuery] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const results = useMemo(
        () =>
            patients.filter((patient) =>
                `${patient.name} ${patient.mobile}`
                    .toLowerCase()
                    .includes(query.toLowerCase()),
            ),
        [patients, query],
    );

    if (isCreating)
        return (
            <section
                className="patient-creator"
                aria-labelledby="new-patient-title"
            >
                <div className="form-section__header">
                    <div>
                        <h2 id="new-patient-title">New patient</h2>
                        <p>Capture only the details needed to book.</p>
                    </div>
                    <button
                        type="button"
                        className="text-button text-button--compact"
                        onClick={() => setIsCreating(false)}
                    >
                        Choose existing
                    </button>
                </div>
                <div className="form-grid">
                    <label className="field-group">
                        <span className="field-label">Full name</span>
                        <input
                            className="text-input"
                            placeholder="Patient full name"
                        />
                    </label>
                    <label className="field-group">
                        <span className="field-label">Mobile number</span>
                        <input
                            className="text-input"
                            inputMode="tel"
                            placeholder="01X XXXX XXXX"
                        />
                    </label>
                    <label className="field-group">
                        <span className="field-label">Date of birth</span>
                        <input className="text-input" type="date" />
                    </label>
                    <label className="field-group">
                        <span className="field-label">Gender</span>
                        <select className="select-input">
                            <option>Select gender</option>
                            <option>Female</option>
                            <option>Male</option>
                        </select>
                    </label>
                </div>
                <button
                    type="button"
                    className="button button--secondary"
                    onClick={() => {
                        onSelect({
                            id: "patient-new",
                            name: "New patient",
                            mobile: "Pending mobile",
                            dob: "Not recorded",
                        });
                        setIsCreating(false);
                    }}
                >
                    <Plus aria-hidden="true" />
                    Use this patient
                </button>
            </section>
        );

    return (
        <section
            className="patient-selector"
            aria-labelledby="patient-selector-title"
        >
            <div className="form-section__header">
                <div>
                    <h2 id="patient-selector-title">Patient</h2>
                    <p>Search by patient name or mobile number.</p>
                </div>
                <button
                    type="button"
                    className="button button--secondary booking-compact-action"
                    onClick={() => setIsCreating(true)}
                >
                    <Plus aria-hidden="true" />
                    New patient
                </button>
            </div>
            <label className="booking-search">
                <Search aria-hidden="true" />
                <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search patients"
                    aria-label="Search patient by name or mobile"
                />
            </label>
            <div
                className="patient-results"
                role="listbox"
                aria-label="Patient search results"
            >
                {results.map((patient) => (
                    <button
                        type="button"
                        className={`patient-result ${selectedPatient?.id === patient.id ? "patient-result--selected" : ""}`}
                        key={patient.id}
                        onClick={() => onSelect(patient)}
                        role="option"
                        aria-selected={selectedPatient?.id === patient.id}
                    >
                        <span className="patient-result__avatar">
                            <UserRound aria-hidden="true" />
                        </span>
                        <span>
                            <strong>{patient.name}</strong>
                            <small>
                                {patient.mobile} · {patient.dob}
                            </small>
                        </span>
                        {patient.alert ? (
                            <span className="patient-alert">
                                <AlertTriangle aria-hidden="true" />
                                {patient.alert}
                            </span>
                        ) : null}
                    </button>
                ))}
            </div>
        </section>
    );
}
