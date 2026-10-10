import { Dispatch, SetStateAction, useState } from "react";
import { PatientSelector } from "@/features/appointments/components/patient-selector";
import { SlotPicker } from "@/features/appointments/components/slot-picker";
import { CalendarCheck2, ChevronRight, ShieldAlert } from "lucide-react";
import { BookingForm, BookingPatient, BookingStep } from "../appointment.types";

function BookingFormSurface({
    form,
    setForm,
    patient,
    setPatient,
    step,
    setStep,
    bookingPatients,
    bookingDentists,
    bookingAppointmentTypes,
    availableSlots,
    role,
    setSubmitted,
}: {
    form: BookingForm;
    setForm: Dispatch<SetStateAction<BookingForm>>;
    patient: BookingPatient | null;
    setPatient: Dispatch<SetStateAction<BookingPatient | null>>;
    step: BookingStep;
    setStep: Dispatch<SetStateAction<BookingStep>>;
    bookingPatients: BookingPatient[];
    bookingDentists: string[];
    bookingAppointmentTypes: string[];
    availableSlots: string[];
    role: "admin" | "receptionist";
    setSubmitted: Dispatch<SetStateAction<boolean>>;
}) {
    const [showOverride, setShowOverride] = useState(false);

    const update = <K extends keyof BookingForm>(
        key: K,
        value: BookingForm[K],
    ) => setForm((current) => ({ ...current, [key]: value }));

    const isConflict =
        form.slot === "15:00" && form.dentist === "Dr. Karim Mostafa";

    const canContinue =
        patient &&
        form.dentist &&
        form.appointmentType &&
        form.date &&
        form.slot;

    return (
        <section className="booking-form-surface">
            {step === 1 ? (
                <PatientSelector
                    patients={bookingPatients}
                    selectedPatient={patient}
                    onSelect={setPatient}
                />
            ) : null}
            {step === 2 ? (
                <section aria-labelledby="appointment-details-title">
                    <div className="form-section__header">
                        <div>
                            <h2 id="appointment-details-title">
                                Appointment details
                            </h2>
                            <p>
                                Only available times are shown for this dentist.
                            </p>
                        </div>
                    </div>
                    <div className="form-grid">
                        <label className="field-group">
                            <span className="field-label">Dentist</span>
                            <select
                                className="select-input"
                                value={form.dentist}
                                onChange={(event) =>
                                    update("dentist", event.target.value)
                                }
                            >
                                {bookingDentists.map((dentist) => (
                                    <option key={dentist}>{dentist}</option>
                                ))}
                            </select>
                        </label>
                        <label className="field-group">
                            <span className="field-label">
                                Appointment type
                            </span>
                            <select
                                className="select-input"
                                value={form.appointmentType}
                                onChange={(event) =>
                                    update(
                                        "appointmentType",
                                        event.target.value,
                                    )
                                }
                            >
                                {bookingAppointmentTypes.map((type) => (
                                    <option key={type}>{type}</option>
                                ))}
                            </select>
                        </label>
                        <label className="field-group">
                            <span className="field-label">Date</span>
                            <input
                                className="text-input"
                                type="date"
                                value={form.date}
                                onChange={(event) =>
                                    update("date", event.target.value)
                                }
                            />
                        </label>
                        <label className="field-group">
                            <span className="field-label">Duration</span>
                            <select
                                className="select-input"
                                value={form.duration}
                                onChange={(event) =>
                                    update("duration", event.target.value)
                                }
                            >
                                <option value="30">30 minutes</option>
                                <option value="60">60 minutes</option>
                            </select>
                        </label>
                        <label className="field-group">
                            <span className="field-label">Room or chair</span>
                            <select
                                className="select-input"
                                value={form.room}
                                onChange={(event) =>
                                    update("room", event.target.value)
                                }
                            >
                                <option>Chair 2</option>
                                <option>Chair 1</option>
                                <option>Not assigned</option>
                            </select>
                        </label>
                        <label className="field-group">
                            <span className="field-label">
                                Notes <em>Optional</em>
                            </span>
                            <input
                                className="text-input"
                                value={form.notes}
                                onChange={(event) =>
                                    update("notes", event.target.value)
                                }
                                placeholder="Short booking note"
                            />
                        </label>
                    </div>
                    <div className="booking-slots">
                        <div>
                            <h3>Available times</h3>
                            <p>Saturday, 13 September</p>
                        </div>
                        <SlotPicker
                            slots={availableSlots}
                            selectedSlot={form.slot}
                            onSelect={(slot) => update("slot", slot)}
                        />
                    </div>
                    {isConflict ? (
                        <div className="booking-conflict" role="alert">
                            <ShieldAlert aria-hidden="true" />
                            <div>
                                <strong>
                                    Chair 2 is already occupied at 15:00.
                                </strong>
                                <span>
                                    Select another time or chair to continue.
                                </span>
                            </div>
                            {role === "admin" ? (
                                <button
                                    type="button"
                                    className="text-button text-button--compact"
                                    onClick={() =>
                                        setShowOverride((current) => !current)
                                    }
                                >
                                    {showOverride
                                        ? "Override enabled"
                                        : "Override with reason"}
                                </button>
                            ) : null}
                        </div>
                    ) : null}
                </section>
            ) : null}
            {step === 3 ? (
                <section
                    className="booking-review"
                    aria-labelledby="booking-review-title"
                >
                    <div className="form-section__header">
                        <div>
                            <h2 id="booking-review-title">
                                Review appointment
                            </h2>
                            <p>
                                Check the details before confirming the booking.
                            </p>
                        </div>
                    </div>
                    <div className="booking-review__patient">
                        <span>
                            {patient?.name
                                .split(" ")
                                .map((part) => part[0])
                                .join("")}
                        </span>
                        <div>
                            <strong>{patient?.name}</strong>
                            <small>
                                {patient?.mobile} · {patient?.dob}
                            </small>
                        </div>
                    </div>
                    <dl className="booking-review__details">
                        <div>
                            <dt>Dentist</dt>
                            <dd>{form.dentist}</dd>
                        </div>
                        <div>
                            <dt>Appointment</dt>
                            <dd>{form.appointmentType}</dd>
                        </div>
                        <div>
                            <dt>Date and time</dt>
                            <dd>Saturday, 13 September · {form.slot}</dd>
                        </div>
                        <div>
                            <dt>Duration</dt>
                            <dd>{form.duration} minutes</dd>
                        </div>
                        <div>
                            <dt>Room</dt>
                            <dd>{form.room}</dd>
                        </div>
                        {form.notes ? (
                            <div>
                                <dt>Notes</dt>
                                <dd>{form.notes}</dd>
                            </div>
                        ) : null}
                    </dl>
                    <div className="booking-confirm-note">
                        <CalendarCheck2 aria-hidden="true" />
                        <span>
                            The appointment will be created as{" "}
                            <strong>Booked</strong>. A confirmation email will
                            be sent when notifications are connected.
                        </span>
                    </div>
                </section>
            ) : null}
            <footer className="booking-form-footer">
                <button
                    type="button"
                    className="button button--secondary"
                    onClick={() =>
                        setStep(
                            (current) =>
                                Math.max(1, current - 1) as BookingStep,
                        )
                    }
                    disabled={step === 1}
                >
                    Back
                </button>
                {step < 3 ? (
                    <button
                        type="button"
                        className="button button--primary"
                        disabled={!canContinue || (isConflict && !showOverride)}
                        onClick={() =>
                            setStep((current) => (current + 1) as BookingStep)
                        }
                    >
                        Continue <ChevronRight aria-hidden="true" />
                    </button>
                ) : (
                    <button
                        type="button"
                        className="button button--primary"
                        onClick={() => setSubmitted(true)}
                    >
                        Confirm booking
                    </button>
                )}
            </footer>
        </section>
    );
}

export default BookingFormSurface;
