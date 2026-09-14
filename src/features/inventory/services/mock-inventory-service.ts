import type {
    InventoryItem,
    InventoryMovement,
    Supplier,
} from "@/features/inventory/inventory.types";

export const mockInventoryItems: InventoryItem[] = [
    {
        id: "inv-gloves",
        name: "Nitrile examination gloves",
        category: "Consumable",
        unit: "pairs",
        currentStock: 42,
        minimumStock: 50,
        supplier: "Medline Supplies",
        batch: "NG-2608-A",
        expiryDate: "18 Mar 2028",
        purchaseCost: 2.4,
    },
    {
        id: "inv-syringes",
        name: "Dental anesthetic syringes",
        category: "Consumable",
        unit: "pieces",
        currentStock: 180,
        minimumStock: 100,
        supplier: "Cairo Dental Trade",
        batch: "DS-2611-C",
        expiryDate: "06 Nov 2029",
        purchaseCost: 6.5,
    },
    {
        id: "inv-composite",
        name: "Universal composite resin",
        category: "Material",
        unit: "syringes",
        currentStock: 7,
        minimumStock: 10,
        supplier: "Cairo Dental Trade",
        batch: "CR-2605-B",
        expiryDate: "04 Oct 2026",
        purchaseCost: 420,
    },
    {
        id: "inv-fluoride",
        name: "Fluoride varnish",
        category: "Medicine",
        unit: "boxes",
        currentStock: 0,
        minimumStock: 4,
        supplier: "OralCare Egypt",
        batch: "FV-2601-D",
        expiryDate: "26 Sep 2027",
        purchaseCost: 310,
    },
    {
        id: "inv-cups",
        name: "Patient rinse cups",
        category: "Clinic supply",
        unit: "packs",
        currentStock: 24,
        minimumStock: 12,
        supplier: "Medline Supplies",
        purchaseCost: 85,
    },
];

export const mockSuppliers: Supplier[] = [
    {
        id: "supplier-medline",
        name: "Medline Supplies",
        contact: "orders@medline.example",
        items: 2,
        lastReceipt: "11 Sep 2026",
    },
    {
        id: "supplier-cairo",
        name: "Cairo Dental Trade",
        contact: "Sales desk · +20 2 555 0190",
        items: 2,
        lastReceipt: "08 Sep 2026",
    },
    {
        id: "supplier-oralcare",
        name: "OralCare Egypt",
        contact: "procurement@oralcare.example",
        items: 1,
        lastReceipt: "02 Sep 2026",
    },
];

export const mockInventoryMovements: InventoryMovement[] = [
    {
        id: "movement-001",
        date: "13 Sep 2026 · 09:42",
        itemName: "Nitrile examination gloves",
        type: "Manual adjustment",
        quantity: -8,
        unit: "pairs",
        balanceAfter: 42,
        user: "Dr. Salma Hassan",
        reason: "Damaged stock removed",
    },
    {
        id: "movement-002",
        date: "11 Sep 2026 · 14:10",
        itemName: "Patient rinse cups",
        type: "Goods received",
        quantity: 12,
        unit: "packs",
        balanceAfter: 24,
        user: "Dr. Salma Hassan",
        reason: "Supplier delivery",
    },
    {
        id: "movement-003",
        date: "08 Sep 2026 · 10:25",
        itemName: "Dental anesthetic syringes",
        type: "Goods received",
        quantity: 80,
        unit: "pieces",
        balanceAfter: 180,
        user: "Dr. Salma Hassan",
        reason: "Supplier delivery",
    },
];

export function formatEgp(value: number) {
    return `EGP ${value.toLocaleString("en-US", {
        minimumFractionDigits: value % 1 ? 2 : 0,
        maximumFractionDigits: 2,
    })}`;
}

export function inventoryStatus(item: InventoryItem) {
    if (item.currentStock === 0) {
        return "Out of stock" as const;
    }
    if (item.expiryDate === "04 Oct 2026") {
        return "Expiring" as const;
    }
    if (item.currentStock < item.minimumStock) {
        return "Low stock" as const;
    }
    return "Healthy" as const;
}

