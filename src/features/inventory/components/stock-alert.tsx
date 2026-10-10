import { AlertTriangle, ArrowUpRight, FileWarning } from "lucide-react";
import { InventoryItem, InventoryTab, StockStatus } from "../inventory.types";
import { Dispatch, SetStateAction } from "react";

function StockAlert({
    alertItems,
    inventoryStatus,
    setSelectedItemId,
    setActiveTab,
    numOutOfStockItems,
    numLowStockItems,
    numExpiringItems,
}: {
    alertItems: InventoryItem[];
    inventoryStatus: (item: InventoryItem) => StockStatus;
    setSelectedItemId: Dispatch<SetStateAction<string>>;
    setActiveTab: Dispatch<SetStateAction<InventoryTab>>;
    numOutOfStockItems: number;
    numLowStockItems: number;
    numExpiringItems: number;
}) {
    return (
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
                {!numOutOfStockItems &&
                !numLowStockItems &&
                !numExpiringItems ? (
                    <p className="inventory-empty-copy">
                        All tracked items are within safe levels.
                    </p>
                ) : null}
            </div>
        </article>
    );
}

export default StockAlert;
