import type { PatientListRow } from "@/features/patients/patient.types";

export const mockPatientList: PatientListRow[] = [
  {
    id: "pt-001",
    name: "Mariam Adel",
    initials: "MA",
    mobile: "010 1234 5678",
    dob: "18 Mar 1988",
    age: 38,
    gender: "Female",
    status: "Active",
    lastVisitDate: "10 Sep 2026",
    lastVisitType: "Root canal treatment",
    nextAppointment: { date: "Sat, 13 Sep", time: "14:00", type: "Root canal follow-up", dentist: "Dr. Karim Mostafa" },
    balance: "EGP 1,450",
    balanceNumeric: 1450,
    alerts: ["Penicillin allergy"],
    profileSlug: "mariam-adel",
  },
  {
    id: "pt-002",
    name: "Omar Hassan",
    initials: "OH",
    mobile: "011 5555 9001",
    dob: "02 Jun 1995",
    age: 31,
    gender: "Male",
    status: "Active",
    lastVisitDate: "01 Sep 2026",
    lastVisitType: "Scaling & polishing",
    nextAppointment: null,
    balance: "EGP 0",
    balanceNumeric: 0,
    alerts: [],
    profileSlug: null,
  },
  {
    id: "pt-003",
    name: "Nour El-Din Sayed",
    initials: "NS",
    mobile: "012 3344 7890",
    dob: "27 Nov 1980",
    age: 45,
    gender: "Male",
    status: "Active",
    lastVisitDate: "05 Sep 2026",
    lastVisitType: "Composite filling",
    nextAppointment: { date: "Mon, 15 Sep", time: "10:00", type: "Composite filling — check", dentist: "Dr. Amira Fathy" },
    balance: "EGP 800",
    balanceNumeric: 800,
    alerts: [],
    profileSlug: null,
  },
  {
    id: "pt-004",
    name: "Sara Khaled",
    initials: "SK",
    mobile: "010 9988 1122",
    dob: "14 Apr 2000",
    age: 26,
    gender: "Female",
    status: "New",
    lastVisitDate: null,
    lastVisitType: null,
    nextAppointment: { date: "Tue, 16 Sep", time: "09:00", type: "New patient examination", dentist: "Dr. Karim Mostafa" },
    balance: "EGP 0",
    balanceNumeric: 0,
    alerts: [],
    profileSlug: null,
  },
  {
    id: "pt-005",
    name: "Ahmed Farouk",
    initials: "AF",
    mobile: "015 6677 4400",
    dob: "30 Jul 1972",
    age: 54,
    gender: "Male",
    status: "Active",
    lastVisitDate: "12 Aug 2026",
    lastVisitType: "Crown preparation",
    nextAppointment: null,
    balance: "EGP 3,200",
    balanceNumeric: 3200,
    alerts: ["Hypertension — check BP before treatment"],
    profileSlug: null,
  },
  {
    id: "pt-006",
    name: "Dina Ramadan",
    initials: "DR",
    mobile: "011 2200 8833",
    dob: "19 Jan 1991",
    age: 35,
    gender: "Female",
    status: "Active",
    lastVisitDate: "22 Aug 2026",
    lastVisitType: "Orthodontic adjustment",
    nextAppointment: { date: "Wed, 17 Sep", time: "11:30", type: "Orthodontic adjustment", dentist: "Dr. Amira Fathy" },
    balance: "EGP 0",
    balanceNumeric: 0,
    alerts: [],
    profileSlug: null,
  },
  {
    id: "pt-007",
    name: "Khaled Ibrahim",
    initials: "KI",
    mobile: "010 4411 6622",
    dob: "08 Oct 1966",
    age: 59,
    gender: "Male",
    status: "Inactive",
    lastVisitDate: "03 Jan 2025",
    lastVisitType: "Extraction",
    nextAppointment: null,
    balance: "EGP 0",
    balanceNumeric: 0,
    alerts: ["Diabetes — coordinate with GP"],
    profileSlug: null,
  },
  {
    id: "pt-008",
    name: "Yasmine Mostafa",
    initials: "YM",
    mobile: "012 8899 3344",
    dob: "23 Feb 1998",
    age: 28,
    gender: "Female",
    status: "Active",
    lastVisitDate: "08 Sep 2026",
    lastVisitType: "Teeth whitening",
    nextAppointment: null,
    balance: "EGP 0",
    balanceNumeric: 0,
    alerts: [],
    profileSlug: null,
  },
  {
    id: "pt-009",
    name: "Mohamed Salah",
    initials: "MS",
    mobile: "011 7733 0055",
    dob: "11 Dec 1985",
    age: 40,
    gender: "Male",
    status: "Active",
    lastVisitDate: "03 Sep 2026",
    lastVisitType: "Full mouth X-ray",
    nextAppointment: { date: "Thu, 18 Sep", time: "13:00", type: "Treatment planning", dentist: "Dr. Karim Mostafa" },
    balance: "EGP 500",
    balanceNumeric: 500,
    alerts: [],
    profileSlug: null,
  },
  {
    id: "pt-010",
    name: "Rania Gamal",
    initials: "RG",
    mobile: "015 1122 6677",
    dob: "05 Sep 2010",
    age: 16,
    gender: "Female",
    status: "New",
    lastVisitDate: null,
    lastVisitType: null,
    nextAppointment: { date: "Fri, 19 Sep", time: "15:30", type: "Orthodontic consultation", dentist: "Dr. Amira Fathy" },
    balance: "EGP 0",
    balanceNumeric: 0,
    alerts: ["Minor — guardian consent required"],
    profileSlug: null,
  },
];

export type PatientSortField = "name" | "dob" | "lastVisitDate" | "balance" | "nextAppointment";
export type SortDirection = "asc" | "desc";

export function filterAndSortPatients(
  patients: PatientListRow[],
  search: string,
  statusFilter: string,
  genderFilter: string,
  sortField: PatientSortField,
  sortDir: SortDirection
): PatientListRow[] {
  const q = search.trim().toLowerCase();
  let result = patients.filter((p) => {
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.mobile.includes(q);
    const matchStatus = !statusFilter || p.status === statusFilter;
    const matchGender = !genderFilter || p.gender === genderFilter;
    return matchSearch && matchStatus && matchGender;
  });

  result = [...result].sort((a, b) => {
    let cmp = 0;
    if (sortField === "name") cmp = a.name.localeCompare(b.name);
    else if (sortField === "dob") cmp = a.age - b.age; // older = smaller age value descending
    else if (sortField === "lastVisitDate") cmp = (a.lastVisitDate ?? "").localeCompare(b.lastVisitDate ?? "");
    else if (sortField === "balance") cmp = a.balanceNumeric - b.balanceNumeric;
    else if (sortField === "nextAppointment") cmp = (a.nextAppointment?.date ?? "").localeCompare(b.nextAppointment?.date ?? "");
    return sortDir === "asc" ? cmp : -cmp;
  });

  return result;
}
