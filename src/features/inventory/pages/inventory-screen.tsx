"use client";

import {
    AlertTriangle,
    ArrowDownToLine,
    ArrowUpRight,
    CheckCircle2,
    ClipboardList,
    FileWarning,
    History,
    Package,
    Plus,
    Search,
    ShieldAlert,
    Truck,
    X,
} from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { AppShell } from "@/components/layout/app-shell";
import type { UserRole } from "@/types";
import type {
    InventoryItem,
    InventoryMovement,
} from "@/features/inventory/inventory.types";
import {
    formatEgp,
    inventoryStatus,
    mockInventoryItems,
    mockInventoryMovements,
    mockSuppliers,
} from "@/features/inventory/services/mock-inventory-service";
import { dashboardUsers } from "@/features/dashboard/services/mock-dashboard-service";

type InventoryTab = "Items" | "Suppliers" | "Goods receipts" | "Stock movements";
type AdjustmentDirection = "Increase" | "Decrease";

function statusClass(status: ReturnType<typeof inventoryStatus>) {
    return status.toLowerCase().replaceAll(" ", "-");
}

function movementClass(quantity: number) {
    return quantity > 0 ? "inventory-quantity--positive" : "inventory-quantity--negative";
}

export function InventoryScreen({ initialRole }: { initialRole: UserRole }) {
    const [role, setRole] = useState<UserRole>(initialRole);
    const [activeTab, setActiveTab] = useState<InventoryTab>("Items");
    const [items, setItems] = useState<InventoryItem[]>(mockInventoryItems);
    const [movements, setMovements] =
        useState<InventoryMovement[]>(mockInventoryMovements);
    const [selectedItemId, setSelectedItemId] = useState("inv-gloves");
    const [query, setQuery] = useState("");
    const [showReceiptForm, setShowReceiptForm] = useState(false);
    const [showAdjustmentForm, setShowAdjustmentForm] = useState(false);
    const [feedback, setFeedback] = useState("");

    const selectedItem =
        items.find((item) => item.id === selectedItemId) ?? items[0];
    const filteredItems = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();
        if (!normalizedQuery) {
            return items;
        }
        return items.filter((item) =>
            [item.name, item.category, item.supplier, item.batch]
                .filter(Boolean)
                .some((value) => value?.toLowerCase().includes(normalizedQuery)),
        );
    }, [items, query]);
    const lowStockItems = items.filter(
        (item) => item.currentStock > 0 && item.currentStock < item.minimumStock,
    );
    const outOfStockItems = items.filter((item) => item.currentStock === 0);
    const expiringItems = items.filter((item) => inventoryStatus(item) === "Expiring");
    const alertItems = Array.from(
        new Map(
            [...outOfStockItems, ...lowStockItems, ...expiringItems].map((item) => [
                item.id,
                item,
            ]),
        ).values(),
    );

    function updateSelectedItem(update: (item: InventoryItem) => InventoryItem) {
        setItems((current) =>
            current.map((item) =>
                item.id === selectedItemId ? update(item) : item,
            ),
        );
    }

    function recordGoodsReceipt(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const quantity = Number(form.get("quantity"));
        if (!quantity || quantity <= 0) {
            setFeedback("Enter a received quantity greater than zero.");
            return;
        }
        const receiptItemId = String(form.get("itemId"));
        const receiptItem =
            items.find((item) => item.id === receiptItemId) ?? selectedItem;
        const newBalance = receiptItem.currentStock + quantity;
        setItems((current) =>
            current.map((item) =>
                item.id === receiptItem.id
                    ? { ...item, currentStock: newBalance }
                    : item,
            ),
        );
        setMovements((current) => [
            {
                id: `movement-${Date.now()}`,
                date: "13 Sep 2026 · 11:18",
                itemName: receiptItem.name,
                type: "Goods received",
                quantity,
                unit: receiptItem.unit,
                balanceAfter: newBalance,
                user: dashboardUsers.admin,
                reason: String(form.get("reason") || "Supplier delivery"),
            },
            ...current,
        ]);
        setSelectedItemId(receiptItem.id);
        setShowReceiptForm(false);
        setFeedback(`${quantity} ${receiptItem.unit} received and added to stock.`);
    }

    function recordAdjustment(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const quantity = Number(form.get("quantity"));
        const direction = String(form.get("direction")) as AdjustmentDirection;
        const reason = String(form.get("reason") || "").trim();
        if (!quantity || quantity <= 0 || !reason) {
            setFeedback("Enter a quantity and reason before recording the adjustment.");
            return;
        }
        const delta = direction === "Increase" ? quantity : -quantity;
        const newBalance = selectedItem.currentStock + delta;
        if (newBalance < 0) {
            setFeedback("Negative stock is blocked. Reduce the adjustment quantity.");
            return;
        }
        updateSelectedItem((item) => ({ ...item, currentStock: newBalance }));
        setMovements((current) => [
            {
                id: `movement-${Date.now()}`,
                date: "13 Sep 2026 · 11:24",
                itemName: selectedItem.name,
                type: "Manual adjustment",
                quantity: delta,
                unit: selectedItem.unit,
                balanceAfter: newBalance,
                user: dashboardUsers.admin,
                reason,
            },
            ...current,
        ]);
        setShowAdjustmentForm(false);
        setFeedback(
            `${selectedItem.name} adjusted to ${newBalance} ${selectedItem.unit}. The movement was logged.`,
        );
    }

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
                    <p className="page-heading__eyebrow">Restricted workspace</p>
                    <h1 id="inventory-access-title">Inventory access is restricted</h1>
                    <p>
                        Stock records and adjustments are available to Admins and
                        authorized inventory staff. Your role does not include inventory
                        access.
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
                        Keep essential clinic supplies visible, traceable, and ready for
                        the next appointment.
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

            <section className="inventory-metrics" aria-label="Inventory summary">
                <article>
                    <span className="inventory-metric__icon inventory-metric__icon--teal">
                        <Package aria-hidden="true" />
                    </span>
                    <div>
                        <span>Tracked items</span>
                        <strong>{items.length}</strong>
                        <small>Across this branch</small>
                    </div>
                </article>
                <article>
                    <span className="inventory-metric__icon inventory-metric__icon--warning">
                        <AlertTriangle aria-hidden="true" />
                    </span>
                    <div>
                        <span>Low stock</span>
                        <strong>{lowStockItems.length}</strong>
                        <small>Below minimum level</small>
                    </div>
                </article>
                <article>
                    <span className="inventory-metric__icon inventory-metric__icon--error">
                        <FileWarning aria-hidden="true" />
                    </span>
                    <div>
                        <span>Out of stock</span>
                        <strong>{outOfStockItems.length}</strong>
                        <small>Needs replenishment</small>
                    </div>
                </article>
                <article>
                    <span className="inventory-metric__icon inventory-metric__icon--purple">
                        <ClipboardList aria-hidden="true" />
                    </span>
                    <div>
                        <span>Expiring soon</span>
                        <strong>{expiringItems.length}</strong>
                        <small>Review before use</small>
                    </div>
                </article>
            </section>

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
                <form className="inventory-action-panel" onSubmit={recordGoodsReceipt}>
                    <div>
                        <p className="panel-kicker">Goods receipt</p>
                        <h2>Receive stock into the branch</h2>
                        <p>Stock increases only when goods are physically received.</p>
                    </div>
                    <div className="inventory-form-grid">
                        <label>
                            <span>Item</span>
                            <select name="itemId" defaultValue={selectedItem.id}>
                                {items.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label>
                            <span>Quantity received</span>
                            <input name="quantity" type="number" min="1" step="1" required />
                        </label>
                        <label>
                            <span>Reason</span>
                            <input
                                name="reason"
                                type="text"
                                defaultValue="Supplier delivery"
                                required
                            />
                        </label>
                    </div>
                    <div className="inventory-action-panel__actions">
                        <button
                            type="button"
                            className="button button--secondary"
                            onClick={() => setShowReceiptForm(false)}
                        >
                            Cancel
                        </button>
                        <button type="submit" className="button button--primary">
                            <Truck aria-hidden="true" />
                            Record goods receipt
                        </button>
                    </div>
                </form>
            ) : null}

            {showAdjustmentForm ? (
                <form className="inventory-action-panel" onSubmit={recordAdjustment}>
                    <div>
                        <p className="panel-kicker">Audited adjustment</p>
                        <h2>Adjust {selectedItem.name}</h2>
                        <p>
                            Current balance: {selectedItem.currentStock} {selectedItem.unit}.
                            Negative stock is blocked by default.
                        </p>
                    </div>
                    <div className="inventory-form-grid">
                        <label>
                            <span>Direction</span>
                            <select name="direction" defaultValue="Increase">
                                <option>Increase</option>
                                <option>Decrease</option>
                            </select>
                        </label>
                        <label>
                            <span>Quantity</span>
                            <input name="quantity" type="number" min="1" step="1" required />
                        </label>
                        <label>
                            <span>Reason</span>
                            <input name="reason" type="text" required />
                        </label>
                    </div>
                    <div className="inventory-action-panel__actions">
                        <button
                            type="button"
                            className="button button--secondary"
                            onClick={() => setShowAdjustmentForm(false)}
                        >
                            Cancel
                        </button>
                        <button type="submit" className="button button--primary">
                            <History aria-hidden="true" />
                            Record adjustment
                        </button>
                    </div>
                </form>
            ) : null}

            <section className="inventory-layout" aria-label="Inventory workspace">
                <article className="inventory-items-panel">
                    <div className="panel-header inventory-panel-header">
                        <div>
                            <h2>Inventory items</h2>
                            <p>Current stock by item, unit, and minimum level</p>
                        </div>
                        <label className="inventory-search">
                            <Search aria-hidden="true" />
                            <span className="sr-only">Search inventory</span>
                            <input
                                type="search"
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder="Search items"
                            />
                        </label>
                    </div>
                    <div className="inventory-table-wrap">
                        <table className="inventory-table">
                            <thead>
                                <tr>
                                    <th scope="col">Item</th>
                                    <th scope="col">Stock</th>
                                    <th scope="col">Minimum</th>
                                    <th scope="col">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.map((item) => {
                                    const status = inventoryStatus(item);
                                    return (
                                        <tr
                                            key={item.id}
                                            className={
                                                selectedItemId === item.id
                                                    ? "inventory-row--selected"
                                                    : ""
                                            }
                                            onClick={() => setSelectedItemId(item.id)}
                                        >
                                            <td>
                                                <button
                                                    type="button"
                                                    className="inventory-item-link"
                                                    onClick={() => setSelectedItemId(item.id)}
                                                >
                                                    <strong>{item.name}</strong>
                                                    <small>
                                                        {item.category} · {item.supplier}
                                                    </small>
                                                </button>
                                            </td>
                                            <td>
                                                <strong>
                                                    {item.currentStock} {item.unit}
                                                </strong>
                                            </td>
                                            <td>{item.minimumStock} {item.unit}</td>
                                            <td>
                                                <span
                                                    className={`inventory-status inventory-status--${statusClass(status)}`}
                                                >
                                                    {status}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {!filteredItems.length ? (
                            <div className="inventory-empty">
                                <Search aria-hidden="true" />
                                <strong>No inventory items found</strong>
                                <span>Try a different item, category, or supplier.</span>
                            </div>
                        ) : null}
                    </div>
                </article>

                <aside className="inventory-detail-panel">
                    <div className="inventory-detail-panel__header">
                        <div>
                            <p className="panel-kicker">Selected item</p>
                            <h2>{selectedItem.name}</h2>
                            <p>{selectedItem.category} · {selectedItem.supplier}</p>
                        </div>
                        <span
                            className={`inventory-status inventory-status--${statusClass(inventoryStatus(selectedItem))}`}
                        >
                            {inventoryStatus(selectedItem)}
                        </span>
                    </div>
                    <div className="inventory-stock-highlight">
                        <span>Current stock</span>
                        <strong>{selectedItem.currentStock} {selectedItem.unit}</strong>
                        <small>Minimum level: {selectedItem.minimumStock} {selectedItem.unit}</small>
                    </div>
                    <dl className="inventory-detail-list">
                        <div>
                            <dt>Batch / lot</dt>
                            <dd>{selectedItem.batch ?? "Not recorded"}</dd>
                        </div>
                        <div>
                            <dt>Expiry date</dt>
                            <dd>{selectedItem.expiryDate ?? "Not applicable"}</dd>
                        </div>
                        <div>
                            <dt>Purchase cost</dt>
                            <dd>{formatEgp(selectedItem.purchaseCost)} / {selectedItem.unit}</dd>
                        </div>
                    </dl>
                    <div className="inventory-detail-actions">
                        <button
                            type="button"
                            className="button button--secondary"
                            onClick={() => {
                                setShowReceiptForm(false);
                                setShowAdjustmentForm(true);
                            }}
                        >
                            <History aria-hidden="true" />
                            Adjust stock
                        </button>
                    </div>
                </aside>
            </section>

            <section className="inventory-lower-grid">
                <article className="inventory-panel">
                    <div className="panel-header">
                        <div>
                            <h2>Stock alerts</h2>
                            <p>Items needing an Admin review</p>
                        </div>
                        <AlertTriangle aria-hidden="true" />
                    </div>
                    <div className="inventory-alert-list">
                        {alertItems.map((item) => (
                                <button
                                    type="button"
                                    key={`${item.id}-${inventoryStatus(item)}`}
                                    onClick={() => {
                                        setSelectedItemId(item.id);
                                        setActiveTab("Items");
                                    }}
                                >
                                    <span className="inventory-alert-list__icon">
                                        {inventoryStatus(item) === "Expiring" ? (
                                            <FileWarning aria-hidden="true" />
                                        ) : (
                                            <AlertTriangle aria-hidden="true" />
                                        )}
                                    </span>
                                    <span>
                                        <strong>{item.name}</strong>
                                        <small>
                                            {inventoryStatus(item)} · {item.currentStock}{" "}
                                            {item.unit} available
                                        </small>
                                    </span>
                                    <ArrowUpRight aria-hidden="true" />
                                </button>
                            ))}
                        {!outOfStockItems.length && !lowStockItems.length && !expiringItems.length ? (
                            <p className="inventory-empty-copy">All tracked items are within safe levels.</p>
                        ) : null}
                    </div>
                </article>

                <article className="inventory-panel">
                    <div className="panel-header">
                        <div>
                            <h2>Recent stock movements</h2>
                            <p>Immutable movement history</p>
                        </div>
                        <History aria-hidden="true" />
                    </div>
                    <div className="inventory-movement-list">
                        {movements.slice(0, 4).map((movement) => (
                            <article key={movement.id}>
                                <span className="inventory-movement-list__icon">
                                    {movement.type === "Goods received" ? (
                                        <ArrowDownToLine aria-hidden="true" />
                                    ) : (
                                        <History aria-hidden="true" />
                                    )}
                                </span>
                                <div>
                                    <strong>{movement.itemName}</strong>
                                    <small>
                                        {movement.type} · {movement.date}
                                    </small>
                                    <small>
                                        {movement.reason} · {movement.user}
                                    </small>
                                </div>
                                <b className={movementClass(movement.quantity)}>
                                    {movement.quantity > 0 ? "+" : ""}
                                    {movement.quantity} {movement.unit}
                                </b>
                            </article>
                        ))}
                    </div>
                </article>
            </section>

            <section className="inventory-tabs-panel">
                <div className="inventory-tabs" role="tablist" aria-label="Inventory records">
                    {(["Items", "Suppliers", "Goods receipts", "Stock movements"] as InventoryTab[]).map(
                        (tab) => (
                            <button
                                key={tab}
                                type="button"
                                role="tab"
                                aria-selected={activeTab === tab}
                                className={activeTab === tab ? "inventory-tab--active" : ""}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </button>
                        ),
                    )}
                </div>
                {activeTab === "Suppliers" ? (
                    <div className="inventory-record-grid">
                        {mockSuppliers.map((supplier) => (
                            <article key={supplier.id}>
                                <span className="inventory-record-icon">
                                    <Truck aria-hidden="true" />
                                </span>
                                <div>
                                    <strong>{supplier.name}</strong>
                                    <small>{supplier.contact}</small>
                                    <small>{supplier.items} tracked items · Last receipt {supplier.lastReceipt}</small>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : null}
                {activeTab === "Goods receipts" ? (
                    <div className="inventory-record-table">
                        {movements
                            .filter((movement) => movement.type === "Goods received")
                            .map((movement) => (
                                <article key={movement.id}>
                                    <span>{movement.date}</span>
                                    <strong>{movement.itemName}</strong>
                                    <span className="inventory-quantity--positive">
                                        +{movement.quantity} {movement.unit}
                                    </span>
                                    <small>{movement.reason} · {movement.user}</small>
                                </article>
                            ))}
                    </div>
                ) : null}
                {activeTab === "Stock movements" ? (
                    <div className="inventory-record-table">
                        {movements.map((movement) => (
                            <article key={movement.id}>
                                <span>{movement.date}</span>
                                <strong>{movement.itemName}</strong>
                                <span className={movementClass(movement.quantity)}>
                                    {movement.quantity > 0 ? "+" : ""}
                                    {movement.quantity} {movement.unit}
                                </span>
                                <small>{movement.reason} · {movement.user}</small>
                            </article>
                        ))}
                    </div>
                ) : null}
                {activeTab === "Items" ? (
                    <p className="inventory-tab-note">
                        Select an item above to review its batch, expiry, purchase cost, and
                        current stock.
                    </p>
                ) : null}
            </section>
        </AppShell>
    );
}
