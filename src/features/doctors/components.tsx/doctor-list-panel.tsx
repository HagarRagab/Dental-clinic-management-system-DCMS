import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { DoctorProfile } from "../doctor-schedule.types";

function DoctorListPanel({
    doctors,
    setSelectedDoctorId,
    setFeedback,
    selectedDoctor,
    doctorStatusClass,
}: {
    doctors: DoctorProfile[];
    setSelectedDoctorId: Dispatch<SetStateAction<string>>;
    setFeedback: Dispatch<SetStateAction<string>>;
    selectedDoctor: DoctorProfile;
    doctorStatusClass: (status: DoctorProfile["status"]) => string;
}) {
    const [doctorQuery, setDoctorQuery] = useState("");

    const filteredDoctors = useMemo(() => {
        const normalizedQuery = doctorQuery.trim().toLowerCase();
        if (!normalizedQuery) {
            return doctors;
        }
        return doctors.filter((doctor) =>
            [doctor.name, doctor.specialty, doctor.branch, doctor.status].some(
                (value) => value.toLowerCase().includes(normalizedQuery),
            ),
        );
    }, [doctorQuery, doctors]);

    return (
        <aside className="doctor-list-panel">
            <div className="panel-header doctor-panel-header">
                <div>
                    <h2>Dentists</h2>
                    <p>Select a doctor to configure availability</p>
                </div>
                <div className="doctor-search">
                    <Search aria-hidden="true" />
                    <input
                        type="search"
                        value={doctorQuery}
                        onChange={(event) => setDoctorQuery(event.target.value)}
                        placeholder="Search doctors"
                        aria-label="search doctors"
                    />
                </div>
            </div>
            <div className="doctor-list">
                {filteredDoctors.map((doctor) => (
                    <button
                        key={doctor.id}
                        type="button"
                        className={`doctor-list-item ${selectedDoctor.id === doctor.id ? "doctor-list-item--active" : ""}`}
                        onClick={() => {
                            setSelectedDoctorId(doctor.id);
                            setFeedback("");
                        }}
                        aria-pressed={selectedDoctor.id === doctor.id}
                    >
                        <span className="doctor-avatar">{doctor.initials}</span>
                        <span>
                            <strong>{doctor.name}</strong>
                            <small>{doctor.specialty}</small>
                        </span>
                        <em
                            className={`doctor-status doctor-status--${doctorStatusClass(doctor.status)}`}
                        >
                            {doctor.status}
                        </em>
                    </button>
                ))}
            </div>
        </aside>
    );
}

export default DoctorListPanel;
