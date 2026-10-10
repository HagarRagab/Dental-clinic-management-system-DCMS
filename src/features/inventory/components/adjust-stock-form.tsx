import { Dispatch, SetStateAction, type SubmitEvent } from "react";
import { History } from "lucide-react";
import { InventoryItem, InventoryMovement } from "../inventory.types";
import { UserRole } from "@/types";

type AdjustmentDirection = "Increase" | "Decrease";

function AdjustStockForm({
    setFeedback,
    selectedItem,
    setMovements,
    dashboardUsers,
    setShowAdjustmentForm,
    setItems,
    selectedItemId,
}: {
    setFeedback: Dispatch<SetStateAction<string>>;
    selectedItem: InventoryItem;
    setMovements: Dispatch<SetStateAction<InventoryMovement[]>>;
    dashboardUsers: Record<UserRole, string>;
    setShowAdjustmentForm: Dispatch<SetStateAction<boolean>>;
    setItems: Dispatch<SetStateAction<InventoryItem[]>>;
    selectedItemId: string;
}) {
    function recordAdjustment(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const quantity = Number(form.get("quantity"));
        const direction = String(form.get("direction")) as AdjustmentDirection;
        const reason = String(form.get("reason") || "").trim();
        if (!quantity || quantity <= 0 || !reason) {
            setFeedback(
                "Enter a quantity and reason before recording the adjustment.",
            );
            return;
        }
        const delta = direction === "Increase" ? quantity : -quantity;
        const newBalance = selectedItem.currentStock + delta;
        if (newBalance < 0) {
            setFeedback(
                "Negative stock is blocked. Reduce the adjustment quantity.",
            );
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

    function updateSelectedItem(
        update: (item: InventoryItem) => InventoryItem,
    ) {
        setItems((current) =>
            current.map((item) =>
                item.id === selectedItemId ? update(item) : item,
            ),
        );
    }

    return (
        <form className="inventory-action-panel" onSubmit={recordAdjustment}>
            <div>
                <p className="panel-kicker">Audited adjustment</p>
                <h2>Adjust {selectedItem.name}</h2>
                <p>
                    Current balance: {selectedItem.currentStock}{" "}
                    {selectedItem.unit}. Negative stock is blocked by default.
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
    );
}

export default AdjustStockForm;
