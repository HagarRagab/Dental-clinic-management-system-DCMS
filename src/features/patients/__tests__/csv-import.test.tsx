import { describe, it, expect } from "vitest";
import { parsePatientCsv } from "../services/csv-import-service";
import { mockPatientList } from "../services/mock-patient-list-service";

describe("PAT-03: CSV Patient Import Parser & Duplicate Detection", () => {
  it("parses valid CSV text into structured rows", () => {
    const csv = `First Name,Last Name,Mobile,Date of Birth,Gender,Address,Emergency Contact\nHany,Kamal,+20 109 988 7766,1990-05-12,Male,Giza,01011112222`;
    const result = parsePatientCsv(csv, mockPatientList);

    expect(result.rows).toHaveLength(1);
    expect(result.rows[0].firstName).toBe("Hany");
    expect(result.rows[0].lastName).toBe("Kamal");
    expect(result.validCount).toBe(1);
  });

  it("detects invalid mobile syntax and missing required fields", () => {
    const csv = `First Name,Last Name,Mobile,Date of Birth,Gender\n,Kamal,12345,1990-05-12,Male`;
    const result = parsePatientCsv(csv, mockPatientList);

    expect(result.errorCount).toBeGreaterThan(0);
    expect(result.rows[0].status).toBe("error");
  });

  it("detects duplicate mobile numbers against current clinic roster", () => {
    // Mariam Adel has mobile "0100 248 1920" in mockPatientList
    const csv = `First Name,Last Name,Mobile,Date of Birth,Gender\nMariam,Adel,0100 248 1920,1996-05-14,Female`;
    const result = parsePatientCsv(csv, mockPatientList);

    expect(result.duplicateCount).toBe(1);
    expect(result.rows[0].status).toBe("duplicate");
  });
});
