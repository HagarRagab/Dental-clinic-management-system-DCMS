import { CalendarClock } from "lucide-react";
import { Dispatch, SetStateAction, SubmitEvent } from "react";
import { BlockedSlot, DoctorProfile } from "../doctor-schedule.types";

function BlockedTimeForm({
    setFeedback,
    selectedDoctor,
    setBlockedSlots,
}: {
    setFeedback: Dispatch<SetStateAction<string>>;
    selectedDoctor: DoctorProfile;
    setBlockedSlots: Dispatch<SetStateAction<BlockedSlot[]>>;
}) {
    function addBlockedSlot(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const start = String(form.get("start"));
        const end = String(form.get("end"));
        const reason = String(form.get("reason") || "").trim();
        if (!start || !end || start >= end || !reason) {
            setFeedback(
                "Enter a valid time range and reason for the blocked slot.",
            );
            return;
        }
        const slot: BlockedSlot = {
            id: `blocked-${Date.now()}`,
            doctorId: selectedDoctor.id,
            date: String(form.get("date")),
            start,
            end,
            type: "Blocked time",
            reason,
        };
        setBlockedSlots((current) => [slot, ...current]);
        setFeedback(
            `${selectedDoctor.name} is blocked on ${slot.date} from ${start} to ${end}.`,
        );
        event.currentTarget.reset();
    }

    return (
        <form
            id="blocked-time-form"
            className="doctor-action-panel doctor-action-panel--persistent"
            onSubmit={addBlockedSlot}
        >
            <div>
                <p className="panel-kicker">Blocked time</p>
                <h2>Block availability for {selectedDoctor.name}</h2>
                <p>Blocked periods prevent normal appointment booking.</p>
            </div>
            <div className="doctor-form-grid">
                <label>
                    <span>Date</span>
                    <select name="date" defaultValue="15 Sep 2026">
                        <option>15 Sep 2026</option>
                        <option>16 Sep 2026</option>
                        <option>17 Sep 2026</option>
                    </select>
                </label>
                <label>
                    <span>Start</span>
                    <input
                        name="start"
                        type="time"
                        defaultValue="12:00"
                        required
                    />
                </label>
                <label>
                    <span>End</span>
                    <input
                        name="end"
                        type="time"
                        defaultValue="12:30"
                        required
                    />
                </label>
                <label>
                    <span>Reason</span>
                    <input
                        name="reason"
                        type="text"
                        placeholder="Reason"
                        required
                    />
                </label>
            </div>
            <div className="doctor-action-panel__actions">
                <button type="reset" className="button button--secondary">
                    Clear
                </button>
                <button type="submit" className="button button--primary">
                    <CalendarClock aria-hidden="true" />
                    Save blocked time
                </button>
            </div>
        </form>
    );
}

export default BlockedTimeForm;
