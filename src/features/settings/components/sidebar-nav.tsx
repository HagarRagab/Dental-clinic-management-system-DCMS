import { Dispatch, SetStateAction } from "react";
import { ChevronRight } from "lucide-react";
import { navEntries } from "../services/nav-entries";
import { SettingsSection } from "../settings.types";

function SidebarNav({
    active,
    setActive,
}: {
    active: SettingsSection;
    setActive: Dispatch<SetStateAction<SettingsSection>>;
}) {
    return (
        <nav className="settings-nav" aria-label="Settings sections">
            {navEntries.map(({ section, icon: Icon, label, description }) => (
                <button
                    key={section}
                    type="button"
                    className={`settings-nav__item${active === section ? " settings-nav__item--active" : ""}`}
                    aria-current={active === section ? "page" : undefined}
                    onClick={() => setActive(section)}
                >
                    <span className="settings-nav__icon">
                        <Icon aria-hidden="true" />
                    </span>
                    <span>
                        <strong>{label}</strong>
                        <small>{description}</small>
                    </span>
                    <ChevronRight
                        aria-hidden="true"
                        className="settings-nav__chevron"
                    />
                </button>
            ))}
        </nav>
    );
}

export default SidebarNav;
