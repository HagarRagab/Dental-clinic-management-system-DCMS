"use client";

import type { ToothCondition, ToothSurface } from "@/features/odontogram/odontogram.types";
import { conditionDefinitions } from "@/features/odontogram/services/mock-odontogram-service";

interface ToothSurfaceMapProps {
  toothNumber: number;
  surfaces: Record<ToothSurface, boolean>;
  condition: ToothCondition;
  onToggleSurface?: (surface: ToothSurface) => void;
  readOnly?: boolean;
}

export function ToothSurfaceMap({
  toothNumber,
  surfaces,
  condition,
  onToggleSurface,
  readOnly = false,
}: ToothSurfaceMapProps) {
  const isUpper = toothNumber >= 11 && toothNumber <= 28;
  const isRight = (toothNumber >= 11 && toothNumber <= 18) || (toothNumber >= 41 && toothNumber <= 48);
  
  // Anatomical labels based on arch and quadrant
  const topLabel = isUpper ? "B" : "B"; // Buccal
  const bottomLabel = isUpper ? "P" : "L"; // Palatal vs Lingual
  // For Q1 & Q4 (Right side of patient, left of doctor view): Mesial is toward center (right in view)
  const leftLabel = isRight ? "D" : "M";
  const rightLabel = isRight ? "M" : "D";
  
  const leftSurface: ToothSurface = isRight ? "distal" : "mesial";
  const rightSurface: ToothSurface = isRight ? "mesial" : "distal";

  const conditionColor = conditionDefinitions[condition]?.color || "var(--primary)";

  function getFill(isActive: boolean) {
    if (condition === "missing") return "#f1f5f9";
    if (condition === "crown") return "#fde68a"; // gold
    if (!isActive) return "#ffffff";
    return conditionColor;
  }

  function getTextColor(isActive: boolean) {
    if (condition === "missing") return "#94a3b8";
    if (!isActive) return "#64748b";
    return condition === "crown" ? "#78350f" : "#ffffff";
  }

  function handleClick(surface: ToothSurface) {
    if (readOnly || !onToggleSurface || condition === "missing") return;
    onToggleSurface(surface);
  }

  return (
    <div className="od-surface-map">
      <div className="od-surface-map__legend">
        <span>{isUpper ? "Upper Arch (Maxillary)" : "Lower Arch (Mandibular)"}</span>
        <small>Click surface to toggle</small>
      </div>

      <svg
        viewBox="0 0 160 160"
        className={`od-surface-svg ${condition === "missing" ? "od-surface-svg--missing" : ""}`}
        aria-label={`Surface map for tooth ${toothNumber}`}
      >
        {/* Background base */}
        <rect x="10" y="10" width="140" height="140" rx="14" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />

        {/* Top Surface (Buccal / Facial) */}
        <polygon
          points="10,10 150,10 115,45 45,45"
          fill={getFill(surfaces.buccal)}
          stroke="#94a3b8"
          strokeWidth="1.5"
          className="od-surface-polygon"
          onClick={() => handleClick("buccal")}
        />
        <text
          x="80"
          y="32"
          textAnchor="middle"
          fill={getTextColor(surfaces.buccal)}
          className="od-surface-text"
        >
          {topLabel} (Buccal)
        </text>

        {/* Bottom Surface (Lingual / Palatal) */}
        <polygon
          points="10,150 150,150 115,115 45,115"
          fill={getFill(surfaces.lingual)}
          stroke="#94a3b8"
          strokeWidth="1.5"
          className="od-surface-polygon"
          onClick={() => handleClick("lingual")}
        />
        <text
          x="80"
          y="136"
          textAnchor="middle"
          fill={getTextColor(surfaces.lingual)}
          className="od-surface-text"
        >
          {bottomLabel} ({isUpper ? "Palatal" : "Lingual"})
        </text>

        {/* Left Surface (Mesial or Distal) */}
        <polygon
          points="10,10 10,150 45,115 45,45"
          fill={getFill(surfaces[leftSurface])}
          stroke="#94a3b8"
          strokeWidth="1.5"
          className="od-surface-polygon"
          onClick={() => handleClick(leftSurface)}
        />
        <text
          x="28"
          y="84"
          textAnchor="middle"
          fill={getTextColor(surfaces[leftSurface])}
          className="od-surface-text"
        >
          {leftLabel}
        </text>

        {/* Right Surface (Distal or Mesial) */}
        <polygon
          points="150,10 150,150 115,115 115,45"
          fill={getFill(surfaces[rightSurface])}
          stroke="#94a3b8"
          strokeWidth="1.5"
          className="od-surface-polygon"
          onClick={() => handleClick(rightSurface)}
        />
        <text
          x="132"
          y="84"
          textAnchor="middle"
          fill={getTextColor(surfaces[rightSurface])}
          className="od-surface-text"
        >
          {rightLabel}
        </text>

        {/* Center Surface (Occlusal / Incisal) */}
        <rect
          x="45"
          y="45"
          width="70"
          height="70"
          fill={getFill(surfaces.occlusal)}
          stroke="#94a3b8"
          strokeWidth="1.5"
          className="od-surface-polygon"
          onClick={() => handleClick("occlusal")}
        />
        <text
          x="80"
          y="85"
          textAnchor="middle"
          fill={getTextColor(surfaces.occlusal)}
          className="od-surface-text od-surface-text--center"
        >
          O (Occlusal)
        </text>

        {/* Missing cross indicator */}
        {condition === "missing" && (
          <g stroke="#94a3b8" strokeWidth="3" strokeLinecap="round">
            <line x1="20" y1="20" x2="140" y2="140" />
            <line x1="140" y1="20" x2="20" y2="140" />
          </g>
        )}
      </svg>

      <div className="od-surface-summary">
        <span>Active surfaces:</span>
        <strong>
          {Object.entries(surfaces)
            .filter(([_, v]) => v)
            .map(([k]) => k.charAt(0).toUpperCase())
            .join(", ") || "None"}
        </strong>
      </div>
    </div>
  );
}
