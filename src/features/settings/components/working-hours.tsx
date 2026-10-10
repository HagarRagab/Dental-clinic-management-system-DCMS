import { useState } from "react";
import { Info } from "lucide-react";
import { WorkingDayConfig } from "../settings.types";

function WorkingHours({ settingsData }: { settingsData: WorkingDayConfig[] }) {
    const [workingHours] = useState(settingsData);

    return (
        <div className="settings-table-section">
            <p className="settings-section-note">
                <Info aria-hidden="true" /> Branch-level working hours.
                Dentist-specific availability is managed in the Doctors
                workspace. Changes here are local.
            </p>
            <div className="settings-table-wrap">
                <table className="settings-table">
                    <thead>
                        <tr>
                            <th scope="col">Day</th>
                            <th scope="col">Open</th>
                            <th scope="col">Start</th>
                            <th scope="col">End</th>
                            <th scope="col">Break</th>
                        </tr>
                    </thead>
                    <tbody>
                        {workingHours.map((day) => (
                            <tr
                                key={day.day}
                                className={
                                    !day.open ? "settings-row--closed" : ""
                                }
                            >
                                <td>
                                    <strong>{day.day}</strong>
                                </td>
                                <td>
                                    <span
                                        className={`settings-status ${day.open ? "settings-status--active" : "settings-status--inactive"}`}
                                    >
                                        {day.open ? "Open" : "Closed"}
                                    </span>
                                </td>
                                <td>{day.open ? day.start : "—"}</td>
                                <td>{day.open ? day.end : "—"}</td>
                                <td>
                                    {day.open && day.breakStart
                                        ? `${day.breakStart} – ${day.breakEnd}`
                                        : day.open
                                          ? "No break"
                                          : "—"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <p className="settings-phase2__note" style={{ marginTop: 14 }}>
                Editing working hours requires backend integration to prevent
                double-booking against existing appointments.
            </p>
        </div>
    );
}

export default WorkingHours;
