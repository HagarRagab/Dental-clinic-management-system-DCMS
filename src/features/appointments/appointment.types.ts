export type AppointmentStatus = "Booked" | "Confirmed" | "Completed" | "Cancelled" | "No Show" | "Rescheduled";
export type VisitState = "Not arrived" | "Waiting" | "In progress" | "Finished";

export type CalendarAppointment = {
  id: string;
  patient: string;
  dentist: string;
  type: string;
  start: string;
  end: string;
  room?: string;
  appointmentStatus: AppointmentStatus;
  visitState: VisitState;
  note?: string;
};
