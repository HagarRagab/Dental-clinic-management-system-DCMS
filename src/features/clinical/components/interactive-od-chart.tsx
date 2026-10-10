import { Dispatch, SetStateAction } from "react";

const adultUpperTeeth = [
  18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28,
];
const adultLowerTeeth = [
  48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38,
];

function InteractiveOdChart({
  isFinalized,
  setSelectedTooth,
  setNewProcTooth,
  selectedTooth,
}: {
  isFinalized: boolean;
  setSelectedTooth: Dispatch<SetStateAction<number>>;
  setNewProcTooth: Dispatch<SetStateAction<number>>;
  selectedTooth: number;
}) {
  function handleToothClick(tooth: number) {
    if (isFinalized) return;
    setSelectedTooth(tooth);
    setNewProcTooth(tooth);
  }

  return (
    <section className="clinical-card">
      <div className="clinical-card__header">
        <div>
          <h2>Odontogram chart</h2>
          <p>Selected tooth: #{selectedTooth}</p>
        </div>
      </div>
      <div className="clinical-odontogram">
        <div className="clinical-arch-label">Upper Arch (Maxillary)</div>
        <div className="clinical-tooth-row">
          {adultUpperTeeth.map((t) => {
            const isSelected = selectedTooth === t;
            const isTreated = t === 16;
            return (
              <button
                key={t}
                type="button"
                className={`clinical-tooth-btn ${
                  isSelected ? "clinical-tooth-btn--selected" : ""
                } ${isTreated ? "clinical-tooth-btn--treated" : ""}`}
                onClick={() => handleToothClick(t)}
                aria-label={`Tooth ${t}`}
              >
                {t}
              </button>
            );
          })}
        </div>

        <div className="clinical-arch-label" style={{ marginTop: 12 }}>
          Lower Arch (Mandibular)
        </div>
        <div className="clinical-tooth-row">
          {adultLowerTeeth.map((t) => {
            const isSelected = selectedTooth === t;
            return (
              <button
                key={t}
                type="button"
                className={`clinical-tooth-btn ${
                  isSelected ? "clinical-tooth-btn--selected" : ""
                }`}
                onClick={() => handleToothClick(t)}
                aria-label={`Tooth ${t}`}
              >
                {t}
              </button>
            );
          })}
        </div>

        <div className="clinical-odontogram-legend">
          <span>
            <i className="clinical-dot clinical-dot--treated" /> Active tooth
            (#16)
          </span>
          <span>
            <i className="clinical-dot clinical-dot--selected" /> Selected
          </span>
        </div>
      </div>
    </section>
  );
}

export default InteractiveOdChart;
