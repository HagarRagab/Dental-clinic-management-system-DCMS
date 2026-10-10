import { AlertTriangle, History } from "lucide-react";
import { BlockedSlot } from "../doctor-schedule.types";

function BlockedPanel({
    selectedBlockedSlots,
}: {
    selectedBlockedSlots: BlockedSlot[];
}) {
    return (
        <article className="blocked-panel">
            <div className="panel-header">
                <div>
                    <h2>Leave and blocked slots</h2>
                    <p>Admin-controlled availability exceptions</p>
                </div>
                <AlertTriangle aria-hidden="true" />
            </div>
            <div className="blocked-list">
                {selectedBlockedSlots.map((slot) => (
                    <article key={slot.id}>
                        <span className="blocked-list__icon">
                            <History aria-hidden="true" />
                        </span>
                        <div>
                            <strong>{slot.type}</strong>
                            <small>
                                {slot.date} - {slot.start} to {slot.end}
                            </small>
                            <small>{slot.reason}</small>
                        </div>
                    </article>
                ))}
                {!selectedBlockedSlots.length ? (
                    <p className="doctor-empty-copy">
                        No blocked time is recorded for this doctor.
                    </p>
                ) : null}
            </div>
        </article>
    );
}

export default BlockedPanel;
