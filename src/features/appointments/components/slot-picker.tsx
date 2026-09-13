export function SlotPicker({ selectedSlot, slots, onSelect }: { selectedSlot: string; slots: string[]; onSelect: (slot: string) => void }) {
  return <div className="slot-picker" role="group" aria-label="Available appointment times">{slots.map((slot) => <button type="button" key={slot} className={selectedSlot === slot ? "slot-picker__selected" : ""} onClick={() => onSelect(slot)} aria-pressed={selectedSlot === slot}>{slot}</button>)}</div>;
}
