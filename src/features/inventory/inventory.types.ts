export type InventoryCategory =
    | "Consumable"
    | "Material"
    | "Medicine"
    | "Clinic supply";

export type StockStatus = "Healthy" | "Low stock" | "Out of stock" | "Expiring";

export type InventoryMovementType =
    | "Goods received"
    | "Manual adjustment"
    | "Adjustment reversal";

export type InventoryItem = {
    id: string;
    name: string;
    category: InventoryCategory;
    unit: string;
    currentStock: number;
    minimumStock: number;
    supplier: string;
    batch?: string;
    expiryDate?: string;
    purchaseCost: number;
};

export type InventoryMovement = {
    id: string;
    date: string;
    itemName: string;
    type: InventoryMovementType;
    quantity: number;
    unit: string;
    balanceAfter: number;
    user: string;
    reason: string;
};

export type Supplier = {
    id: string;
    name: string;
    contact: string;
    items: number;
    lastReceipt: string;
};

