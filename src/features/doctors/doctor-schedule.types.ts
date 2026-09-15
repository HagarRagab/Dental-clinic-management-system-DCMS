export type DoctorStatus = "Active" | "On leave" | "Inactive";

export type Weekday =
    | "Saturday"
    | "Sunday"
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday";

export type WorkingDay = {
    day: Weekday;
    isOpen: boolean;
    start: string;
    end: string;
    breakStart?: string;
    breakEnd?: string;
};

export type BlockedSlotType = "Break" | "Leave" | "Holiday" | "Blocked time";

export type BlockedSlot = {
    id: string;
    doctorId: string;
    date: string;
    start: string;
    end: string;
    type: BlockedSlotType;
    reason: string;
};

export type DoctorProfile = {
    id: string;
    name: string;
    initials: string;
    specialty: string;
    branch: string;
    status: DoctorStatus;
    appointmentCountToday: number;
    nextAvailable: string;
    workingDays: WorkingDay[];
};

export type AvailabilitySlot = {
    time: string;
    status: "Available" | "Booked" | "Blocked";
    note: string;
};

