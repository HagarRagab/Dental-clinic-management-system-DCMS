import type {
  ChartSummaryMetrics,
  ConditionDefinition,
  OdontogramChartData,
  ToothCondition,
  ToothRecord,
} from "@/features/odontogram/odontogram.types";

export const upperRightTeeth = [18, 17, 16, 15, 14, 13, 12, 11] as const;
export const upperLeftTeeth = [21, 22, 23, 24, 25, 26, 27, 28] as const;
export const lowerRightTeeth = [48, 47, 46, 45, 44, 43, 42, 41] as const;
export const lowerLeftTeeth = [31, 32, 33, 34, 35, 36, 37, 38] as const;

export const upperArchTeeth = [...upperRightTeeth, ...upperLeftTeeth];
export const lowerArchTeeth = [...lowerRightTeeth, ...lowerLeftTeeth];
export const allTeeth = [...upperArchTeeth, ...lowerArchTeeth];

export const conditionDefinitions: Record<ToothCondition, ConditionDefinition> = {
  healthy: {
    id: "healthy",
    label: "Healthy / Sound",
    shortCode: "S",
    color: "#10b981",
    badgeClass: "od-badge--healthy",
    description: "Intact natural tooth structure with no active decay or pathology.",
  },
  caries: {
    id: "caries",
    label: "Active Caries",
    shortCode: "C",
    color: "#ef4444",
    badgeClass: "od-badge--caries",
    description: "Carious lesion requiring operative intervention or restoration.",
  },
  composite: {
    id: "composite",
    label: "Composite Resin",
    shortCode: "CR",
    color: "#0d9488",
    badgeClass: "od-badge--composite",
    description: "Tooth-colored direct composite restoration in place.",
  },
  amalgam: {
    id: "amalgam",
    label: "Amalgam Filling",
    shortCode: "AM",
    color: "#64748b",
    badgeClass: "od-badge--amalgam",
    description: "Existing silver-amalgam restoration.",
  },
  crown: {
    id: "crown",
    label: "Full Crown",
    shortCode: "CRW",
    color: "#f59e0b",
    badgeClass: "od-badge--crown",
    description: "Full-coverage prosthetic crown (PFM, Zirconia, or E-max).",
  },
  "root-canal": {
    id: "root-canal",
    label: "Endodontic (RCT)",
    shortCode: "RCT",
    color: "#8b5cf6",
    badgeClass: "od-badge--root-canal",
    description: "Root canal treated tooth with pulpal extirpation and canal obturation.",
  },
  missing: {
    id: "missing",
    label: "Missing / Extracted",
    shortCode: "M",
    color: "#94a3b8",
    badgeClass: "od-badge--missing",
    description: "Tooth absent due to extraction, congenital absence, or impaction.",
  },
  implant: {
    id: "implant",
    label: "Dental Implant",
    shortCode: "IMP",
    color: "#3b82f6",
    badgeClass: "od-badge--implant",
    description: "Osseointegrated endosseous titanium/zirconia fixture with abutment.",
  },
};

export const commonProceduresByCondition: Record<ToothCondition, string[]> = {
  healthy: ["Routine scaling", "Fluoride varnish", "Fissure sealant"],
  caries: ["Class I Composite", "Class II Composite", "Temporary sedative dressing"],
  composite: ["Polish restoration", "Replace margin", "Re-contour"],
  amalgam: ["Check margins", "Replace with composite", "Occlusal adjustment"],
  crown: ["PFM Crown seating", "Zirconia Crown prep", "Crown recementation"],
  "root-canal": ["Root canal therapy", "Core build-up", "Post placement"],
  missing: ["Implant placement", "Fixed partial bridge", "Removable prosthesis"],
  implant: ["Implant crown delivery", "Peri-implant maintenance", "Abutment tightening"],
};

export function createDefaultToothRecord(toothNumber: number): ToothRecord {
  return {
    toothNumber,
    condition: "healthy",
    surfaces: {
      occlusal: false,
      mesial: false,
      distal: false,
      buccal: false,
      lingual: false,
    },
    notes: "",
  };
}

export function getToothName(toothNumber: number): string {
  const quadrant = Math.floor(toothNumber / 10);
  const position = toothNumber % 10;

  const quadrantNames: Record<number, string> = {
    1: "Upper Right",
    2: "Upper Left",
    3: "Lower Left",
    4: "Lower Right",
  };

  const toothTypes: Record<number, string> = {
    1: "Central Incisor",
    2: "Lateral Incisor",
    3: "Canine (Cuspid)",
    4: "First Premolar (Bicuspid)",
    5: "Second Premolar",
    6: "First Molar (6-year)",
    7: "Second Molar (12-year)",
    8: "Third Molar (Wisdom)",
  };

  return `${quadrantNames[quadrant] || "Tooth"} ${toothTypes[position] || `#${toothNumber}`}`;
}

export function buildInitialMariamAdelChart(): OdontogramChartData {
  const teeth: Record<number, ToothRecord> = {};

  allTeeth.forEach((num) => {
    teeth[num] = createDefaultToothRecord(num);
  });

  // Tooth 16: Root canal completed + Crown planned
  teeth[16] = {
    toothNumber: 16,
    condition: "root-canal",
    surfaces: { occlusal: true, mesial: true, distal: false, buccal: false, lingual: false },
    notes: "Three canals treated and sealed. Composite core build-up in place.",
    completedProcedure: "Root canal treatment — Tooth 16 (D3330)",
    plannedProcedure: "Porcelain-fused-to-metal crown (D2750)",
    lastUpdated: "8 Sep 2026",
  };

  // Tooth 15: Caries on occlusal surface
  teeth[15] = {
    toothNumber: 15,
    condition: "caries",
    surfaces: { occlusal: true, mesial: false, distal: false, buccal: false, lingual: false },
    notes: "Occlusal fissure demineralization extending to dentin. No spontaneous pain.",
    plannedProcedure: "Class I Composite resin restoration",
    lastUpdated: "8 Sep 2026",
  };

  // Tooth 26: Existing amalgam restoration (occlusal + distal)
  teeth[26] = {
    toothNumber: 26,
    condition: "amalgam",
    surfaces: { occlusal: true, mesial: false, distal: true, buccal: false, lingual: false },
    notes: "Existing OD amalgam placed 2021. Margins intact, no secondary decay.",
    completedProcedure: "Amalgam restoration (Historical)",
    lastUpdated: "30 Aug 2026",
  };

  // Tooth 38: Missing wisdom tooth
  teeth[38] = {
    toothNumber: 38,
    condition: "missing",
    surfaces: { occlusal: false, mesial: false, distal: false, buccal: false, lingual: false },
    notes: "Congenitally missing / unerupted.",
    lastUpdated: "30 Aug 2026",
  };

  // Tooth 48: Extracted wisdom tooth
  teeth[48] = {
    toothNumber: 48,
    condition: "missing",
    surfaces: { occlusal: false, mesial: false, distal: false, buccal: false, lingual: false },
    notes: "Surgically extracted in 2024.",
    lastUpdated: "30 Aug 2026",
  };

  return {
    patientId: "pt-001",
    patientName: "Mariam Adel",
    teeth,
    generalNotes: "Patient presents with good oral hygiene. Focus on completing Tooth 16 crown and restoring Tooth 15.",
  };
}

export function calculateChartSummary(chart: OdontogramChartData): ChartSummaryMetrics {
  const records = Object.values(chart.teeth);
  return {
    totalTeeth: records.length,
    healthy: records.filter((t) => t.condition === "healthy").length,
    caries: records.filter((t) => t.condition === "caries").length,
    restored: records.filter((t) => t.condition === "composite" || t.condition === "amalgam").length,
    crownEndo: records.filter((t) => t.condition === "crown" || t.condition === "root-canal").length,
    missing: records.filter((t) => t.condition === "missing").length,
    implants: records.filter((t) => t.condition === "implant").length,
  };
}
