import type {
    AvailabilitySlot,
    BlockedSlot,
    DoctorProfile,
} from "@/features/doctors/doctor-schedule.types";

const commonWorkingDays = [
    { day: "Saturday", isOpen: true, start: "10:00", end: "18:00", breakStart: "13:30", breakEnd: "14:00" },
    { day: "Sunday", isOpen: true, start: "10:00", end: "18:00", breakStart: "13:30", breakEnd: "14:00" },
    { day: "Monday", isOpen: true, start: "11:00", end: "19:00", breakStart: "15:00", breakEnd: "15:30" },
    { day: "Tuesday", isOpen: true, start: "10:00", end: "18:00", breakStart: "13:30", breakEnd: "14:00" },
    { day: "Wednesday", isOpen: true, start: "10:00", end: "16:00" },
    { day: "Thursday", isOpen: false, start: "00:00", end: "00:00" },
    { day: "Friday", isOpen: false, start: "00:00", end: "00:00" },
] as const;

export const mockDoctors: DoctorProfile[] = [
    {
        id: "doctor-karim",
        name: "Dr. Karim Mostafa",
        initials: "KM",
        specialty: "Endodontics",
        branch: "Main branch",
        status: "Active",
        appointmentCountToday: 9,
        nextAvailable: "Today, 16:30",
        workingDays: commonWorkingDays.map((day) => ({ ...day })),
    },
    {
        id: "doctor-salma",
        name: "Dr. Salma Hassan",
        initials: "SH",
        specialty: "General dentistry",
        branch: "Main branch",
        status: "Active",
        appointmentCountToday: 7,
        nextAvailable: "Tomorrow, 11:00",
        workingDays: commonWorkingDays.map((day) =>
            day.day === "Wednesday"
                ? { ...day, end: "18:00" }
                : { ...day },
        ),
    },
    {
        id: "doctor-nour",
        name: "Dr. Nour Fahmy",
        initials: "NF",
        specialty: "Prosthodontics",
        branch: "Main branch",
        status: "On leave",
        appointmentCountToday: 0,
        nextAvailable: "18 Sep, 12:00",
        workingDays: commonWorkingDays.map((day) => ({ ...day })),
    },
];

export const mockBlockedSlots: BlockedSlot[] = [
    {
        id: "blocked-001",
        doctorId: "doctor-karim",
        date: "15 Sep 2026",
        start: "13:30",
        end: "14:00",
        type: "Break",
        reason: "Lunch break",
    },
    {
        id: "blocked-002",
        doctorId: "doctor-karim",
        date: "16 Sep 2026",
        start: "10:00",
        end: "11:00",
        type: "Blocked time",
        reason: "Clinical meeting",
    },
    {
        id: "blocked-003",
        doctorId: "doctor-nour",
        date: "15 Sep 2026",
        start: "10:00",
        end: "18:00",
        type: "Leave",
        reason: "Annual leave",
    },
];

export const mockAvailability: Record<string, AvailabilitySlot[]> = {
    "doctor-karim": [
        { time: "10:00", status: "Booked", note: "Root canal follow-up" },
        { time: "10:30", status: "Available", note: "Open slot" },
        { time: "11:00", status: "Booked", note: "Consultation" },
        { time: "11:30", status: "Available", note: "Open slot" },
        { time: "12:00", status: "Available", note: "Open slot" },
        { time: "13:30", status: "Blocked", note: "Lunch break" },
        { time: "14:00", status: "Booked", note: "Crown fitting" },
        { time: "16:30", status: "Available", note: "Next available" },
    ],
    "doctor-salma": [
        { time: "10:00", status: "Booked", note: "Cleaning" },
        { time: "10:30", status: "Booked", note: "Consultation" },
        { time: "11:00", status: "Available", note: "Open slot" },
        { time: "12:30", status: "Available", note: "Open slot" },
        { time: "13:30", status: "Blocked", note: "Lunch break" },
        { time: "15:00", status: "Booked", note: "Filling" },
        { time: "17:00", status: "Available", note: "Open slot" },
    ],
    "doctor-nour": [
        { time: "10:00", status: "Blocked", note: "Annual leave" },
        { time: "12:00", status: "Blocked", note: "Annual leave" },
        { time: "14:00", status: "Blocked", note: "Annual leave" },
        { time: "16:00", status: "Blocked", note: "Annual leave" },
    ],
};

