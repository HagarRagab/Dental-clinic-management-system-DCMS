import { UserRound } from "lucide-react";
import { AvailabilitySlot, DoctorProfile } from "../doctor-schedule.types";

function slotStatusClass(status: string) {
    return status.toLowerCase();
}

function AvailabilityPanel({
    availabilityData,
    selectedDoctor,
}: {
    availabilityData: Record<string, AvailabilitySlot[]>;
    selectedDoctor: DoctorProfile;
}) {
    return (
        <article className="availability-panel">
            <div className="panel-header">
                <div>
                    <h2>Appointment availability</h2>
                    <p>Today, 15 Sep 2026</p>
                </div>
                <UserRound aria-hidden="true" />
            </div>
            <div className="availability-slots" aria-label="Availability slots">
                {(availabilityData[selectedDoctor.id] ?? []).map((slot) => (
                    <button
                        key={`${slot.time}-${slot.note}`}
                        type="button"
                        className={`availability-slot availability-slot--${slotStatusClass(slot.status)}`}
                    >
                        <strong>{slot.time}</strong>
                        <span>{slot.status}</span>
                        <small>{slot.note}</small>
                    </button>
                ))}
            </div>
        </article>
    );
}

export default AvailabilityPanel;
