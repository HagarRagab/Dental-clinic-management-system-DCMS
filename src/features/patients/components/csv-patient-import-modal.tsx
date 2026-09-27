"use client";

import { useId, useState, type ChangeEvent, type FormEvent } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  FileText,
  Info,
  Sparkles,
  Upload,
  Users,
  X,
  XCircle,
} from "lucide-react";
import type { PatientListRow } from "@/features/patients/patient.types";
import {
  convertToPatientListRow,
  demoSampleCsv,
  parsePatientCsv,
  sampleCsvTemplate,
  type ImportValidationResult,
  type ParsedCsvPatient,
} from "@/features/patients/services/csv-import-service";

interface CsvPatientImportModalProps {
  existingPatients: PatientListRow[];
  onClose: () => void;
  onImport: (newPatients: PatientListRow[]) => void;
}

export function CsvPatientImportModal({
  existingPatients,
  onClose,
  onImport,
}: CsvPatientImportModalProps) {
  const fileInputId = useId();
  const [csvContent, setCsvContent] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [validationResult, setValidationResult] = useState<ImportValidationResult | null>(null);
  const [skipDuplicates, setSkipDuplicates] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showPasteArea, setShowPasteArea] = useState<boolean>(false);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setCsvContent(text);
        const result = parsePatientCsv(text, existingPatients);
        setValidationResult(result);
      }
    };
    reader.readAsText(file);
  }

  function handleLoadDemoData() {
    setFileName("demo_patients_import.csv");
    setCsvContent(demoSampleCsv);
    const result = parsePatientCsv(demoSampleCsv, existingPatients);
    setValidationResult(result);
  }

  function handleDownloadTemplate() {
    const blob = new Blob([sampleCsvTemplate], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "dcms_patient_import_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function handleManualParse() {
    if (!csvContent.trim()) return;
    const result = parsePatientCsv(csvContent, existingPatients);
    setValidationResult(result);
  }

  function handleCommitImport(e: FormEvent) {
    e.preventDefault();
    if (!validationResult || validationResult.rows.length === 0) return;

    setIsProcessing(true);

    const rowsToImport = validationResult.rows.filter((r) => {
      if (r.status === "error") return false;
      if (r.status === "duplicate" && skipDuplicates) return false;
      return true;
    });

    const newPatientListRows: PatientListRow[] = rowsToImport.map((row, idx) =>
      convertToPatientListRow(row, existingPatients.length + idx + 1)
    );

    setTimeout(() => {
      onImport(newPatientListRows);
      setIsProcessing(false);
      onClose();
    }, 600);
  }

  const eligibleCount = validationResult
    ? validationResult.rows.filter((r) => {
        if (r.status === "error") return false;
        if (r.status === "duplicate" && skipDuplicates) return false;
        return true;
      }).length
    : 0;

  return (
    <div
      className="csv-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="csv-modal-title"
    >
      <div className="csv-modal">
        {/* Header */}
        <header className="csv-modal__header">
          <div className="csv-modal__title-group">
            <div className="csv-modal__icon">
              <FileSpreadsheet aria-hidden="true" size={20} />
            </div>
            <div>
              <h2 id="csv-modal-title">Bulk Patient CSV Import</h2>
              <p>Upload a CSV spreadsheet to import multiple patient profiles at once.</p>
            </div>
          </div>
          <button
            type="button"
            className="csv-modal__close-btn"
            onClick={onClose}
            aria-label="Close import dialog"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </header>

        <form onSubmit={handleCommitImport} className="csv-modal__form">
          <div className="csv-modal__body">
            {/* Step 1: Upload & Templates */}
            {!validationResult && (
              <div className="csv-upload-section">
                <div className="csv-dropzone">
                  <Upload size={36} aria-hidden="true" className="csv-dropzone__icon" />
                  <p className="csv-dropzone__prompt">
                    <strong>Drag and drop your patient CSV file here</strong>, or browse
                  </p>
                  <label htmlFor={fileInputId} className="button button--secondary button--compact">
                    Select CSV File
                  </label>
                  <input
                    id={fileInputId}
                    type="file"
                    accept=".csv,text/csv"
                    onChange={handleFileChange}
                    className="csv-dropzone__input"
                  />
                  <span className="csv-dropzone__note">Supported format: .csv with comma separation</span>
                </div>

                <div className="csv-quick-actions">
                  <button
                    type="button"
                    className="button button--secondary button--compact"
                    onClick={handleDownloadTemplate}
                  >
                    <Download size={14} aria-hidden="true" />
                    Download Sample Template (.csv)
                  </button>

                  <button
                    type="button"
                    className="button button--secondary button--compact"
                    onClick={handleLoadDemoData}
                  >
                    <Sparkles size={14} aria-hidden="true" />
                    Load Demo Dataset (5 records)
                  </button>

                  <button
                    type="button"
                    className="text-button text-button--compact"
                    onClick={() => setShowPasteArea(!showPasteArea)}
                  >
                    <FileText size={14} aria-hidden="true" />
                    {showPasteArea ? "Hide raw CSV box" : "Paste raw CSV text"}
                  </button>
                </div>

                {showPasteArea && (
                  <div className="csv-paste-box">
                    <label htmlFor="csv-raw-input">Paste CSV Content:</label>
                    <textarea
                      id="csv-raw-input"
                      rows={5}
                      value={csvContent}
                      onChange={(e) => setCsvContent(e.target.value)}
                      placeholder="First Name,Last Name,Mobile,Date of Birth,Gender&#10;Hani,Kamal,01012345678,1990-05-12,Male"
                    />
                    <button
                      type="button"
                      className="button button--primary button--compact"
                      style={{ marginTop: 8 }}
                      onClick={handleManualParse}
                      disabled={!csvContent.trim()}
                    >
                      Parse &amp; Validate Text
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Validation Preview */}
            {validationResult && (
              <div className="csv-preview-section">
                {/* Summary banner */}
                <div className="csv-summary-banner">
                  <div className="csv-summary-metric">
                    <span>Total Rows</span>
                    <strong>{validationResult.total}</strong>
                  </div>
                  <div className="csv-summary-metric csv-summary-metric--valid">
                    <span>Valid</span>
                    <strong>{validationResult.validCount}</strong>
                  </div>
                  <div className="csv-summary-metric csv-summary-metric--duplicate">
                    <span>Duplicates</span>
                    <strong>{validationResult.duplicateCount}</strong>
                  </div>
                  <div className="csv-summary-metric csv-summary-metric--error">
                    <span>Errors</span>
                    <strong>{validationResult.errorCount}</strong>
                  </div>
                  <button
                    type="button"
                    className="text-button text-button--compact"
                    style={{ marginLeft: "auto" }}
                    onClick={() => {
                      setValidationResult(null);
                      setCsvContent("");
                      setFileName("");
                    }}
                  >
                    Choose another file
                  </button>
                </div>

                {/* Duplicate handling option */}
                {validationResult.duplicateCount > 0 && (
                  <div className="csv-duplicate-bar">
                    <label className="csv-checkbox-label">
                      <input
                        type="checkbox"
                        checked={skipDuplicates}
                        onChange={(e) => setSkipDuplicates(e.target.checked)}
                      />
                      <span>Skip duplicate rows ({validationResult.duplicateCount} records already in clinic list)</span>
                    </label>
                  </div>
                )}

                {/* Preview Table */}
                <div className="csv-table-scroll">
                  <table className="csv-preview-table" aria-label="Parsed CSV rows">
                    <thead>
                      <tr>
                        <th style={{ width: "40px" }}>#</th>
                        <th>Name</th>
                        <th>Mobile</th>
                        <th>Date of Birth</th>
                        <th>Gender</th>
                        <th>Validation Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {validationResult.rows.map((row: ParsedCsvPatient) => (
                        <tr key={row.rowNumber} className={`csv-row--${row.status}`}>
                          <td style={{ color: "var(--muted)" }}>{row.rowNumber}</td>
                          <td>
                            <strong>{row.fullName}</strong>
                          </td>
                          <td>{row.mobile || "—"}</td>
                          <td>{row.dateOfBirth}</td>
                          <td>{row.gender}</td>
                          <td>
                            {row.status === "valid" && (
                              <span className="csv-badge csv-badge--valid">
                                <CheckCircle2 size={12} aria-hidden="true" />
                                Valid
                              </span>
                            )}
                            {row.status === "duplicate" && (
                              <span
                                className="csv-badge csv-badge--duplicate"
                                title={row.errorReason}
                              >
                                <AlertTriangle size={12} aria-hidden="true" />
                                Duplicate
                              </span>
                            )}
                            {row.status === "error" && (
                              <span
                                className="csv-badge csv-badge--error"
                                title={row.errorReason}
                              >
                                <XCircle size={12} aria-hidden="true" />
                                {row.errorReason || "Invalid"}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="csv-compliance-note">
                  <Info size={14} aria-hidden="true" />
                  <span>
                    Mock session import: records are added to your in-memory patient list. Database persistence begins in Phase 2.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <footer className="csv-modal__footer">
            <button
              type="button"
              className="button button--secondary"
              onClick={onClose}
              disabled={isProcessing}
            >
              Cancel
            </button>

            {validationResult && (
              <button
                type="submit"
                className="button button--primary"
                disabled={eligibleCount === 0 || isProcessing}
              >
                <Users size={15} aria-hidden="true" />
                {isProcessing
                  ? "Importing..."
                  : `Import ${eligibleCount} ${eligibleCount === 1 ? "Patient" : "Patients"}`}
              </button>
            )}
          </footer>
        </form>
      </div>
    </div>
  );
}
