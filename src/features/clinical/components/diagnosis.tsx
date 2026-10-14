import { Dispatch, SetStateAction } from "react";

function Diagnosis({
  isFinalized,
  primaryDiagnosis,
  setPrimaryDiagnosis,
  commonDiagnoses,
  diagnosisCode,
  setDiagnosisCode,
  selectedTooth,
}: {
  isFinalized: boolean;
  primaryDiagnosis: string;
  setPrimaryDiagnosis: Dispatch<SetStateAction<string>>;
  commonDiagnoses: string[];
  diagnosisCode: string;
  setDiagnosisCode: Dispatch<SetStateAction<string>>;
  selectedTooth: number;
}) {
  return (
    <section className="clinical-card">
      <div className="clinical-card__header">
        <div>
          <h2>Diagnosis</h2>
          <p>Clinical diagnosis and affected tooth</p>
        </div>
      </div>

      <div className="clinical-diagnosis-row">
        <div style={{ flex: 1 }}>
          <label className="clinical-field-label" htmlFor="primary-diag">
            Primary diagnosis
          </label>
          {isFinalized ? (
            <p className="clinical-readonly-text" id="primary-diag">
              {primaryDiagnosis}
            </p>
          ) : (
            <select
              id="primary-diag"
              className="clinical-select"
              value={primaryDiagnosis}
              onChange={(e) => setPrimaryDiagnosis(e.target.value)}
            >
              {commonDiagnoses.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="w-[140px]">
          <label className="clinical-field-label" htmlFor="icd-code">
            ICD / Code
          </label>
          {isFinalized ? (
            <p className="clinical-readonly-text" id="icd-code">
              {diagnosisCode || "None"}
            </p>
          ) : (
            <input
              id="icd-code"
              type="text"
              className="clinical-input"
              value={diagnosisCode}
              onChange={(e) => setDiagnosisCode(e.target.value)}
              placeholder="e.g. K04.5"
            />
          )}
        </div>

        <div className="w-[130px]">
          <label className="clinical-field-label">Tooth target</label>
          <div className="clinical-tooth-target">Tooth #{selectedTooth}</div>
        </div>
      </div>
    </section>
  );
}

export default Diagnosis;
