import { ArrowDownToLine, History } from "lucide-react";
import { InventoryMovement } from "../inventory.types";

function InventoryMovementList({
    movements,
    movementClass,
}: {
    movements: InventoryMovement[];
    movementClass: (
        quantity: number,
    ) => "inventory-quantity--positive" | "inventory-quantity--negative";
}) {
    return (
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
    );
}

export default InventoryMovementList;
