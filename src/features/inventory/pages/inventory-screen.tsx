"use client";

import {
    ArrowDownToLine,
    CheckCircle2,
    Plus,
    ShieldAlert,
    X,
} from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import type { UserRole } from "@/types";
import type {
    InventoryItem,
    InventoryMovement,
    InventoryTab,
} from "@/features/inventory/inventory.types";
import {
    inventoryStatus,
    mockInventoryItems,
    mockInventoryMovements,
    mockSuppliers,
} from "@/features/inventory/services/mock-inventory-service";
import { dashboardUsers } from "@/features/dashboard/services/mock-dashboard-service";
import InventoryMetrics from "../components/inventory-metrics";
import ReceiveGoodsForm from "../components/receive-goods-form";
import AdjustStockForm from "../components/adjust-stock-form";
import InventoryItems from "../components/inventory-items";
import InventorySelectedItem from "../components/inventory-selected-item";
import StockAlert from "../components/stock-alert";
import InventoryMovementList from "../components/inventory-movement-list";
import InventoryTabsPanel from "../components/inventory-tabs-panel";

function statusClass(status: ReturnType<typeof inventoryStatus>) {
    return status.toLowerCase().replaceAll(" ", "-");
}

function movementClass(quantity: number) {
    return quantity > 0
        ? "inventory-quantity--positive"
        : "inventory-quantity--negative";
}

export function InventoryScreen({ initialRole }: { initialRole: UserRole }) {
    const [role, setRole] = useState<UserRole>(initialRole);
    const [activeTab, setActiveTab] = useState<InventoryTab>("Items");
    const [items, setItems] = useState<InventoryItem[]>(mockInventoryItems);
    const [movements, setMovements] = useState<InventoryMovement[]>(
        mockInventoryMovements,
    );
    const [selectedItemId, setSelectedItemId] = useState("inv-gloves");
    const [showReceiptForm, setShowReceiptForm] = useState(false);
    const [showAdjustmentForm, setShowAdjustmentForm] = useState(false);
    const [feedback, setFeedback] = useState("");

    const selectedItem =
        items.find((item) => item.id === selectedItemId) ?? items[0];

    const lowStockItems = items.filter(
        (item) =>
            item.currentStock > 0 && item.currentStock < item.minimumStock,
    );
    const outOfStockItems = items.filter((item) => item.currentStock === 0);
    const expiringItems = items.filter(
        (item) => inventoryStatus(item) === "Expiring",
    );
    const alertItems = Array.from(
        new Map(
            [...outOfStockItems, ...lowStockItems, ...expiringItems].map(
                (item) => [item.id, item],
            ),
        ).values(),
    );

    if (role !== "admin") {
        return (
            <AppShell
                activeItem="Inventory"
                role={role}
                userName={dashboardUsers[role]}
                onRoleChange={setRole}
            >
                <section
                    className="permission-state"
                    aria-labelledby="inventory-access-title"
                >
                    <span className="permission-state__icon">
                        <ShieldAlert aria-hidden="true" />
                    </span>
                    <p className="page-heading__eyebrow">
                        Restricted workspace
                    </p>
                    <h1 id="inventory-access-title">
                        Inventory access is restricted
                    </h1>
                    <p>
                        Stock records and adjustments are available to Admins
                        and authorized inventory staff. Your role does not
                        include inventory access.
                    </p>
                </section>
            </AppShell>
        );
    }

    return (
        <AppShell
            activeItem="Inventory"
            role={role}
            userName={dashboardUsers[role]}
            onRoleChange={setRole}
        >
            <header className="page-heading inventory-heading">
                <div>
                    <p className="page-heading__eyebrow">Branch inventory</p>
                    <h1>Stock and supplies</h1>
                    <p>
                        Keep essential clinic supplies visible, traceable, and
                        ready for the next appointment.
                    </p>
                </div>
                <div className="inventory-heading__actions">
                    <button
                        type="button"
                        className="button button--secondary"
                        onClick={() => {
                            setShowAdjustmentForm(false);
                            setShowReceiptForm(true);
                        }}
                    >
                        <ArrowDownToLine aria-hidden="true" />
                        Receive goods
                    </button>
                    <button
                        type="button"
                        className="button button--primary"
                        onClick={() => {
                            setShowReceiptForm(false);
                            setShowAdjustmentForm(true);
                        }}
                    >
                        <Plus aria-hidden="true" />
                        Adjust stock
                    </button>
                </div>
            </header>

            <InventoryMetrics
                numExpiringItems={expiringItems.length}
                numItems={items.length}
                numLowStockItems={lowStockItems.length}
                numOutOfStockItems={outOfStockItems.length}
            />

            {feedback ? (
                <p className="inventory-feedback" role="status">
                    <CheckCircle2 aria-hidden="true" />
                    {feedback}
                    <button
                        type="button"
                        aria-label="Dismiss inventory message"
                        onClick={() => setFeedback("")}
                    >
                        <X aria-hidden="true" />
                    </button>
                </p>
            ) : null}

            {showReceiptForm ? (
                <ReceiveGoodsForm
                    dashboardUsers={dashboardUsers}
                    items={items}
                    selectedItem={selectedItem}
                    setFeedback={setFeedback}
                    setItems={setItems}
                    setMovements={setMovements}
                    setSelectedItemId={setSelectedItemId}
                    setShowReceiptForm={setShowReceiptForm}
                />
            ) : null}

            {showAdjustmentForm ? (
                <AdjustStockForm
                    dashboardUsers={dashboardUsers}
                    selectedItem={selectedItem}
                    selectedItemId={selectedItemId}
                    setFeedback={setFeedback}
                    setItems={setItems}
                    setMovements={setMovements}
                    setShowAdjustmentForm={setShowAdjustmentForm}
                />
            ) : null}

            <section
                className="inventory-layout"
                aria-label="Inventory workspace"
            >
                <InventoryItems
                    inventoryStatus={inventoryStatus}
                    items={items}
                    selectedItemId={selectedItemId}
                    setSelectedItemId={setSelectedItemId}
                    statusClass={statusClass}
                />

                <InventorySelectedItem
                    selectedItem={selectedItem}
                    setShowAdjustmentForm={setShowAdjustmentForm}
                    setShowReceiptForm={setShowReceiptForm}
                    statusClass={statusClass}
                />
            </section>

            <section className="inventory-lower-grid">
                <StockAlert
                    alertItems={alertItems}
                    inventoryStatus={inventoryStatus}
                    numExpiringItems={expiringItems.length}
                    numLowStockItems={lowStockItems.length}
                    numOutOfStockItems={outOfStockItems.length}
                    setActiveTab={setActiveTab}
                    setSelectedItemId={setSelectedItemId}
                />

                <InventoryMovementList
                    movements={movements}
                    movementClass={movementClass}
                />
            </section>

            <InventoryTabsPanel
                suppliers={mockSuppliers}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                movementClass={movementClass}
                movements={movements}
            />
        </AppShell>
    );
}
