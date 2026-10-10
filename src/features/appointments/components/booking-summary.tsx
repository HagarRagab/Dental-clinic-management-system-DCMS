import { Clock3, ShieldAlert } from "lucide-react";
import { BookingForm, BookingPatient } from "../appointment.types";

function BookingSummary({
    patient,
    form,
}: {
    patient: BookingPatient | null;
    form: BookingForm;
}) {
    return (
        <aside
            className="booking-summary"
            aria-labelledby="booking-summary-title"
        >
            <div className="booking-summary__header">
                <Clock3 aria-hidden="true" />
                <h2 id="booking-summary-title">Booking summary</h2>
            </div>
            <div>
                <span>Patient</span>
                <strong>{patient?.name ?? "Select patient"}</strong>
            </div>
            <div>
                <span>Appointment</span>
                <strong>{form.appointmentType}</strong>
            </div>
            <div>
                <span>When</span>
                <strong>{form.slot} · Sat 13 Sep</strong>
            </div>
            <div>
                <span>Chair</span>
                <strong>{form.room}</strong>
            </div>
            {patient?.alert ? (
                <p className="booking-summary__alert">
                    <ShieldAlert aria-hidden="true" />
                    {patient.alert}
                </p>
            ) : null}
        </aside>
    );
}

export default BookingSummary;
