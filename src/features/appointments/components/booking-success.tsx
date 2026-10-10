import { Check } from "lucide-react";
import Link from "next/link";
import { BookingForm, BookingPatient, BookingStep } from "../appointment.types";
import { Dispatch, SetStateAction } from "react";

function BookingSuccess({
    patient,
    form,
    role,
    setSubmitted,
    setStep,
}: {
    patient: BookingPatient | null;
    form: BookingForm;
    role: "admin" | "receptionist";
    setSubmitted: Dispatch<SetStateAction<boolean>>;
    setStep: Dispatch<SetStateAction<BookingStep>>;
}) {
    return (
        <section
            className="booking-success"
            aria-labelledby="booking-success-title"
        >
            <span className="booking-success__icon">
                <Check aria-hidden="true" />
            </span>
            <p className="page-heading__eyebrow">Appointment booked</p>
            <h1 id="booking-success-title">
                {patient?.name} is on the schedule.
            </h1>
            <p>
                Root canal follow-up with {form.dentist} on Saturday, 13
                September at {form.slot}.
            </p>
            <div className="booking-success__actions">
                <Link
                    href={`/calendar?role=${role}`}
                    className="button button--primary"
                >
                    View calendar
                </Link>
                <button
                    type="button"
                    className="button button--secondary"
                    onClick={() => {
                        setSubmitted(false);
                        setStep(1);
                    }}
                >
                    Book another
                </button>
            </div>
        </section>
    );
}

export default BookingSuccess;
