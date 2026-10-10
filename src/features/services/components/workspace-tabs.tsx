import { Dispatch, SetStateAction } from "react";
import { Calendar, Layers } from "lucide-react";
import {
    AppointmentTypeConfig,
    ClinicalProcedure,
    ServicesTab,
} from "../services.types";

function WorkspaceTabs({
    activeTab,
    setActiveTab,
    procedures,
    appointmentTypes,
}: {
    activeTab: ServicesTab;
    setActiveTab: Dispatch<SetStateAction<ServicesTab>>;
    procedures: ClinicalProcedure[];
    appointmentTypes: AppointmentTypeConfig[];
}) {
    return (
        <div
            className="services-tab-bar"
            role="tablist"
            aria-label="Services catalog tabs"
        >
            <button
                type="button"
                role="tab"
                aria-selected={activeTab === "procedures"}
                className={`services-tab-btn ${activeTab === "procedures" ? "services-tab-btn--active" : ""}`}
                onClick={() => setActiveTab("procedures")}
            >
                <Layers aria-hidden="true" />
                <span>Clinical Procedures &amp; Pricing</span>
                <span className="services-badge-count">
                    {procedures.length}
                </span>
            </button>
            <button
                type="button"
                role="tab"
                aria-selected={activeTab === "appointment-types"}
                className={`services-tab-btn ${activeTab === "appointment-types" ? "services-tab-btn--active" : ""}`}
                onClick={() => setActiveTab("appointment-types")}
            >
                <Calendar aria-hidden="true" />
                <span>Appointment Templates</span>
                <span className="services-badge-count">
                    {appointmentTypes.length}
                </span>
            </button>
        </div>
    );
}

export default WorkspaceTabs;
