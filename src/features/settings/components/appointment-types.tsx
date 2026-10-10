import { useState } from "react";
import { Info } from "lucide-react";
import { AppointmentTypeConfig } from "../settings.types";

function AppointmentTypes({
    settingsData,
}: {
    settingsData: AppointmentTypeConfig[];
}) {
    const [apptTypes, setApptTypes] = useState(settingsData);

    return (
        <div className="settings-table-section">
            <p className="settings-section-note">
                <Info aria-hidden="true" /> Changes are local and reset on
                refresh. Real persistence requires backend integration.
            </p>
            <div className="settings-table-wrap">
                <table className="settings-table">
                    <thead>
                        <tr>
                            <th scope="col">Type</th>
                            <th scope="col">Duration</th>
                            <th scope="col">Default price</th>
                            <th scope="col">Status</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {apptTypes.map((apt) => (
                            <tr key={apt.id}>
                                <td>
                                    <span
                                        className="settings-color-dot"
                                        style={{
                                            background: apt.color,
                                        }}
                                        aria-hidden="true"
                                    />
                                    <strong>{apt.name}</strong>
                                </td>
                                <td>{apt.defaultDurationMinutes} min</td>
                                <td>EGP {apt.defaultPrice.toLocaleString()}</td>
                                <td>
                                    <span
                                        className={`settings-status ${apt.active ? "settings-status--active" : "settings-status--inactive"}`}
                                    >
                                        {apt.active ? "Active" : "Inactive"}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        type="button"
                                        className="settings-text-action"
                                        onClick={() =>
                                            setApptTypes((prev) =>
                                                prev.map((a) =>
                                                    a.id === apt.id
                                                        ? {
                                                              ...a,
                                                              active: !a.active,
                                                          }
                                                        : a,
                                                ),
                                            )
                                        }
                                    >
                                        {apt.active ? "Deactivate" : "Activate"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AppointmentTypes;
