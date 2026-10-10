import { History } from "lucide-react";
import {
    formatEgp,
    inventoryStatus,
} from "@/features/inventory/services/mock-inventory-service";
import { InventoryItem } from "../inventory.types";
import { Dispatch, SetStateAction } from "react";

function InventorySelectedItem({
    selectedItem,
    setShowAdjustmentForm,
    setShowReceiptForm,
    statusClass,
}: {
    selectedItem: InventoryItem;
    setShowAdjustmentForm: Dispatch<SetStateAction<boolean>>;
    setShowReceiptForm: Dispatch<SetStateAction<boolean>>;
    statusClass: (status: ReturnType<typeof inventoryStatus>) => string;
}) {
    return (
        <aside className="inventory-detail-panel">
            <div className="inventory-detail-panel__header">
                <div>
                    <p className="panel-kicker">Selected item</p>
                    <h2>{selectedItem.name}</h2>
                    <p>
                        {selectedItem.category} · {selectedItem.supplier}
                    </p>
                </div>
                <span
                    className={`inventory-status inventory-status--${statusClass(inventoryStatus(selectedItem))}`}
                >
                    {inventoryStatus(selectedItem)}
                </span>
            </div>
            <div className="inventory-stock-highlight">
                <span>Current stock</span>
                <strong>
                    {selectedItem.currentStock} {selectedItem.unit}
                </strong>
                <small>
                    Minimum level: {selectedItem.minimumStock}{" "}
                    {selectedItem.unit}
                </small>
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
                    <dd>
                        {formatEgp(selectedItem.purchaseCost)} /{" "}
                        {selectedItem.unit}
                    </dd>
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
    );
}

export default InventorySelectedItem;
