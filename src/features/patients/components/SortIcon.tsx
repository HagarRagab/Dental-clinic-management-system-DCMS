import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react";
import { SortDirection } from "../patient.types";

function SortIcon({ active, dir }: { active: boolean; dir: SortDirection }) {
  if (!active)
    return (
      <ChevronsUpDown className="pl-sort-icon" aria-hidden="true" size={12} />
    );
  return dir === "asc" ? (
    <ChevronUp
      className="pl-sort-icon pl-sort-icon--active"
      aria-hidden="true"
      size={12}
    />
  ) : (
    <ChevronDown
      className="pl-sort-icon pl-sort-icon--active"
      aria-hidden="true"
      size={12}
    />
  );
}

export default SortIcon;
