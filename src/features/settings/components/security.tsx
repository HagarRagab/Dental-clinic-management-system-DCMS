import { SubmitEvent, useState } from "react";
import { Info } from "lucide-react";
import { SecurityConfig } from "../settings.types";

function Security({
    showSaved,
    settingsData,
}: {
    showSaved: () => void;
    settingsData: SecurityConfig;
}) {
    const [security, setSecurity] = useState(settingsData);

    function handleSecuritySave(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        setSecurity({
            sessionTimeoutMinutes:
                Number(fd.get("sessionTimeoutMinutes")) ||
                security.sessionTimeoutMinutes,
            passwordMinLength:
                Number(fd.get("passwordMinLength")) ||
                security.passwordMinLength,
            requireUppercase: fd.get("requireUppercase") === "on",
            requireSpecialChar: fd.get("requireSpecialChar") === "on",
            mfaRequiredForAdmin: fd.get("mfaRequiredForAdmin") === "on",
            loginAttemptLockout:
                Number(fd.get("loginAttemptLockout")) ||
                security.loginAttemptLockout,
        });
        showSaved();
    }

    return (
        <form className="settings-form" onSubmit={handleSecuritySave}>
            <div className="settings-form__grid">
                <label>
                    <span>Session timeout (minutes of inactivity)</span>
                    <input
                        name="sessionTimeoutMinutes"
                        type="number"
                        min={5}
                        max={480}
                        defaultValue={security.sessionTimeoutMinutes}
                    />
                </label>
                <label>
                    <span>Minimum password length</span>
                    <input
                        name="passwordMinLength"
                        type="number"
                        min={8}
                        max={32}
                        defaultValue={security.passwordMinLength}
                    />
                </label>
                <label>
                    <span>Failed login lockout (attempts)</span>
                    <input
                        name="loginAttemptLockout"
                        type="number"
                        min={3}
                        max={20}
                        defaultValue={security.loginAttemptLockout}
                    />
                </label>
            </div>
            <div className="settings-toggles">
                <label className="settings-toggle-row">
                    <span>
                        <strong>Require uppercase letter in passwords</strong>
                        <small>At least one A–Z character required</small>
                    </span>
                    <input
                        name="requireUppercase"
                        type="checkbox"
                        role="switch"
                        defaultChecked={security.requireUppercase}
                    />
                </label>
                <label className="settings-toggle-row">
                    <span>
                        <strong>Require special character in passwords</strong>
                        <small>At least one symbol (!@#$…) required</small>
                    </span>
                    <input
                        name="requireSpecialChar"
                        type="checkbox"
                        role="switch"
                        defaultChecked={security.requireSpecialChar}
                    />
                </label>
                <label className="settings-toggle-row">
                    <span>
                        <strong>MFA required for Admin accounts</strong>
                        <small>
                            Admins must enrol TOTP before accessing the system
                        </small>
                    </span>
                    <input
                        name="mfaRequiredForAdmin"
                        type="checkbox"
                        role="switch"
                        defaultChecked={security.mfaRequiredForAdmin}
                    />
                </label>
            </div>
            <div className="settings-phase2 settings-phase2--inline">
                <Info aria-hidden="true" />
                <p>
                    These settings are UI affordances only. Enforcement requires
                    the backend auth layer. Do not rely on these controls for
                    production security.
                </p>
            </div>
            <div className="settings-form__actions">
                <button type="submit" className="button button--primary">
                    Save security settings
                </button>
            </div>
        </form>
    );
}

export default Security;
