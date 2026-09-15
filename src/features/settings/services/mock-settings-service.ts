import type { MockSettingsData } from "@/features/settings/settings.types";

export const mockSettingsData: MockSettingsData = {
  clinic: {
    name: "Smile Clinic Cairo",
    specialty: "General & Cosmetic Dentistry",
    address: "14 Tahrir Square, 2nd Floor, Cairo Governorate, Egypt",
    phone: "+20 2 2391 0000",
    email: "info@smileclinic.example",
    registrationNumber: "EG-MED-2019-00482",
    taxId: "201-456-789",
    website: "https://smileclinic.example",
  },

  appointmentTypes: [
    { id: "apt-consultation", name: "Consultation", defaultDurationMinutes: 30, defaultPrice: 500, active: true, color: "#0f766e" },
    { id: "apt-cleaning", name: "Cleaning", defaultDurationMinutes: 45, defaultPrice: 450, active: true, color: "#0e9488" },
    { id: "apt-rootcanal", name: "Root canal treatment", defaultDurationMinutes: 90, defaultPrice: 4500, active: true, color: "#7c3aed" },
    { id: "apt-crown", name: "Crown fitting", defaultDurationMinutes: 60, defaultPrice: 3200, active: true, color: "#c2410c" },
    { id: "apt-xray", name: "X-ray", defaultDurationMinutes: 15, defaultPrice: 350, active: true, color: "#1d4ed8" },
    { id: "apt-followup", name: "Follow-up", defaultDurationMinutes: 20, defaultPrice: 200, active: true, color: "#047857" },
    { id: "apt-whitening", name: "Whitening", defaultDurationMinutes: 60, defaultPrice: 2500, active: false, color: "#b45309" },
  ],

  services: [
    { id: "svc-rct", name: "Root canal treatment", category: "Endodontics", defaultPrice: 4500, active: true },
    { id: "svc-crown", name: "Porcelain crown", category: "Prosthodontics", defaultPrice: 3200, active: true },
    { id: "svc-consult", name: "Initial consultation", category: "General", defaultPrice: 500, active: true },
    { id: "svc-clean", name: "Scaling and polishing", category: "Preventive", defaultPrice: 450, active: true },
    { id: "svc-xray-peri", name: "Periapical X-ray", category: "Radiology", defaultPrice: 350, active: true },
    { id: "svc-xray-pan", name: "Panoramic X-ray", category: "Radiology", defaultPrice: 700, active: true },
    { id: "svc-comp", name: "Composite filling", category: "Restorative", defaultPrice: 800, active: true },
    { id: "svc-ext", name: "Simple extraction", category: "Oral surgery", defaultPrice: 600, active: true },
    { id: "svc-white", name: "In-office whitening", category: "Cosmetic", defaultPrice: 2500, active: false },
  ],

  workingHours: [
    { day: "Sunday", open: true, start: "09:00", end: "17:00", breakStart: "13:00", breakEnd: "14:00" },
    { day: "Monday", open: true, start: "09:00", end: "17:00", breakStart: "13:00", breakEnd: "14:00" },
    { day: "Tuesday", open: true, start: "09:00", end: "17:00", breakStart: "13:00", breakEnd: "14:00" },
    { day: "Wednesday", open: true, start: "09:00", end: "17:00", breakStart: "13:00", breakEnd: "14:00" },
    { day: "Thursday", open: true, start: "09:00", end: "15:00" },
    { day: "Friday", open: false, start: "09:00", end: "17:00" },
    { day: "Saturday", open: true, start: "10:00", end: "14:00" },
  ],

  appointmentRules: {
    defaultSlotMinutes: 30,
    minAdvanceBookingHours: 2,
    maxAdvanceBookingDays: 90,
    allowDoubleBooking: false,
    requireAdminOverrideReason: true,
    autoConfirm: false,
    cancellationCutoffHours: 24,
  },

  billing: {
    currency: "EGP",
    taxRate: 0,
    taxLabel: "VAT",
    invoicePrefix: "INV-",
    receiptPrefix: "RCP-",
    paymentTermsDays: 0,
    allowPartialPayments: true,
  },

  users: [
    { id: "user-salma", name: "Dr. Salma Hassan", email: "salma@smileclinic.example", role: "admin", active: true, mfaEnabled: true },
    { id: "user-nour", name: "Nour Adel", email: "nour@smileclinic.example", role: "receptionist", active: true, mfaEnabled: false },
    { id: "user-karim", name: "Dr. Karim Mostafa", email: "karim@smileclinic.example", role: "dentist", active: true, mfaEnabled: false },
    { id: "user-rania", name: "Dr. Rania Khaled", email: "rania@smileclinic.example", role: "dentist", active: false, mfaEnabled: false },
  ],

  security: {
    sessionTimeoutMinutes: 30,
    passwordMinLength: 10,
    requireUppercase: true,
    requireSpecialChar: true,
    mfaRequiredForAdmin: true,
    loginAttemptLockout: 5,
  },
};
