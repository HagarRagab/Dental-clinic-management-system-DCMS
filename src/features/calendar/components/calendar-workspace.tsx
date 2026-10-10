import { Dispatch, SetStateAction, useMemo } from "react";
import { CalendarAppointmentCard } from "./calendar-appointment-card";
import { CalendarAppointment } from "../calendar.types";
import { UserRole } from "@/types";

const timeSlots = [
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
];

function CalendarWorkspace({
    role,
    dentistFilter,
    calendarDentists,
    appointments,
    typeFilter,
    view,
    selected,
    setSelected,
}: {
    role: UserRole;
    dentistFilter: string;
    calendarDentists: string[];
    appointments: CalendarAppointment[];
    typeFilter: string;
    view: "week" | "day";
    selected: CalendarAppointment;
    setSelected: Dispatch<SetStateAction<CalendarAppointment>>;
}) {
    const dentists =
        role === "dentist"
            ? ["Dr. Karim Mostafa"]
            : dentistFilter === "All dentists"
              ? calendarDentists.slice(1)
              : [dentistFilter];

    const visibleAppointments = useMemo(
        () =>
            appointments.filter(
                (appointment) =>
                    (dentistFilter === "All dentists" ||
                        appointment.dentist === dentistFilter) &&
                    (typeFilter === "All appointment types" ||
                        appointment.type === typeFilter),
            ),
        [dentistFilter, typeFilter],
    );

    return (
        <section className="calendar-workspace" aria-label="Calendar schedule">
            <div className="calendar-legend">
                <span>
                    <i className="legend-dot legend-dot--confirmed" />
                    Confirmed
                </span>
                <span>
                    <i className="legend-dot legend-dot--booked" />
                    Booked
                </span>
                <span>
                    <i className="legend-dot legend-dot--waiting" />
                    Waiting
                </span>
            </div>
            <div
                className={`calendar-board ${view === "week" ? "calendar-board--week" : ""}`}
            >
                <div className="calendar-board__header">
                    <span />
                    {dentists.map((dentist) => (
                        <strong key={dentist}>
                            {dentist} · Chair{" "}
                            {dentist.includes("Salma") ? "1" : "2"}
                        </strong>
                    ))}
                </div>
                <div className="calendar-board__body">
                    {timeSlots.map((time) => (
                        <div className="calendar-time-row" key={time}>
                            <time>{time}</time>
                            {dentists.map((dentist) => (
                                <div
                                    className="calendar-time-cell"
                                    key={`${time}-${dentist}`}
                                >
                                    {visibleAppointments
                                        .filter(
                                            (appointment) =>
                                                appointment.dentist ===
                                                    dentist &&
                                                appointment.start === time,
                                        )
                                        .map((appointment) => (
                                            <CalendarAppointmentCard
                                                key={appointment.id}
                                                appointment={appointment}
                                                isSelected={
                                                    selected.id ===
                                                    appointment.id
                                                }
                                                onSelect={setSelected}
                                            />
                                        ))}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default CalendarWorkspace;
