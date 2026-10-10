import { UserPlus, X } from "lucide-react";
import { type SubmitEvent, useState } from "react";

function NewPatientModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (name: string) => void;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState<"Male" | "Female">("Female");

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !mobile.trim()) return;
    onAdd(`${firstName.trim()} ${lastName.trim()}`);
    onClose();
  }

  return (
    <div
      className="pl-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-patient-title"
    >
      <div className="pl-modal">
        <div className="pl-modal__header">
          <div>
            <h2 id="new-patient-title">New Patient</h2>
            <p>
              Register a new patient in the clinic. Mock only — not persisted.
            </p>
          </div>
          <button
            type="button"
            className="pl-modal__close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X aria-hidden="true" size={18} />
          </button>
        </div>
        <form className="pl-modal__body" onSubmit={handleSubmit} noValidate>
          <div className="pl-form-row">
            <label className="pl-form-field">
              <span>
                First name{" "}
                <span aria-hidden="true" style={{ color: "#dc2626" }}>
                  *
                </span>
              </span>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. Sara"
                required
                autoFocus
              />
            </label>
            <label className="pl-form-field">
              <span>
                Last name{" "}
                <span aria-hidden="true" style={{ color: "#dc2626" }}>
                  *
                </span>
              </span>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="e.g. Khaled"
                required
              />
            </label>
          </div>
          <label className="pl-form-field">
            <span>
              Mobile{" "}
              <span aria-hidden="true" style={{ color: "#dc2626" }}>
                *
              </span>
            </span>
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="e.g. 010 1234 5678"
              required
            />
          </label>
          <div className="pl-form-row">
            <label className="pl-form-field">
              <span>Date of birth</span>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </label>
            <label className="pl-form-field">
              <span>Gender</span>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as "Male" | "Female")}
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
              </select>
            </label>
          </div>
          <p className="pl-modal__prototype-note">
            This is a prototype — submitted records are not stored or persisted.
          </p>
          <div className="pl-modal__actions">
            <button
              type="button"
              className="button button--secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="button button--primary"
              disabled={!firstName.trim() || !lastName.trim() || !mobile.trim()}
            >
              <UserPlus aria-hidden="true" size={15} />
              Register Patient
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewPatientModal;
