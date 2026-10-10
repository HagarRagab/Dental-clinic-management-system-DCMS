import { Coffee } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { DoctorProfile } from "../doctor-schedule.types";

function DoctorProfilePanel({
    setDoctors,
    setFeedback,
    selectedDoctor,
    doctorStatusClass,
}: {
    setDoctors: Dispatch<SetStateAction<DoctorProfile[]>>;
    setFeedback: Dispatch<SetStateAction<string>>;
    selectedDoctor: DoctorProfile;
    doctorStatusClass: (status: DoctorProfile["status"]) => string;
}) {
    function updateWorkingDay(
        dayName: string,
        field: "start" | "end" | "isOpen",
        value: string | boolean,
    ) {
        setDoctors((current) =>
            current.map((doctor) =>
                doctor.id === selectedDoctor.id
                    ? {
                          ...doctor,
                          workingDays: doctor.workingDays.map((day) =>
                              day.day === dayName
                                  ? { ...day, [field]: value }
                                  : day,
                          ),
                      }
                    : doctor,
            ),
        );
        setFeedback(
            `${selectedDoctor.name}'s ${dayName} schedule was updated.`,
        );
    }

    return (
        <article className="doctor-profile-panel">
            <div className="doctor-profile-header">
                <div className="doctor-profile-identity">
                    <span className="doctor-profile-avatar">
                        {selectedDoctor.initials}
                    </span>
                    <div>
                        <p className="panel-kicker">Selected doctor</p>
                        <h2>{selectedDoctor.name}</h2>
                        <p>
                            {selectedDoctor.specialty} - {selectedDoctor.branch}
                        </p>
                    </div>
                </div>
                <span
                    className={`doctor-status doctor-status--${doctorStatusClass(selectedDoctor.status)}`}
                >
                    {selectedDoctor.status}
                </span>
            </div>

            <div className="doctor-profile-summary">
                <div>
                    <span>Appointments today</span>
                    <strong>{selectedDoctor.appointmentCountToday}</strong>
                </div>
                <div>
                    <span>Next available</span>
                    <strong>{selectedDoctor.nextAvailable}</strong>
                </div>
            </div>

            <section
                className="working-hours-panel"
                aria-labelledby="working-hours-title"
            >
                <div className="panel-header">
                    <div>
                        <h2 id="working-hours-title">Working hours</h2>
                        <p>Per-day availability for the main branch</p>
                    </div>
                </div>
                <div className="working-hours-list">
                    {selectedDoctor.workingDays.map((day) => (
                        <article key={day.day}>
                            <label className="working-day-toggle">
                                <input
                                    type="checkbox"
                                    checked={day.isOpen}
                                    onChange={(event) =>
                                        updateWorkingDay(
                                            day.day,
                                            "isOpen",
                                            event.target.checked,
                                        )
                                    }
                                />
                                <span>{day.day}</span>
                            </label>
                            <label>
                                <span className="sr-only text-sm">
                                    {day.day} start time
                                </span>
                                <input
                                    type="time"
                                    value={day.start}
                                    disabled={!day.isOpen}
                                    onChange={(event) =>
                                        updateWorkingDay(
                                            day.day,
                                            "start",
                                            event.target.value,
                                        )
                                    }
                                />
                            </label>
                            <label>
                                <span className="sr-only text-sm">
                                    {day.day} end time
                                </span>
                                <input
                                    type="time"
                                    value={day.end}
                                    disabled={!day.isOpen}
                                    onChange={(event) =>
                                        updateWorkingDay(
                                            day.day,
                                            "end",
                                            event.target.value,
                                        )
                                    }
                                />
                            </label>
                            <span className="working-break">
                                <Coffee aria-hidden="true" />
                                {day.breakStart && day.breakEnd
                                    ? `${day.breakStart} - ${day.breakEnd}`
                                    : "No break"}
                            </span>
                        </article>
                    ))}
                </div>
            </section>
        </article>
    );
}

export default DoctorProfilePanel;
