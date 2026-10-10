import { Search, X } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { AuditModuleFilter, AuditResultFilter } from "../audit-logs.types";

const ALL_MODULES: AuditModuleFilter[] = [
    "All",
    "Clinical",
    "Billing",
    "Inventory",
    "Appointments",
    "Auth",
    "Reports",
    "Settings",
];
const ALL_RESULTS: AuditResultFilter[] = [
    "All",
    "Success",
    "Warning",
    "Denied",
];

function Toolbar({
    setQuery,
    setModuleFilter,
    setResultFilter,
    moduleFilter,
    query,
    resultFilter,
}: {
    setQuery: Dispatch<SetStateAction<string>>;
    setResultFilter: Dispatch<SetStateAction<AuditResultFilter>>;
    setModuleFilter: Dispatch<SetStateAction<AuditModuleFilter>>;
    moduleFilter: AuditModuleFilter;
    query: string;
    resultFilter: AuditResultFilter;
}) {
    return (
        <div
            className="audit-toolbar"
            role="search"
            aria-label="Filter audit events"
        >
            <label className="audit-search">
                <Search aria-hidden="true" />
                <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by action, user, entity…"
                    aria-label="Search audit events"
                />
            </label>
            <label className="audit-filter-label" aria-label="Filter by module">
                <span>Module</span>
                <select
                    value={moduleFilter}
                    onChange={(e) =>
                        setModuleFilter(e.target.value as AuditModuleFilter)
                    }
                    aria-label="Filter by module"
                >
                    {ALL_MODULES.map((m) => (
                        <option key={m} value={m}>
                            {m}
                        </option>
                    ))}
                </select>
            </label>
            <label className="audit-filter-label" aria-label="Filter by result">
                <span>Result</span>
                <select
                    value={resultFilter}
                    onChange={(e) =>
                        setResultFilter(e.target.value as AuditResultFilter)
                    }
                    aria-label="Filter by result"
                >
                    {ALL_RESULTS.map((r) => (
                        <option key={r} value={r}>
                            {r}
                        </option>
                    ))}
                </select>
            </label>
            {(query || moduleFilter !== "All" || resultFilter !== "All") && (
                <button
                    type="button"
                    className="audit-clear"
                    onClick={() => {
                        setQuery("");
                        setModuleFilter("All");
                        setResultFilter("All");
                    }}
                    aria-label="Clear filters"
                >
                    <X aria-hidden="true" /> Clear
                </button>
            )}
        </div>
    );
}

export default Toolbar;
