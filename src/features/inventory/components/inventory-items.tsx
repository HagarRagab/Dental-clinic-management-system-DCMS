import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { InventoryItem, StockStatus } from "../inventory.types";

function InventoryItems({
    items,
    inventoryStatus,
    selectedItemId,
    setSelectedItemId,
    statusClass,
}: {
    items: InventoryItem[];
    inventoryStatus: (item: InventoryItem) => StockStatus;
    selectedItemId: string;
    setSelectedItemId: Dispatch<SetStateAction<string>>;
    statusClass: (status: ReturnType<typeof inventoryStatus>) => string;
}) {
    const [query, setQuery] = useState("");

    const filteredItems = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();
        if (!normalizedQuery) {
            return items;
        }
        return items.filter((item) =>
            [item.name, item.category, item.supplier, item.batch]
                .filter(Boolean)
                .some((value) =>
                    value?.toLowerCase().includes(normalizedQuery),
                ),
        );
    }, [items, query]);

    return (
        <article className="inventory-items-panel">
            <div className="panel-header inventory-panel-header">
                <div>
                    <h2>Inventory items</h2>
                    <p>Current stock by item, unit, and minimum level</p>
                </div>
                <div className="inventory-search">
                    <Search aria-hidden="true" />
                    <input
                        type="search"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search items"
                        aria-label="inventory search"
                    />
                </div>
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
                                            onClick={() =>
                                                setSelectedItemId(item.id)
                                            }
                                        >
                                            <strong>{item.name}</strong>
                                            <small>
                                                {item.category} ·{" "}
                                                {item.supplier}
                                            </small>
                                        </button>
                                    </td>
                                    <td>
                                        <strong>
                                            {item.currentStock} {item.unit}
                                        </strong>
                                    </td>
                                    <td>
                                        {item.minimumStock} {item.unit}
                                    </td>
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
                        <span>
                            Try a different item, category, or supplier.
                        </span>
                    </div>
                ) : null}
            </div>
        </article>
    );
}

export default InventoryItems;
