"use client";

import { Plus, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import type { UserRole } from "@/types";
import type {
    AppointmentTypeConfig,
    ClinicalProcedure,
    ServiceCategory,
    ServicesStatusFilter,
    ServicesTab,
} from "@/features/services/services.types";
import {
    mockAppointmentTypes,
    mockProcedures,
    serviceCategories,
} from "@/features/services/services/mock-services-service";
import { dashboardUsers } from "@/features/dashboard/services/mock-dashboard-service";
import MetricsBanner from "../components/metrics-banner";
import FeedbackAlert from "../components/feedback-alert";
import WorkspaceTabs from "../components/workspace-tabs";
import FilterToolbar from "../components/filter-toolbar";
import ClinicalProcedures from "../components/clinical-procedures";
import AppointmentTemplates from "../components/appointment-templates";
import AddProcedureModal from "../components/add-procedure-modal";
import EditProcedureModal from "../components/edit-procedure-modal";
import AddAppointmentTemplateModal from "../components/add-appointment-template-modal";
import EditAppointmentTemplateModal from "../components/edit-appointment-template-modal";

export function ServicesScreen({ initialRole }: { initialRole: UserRole }) {
    const [role, setRole] = useState<UserRole>(initialRole);
    const [activeTab, setActiveTab] = useState<ServicesTab>("procedures");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] =
        useState<ServiceCategory>("All");
    const [statusFilter, setStatusFilter] =
        useState<ServicesStatusFilter>("all");
    const [feedback, setFeedback] = useState("");

    // Procedures State
    const [procedures, setProcedures] =
        useState<ClinicalProcedure[]>(mockProcedures);
    const [editingProcedure, setEditingProcedure] =
        useState<ClinicalProcedure | null>(null);
    const [showAddProcModal, setShowAddProcModal] = useState(false);

    // Appointment Types State
    const [appointmentTypes, setAppointmentTypes] =
        useState<AppointmentTypeConfig[]>(mockAppointmentTypes);
    const [editingApptType, setEditingApptType] =
        useState<AppointmentTypeConfig | null>(null);
    const [showAddApptModal, setShowAddApptModal] = useState(false);

    // Role Protection
    if (role !== "admin") {
        return (
            <AppShell
                activeItem="Services"
                role={role}
                userName={dashboardUsers[role]}
                onRoleChange={setRole}
            >
                <section
                    className="permission-state"
                    aria-labelledby="services-restricted-title"
                >
                    <span className="permission-state__icon">
                        <ShieldAlert aria-hidden="true" />
                    </span>
                    <p className="page-heading__eyebrow">
                        Restricted administration area
                    </p>
                    <h1 id="services-restricted-title">
                        Services configuration is admin-only
                    </h1>
                    <p>
                        Modifying clinic fee schedules, procedure catalogs, and
                        appointment booking templates requires administrative
                        security privileges.
                    </p>
                </section>
            </AppShell>
        );
    }

    return (
        <AppShell
            activeItem="Services"
            role={role}
            userName={dashboardUsers[role]}
            onRoleChange={setRole}
        >
            <header className="page-heading">
                <div>
                    <p className="page-heading__eyebrow">
                        Clinic configuration
                    </p>
                    <h1>Services &amp; Appointment Types</h1>
                    <p>
                        Configure procedure catalog, CDT codes, standard fees,
                        and booking slot templates.
                    </p>
                </div>
                <div className="services-header-actions">
                    {activeTab === "procedures" ? (
                        <button
                            type="button"
                            className="button button--primary"
                            onClick={() => setShowAddProcModal(true)}
                        >
                            <Plus aria-hidden="true" /> Add procedure
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="button button--primary"
                            onClick={() => setShowAddApptModal(true)}
                        >
                            <Plus aria-hidden="true" /> Add appointment template
                        </button>
                    )}
                </div>
            </header>

            {/* Metrics Banner */}
            <MetricsBanner
                appointmentTypes={appointmentTypes}
                procedures={procedures}
            />

            {/* Feedback Alert */}
            {feedback && (
                <FeedbackAlert feedback={feedback} setFeedback={setFeedback} />
            )}

            {/* Workspace Tabs */}
            <WorkspaceTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                procedures={procedures}
                appointmentTypes={appointmentTypes}
            />

            {/* Filter Toolbar */}
            <FilterToolbar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                activeTab={activeTab}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                serviceCategories={serviceCategories}
            />

            {/* Tab 1: Clinical Procedures */}
            {activeTab === "procedures" && (
                <ClinicalProcedures
                    procedures={procedures}
                    searchQuery={searchQuery}
                    selectedCategory={selectedCategory}
                    statusFilter={statusFilter}
                    setProcedures={setProcedures}
                    setFeedback={setFeedback}
                    setEditingProcedure={setEditingProcedure}
                />
            )}

            {/* Tab 2: Appointment Templates */}
            {activeTab === "appointment-types" && (
                <AppointmentTemplates
                    appointmentTypes={appointmentTypes}
                    searchQuery={searchQuery}
                    statusFilter={statusFilter}
                    setEditingApptType={setEditingApptType}
                    setFeedback={setFeedback}
                    setAppointmentTypes={setAppointmentTypes}
                />
            )}

            {/* Add Procedure Modal */}
            {showAddProcModal && (
                <AddProcedureModal
                    setProcedures={setProcedures}
                    setShowAddProcModal={setShowAddProcModal}
                    setFeedback={setFeedback}
                    serviceCategories={serviceCategories}
                />
            )}

            {/* Edit Procedure Modal */}
            {editingProcedure && (
                <EditProcedureModal
                    editingProcedure={editingProcedure}
                    setEditingProcedure={setEditingProcedure}
                    setFeedback={setFeedback}
                    setProcedures={setProcedures}
                />
            )}

            {/* Add Appointment Template Modal */}
            {showAddApptModal && (
                <AddAppointmentTemplateModal
                    setAppointmentTypes={setAppointmentTypes}
                    setFeedback={setFeedback}
                    setShowAddApptModal={setShowAddApptModal}
                />
            )}

            {/* Edit Appointment Template Modal */}
            {editingApptType && (
                <EditAppointmentTemplateModal
                    editingApptType={editingApptType}
                    setAppointmentTypes={setAppointmentTypes}
                    setEditingApptType={setEditingApptType}
                    setFeedback={setFeedback}
                />
            )}
        </AppShell>
    );
}
