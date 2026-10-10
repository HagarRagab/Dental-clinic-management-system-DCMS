export type BookingStep = 1 | 2 | 3;
export type BookingForm = {
    dentist: string;
    appointmentType: string;
    date: string;
    duration: string;
    room: string;
    notes: string;
    slot: string;
};
export type BookingPatient = {
    id: string;
    name: string;
    mobile: string;
    dob: string;
    alert?: string;
};
