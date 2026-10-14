import {
    CalendarClock,
    CircleCheck,
    Clock3,
    FileText,
    MapPin,
    Stethoscope,
    UserRound,
    XCircle,
} from "lucide-react";
import type { CalendarAppointment } from "@/features/calendar/calendar.types";
import type { UserRole } from "@/types";

export function AppointmentDetailPanel({
    appointment,
    role,
    onVisitAction,
    onCancel,
    onMarkNoShow,
    onReschedule,
    onOpenPatient,
}: {
    appointment: CalendarAppointment;
    role: UserRole;
    onVisitAction: (appointment: CalendarAppointment) => void;
    onCancel: (id: string) => void;
    onMarkNoShow: (id: string) => void;
    onReschedule: (appointment: CalendarAppointment) => void;
    onOpenPatient: (appointment: CalendarAppointment) => void;
}) {
    const canManage = role !== "dentist";

    /** Labels and disabled state for the primary visit-progression button. */
    const visitActionLabel = (() => {
        switch (appointment.visitState) {
            case "Not arrived": return "Check in";
            case "Waiting":     return "Start visit";
            case "In progress": return "Finish visit";
            case "Finished":    return "Visit finished";
        }
    })();

    const isTerminal =
        appointment.appointmentStatus === "Cancelled" ||
        appointment.appointmentStatus === "No Show" ||
        appointment.visitState === "Finished";

    return (
        <aside
            className="appointment-detail"
            aria-labelledby="appointment-detail-title"
        >
            <div className="appointment-detail__head">
                <div>
                    <p className="panel-kicker">Selected appointment</p>
                    <h2 id="appointment-detail-title">{appointment.patient}</h2>
                </div>
                <span
                    className={`status-badge status-badge--${appointment.appointmentStatus.toLowerCase()}`}
                >
                    {appointment.appointmentStatus}
                </span>
            </div>
            <div className="appointment-detail__summary">
                <span
                    className={`visit-state visit-state--${appointment.visitState.toLowerCase().replace(" ", "-")}`}
                >
                    <Clock3 aria-hidden="true" />
                    {appointment.visitState}
                </span>
                <p>{appointment.type}</p>
            </div>
            <dl className="detail-list">
                <div>
                    <dt>
                        <CalendarClock aria-hidden="true" />
                        Time
                    </dt>
                    <dd>
                        {appointment.start}–{appointment.end}
                    </dd>
                </div>
                <div>
                    <dt>
                        <Stethoscope aria-hidden="true" />
                        Dentist
                    </dt>
                    <dd>{appointment.dentist}</dd>
                </div>
                <div>
                    <dt>
                        <MapPin aria-hidden="true" />
                        Room
                    </dt>
                    <dd>{appointment.room ?? "Not assigned"}</dd>
                </div>
            </dl>
            {appointment.note ? (
                <div className="appointment-note">
                    <FileText aria-hidden="true" />
                    <span>{appointment.note}</span>
                </div>
            ) : null}
            <div className="appointment-detail__actions">
                <button
                    className="button button--primary button--full"
                    type="button"
                    disabled={isTerminal}
                    onClick={() => onVisitAction(appointment)}
                >
                    {visitActionLabel}
                </button>
                {canManage ? (
                    <div className="detail-action-row">
                        <button
                            className="button button--secondary"
                            type="button"
                            disabled={isTerminal}
                            onClick={() => onReschedule(appointment)}
                        >
                            <CalendarClock aria-hidden="true" />
                            Reschedule
                        </button>
                        <button
                            className="button button--secondary"
                            type="button"
                            disabled={isTerminal}
                            onClick={() => onCancel(appointment.id)}
                        >
                            <XCircle aria-hidden="true" />
                            Cancel
                        </button>
                    </div>
                ) : (
                    <button
                        className="button button--secondary button--full"
                        type="button"
                        onClick={() => onOpenPatient(appointment)}
                    >
                        <UserRound aria-hidden="true" />
                        Open patient
                    </button>
                )}
                <button
                    className="text-button text-button--compact"
                    type="button"
                    disabled={isTerminal}
                    onClick={() => onMarkNoShow(appointment.id)}
                >
                    <CircleCheck aria-hidden="true" />
                    Mark as no show
                </button>
            </div>
        </aside>
    );
}
