import { Dispatch, SetStateAction } from "react";
import { Filter, Search, Tag } from "lucide-react";
import {
    ServiceCategory,
    ServicesStatusFilter,
    ServicesTab,
} from "../services.types";

function FilterToolbar({
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    activeTab,
    selectedCategory,
    setSelectedCategory,
    serviceCategories,
}: {
    searchQuery: string;
    setSearchQuery: Dispatch<SetStateAction<string>>;
    statusFilter: ServicesStatusFilter;
    setStatusFilter: Dispatch<SetStateAction<ServicesStatusFilter>>;
    activeTab: ServicesTab;
    selectedCategory: ServiceCategory;
    setSelectedCategory: Dispatch<SetStateAction<ServiceCategory>>;
    serviceCategories: ServiceCategory[];
}) {
    return (
        <div
            className="services-toolbar"
            role="search"
            aria-label="Filter catalog"
        >
            <label className="services-search">
                <Search aria-hidden="true" />
                <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                        activeTab === "procedures"
                            ? "Search by code, procedure name, or description..."
                            : "Search appointment templates..."
                    }
                    aria-label="Search procedures and templates"
                />
            </label>

            {activeTab === "procedures" && (
                <label className="services-filter-select">
                    <Filter aria-hidden="true" />
                    <select
                        value={selectedCategory}
                        onChange={(e) =>
                            setSelectedCategory(
                                e.target.value as ServiceCategory,
                            )
                        }
                        aria-label="Filter by category"
                    >
                        {serviceCategories.map((c) => (
                            <option key={c} value={c}>
                                {c === "All" ? "All Categories" : c}
                            </option>
                        ))}
                    </select>
                </label>
            )}

            <label className="services-filter-select">
                <Tag aria-hidden="true" />
                <select
                    value={statusFilter}
                    onChange={(e) =>
                        setStatusFilter(e.target.value as ServicesStatusFilter)
                    }
                    aria-label="Filter by active status"
                >
                    <option value="all">All Statuses</option>
                    <option value="active">Active Only</option>
                    <option value="inactive">Inactive Only</option>
                </select>
            </label>

            {(searchQuery ||
                selectedCategory !== "All" ||
                statusFilter !== "all") && (
                <button
                    type="button"
                    className="services-clear-btn"
                    onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("All");
                        setStatusFilter("all");
                    }}
                >
                    Clear filters
                </button>
            )}
        </div>
    );
}

export default FilterToolbar;
