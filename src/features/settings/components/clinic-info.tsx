import { SubmitEvent, useState } from "react";
import { ClinicSettings } from "../settings.types";

function ClinicInformation({
    showSaved,
    settingsData,
}: {
    showSaved: () => void;
    settingsData: ClinicSettings;
}) {
    const [clinic, setClinic] = useState(settingsData);

    function handleClinicSave(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        setClinic({
            name: String(fd.get("name") ?? clinic.name),
            specialty: String(fd.get("specialty") ?? clinic.specialty),
            address: String(fd.get("address") ?? clinic.address),
            phone: String(fd.get("phone") ?? clinic.phone),
            email: String(fd.get("email") ?? clinic.email),
            registrationNumber: String(
                fd.get("registrationNumber") ?? clinic.registrationNumber,
            ),
            taxId: String(fd.get("taxId") ?? clinic.taxId),
            website: String(fd.get("website") ?? clinic.website),
        });
        showSaved();
    }

    return (
        <form className="settings-form" onSubmit={handleClinicSave}>
            <div className="settings-form__grid">
                <label>
                    <span>Clinic name</span>
                    <input
                        name="name"
                        type="text"
                        defaultValue={clinic.name}
                        required
                    />
                </label>
                <label>
                    <span>Specialty</span>
                    <input
                        name="specialty"
                        type="text"
                        defaultValue={clinic.specialty}
                    />
                </label>
                <label className="settings-form__full">
                    <span>Address</span>
                    <input
                        name="address"
                        type="text"
                        defaultValue={clinic.address}
                    />
                </label>
                <label>
                    <span>Phone</span>
                    <input
                        name="phone"
                        type="tel"
                        defaultValue={clinic.phone}
                    />
                </label>
                <label>
                    <span>Email</span>
                    <input
                        name="email"
                        type="email"
                        defaultValue={clinic.email}
                    />
                </label>
                <label>
                    <span>Registration number</span>
                    <input
                        name="registrationNumber"
                        type="text"
                        defaultValue={clinic.registrationNumber}
                    />
                </label>
                <label>
                    <span>Tax ID</span>
                    <input
                        name="taxId"
                        type="text"
                        defaultValue={clinic.taxId}
                    />
                </label>
                <label>
                    <span>Website</span>
                    <input
                        name="website"
                        type="url"
                        defaultValue={clinic.website}
                    />
                </label>
            </div>
            <div className="settings-form__actions">
                <button type="submit" className="button button--primary">
                    Save clinic information
                </button>
            </div>
        </form>
    );
}

export default ClinicInformation;
