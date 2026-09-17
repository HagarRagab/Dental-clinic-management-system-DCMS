"use client";

import {
  AlertCircle,
  BadgePercent,
  Calendar,
  CheckCircle2,
  Clock,
  Coins,
  Edit2,
  Filter,
  Layers,
  Plus,
  Search,
  ShieldAlert,
  Stethoscope,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { AppShell } from "@/components/layout/app-shell";
import type { UserRole } from "@/types";
import type {
  AppointmentTypeConfig,
  ClinicalProcedure,
  ServiceCategory,
  ServicesTab,
} from "@/features/services/services.types";
import {
  formatEgp,
  mockAppointmentTypes,
  mockProcedures,
  serviceCategories,
} from "@/features/services/services/mock-services-service";
import { dashboardUsers } from "@/features/dashboard/services/mock-dashboard-service";

export function ServicesScreen({ initialRole }: { initialRole: UserRole }) {
  const [role, setRole] = useState<UserRole>(initialRole);
  const [activeTab, setActiveTab] = useState<ServicesTab>("procedures");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>("All");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [feedback, setFeedback] = useState("");

  // Procedures State
  const [procedures, setProcedures] = useState<ClinicalProcedure[]>(mockProcedures);
  const [editingProcedure, setEditingProcedure] = useState<ClinicalProcedure | null>(null);
  const [showAddProcModal, setShowAddProcModal] = useState(false);

  // New Procedure Form State
  const [procCode, setProcCode] = useState("");
  const [procName, setProcName] = useState("");
  const [procCategory, setProcCategory] = useState<Exclude<ServiceCategory, "All">>("Diagnostic & Preventive");
  const [procPrice, setProcPrice] = useState(500);
  const [procDuration, setProcDuration] = useState(30);
  const [procDescription, setProcDescription] = useState("");
  const [procToothTarget, setProcToothTarget] = useState(true);

  // Appointment Types State
  const [appointmentTypes, setAppointmentTypes] = useState<AppointmentTypeConfig[]>(mockAppointmentTypes);
  const [editingApptType, setEditingApptType] = useState<AppointmentTypeConfig | null>(null);
  const [showAddApptModal, setShowAddApptModal] = useState(false);

  // New Appointment Type Form State
  const [aptName, setAptName] = useState("");
  const [aptCategory, setAptCategory] = useState("General");
  const [aptDuration, setAptDuration] = useState(30);
  const [aptPrice, setAptPrice] = useState(400);
  const [aptColor, setAptColor] = useState("#0f766e");
  const [aptDesc, setAptDesc] = useState("");

  // Filtered Procedures
  const filteredProcedures = useMemo(() => {
    return procedures.filter((proc) => {
      const matchesSearch =
        proc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proc.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proc.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || proc.category === selectedCategory;
      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "active"
          ? proc.active
          : !proc.active;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [procedures, searchQuery, selectedCategory, statusFilter]);

  // Filtered Appointment Types
  const filteredAppointmentTypes = useMemo(() => {
    return appointmentTypes.filter((apt) => {
      const matchesSearch =
        apt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "active"
          ? apt.active
          : !apt.active;
      return matchesSearch && matchesStatus;
    });
  }, [appointmentTypes, searchQuery, statusFilter]);

  // Calculations for summary metrics
  const activeProcsCount = procedures.filter((p) => p.active).length;
  const avgPrice = Math.round(
    procedures.reduce((sum, p) => sum + p.defaultPrice, 0) / (procedures.length || 1)
  );

  // Procedures handlers
  function toggleProcedureActive(id: string) {
    setProcedures((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = !p.active;
          setFeedback(`Procedure "${p.name}" marked as ${updated ? "active" : "inactive"}.`);
          return { ...p, active: updated };
        }
        return p;
      })
    );
  }

  function handleAddProcedure(e: FormEvent) {
    e.preventDefault();
    if (!procName.trim() || !procCode.trim()) return;

    const newProc: ClinicalProcedure = {
      id: `proc-${Date.now()}`,
      code: procCode.trim().toUpperCase(),
      name: procName.trim(),
      category: procCategory,
      defaultPrice: Number(procPrice) || 0,
      durationMinutes: Number(procDuration) || 15,
      description: procDescription.trim(),
      requiresToothTarget: procToothTarget,
      active: true,
    };

    setProcedures((prev) => [newProc, ...prev]);
    setShowAddProcModal(false);
    setProcCode("");
    setProcName("");
    setProcDescription("");
    setFeedback(`New procedure "${newProc.name}" (${newProc.code}) added to catalog.`);
  }

  function handleSaveEditProcedure(e: FormEvent) {
    e.preventDefault();
    if (!editingProcedure) return;

    setProcedures((prev) =>
      prev.map((p) => (p.id === editingProcedure.id ? editingProcedure : p))
    );
    setFeedback(`Procedure "${editingProcedure.name}" updated successfully.`);
    setEditingProcedure(null);
  }

  function handleDeleteProcedure(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete procedure "${name}"?`)) return;
    setProcedures((prev) => prev.filter((p) => p.id !== id));
    setFeedback(`Procedure "${name}" removed from catalog.`);
  }

  // Appointment types handlers
  function toggleApptTypeActive(id: string) {
    setAppointmentTypes((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const updated = !a.active;
          setFeedback(`Appointment template "${a.name}" marked as ${updated ? "active" : "inactive"}.`);
          return { ...a, active: updated };
        }
        return a;
      })
    );
  }

  function handleAddApptType(e: FormEvent) {
    e.preventDefault();
    if (!aptName.trim()) return;

    const newApt: AppointmentTypeConfig = {
      id: `apt-${Date.now()}`,
      name: aptName.trim(),
      category: aptCategory.trim(),
      defaultDurationMinutes: Number(aptDuration) || 20,
      defaultPrice: Number(aptPrice) || 0,
      color: aptColor,
      description: aptDesc.trim(),
      active: true,
      requiresChair: true,
    };

    setAppointmentTypes((prev) => [...prev, newApt]);
    setShowAddApptModal(false);
    setAptName("");
    setAptDesc("");
    setFeedback(`Appointment template "${newApt.name}" created.`);
  }

  function handleSaveEditApptType(e: FormEvent) {
    e.preventDefault();
    if (!editingApptType) return;

    setAppointmentTypes((prev) =>
      prev.map((a) => (a.id === editingApptType.id ? editingApptType : a))
    );
    setFeedback(`Appointment template "${editingApptType.name}" updated.`);
    setEditingApptType(null);
  }

  // Role Protection
  if (role !== "admin") {
    return (
      <AppShell activeItem="Services" role={role} userName={dashboardUsers[role]} onRoleChange={setRole}>
        <section className="permission-state" aria-labelledby="services-restricted-title">
          <span className="permission-state__icon">
            <ShieldAlert aria-hidden="true" />
          </span>
          <p className="page-heading__eyebrow">Restricted administration area</p>
          <h1 id="services-restricted-title">Services configuration is admin-only</h1>
          <p>
            Modifying clinic fee schedules, procedure catalogs, and appointment
            booking templates requires administrative security privileges.
          </p>
        </section>
      </AppShell>
    );
  }

  return (
    <AppShell activeItem="Services" role={role} userName={dashboardUsers[role]} onRoleChange={setRole}>
      <header className="page-heading">
        <div>
          <p className="page-heading__eyebrow">Clinic configuration</p>
          <h1>Services &amp; Appointment Types</h1>
          <p>Configure procedure catalog, CDT codes, standard fees, and booking slot templates.</p>
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
      <section className="metric-grid" aria-label="Services overview metrics">
        <article className="metric-card">
          <span className="metric-card__icon">
            <Stethoscope aria-hidden="true" />
          </span>
          <p>Total Procedures</p>
          <strong>{procedures.length}</strong>
          <span>In clinical catalog</span>
        </article>
        <article className="metric-card metric-card--success">
          <span className="metric-card__icon">
            <CheckCircle2 aria-hidden="true" />
          </span>
          <p>Active Procedures</p>
          <strong>{activeProcsCount}</strong>
          <span>Available for treatment</span>
        </article>
        <article className="metric-card">
          <span className="metric-card__icon">
            <Calendar aria-hidden="true" />
          </span>
          <p>Appointment Templates</p>
          <strong>{appointmentTypes.length}</strong>
          <span>Booking slot options</span>
        </article>
        <article className="metric-card metric-card--neutral">
          <span className="metric-card__icon">
            <Coins aria-hidden="true" />
          </span>
          <p>Average Fee</p>
          <strong>{formatEgp(avgPrice)}</strong>
          <span>Across all procedures</span>
        </article>
      </section>

      {/* Feedback Alert */}
      {feedback && (
        <p className="services-feedback" role="status">
          <CheckCircle2 aria-hidden="true" />
          <span>{feedback}</span>
          <button
            type="button"
            aria-label="Dismiss message"
            onClick={() => setFeedback("")}
          >
            <X aria-hidden="true" />
          </button>
        </p>
      )}

      {/* Workspace Tabs */}
      <div className="services-tab-bar" role="tablist" aria-label="Services catalog tabs">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "procedures"}
          className={`services-tab-btn ${activeTab === "procedures" ? "services-tab-btn--active" : ""}`}
          onClick={() => setActiveTab("procedures")}
        >
          <Layers aria-hidden="true" />
          <span>Clinical Procedures &amp; Pricing</span>
          <span className="services-badge-count">{procedures.length}</span>
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
          <span className="services-badge-count">{appointmentTypes.length}</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="services-toolbar" role="search" aria-label="Filter catalog">
        <label className="services-search">
          <Search aria-hidden="true" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === "procedures"
                ? "Search by code, procedure name, or description..."
                : "Search appointment templates..."
            }
            aria-label="Search procedures and templates"
          />
        </label>

        {activeTab === "procedures" && (
          <label className="services-filter-select">
            <Filter aria-hidden="true" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as ServiceCategory)}
              aria-label="Filter by category"
            >
              {serviceCategories.map((c) => (
                <option key={c} value={c}>
                  {c === "All" ? "All Categories" : c}
                </option>
              ))}
            </select>
          </label>
        )}

        <label className="services-filter-select">
          <Tag aria-hidden="true" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "inactive")}
            aria-label="Filter by active status"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </label>

        {(searchQuery || selectedCategory !== "All" || statusFilter !== "all") && (
          <button
            type="button"
            className="services-clear-btn"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
              setStatusFilter("all");
            }}
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Tab 1: Clinical Procedures */}
      {activeTab === "procedures" && (
        <section className="services-card" aria-label="Clinical procedures catalog">
          <div className="services-table-wrapper">
            <table className="services-table">
              <thead>
                <tr>
                  <th style={{ width: 100 }}>Code</th>
                  <th>Procedure name</th>
                  <th>Category</th>
                  <th>Duration</th>
                  <th>Default fee</th>
                  <th>Tooth target</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProcedures.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="services-empty-cell">
                      No clinical procedures match your search filters.
                    </td>
                  </tr>
                ) : (
                  filteredProcedures.map((proc) => (
                    <tr key={proc.id} className={!proc.active ? "services-row--inactive" : ""}>
                      <td>
                        <code className="services-code-pill">{proc.code}</code>
                      </td>
                      <td>
                        <div className="services-proc-name">
                          <strong>{proc.name}</strong>
                          {proc.description && <small>{proc.description}</small>}
                        </div>
                      </td>
                      <td>
                        <span className="services-category-pill">{proc.category}</span>
                      </td>
                      <td>
                        <span className="services-duration">
                          <Clock aria-hidden="true" /> {proc.durationMinutes} min
                        </span>
                      </td>
                      <td>
                        <strong className="services-price">{formatEgp(proc.defaultPrice)}</strong>
                      </td>
                      <td>
                        <span className="services-tooth-tag">
                          {proc.requiresToothTarget ? "Specific tooth" : "General arch"}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className={`services-toggle-btn ${
                            proc.active ? "services-toggle-btn--active" : ""
                          }`}
                          onClick={() => toggleProcedureActive(proc.id)}
                          aria-label={`Toggle ${proc.name} active status`}
                        >
                          {proc.active ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div className="services-row-actions">
                          <button
                            type="button"
                            className="icon-button"
                            aria-label={`Edit ${proc.name}`}
                            onClick={() => setEditingProcedure(proc)}
                          >
                            <Edit2 aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            className="icon-button services-delete-btn"
                            aria-label={`Delete ${proc.name}`}
                            onClick={() => handleDeleteProcedure(proc.id, proc.name)}
                          >
                            <Trash2 aria-hidden="true" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="services-footer-bar">
            <span>Showing {filteredProcedures.length} of {procedures.length} procedures</span>
          </div>
        </section>
      )}

      {/* Tab 2: Appointment Templates */}
      {activeTab === "appointment-types" && (
        <section className="services-card" aria-label="Appointment templates catalog">
          <div className="services-table-wrapper">
            <table className="services-table">
              <thead>
                <tr>
                  <th>Color</th>
                  <th>Template name</th>
                  <th>Category</th>
                  <th>Default duration</th>
                  <th>Standard fee</th>
                  <th>Chair required</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointmentTypes.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="services-empty-cell">
                      No appointment templates match your search filters.
                    </td>
                  </tr>
                ) : (
                  filteredAppointmentTypes.map((apt) => (
                    <tr key={apt.id} className={!apt.active ? "services-row--inactive" : ""}>
                      <td>
                        <span
                          className="services-color-dot"
                          style={{ backgroundColor: apt.color }}
                          aria-label={`Color ${apt.color}`}
                        />
                      </td>
                      <td>
                        <div className="services-proc-name">
                          <strong>{apt.name}</strong>
                          {apt.description && <small>{apt.description}</small>}
                        </div>
                      </td>
                      <td>
                        <span className="services-category-pill">{apt.category}</span>
                      </td>
                      <td>
                        <span className="services-duration">
                          <Clock aria-hidden="true" /> {apt.defaultDurationMinutes} min
                        </span>
                      </td>
                      <td>
                        <strong className="services-price">
                          {apt.defaultPrice > 0 ? formatEgp(apt.defaultPrice) : "Free / No charge"}
                        </strong>
                      </td>
                      <td>
                        <span className="services-tooth-tag">
                          {apt.requiresChair ? "Operatory chair" : "Desk consultation"}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className={`services-toggle-btn ${
                            apt.active ? "services-toggle-btn--active" : ""
                          }`}
                          onClick={() => toggleApptTypeActive(apt.id)}
                          aria-label={`Toggle ${apt.name} active status`}
                        >
                          {apt.active ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div className="services-row-actions">
                          <button
                            type="button"
                            className="icon-button"
                            aria-label={`Edit ${apt.name}`}
                            onClick={() => setEditingApptType(apt)}
                          >
                            <Edit2 aria-hidden="true" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="services-footer-bar">
            <span>Showing {filteredAppointmentTypes.length} of {appointmentTypes.length} templates</span>
          </div>
        </section>
      )}

      {/* Add Procedure Modal */}
      {showAddProcModal && (
        <div className="services-modal-backdrop" role="dialog" aria-modal="true">
          <form className="services-modal" onSubmit={handleAddProcedure}>
            <div className="services-modal__header">
              <span className="services-modal__icon">
                <Plus aria-hidden="true" />
              </span>
              <div>
                <h2>Add Clinical Procedure</h2>
                <p>Register a new procedure in the treatment catalog</p>
              </div>
              <button
                type="button"
                className="icon-button"
                style={{ marginLeft: "auto" }}
                onClick={() => setShowAddProcModal(false)}
                aria-label="Close modal"
              >
                <X aria-hidden="true" />
              </button>
            </div>
            <div className="services-modal__body">
              <div className="services-form-grid-2">
                <div>
                  <label className="services-field-label">CDT / Procedure Code</label>
                  <input
                    type="text"
                    className="text-input"
                    value={procCode}
                    onChange={(e) => setProcCode(e.target.value)}
                    placeholder="e.g. D2391"
                    required
                  />
                </div>
                <div>
                  <label className="services-field-label">Category</label>
                  <select
                    className="text-input"
                    value={procCategory}
                    onChange={(e) => setProcCategory(e.target.value as Exclude<ServiceCategory, "All">)}
                  >
                    {serviceCategories
                      .filter((c): c is Exclude<ServiceCategory, "All"> => c !== "All")
                      .map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div style={{ marginTop: 12 }}>
                <label className="services-field-label">Procedure Name</label>
                <input
                  type="text"
                  className="text-input"
                  value={procName}
                  onChange={(e) => setProcName(e.target.value)}
                  placeholder="e.g. Composite Resin Restoration — 1 Surface"
                  required
                />
              </div>

              <div className="services-form-grid-2" style={{ marginTop: 12 }}>
                <div>
                  <label className="services-field-label">Default Fee (EGP)</label>
                  <input
                    type="number"
                    className="text-input"
                    value={procPrice}
                    onChange={(e) => setProcPrice(Number(e.target.value))}
                    min={0}
                    step={50}
                    required
                  />
                </div>
                <div>
                  <label className="services-field-label">Estimated Duration (Minutes)</label>
                  <input
                    type="number"
                    className="text-input"
                    value={procDuration}
                    onChange={(e) => setProcDuration(Number(e.target.value))}
                    min={5}
                    step={5}
                    required
                  />
                </div>
              </div>

              <div style={{ marginTop: 12 }}>
                <label className="services-field-label">Clinical Description</label>
                <textarea
                  className="text-input"
                  style={{ minHeight: 70, paddingTop: 8 }}
                  value={procDescription}
                  onChange={(e) => setProcDescription(e.target.value)}
                  placeholder="Brief clinical description or notes..."
                />
              </div>

              <div style={{ marginTop: 14 }}>
                <label className="checkbox-row">
                  <input
                    type="checkbox"
                    checked={procToothTarget}
                    onChange={(e) => setProcToothTarget(e.target.checked)}
                  />
                  <span>Requires specific tooth selection on odontogram</span>
                </label>
              </div>
            </div>
            <div className="services-modal__actions">
              <button
                type="button"
                className="button button--secondary"
                onClick={() => setShowAddProcModal(false)}
              >
                Cancel
              </button>
              <button type="submit" className="button button--primary">
                Create procedure
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Procedure Modal */}
      {editingProcedure && (
        <div className="services-modal-backdrop" role="dialog" aria-modal="true">
          <form className="services-modal" onSubmit={handleSaveEditProcedure}>
            <div className="services-modal__header">
              <span className="services-modal__icon">
                <Edit2 aria-hidden="true" />
              </span>
              <div>
                <h2>Edit Procedure ({editingProcedure.code})</h2>
                <p>Modify procedure name, fee, or clinical requirements</p>
              </div>
              <button
                type="button"
                className="icon-button"
                style={{ marginLeft: "auto" }}
                onClick={() => setEditingProcedure(null)}
                aria-label="Close modal"
              >
                <X aria-hidden="true" />
              </button>
            </div>
            <div className="services-modal__body">
              <div>
                <label className="services-field-label">Procedure Name</label>
                <input
                  type="text"
                  className="text-input"
                  value={editingProcedure.name}
                  onChange={(e) =>
                    setEditingProcedure({ ...editingProcedure, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="services-form-grid-2" style={{ marginTop: 12 }}>
                <div>
                  <label className="services-field-label">Default Fee (EGP)</label>
                  <input
                    type="number"
                    className="text-input"
                    value={editingProcedure.defaultPrice}
                    onChange={(e) =>
                      setEditingProcedure({
                        ...editingProcedure,
                        defaultPrice: Number(e.target.value),
                      })
                    }
                    min={0}
                    step={50}
                    required
                  />
                </div>
                <div>
                  <label className="services-field-label">Duration (Minutes)</label>
                  <input
                    type="number"
                    className="text-input"
                    value={editingProcedure.durationMinutes}
                    onChange={(e) =>
                      setEditingProcedure({
                        ...editingProcedure,
                        durationMinutes: Number(e.target.value),
                      })
                    }
                    min={5}
                    step={5}
                    required
                  />
                </div>
              </div>

              <div style={{ marginTop: 12 }}>
                <label className="services-field-label">Clinical Description</label>
                <textarea
                  className="text-input"
                  style={{ minHeight: 70, paddingTop: 8 }}
                  value={editingProcedure.description}
                  onChange={(e) =>
                    setEditingProcedure({ ...editingProcedure, description: e.target.value })
                  }
                />
              </div>

              <div style={{ marginTop: 14 }}>
                <label className="checkbox-row">
                  <input
                    type="checkbox"
                    checked={editingProcedure.requiresToothTarget}
                    onChange={(e) =>
                      setEditingProcedure({
                        ...editingProcedure,
                        requiresToothTarget: e.target.checked,
                      })
                    }
                  />
                  <span>Requires specific tooth selection on odontogram</span>
                </label>
              </div>
            </div>
            <div className="services-modal__actions">
              <button
                type="button"
                className="button button--secondary"
                onClick={() => setEditingProcedure(null)}
              >
                Cancel
              </button>
              <button type="submit" className="button button--primary">
                Save changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Appointment Template Modal */}
      {showAddApptModal && (
        <div className="services-modal-backdrop" role="dialog" aria-modal="true">
          <form className="services-modal" onSubmit={handleAddApptType}>
            <div className="services-modal__header">
              <span className="services-modal__icon">
                <Calendar aria-hidden="true" />
              </span>
              <div>
                <h2>Add Appointment Template</h2>
                <p>Define a new booking duration and default rate</p>
              </div>
              <button
                type="button"
                className="icon-button"
                style={{ marginLeft: "auto" }}
                onClick={() => setShowAddApptModal(false)}
                aria-label="Close modal"
              >
                <X aria-hidden="true" />
              </button>
            </div>
            <div className="services-modal__body">
              <div>
                <label className="services-field-label">Template Name</label>
                <input
                  type="text"
                  className="text-input"
                  value={aptName}
                  onChange={(e) => setAptName(e.target.value)}
                  placeholder="e.g. Implant Consultation"
                  required
                />
              </div>

              <div className="services-form-grid-2" style={{ marginTop: 12 }}>
                <div>
                  <label className="services-field-label">Duration (Minutes)</label>
                  <input
                    type="number"
                    className="text-input"
                    value={aptDuration}
                    onChange={(e) => setAptDuration(Number(e.target.value))}
                    min={10}
                    step={5}
                    required
                  />
                </div>
                <div>
                  <label className="services-field-label">Standard Fee (EGP)</label>
                  <input
                    type="number"
                    className="text-input"
                    value={aptPrice}
                    onChange={(e) => setAptPrice(Number(e.target.value))}
                    min={0}
                    step={50}
                    required
                  />
                </div>
              </div>

              <div className="services-form-grid-2" style={{ marginTop: 12 }}>
                <div>
                  <label className="services-field-label">Calendar Badge Color</label>
                  <input
                    type="color"
                    className="text-input"
                    style={{ padding: 4, height: 42 }}
                    value={aptColor}
                    onChange={(e) => setAptColor(e.target.value)}
                  />
                </div>
                <div>
                  <label className="services-field-label">Category</label>
                  <input
                    type="text"
                    className="text-input"
                    value={aptCategory}
                    onChange={(e) => setAptCategory(e.target.value)}
                    placeholder="e.g. Consultation, Surgery"
                    required
                  />
                </div>
              </div>

              <div style={{ marginTop: 12 }}>
                <label className="services-field-label">Description</label>
                <textarea
                  className="text-input"
                  style={{ minHeight: 60, paddingTop: 8 }}
                  value={aptDesc}
                  onChange={(e) => setAptDesc(e.target.value)}
                  placeholder="What is included in this appointment..."
                />
              </div>
            </div>
            <div className="services-modal__actions">
              <button
                type="button"
                className="button button--secondary"
                onClick={() => setShowAddApptModal(false)}
              >
                Cancel
              </button>
              <button type="submit" className="button button--primary">
                Save template
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Appointment Template Modal */}
      {editingApptType && (
        <div className="services-modal-backdrop" role="dialog" aria-modal="true">
          <form className="services-modal" onSubmit={handleSaveEditApptType}>
            <div className="services-modal__header">
              <span className="services-modal__icon">
                <Edit2 aria-hidden="true" />
              </span>
              <div>
                <h2>Edit Template ({editingApptType.name})</h2>
                <p>Modify slot duration, standard fee, or calendar color</p>
              </div>
              <button
                type="button"
                className="icon-button"
                style={{ marginLeft: "auto" }}
                onClick={() => setEditingApptType(null)}
                aria-label="Close modal"
              >
                <X aria-hidden="true" />
              </button>
            </div>
            <div className="services-modal__body">
              <div>
                <label className="services-field-label">Template Name</label>
                <input
                  type="text"
                  className="text-input"
                  value={editingApptType.name}
                  onChange={(e) =>
                    setEditingApptType({ ...editingApptType, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="services-form-grid-2" style={{ marginTop: 12 }}>
                <div>
                  <label className="services-field-label">Duration (Minutes)</label>
                  <input
                    type="number"
                    className="text-input"
                    value={editingApptType.defaultDurationMinutes}
                    onChange={(e) =>
                      setEditingApptType({
                        ...editingApptType,
                        defaultDurationMinutes: Number(e.target.value),
                      })
                    }
                    min={10}
                    step={5}
                    required
                  />
                </div>
                <div>
                  <label className="services-field-label">Standard Fee (EGP)</label>
                  <input
                    type="number"
                    className="text-input"
                    value={editingApptType.defaultPrice}
                    onChange={(e) =>
                      setEditingApptType({
                        ...editingApptType,
                        defaultPrice: Number(e.target.value),
                      })
                    }
                    min={0}
                    step={50}
                    required
                  />
                </div>
              </div>

              <div className="services-form-grid-2" style={{ marginTop: 12 }}>
                <div>
                  <label className="services-field-label">Calendar Badge Color</label>
                  <input
                    type="color"
                    className="text-input"
                    style={{ padding: 4, height: 42 }}
                    value={editingApptType.color}
                    onChange={(e) =>
                      setEditingApptType({ ...editingApptType, color: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="services-field-label">Category</label>
                  <input
                    type="text"
                    className="text-input"
                    value={editingApptType.category}
                    onChange={(e) =>
                      setEditingApptType({ ...editingApptType, category: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div style={{ marginTop: 12 }}>
                <label className="services-field-label">Description</label>
                <textarea
                  className="text-input"
                  style={{ minHeight: 60, paddingTop: 8 }}
                  value={editingApptType.description}
                  onChange={(e) =>
                    setEditingApptType({ ...editingApptType, description: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="services-modal__actions">
              <button
                type="button"
                className="button button--secondary"
                onClick={() => setEditingApptType(null)}
              >
                Cancel
              </button>
              <button type="submit" className="button button--primary">
                Save changes
              </button>
            </div>
          </form>
        </div>
      )}
    </AppShell>
  );
}
