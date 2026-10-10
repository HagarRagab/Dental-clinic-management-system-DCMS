import { SubmitEvent, useState } from "react";
import { AppointmentRulesConfig } from "../settings.types";

function AppointmentRules({
    showSaved,
    settingsData,
}: {
    showSaved: () => void;
    settingsData: AppointmentRulesConfig;
}) {
    const [rules, setRules] = useState(settingsData);

    function handleRulesSave(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        setRules({
            defaultSlotMinutes:
                Number(fd.get("defaultSlotMinutes")) ||
                rules.defaultSlotMinutes,
            minAdvanceBookingHours:
                Number(fd.get("minAdvanceBookingHours")) ||
                rules.minAdvanceBookingHours,
            maxAdvanceBookingDays:
                Number(fd.get("maxAdvanceBookingDays")) ||
                rules.maxAdvanceBookingDays,
            allowDoubleBooking: fd.get("allowDoubleBooking") === "on",
            requireAdminOverrideReason:
                fd.get("requireAdminOverrideReason") === "on",
            autoConfirm: fd.get("autoConfirm") === "on",
            cancellationCutoffHours:
                Number(fd.get("cancellationCutoffHours")) ||
                rules.cancellationCutoffHours,
        });
        showSaved();
    }

    return (
        <form className="settings-form" onSubmit={handleRulesSave}>
            <div className="settings-form__grid">
                <label>
                    <span>Default slot duration (minutes)</span>
                    <input
                        name="defaultSlotMinutes"
                        type="number"
                        min={5}
                        max={240}
                        step={5}
                        defaultValue={rules.defaultSlotMinutes}
                    />
                </label>
                <label>
                    <span>Minimum advance booking (hours)</span>
                    <input
                        name="minAdvanceBookingHours"
                        type="number"
                        min={0}
                        defaultValue={rules.minAdvanceBookingHours}
                    />
                </label>
                <label>
                    <span>Maximum advance booking (days)</span>
                    <input
                        name="maxAdvanceBookingDays"
                        type="number"
                        min={1}
                        defaultValue={rules.maxAdvanceBookingDays}
                    />
                </label>
                <label>
                    <span>Cancellation cut-off (hours before appointment)</span>
                    <input
                        name="cancellationCutoffHours"
                        type="number"
                        min={0}
                        defaultValue={rules.cancellationCutoffHours}
                    />
                </label>
            </div>
            <div className="settings-toggles">
                <label className="settings-toggle-row">
                    <span>
                        <strong>Allow double booking</strong>
                        <small>
                            Permit two appointments in the same chair/dentist
                            slot
                        </small>
                    </span>
                    <input
                        name="allowDoubleBooking"
                        type="checkbox"
                        role="switch"
                        defaultChecked={rules.allowDoubleBooking}
                    />
                </label>
                <label className="settings-toggle-row">
                    <span>
                        <strong>Require Admin override reason</strong>
                        <small>
                            Force a written justification when Admin bypasses a
                            conflict
                        </small>
                    </span>
                    <input
                        name="requireAdminOverrideReason"
                        type="checkbox"
                        role="switch"
                        defaultChecked={rules.requireAdminOverrideReason}
                    />
                </label>
                <label className="settings-toggle-row">
                    <span>
                        <strong>Auto-confirm new bookings</strong>
                        <small>
                            Set appointments to Confirmed automatically on
                            creation
                        </small>
                    </span>
                    <input
                        name="autoConfirm"
                        type="checkbox"
                        role="switch"
                        defaultChecked={rules.autoConfirm}
                    />
                </label>
            </div>
            <div className="settings-form__actions">
                <button type="submit" className="button button--primary">
                    Save appointment rules
                </button>
            </div>
        </form>
    );
}

export default AppointmentRules;
