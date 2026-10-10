import { useState } from "react";
import { BadgeCheck, Info } from "lucide-react";
import { UserConfig } from "../settings.types";

function Users({ settingsData }: { settingsData: UserConfig[] }) {
    const [users] = useState(settingsData);

    return (
        <div className="settings-table-section">
            <p className="settings-section-note">
                <Info aria-hidden="true" /> User accounts shown are mock data.
                Real account creation, password reset, and deactivation require
                backend and secure auth integration.
            </p>
            <div className="settings-table-wrap">
                <table className="settings-table">
                    <thead>
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">Role</th>
                            <th scope="col">MFA</th>
                            <th scope="col">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr
                                key={user.id}
                                className={
                                    !user.active ? "settings-row--closed" : ""
                                }
                            >
                                <td>
                                    <strong>{user.name}</strong>
                                </td>
                                <td>{user.email}</td>
                                <td>
                                    <span className="settings-role-badge">
                                        {user.role.charAt(0).toUpperCase() +
                                            user.role.slice(1)}
                                    </span>
                                </td>
                                <td>
                                    {user.mfaEnabled ? (
                                        <span className="settings-mfa settings-mfa--on">
                                            <BadgeCheck aria-hidden="true" />
                                            Enabled
                                        </span>
                                    ) : (
                                        <span className="settings-mfa settings-mfa--off">
                                            —
                                        </span>
                                    )}
                                </td>
                                <td>
                                    <span
                                        className={`settings-status ${user.active ? "settings-status--active" : "settings-status--inactive"}`}
                                    >
                                        {user.active ? "Active" : "Inactive"}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <p className="settings-phase2__note" style={{ marginTop: 14 }}>
                Invite, deactivate, and role-change actions will be available
                once the auth backend is implemented. Inactive users are
                preserved for audit history.
            </p>
        </div>
    );
}

export default Users;
