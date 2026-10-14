import { UserRole } from "@/types";
import { ChevronLeft, ChevronRight, Filter, ListFilter } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

function CalendarToolbar({
    view,
    setView,
    role,
    dentistFilter,
    setDentistFilter,
    calendarDentists,
    typeFilter,
    setTypeFilter,
    appointmentTypes,
    currentDate,
    setCurrentDate,
}: {
    view: "day" | "week";
    setView: Dispatch<SetStateAction<"day" | "week">>;
    role: UserRole;
    dentistFilter: string;
    setDentistFilter: Dispatch<SetStateAction<string>>;
    calendarDentists: string[];
    typeFilter: string;
    setTypeFilter: Dispatch<SetStateAction<string>>;
    appointmentTypes: string[];
    currentDate: Date;
    setCurrentDate: Dispatch<SetStateAction<Date>>;
}) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isToday =
        currentDate.toDateString() === today.toDateString();

    const step = view === "week" ? 7 : 1;

    function shiftDate(delta: number) {
        setCurrentDate((d) => {
            const next = new Date(d);
            next.setDate(next.getDate() + delta);
            return next;
        });
    }

    const formattedDate = currentDate.toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
    });

    return (
        <section className="calendar-toolbar" aria-label="Calendar controls">
            <div className="calendar-toolbar__date">
                <button
                    type="button"
                    className="icon-button"
                    aria-label={view === "week" ? "Previous week" : "Previous day"}
                    onClick={() => shiftDate(-step)}
                >
                    <ChevronLeft aria-hidden="true" />
                </button>
                <button
                    type="button"
                    className="calendar-date-button"
                    aria-label="Go to today"
                    onClick={() => setCurrentDate(new Date())}
                >
                    {isToday ? "Today" : "Go to today"}
                    <span>{formattedDate}</span>
                </button>
                <button
                    type="button"
                    className="icon-button"
                    aria-label={view === "week" ? "Next week" : "Next day"}
                    onClick={() => shiftDate(step)}
                >
                    <ChevronRight aria-hidden="true" />
                </button>
            </div>
            <div className="calendar-toolbar__filters">
                <div
                    className="calendar-segmented"
                    role="group"
                    aria-label="Calendar view"
                >
                    <button
                        type="button"
                        className={
                            view === "day" ? "calendar-segmented__active" : ""
                        }
                        onClick={() => setView("day")}
                        aria-pressed={view === "day"}
                    >
                        Day
                    </button>
                    <button
                        type="button"
                        className={
                            view === "week" ? "calendar-segmented__active" : ""
                        }
                        onClick={() => setView("week")}
                        aria-pressed={view === "week"}
                    >
                        Week
                    </button>
                </div>
                {role !== "dentist" ? (
                    <label className="calendar-filter">
                        <Filter aria-hidden="true" />
                        <select
                            value={dentistFilter}
                            onChange={(event) =>
                                setDentistFilter(event.target.value)
                            }
                            aria-label="Filter by dentist"
                        >
                            {calendarDentists.map((dentist) => (
                                <option key={dentist}>{dentist}</option>
                            ))}
                        </select>
                    </label>
                ) : null}
                <label className="calendar-filter">
                    <ListFilter aria-hidden="true" />
                    <select
                        value={typeFilter}
                        onChange={(event) => setTypeFilter(event.target.value)}
                        aria-label="Filter by appointment type"
                    >
                        {appointmentTypes.map((type) => (
                            <option key={type}>{type}</option>
                        ))}
                    </select>
                </label>
            </div>
        </section>
    );
}

export default CalendarToolbar;
