import type { CalendarAppointment } from "@/features/appointments/appointment.types";

export function CalendarAppointmentCard({ appointment, isSelected, onSelect }: { appointment: CalendarAppointment; isSelected: boolean; onSelect: (appointment: CalendarAppointment) => void }) {
  return <button type="button" className={`calendar-appointment calendar-appointment--${appointment.visitState.toLowerCase().replace(" ", "-")} ${isSelected ? "calendar-appointment--selected" : ""}`} onClick={() => onSelect(appointment)} aria-pressed={isSelected}><strong>{appointment.patient}</strong><span>{appointment.type}</span><span className="calendar-appointment__meta">{appointment.appointmentStatus} · {appointment.visitState}</span></button>;
}
