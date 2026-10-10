import { Dispatch, SetStateAction, type SubmitEvent } from "react";
import { Truck } from "lucide-react";
import { InventoryItem, InventoryMovement } from "../inventory.types";
import { UserRole } from "@/types";

function ReceiveGoodsForm({
    setFeedback,
    items,
    selectedItem,
    setItems,
    setMovements,
    dashboardUsers,
    setSelectedItemId,
    setShowReceiptForm,
}: {
    setFeedback: Dispatch<SetStateAction<string>>;
    items: InventoryItem[];
    selectedItem: InventoryItem;
    setItems: Dispatch<SetStateAction<InventoryItem[]>>;
    setMovements: Dispatch<SetStateAction<InventoryMovement[]>>;
    dashboardUsers: Record<UserRole, string>;
    setSelectedItemId: Dispatch<SetStateAction<string>>;
    setShowReceiptForm: Dispatch<SetStateAction<boolean>>;
}) {
    function recordGoodsReceipt(event: SubmitEvent<HTMLFormElement>) {
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
        setFeedback(
            `${quantity} ${receiptItem.unit} received and added to stock.`,
        );
    }

    return (
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
                    <input
                        name="quantity"
                        type="number"
                        min="1"
                        step="1"
                        required
                    />
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
    );
}

export default ReceiveGoodsForm;
