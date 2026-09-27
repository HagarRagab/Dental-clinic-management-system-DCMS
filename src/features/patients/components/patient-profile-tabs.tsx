"use client";

import { useState } from "react";
import {
    CalendarDays,
    CheckCircle2,
    FileText,
    Image as ImageIcon,
    Printer,
    ReceiptText,
    Stethoscope,
    WalletCards,
} from "lucide-react";
import type {
    PatientProfile,
    PatientTab,
} from "@/features/patients/patient.types";
import type { UserRole } from "@/types";
import type { BillingInvoice } from "@/features/billing/billing.types";
import { mockInvoices } from "@/features/billing/services/mock-billing-service";
import { InvoicePdfModal } from "@/features/billing/components/invoice-pdf-modal";
import { TreatmentPlansTab } from "@/features/treatment-plans/pages/treatment-plans-tab";
import type { OdontogramChartData } from "@/features/odontogram/odontogram.types";
import {
    buildInitialMariamAdelChart,
    calculateChartSummary,
    conditionDefinitions,
} from "@/features/odontogram/services/mock-odontogram-service";
import { OdontogramEditorModal } from "@/features/odontogram/components/odontogram-editor-modal";

type PatientProfileTabsProps = {
    activeTab: PatientTab;
    onChange: (tab: PatientTab) => void;
    patient: PatientProfile;
    role: UserRole;
};

const allTabs: PatientTab[] = [
    "Overview",
    "Appointments",
    "Clinical Records",
    "Treatment Plans",
    "Odontogram",
    "Invoices",
    "Payments",
    "Patient Statement",
    "Attachments",
];
const receptionistTabs: PatientTab[] = [
    "Overview",
    "Appointments",
    "Treatment Plans",
    "Invoices",
    "Payments",
    "Patient Statement",
];
const dentistTabs: PatientTab[] = [
    "Overview",
    "Appointments",
    "Clinical Records",
    "Treatment Plans",
    "Odontogram",
    "Attachments",
];

export function PatientProfileTabs({
    activeTab,
    onChange,
    patient,
    role,
}: PatientProfileTabsProps) {
    const availableTabs =
        role === "admin"
            ? allTabs
            : role === "receptionist"
              ? receptionistTabs
              : dentistTabs;
    return (
        <>
            <div
                className="patient-tabs"
                role="tablist"
                aria-label="Patient record sections"
            >
                {availableTabs.map((tab) => (
                    <button
                        key={tab}
                        type="button"
                        role="tab"
                        aria-selected={activeTab === tab}
                        className={
                            activeTab === tab ? "patient-tabs__active" : ""
                        }
                        onClick={() => onChange(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>
            <section
                className="patient-tab-panel"
                role="tabpanel"
                aria-label={activeTab}
            >
                {renderTab(activeTab, patient, role)}
            </section>
        </>
    );
}

function renderTab(tab: PatientTab, patient: PatientProfile, role: UserRole) {
    if (tab === "Overview")
        return (
            <div className="profile-overview">
                <section className="profile-section">
                    <div className="profile-section__header">
                        <div>
                            <h2>Patient details</h2>
                            <p>Operational information</p>
                        </div>
                        <button
                            type="button"
                            className="text-button text-button--compact"
                        >
                            Edit details
                        </button>
                    </div>
                    <dl className="patient-detail-grid">
                        <div>
                            <dt>Mobile</dt>
                            <dd>{patient.mobile}</dd>
                        </div>
                        <div>
                            <dt>Date of birth</dt>
                            <dd>
                                {patient.dateOfBirth} · {patient.age} years
                            </dd>
                        </div>
                        <div>
                            <dt>Gender</dt>
                            <dd>{patient.gender}</dd>
                        </div>
                        <div>
                            <dt>Address</dt>
                            <dd>{patient.address}</dd>
                        </div>
                        <div>
                            <dt>Emergency contact</dt>
                            <dd>{patient.emergencyContact}</dd>
                        </div>
                        <div>
                            <dt>Current medications</dt>
                            <dd>
                                {role === "receptionist"
                                    ? "Restricted clinical information"
                                    : patient.currentMedications}
                            </dd>
                        </div>
                    </dl>
                </section>
                {role !== "receptionist" ? (
                    <section className="profile-section profile-section--clinical">
                        <div className="profile-section__header">
                            <div>
                                <h2>Clinical summary</h2>
                                <p>Visible to authorized clinical users</p>
                            </div>
                            <Stethoscope aria-hidden="true" />
                        </div>
                        <div className="clinical-summary-grid">
                            <div>
                                <span>Allergies</span>
                                <strong>{patient.allergies.join(", ")}</strong>
                            </div>
                            <div>
                                <span>Last clinical record</span>
                                <strong>8 September · Dr. Karim Mostafa</strong>
                            </div>
                            <div>
                                <span>Open treatment plan</span>
                                <strong>
                                    Root canal and crown restoration
                                </strong>
                            </div>
                        </div>
                    </section>
                ) : null}
            </div>
        );
    if (tab === "Appointments")
        return (
            <section className="profile-section">
                <div className="profile-section__header">
                    <div>
                        <h2>Appointments</h2>
                        <p>Recent and upcoming visits</p>
                    </div>
                    <button
                        type="button"
                        className="button button--secondary profile-action-button"
                    >
                        <CalendarDays aria-hidden="true" />
                        New appointment
                    </button>
                </div>
                <div className="patient-timeline">
                    <article>
                        <time>
                            13 Sep
                            <br />
                            <strong>14:00</strong>
                        </time>
                        <div>
                            <span className="status-badge status-badge--confirmed">
                                Confirmed
                            </span>
                            <h3>Root canal follow-up</h3>
                            <p>Dr. Karim Mostafa · Chair 2</p>
                        </div>
                    </article>
                    <article>
                        <time>
                            08 Sep
                            <br />
                            <strong>10:30</strong>
                        </time>
                        <div>
                            <span className="status-badge status-badge--confirmed">
                                Completed
                            </span>
                            <h3>Root canal treatment</h3>
                            <p>Dr. Karim Mostafa · Clinical record finalized</p>
                        </div>
                    </article>
                    <article>
                        <time>
                            30 Aug
                            <br />
                            <strong>15:00</strong>
                        </time>
                        <div>
                            <span className="status-badge status-badge--booked">
                                Completed
                            </span>
                            <h3>Consultation</h3>
                            <p>Dr. Salma Hassan</p>
                        </div>
                    </article>
                </div>
            </section>
        );
    if (tab === "Clinical Records")
        return (
            <section className="profile-section">
                <div className="profile-section__header">
                    <div>
                        <h2>Clinical records</h2>
                        <p>
                            Finalized records are protected from direct editing.
                        </p>
                    </div>
                    <button
                        type="button"
                        className="button button--primary profile-action-button"
                    >
                        <FileText aria-hidden="true" />
                        New clinical record
                    </button>
                </div>
                <div className="clinical-record-list">
                    <article>
                        <div>
                            <span className="status-badge status-badge--confirmed">
                                <CheckCircle2 aria-hidden="true" />
                                Finalized
                            </span>
                            <h3>Root canal treatment</h3>
                            <p>8 September 2026 · Dr. Karim Mostafa</p>
                        </div>
                        <button
                            type="button"
                            className="button button--secondary"
                        >
                            View record
                        </button>
                    </article>
                    <article>
                        <div>
                            <span className="status-badge status-badge--booked">
                                Draft
                            </span>
                            <h3>Follow-up preparation</h3>
                            <p>13 September 2026 · Dr. Karim Mostafa</p>
                        </div>
                        <button
                            type="button"
                            className="button button--secondary"
                        >
                            Continue draft
                        </button>
                    </article>
                </div>
            </section>
        );
    if (tab === "Treatment Plans") return <TreatmentPlansTab role={role} />;
    if (tab === "Odontogram") return <PatientOdontogramTab role={role} />;
    if (tab === "Invoices" || tab === "Payments" || tab === "Patient Statement")
        return <PatientFinancialTab tab={tab} patient={patient} />;
    return (
        <section className="profile-section">
            <div className="profile-section__header">
                <div>
                    <h2>Clinical attachments</h2>
                    <p>Private files. Access is recorded.</p>
                </div>
                <button
                    type="button"
                    className="button button--primary profile-action-button"
                >
                    <ImageIcon aria-hidden="true" />
                    Upload file
                </button>
            </div>
            <div className="attachment-list">
                <article>
                    <ImageIcon aria-hidden="true" />
                    <div>
                        <strong>Periapical X-ray · Tooth 16</strong>
                        <span>JPG · 1.8 MB · Uploaded 8 September</span>
                    </div>
                    <button type="button" className="button button--secondary">
                        View
                    </button>
                </article>
                <article>
                    <FileText aria-hidden="true" />
                    <div>
                        <strong>Consent form</strong>
                        <span>PDF · 412 KB · Uploaded 30 August</span>
                    </div>
                    <button type="button" className="button button--secondary">
                        View
                    </button>
                </article>
            </div>
        </section>
    );
}

function PatientFinancialTab({
    tab,
    patient,
}: {
    tab: PatientTab;
    patient: PatientProfile;
}) {
    const [previewInvoice, setPreviewInvoice] = useState<BillingInvoice | null>(null);
    const [notice, setNotice] = useState("");

    function handleExportCsv() {
        setNotice("Financial ledger exported to CSV. Simulated in prototype.");
        setTimeout(() => setNotice(""), 4000);
    }

    return (
        <section className="profile-section">
            <div className="profile-section__header">
                <div>
                    <h2>{tab}</h2>
                    <p>
                        {tab === "Patient Statement"
                            ? "Chronological financial activity"
                            : "Patient billing activity"}
                    </p>
                </div>
                <div className="profile-section__actions" style={{ display: "flex", gap: "8px" }}>
                    {tab === "Invoices" ? (
                        <button
                            type="button"
                            className="button button--secondary profile-action-button"
                            onClick={() => {
                                const inv = mockInvoices.find((i) => i.id === "INV-1019") || mockInvoices[0];
                                setPreviewInvoice(inv);
                            }}
                        >
                            <Printer aria-hidden="true" size={14} />
                            Print statement
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="button button--secondary profile-action-button"
                            onClick={handleExportCsv}
                        >
                            <ReceiptText aria-hidden="true" />
                            Export CSV
                        </button>
                    )}
                </div>
            </div>

            {notice ? (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        background: "#f0fdf4",
                        border: "1px solid #bbf7d0",
                        borderRadius: 8,
                        color: "#15803d",
                        fontSize: 13,
                        fontWeight: 500,
                        padding: "10px 14px",
                        marginBottom: 16,
                    }}
                    role="status"
                >
                    <CheckCircle2 size={14} aria-hidden="true" />
                    <span>{notice}</span>
                </div>
            ) : null}

            <div className="financial-summary">
                <div>
                    <span>Outstanding balance</span>
                    <strong>{patient.balance}</strong>
                </div>
                <div>
                    <span>Total invoiced</span>
                    <strong>EGP 8,200</strong>
                </div>
                <div>
                    <span>Total paid</span>
                    <strong>EGP 6,750</strong>
                </div>
            </div>

            <div className="financial-ledger">
                <article>
                    <span>13 Sep</span>
                    <div>
                        <strong>Invoice #INV-1042</strong>
                        <small>Draft · Root canal follow-up</small>
                    </div>
                    <b>EGP 1,450</b>
                </article>
                <article>
                    <span>08 Sep</span>
                    <div>
                        <strong>Card payment</strong>
                        <small>Receipt #RCT-891 · Invoice #INV-1019</small>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <b className="financial-ledger__positive">EGP 4,500</b>
                        <button
                            type="button"
                            className="button button--secondary button--compact"
                            style={{ padding: "3px 8px", fontSize: 11, minHeight: 28 }}
                            onClick={() => {
                                const inv = mockInvoices.find((i) => i.id === "INV-1019") || mockInvoices[1];
                                setPreviewInvoice(inv);
                            }}
                            aria-label="View and print receipt for payment of EGP 4,500"
                        >
                            <Printer aria-hidden="true" size={11} />
                            <span>Receipt</span>
                        </button>
                    </div>
                </article>
                <article>
                    <span>30 Aug</span>
                    <div>
                        <strong>Cash payment</strong>
                        <small>Receipt #RCT-840 · Consultation</small>
                    </div>
                    <b className="financial-ledger__positive">EGP 2,250</b>
                </article>
            </div>

            {previewInvoice ? (
                <InvoicePdfModal
                    invoice={previewInvoice}
                    onClose={() => setPreviewInvoice(null)}
                />
            ) : null}
        </section>
    );
}

function PatientOdontogramTab({ role }: { role: UserRole }) {
    const [chartData, setChartData] = useState<OdontogramChartData>(buildInitialMariamAdelChart());
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [selectedTooth, setSelectedTooth] = useState(16);
    const [feedback, setFeedback] = useState("");

    function handleOpenEditor(toothNum = 16) {
        setSelectedTooth(toothNum);
        setIsEditorOpen(true);
    }

    function handleSaveChart(newChart: OdontogramChartData) {
        setChartData(newChart);
        setIsEditorOpen(false);
        setFeedback("Odontogram chart updated successfully.");
        setTimeout(() => setFeedback(""), 4000);
    }

    const summary = calculateChartSummary(chartData);

    return (
        <section className="profile-section odontogram-preview">
            <div className="profile-section__header">
                <div>
                    <h2>Odontogram</h2>
                    <p>FDI adult permanent tooth chart · Click any tooth or &quot;Open odontogram&quot; to inspect surfaces and assign conditions.</p>
                </div>
                <button
                    type="button"
                    className="button button--secondary"
                    onClick={() => handleOpenEditor(16)}
                >
                    Open odontogram
                </button>
            </div>

            {feedback && (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        background: "#f0fdf4",
                        border: "1px solid #bbf7d0",
                        borderRadius: 8,
                        color: "#15803d",
                        fontSize: 13,
                        fontWeight: 500,
                        padding: "8px 14px",
                        marginBottom: 16,
                    }}
                    role="status"
                >
                    <CheckCircle2 size={14} aria-hidden="true" />
                    <span>{feedback}</span>
                </div>
            )}

            {/* Quick Metrics Strip */}
            <div className="od-metrics-strip" style={{ padding: "0 0 16px 0", borderBottom: "none" }}>
                <div className="od-metric-pill">
                    <span className="od-metric-dot" style={{ background: conditionDefinitions.healthy.color }} />
                    <span>Sound: <strong>{summary.healthy}</strong></span>
                </div>
                <div className="od-metric-pill">
                    <span className="od-metric-dot" style={{ background: conditionDefinitions.caries.color }} />
                    <span>Caries: <strong>{summary.caries}</strong></span>
                </div>
                <div className="od-metric-pill">
                    <span className="od-metric-dot" style={{ background: conditionDefinitions.composite.color }} />
                    <span>Restored: <strong>{summary.restored}</strong></span>
                </div>
                <div className="od-metric-pill">
                    <span className="od-metric-dot" style={{ background: conditionDefinitions["root-canal"].color }} />
                    <span>Endo/Crown: <strong>{summary.crownEndo}</strong></span>
                </div>
                <div className="od-metric-pill">
                    <span className="od-metric-dot" style={{ background: conditionDefinitions.missing.color }} />
                    <span>Missing: <strong>{summary.missing}</strong></span>
                </div>
            </div>

            {/* Tooth chart preview grid */}
            <div className="tooth-chart">
                <div>
                    {[18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28].map((tooth) => {
                        const rec = chartData.teeth[tooth];
                        let condClass = "tooth";
                        if (rec?.condition === "root-canal" || rec?.condition === "crown") condClass = "tooth tooth--completed";
                        else if (rec?.condition === "caries") condClass = "tooth tooth--planned";
                        else if (rec?.condition === "composite" || rec?.condition === "amalgam") condClass = "tooth tooth--completed";
                        return (
                            <button
                                key={tooth}
                                type="button"
                                className={condClass}
                                onClick={() => handleOpenEditor(tooth)}
                                aria-label={`Tooth ${tooth} (${rec ? conditionDefinitions[rec.condition]?.label : "Healthy"})`}
                                title={`Tooth ${tooth} - ${rec ? conditionDefinitions[rec.condition]?.label : "Healthy"}. Click to open editor.`}
                            >
                                {tooth}
                            </button>
                        );
                    })}
                </div>
                <div>
                    {[48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38].map((tooth) => {
                        const rec = chartData.teeth[tooth];
                        let condClass = "tooth";
                        if (rec?.condition === "root-canal" || rec?.condition === "crown") condClass = "tooth tooth--completed";
                        else if (rec?.condition === "caries") condClass = "tooth tooth--planned";
                        else if (rec?.condition === "composite" || rec?.condition === "amalgam") condClass = "tooth tooth--completed";
                        return (
                            <button
                                key={tooth}
                                type="button"
                                className={condClass}
                                onClick={() => handleOpenEditor(tooth)}
                                aria-label={`Tooth ${tooth} (${rec ? conditionDefinitions[rec.condition]?.label : "Healthy"})`}
                                title={`Tooth ${tooth} - ${rec ? conditionDefinitions[rec.condition]?.label : "Healthy"}. Click to open editor.`}
                            >
                                {tooth}
                            </button>
                        );
                    })}
                </div>
            </div>

            <p className="tooth-chart__legend">
                <span>
                    <i className="legend-dot legend-dot--confirmed" />
                    Treated / Restored
                </span>
                <span>
                    <i className="legend-dot legend-dot--booked" />
                    Active condition / Caries
                </span>
            </p>

            {isEditorOpen && (
                <OdontogramEditorModal
                    initialChart={chartData}
                    initialToothNumber={selectedTooth}
                    onClose={() => setIsEditorOpen(false)}
                    onSave={handleSaveChart}
                    readOnly={role === "receptionist"}
                />
            )}
        </section>
    );
}


