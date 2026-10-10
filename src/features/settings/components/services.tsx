import { Info } from "lucide-react";
import { useState } from "react";
import { ServiceConfig } from "../settings.types";

function Services({ settingsData }: { settingsData: ServiceConfig[] }) {
    const [services, setServices] = useState(settingsData);

    return (
        <div className="settings-table-section">
            <p className="settings-section-note">
                <Info aria-hidden="true" /> Changes are local and reset on
                refresh.
            </p>
            <div className="settings-table-wrap">
                <table className="settings-table">
                    <thead>
                        <tr>
                            <th scope="col">Service</th>
                            <th scope="col">Category</th>
                            <th scope="col">Default price</th>
                            <th scope="col">Status</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.map((svc) => (
                            <tr key={svc.id}>
                                <td>
                                    <strong>{svc.name}</strong>
                                </td>
                                <td>{svc.category}</td>
                                <td>EGP {svc.defaultPrice.toLocaleString()}</td>
                                <td>
                                    <span
                                        className={`settings-status ${svc.active ? "settings-status--active" : "settings-status--inactive"}`}
                                    >
                                        {svc.active ? "Active" : "Inactive"}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        type="button"
                                        className="settings-text-action"
                                        onClick={() =>
                                            setServices((prev) =>
                                                prev.map((s) =>
                                                    s.id === svc.id
                                                        ? {
                                                              ...s,
                                                              active: !s.active,
                                                          }
                                                        : s,
                                                ),
                                            )
                                        }
                                    >
                                        {svc.active ? "Deactivate" : "Activate"}
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

export default Services;
