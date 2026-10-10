import {
    AlertTriangle,
    ClipboardList,
    FileWarning,
    Package,
} from "lucide-react";

function InventoryMetrics({
    numItems,
    numLowStockItems,
    numOutOfStockItems,
    numExpiringItems,
}: {
    numItems: number;
    numLowStockItems: number;
    numOutOfStockItems: number;
    numExpiringItems: number;
}) {
    return (
        <section className="inventory-metrics" aria-label="Inventory summary">
            <article>
                <span className="inventory-metric__icon inventory-metric__icon--teal">
                    <Package aria-hidden="true" />
                </span>
                <div>
                    <span>Tracked items</span>
                    <strong>{numItems}</strong>
                    <small>Across this branch</small>
                </div>
            </article>
            <article>
                <span className="inventory-metric__icon inventory-metric__icon--warning">
                    <AlertTriangle aria-hidden="true" />
                </span>
                <div>
                    <span>Low stock</span>
                    <strong>{numLowStockItems}</strong>
                    <small>Below minimum level</small>
                </div>
            </article>
            <article>
                <span className="inventory-metric__icon inventory-metric__icon--error">
                    <FileWarning aria-hidden="true" />
                </span>
                <div>
                    <span>Out of stock</span>
                    <strong>{numOutOfStockItems}</strong>
                    <small>Needs replenishment</small>
                </div>
            </article>
            <article>
                <span className="inventory-metric__icon inventory-metric__icon--purple">
                    <ClipboardList aria-hidden="true" />
                </span>
                <div>
                    <span>Expiring soon</span>
                    <strong>{numExpiringItems}</strong>
                    <small>Review before use</small>
                </div>
            </article>
        </section>
    );
}

export default InventoryMetrics;
