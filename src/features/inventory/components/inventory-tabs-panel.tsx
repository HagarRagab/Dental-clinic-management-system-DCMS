import { Truck } from "lucide-react";
import { InventoryMovement, InventoryTab, Supplier } from "../inventory.types";
import { Dispatch, SetStateAction } from "react";

function InventoryTabsPanel({
    activeTab,
    setActiveTab,
    suppliers,
    movements,
    movementClass,
}: {
    activeTab: InventoryTab;
    setActiveTab: Dispatch<SetStateAction<InventoryTab>>;
    suppliers: Supplier[];
    movements: InventoryMovement[];
    movementClass: (
        quantity: number,
    ) => "inventory-quantity--positive" | "inventory-quantity--negative";
}) {
    return (
        <section className="inventory-tabs-panel">
            <div
                className="inventory-tabs"
                role="tablist"
                aria-label="Inventory records"
            >
                {(
                    [
                        "Items",
                        "Suppliers",
                        "Goods receipts",
                        "Stock movements",
                    ] as InventoryTab[]
                ).map((tab) => (
                    <button
                        key={tab}
                        type="button"
                        role="tab"
                        aria-selected={activeTab === tab}
                        className={
                            activeTab === tab ? "inventory-tab--active" : ""
                        }
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>
            {activeTab === "Suppliers" ? (
                <div className="inventory-record-grid">
                    {suppliers.map((supplier) => (
                        <article key={supplier.id}>
                            <span className="inventory-record-icon">
                                <Truck aria-hidden="true" />
                            </span>
                            <div>
                                <strong>{supplier.name}</strong>
                                <small>{supplier.contact}</small>
                                <small>
                                    {supplier.items} tracked items · Last
                                    receipt {supplier.lastReceipt}
                                </small>
                            </div>
                        </article>
                    ))}
                </div>
            ) : null}
            {activeTab === "Goods receipts" ? (
                <div className="inventory-record-table">
                    {movements
                        .filter(
                            (movement) => movement.type === "Goods received",
                        )
                        .map((movement) => (
                            <article key={movement.id}>
                                <span>{movement.date}</span>
                                <strong>{movement.itemName}</strong>
                                <span className="inventory-quantity--positive">
                                    +{movement.quantity} {movement.unit}
                                </span>
                                <small>
                                    {movement.reason} · {movement.user}
                                </small>
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
                            <small>
                                {movement.reason} · {movement.user}
                            </small>
                        </article>
                    ))}
                </div>
            ) : null}
            {activeTab === "Items" ? (
                <p className="inventory-tab-note">
                    Select an item above to review its batch, expiry, purchase
                    cost, and current stock.
                </p>
            ) : null}
        </section>
    );
}

export default InventoryTabsPanel;
