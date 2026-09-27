import type { PatientListRow } from "@/features/patients/patient.types";

export type ValidationStatus = "valid" | "duplicate" | "error";

export type ParsedCsvPatient = {
  rowNumber: number;
  firstName: string;
  lastName: string;
  fullName: string;
  mobile: string;
  dateOfBirth: string;
  gender: "Male" | "Female" | "Other";
  address?: string;
  emergencyContact?: string;
  status: ValidationStatus;
  errorReason?: string;
};

export type ImportValidationResult = {
  rows: ParsedCsvPatient[];
  total: number;
  validCount: number;
  duplicateCount: number;
  errorCount: number;
};

export const sampleCsvTemplate = `First Name,Last Name,Mobile,Date of Birth,Gender,Address,Emergency Contact
Farah,Kamel,+20 101 555 4321,1994-06-12,Female,Haram - Giza,+20 100 999 8888
Youssef,Mansour,+20 112 444 9876,1987-11-23,Male,Nasr City - Cairo,+20 122 333 4444
Nour,El-Din,+20 120 777 6543,2001-04-05,Female,Mohandessin - Giza,+20 111 222 3333`;

export const demoSampleCsv = `First Name,Last Name,Mobile,Date of Birth,Gender,Address,Emergency Contact
Ziad,Samy,+20 102 334 8899,1993-08-15,Male,Sheikh Zayed - Giza,+20 100 111 2233
Mariam,Adel,0100 248 1920,1996-05-14,Female,Dokki - Giza,Hussein Adel (Brother)
Salma,Rami,011234,1990-12-01,Female,Maadi - Cairo,+20 114 555 6677
Tamer,Ghoneim,+20 127 889 1234,1982-03-29,Male,Heliopolis - Cairo,+20 120 998 7766
Hana,,+20 109 443 2211,2000-09-10,Female,Zamalek - Cairo,+20 100 554 3322`;

function cleanString(str?: string): string {
  if (!str) return "";
  return str.trim().replace(/^["']|["']$/g, "").trim();
}

function normalizeMobile(phone: string): string {
  return phone.replace(/[\s\-\+\(\)]/g, "");
}

function calculateAge(dobString: string): number {
  const parts = dobString.split(/[-/]/);
  let birthDate: Date;
  if (parts.length === 3) {
    if (parts[0].length === 4) {
      birthDate = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    } else {
      birthDate = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
    }
    const ageDiffMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDiffMs);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);
    return isNaN(age) ? 30 : age;
  }
  return 30;
}

export function parsePatientCsv(
  csvText: string,
  existingPatients: PatientListRow[]
): ImportValidationResult {
  const lines = csvText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length <= 1) {
    return {
      rows: [],
      total: 0,
      validCount: 0,
      duplicateCount: 0,
      errorCount: 0,
    };
  }

  // Header detection
  const headers = lines[0].split(",").map((h) => cleanString(h).toLowerCase());
  const firstNameIdx = headers.findIndex((h) => h.includes("first") || h === "fname");
  const lastNameIdx = headers.findIndex((h) => h.includes("last") || h === "lname");
  const mobileIdx = headers.findIndex((h) => h.includes("mobile") || h.includes("phone"));
  const dobIdx = headers.findIndex((h) => h.includes("birth") || h.includes("dob"));
  const genderIdx = headers.findIndex((h) => h.includes("gender") || h.includes("sex"));
  const addressIdx = headers.findIndex((h) => h.includes("address"));
  const emergencyIdx = headers.findIndex((h) => h.includes("emergency"));

  const existingMobiles = new Set(
    existingPatients.map((p) => normalizeMobile(p.mobile))
  );
  const existingNames = new Set(
    existingPatients.map((p) => p.name.toLowerCase().trim())
  );

  const parsedRows: ParsedCsvPatient[] = [];

  for (let i = 1; i < lines.length; i++) {
    const rawLine = lines[i];
    // Split by comma ignoring commas inside quotes
    const values = rawLine
      .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
      .map((val) => cleanString(val));

    const firstName = firstNameIdx >= 0 ? values[firstNameIdx] || "" : values[0] || "";
    const lastName = lastNameIdx >= 0 ? values[lastNameIdx] || "" : values[1] || "";
    const mobile = mobileIdx >= 0 ? values[mobileIdx] || "" : values[2] || "";
    const dateOfBirth = dobIdx >= 0 ? values[dobIdx] || "" : values[3] || "1995-01-01";
    const rawGender = genderIdx >= 0 ? values[genderIdx] || "" : values[4] || "";
    const address = addressIdx >= 0 ? values[addressIdx] : values[5];
    const emergencyContact = emergencyIdx >= 0 ? values[emergencyIdx] : values[6];

    const fullName = `${firstName} ${lastName}`.trim();
    let gender: "Male" | "Female" | "Other" = "Other";
    if (rawGender.toLowerCase().startsWith("m")) gender = "Male";
    else if (rawGender.toLowerCase().startsWith("f")) gender = "Female";

    let status: ValidationStatus = "valid";
    let errorReason: string | undefined = undefined;

    // Validation checks
    if (!firstName) {
      status = "error";
      errorReason = "First name is missing";
    } else if (!lastName) {
      status = "error";
      errorReason = "Last name is missing";
    } else if (!mobile) {
      status = "error";
      errorReason = "Mobile number is required";
    } else if (normalizeMobile(mobile).length < 8) {
      status = "error";
      errorReason = "Mobile number format is invalid (too short)";
    } else {
      // Duplicate checks
      const cleanMobile = normalizeMobile(mobile);
      if (existingMobiles.has(cleanMobile)) {
        status = "duplicate";
        errorReason = "Duplicate mobile: already exists in clinic roster";
      } else if (existingNames.has(fullName.toLowerCase())) {
        status = "duplicate";
        errorReason = "Duplicate name: patient with this name exists";
      }
    }

    parsedRows.push({
      rowNumber: i,
      firstName,
      lastName,
      fullName: fullName || "Unnamed Patient",
      mobile,
      dateOfBirth,
      gender,
      address,
      emergencyContact,
      status,
      errorReason,
    });
  }

  const validCount = parsedRows.filter((r) => r.status === "valid").length;
  const duplicateCount = parsedRows.filter((r) => r.status === "duplicate").length;
  const errorCount = parsedRows.filter((r) => r.status === "error").length;

  return {
    rows: parsedRows,
    total: parsedRows.length,
    validCount,
    duplicateCount,
    errorCount,
  };
}

export function convertToPatientListRow(
  parsed: ParsedCsvPatient,
  index: number
): PatientListRow {
  const idNum = 1040 + index;
  const initials = parsed.fullName
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "PT";

  return {
    id: `P-${idNum}`,
    name: parsed.fullName,
    initials,
    mobile: parsed.mobile,
    dob: parsed.dateOfBirth,
    age: calculateAge(parsed.dateOfBirth),
    gender: parsed.gender === "Male" ? "Male" : "Female",
    status: "Active",
    lastVisitDate: null,
    lastVisitType: null,
    nextAppointment: null,
    balance: "EGP 0",
    balanceNumeric: 0,
    alerts: [],
    profileSlug: `P-${idNum}`,
  };
}
