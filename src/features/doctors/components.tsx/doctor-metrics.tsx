import { CalendarClock, Clock3, Stethoscope } from "lucide-react";
import { BlockedSlot, DoctorProfile } from "../doctor-schedule.types";

function DoctorMetrics({
    doctors,
    blockedSlots,
}: {
    doctors: DoctorProfile[];
    blockedSlots: BlockedSlot[];
}) {
    const totalAppointments = doctors.reduce(
        (sum, doctor) => sum + doctor.appointmentCountToday,
        0,
    );
    const activeDoctors = doctors.filter(
        (doctor) => doctor.status === "Active",
    ).length;
    const blockedToday = blockedSlots.filter(
        (slot) => slot.date === "15 Sep 2026",
    ).length;

    return (
        <section
            className="doctor-metrics"
            aria-label="Doctor schedule summary"
        >
            <article>
                <span className="doctor-metric__icon">
                    <Stethoscope aria-hidden="true" />
                </span>
                <div>
                    <span>Active dentists</span>
                    <strong>{activeDoctors}</strong>
                    <small>{doctors.length} total profiles</small>
                </div>
            </article>
            <article>
                <span className="doctor-metric__icon doctor-metric__icon--warning">
                    <CalendarClock aria-hidden="true" />
                </span>
                <div>
                    <span>Appointments today</span>
                    <strong>{totalAppointments}</strong>
                    <small>Across all dentists</small>
                </div>
            </article>
            <article>
                <span className="doctor-metric__icon doctor-metric__icon--neutral">
                    <Clock3 aria-hidden="true" />
                </span>
                <div>
                    <span>Blocked periods</span>
                    <strong>{blockedToday}</strong>
                    <small>Today</small>
                </div>
            </article>
        </section>
    );
}

export default DoctorMetrics;
