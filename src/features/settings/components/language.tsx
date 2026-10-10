import { Info } from "lucide-react";

function Language() {
    const PHASE2_NOTE =
        "This section is available for configuration after the backend is implemented.";

    return (
        <div className="settings-phase2">
            <span className="settings-phase2__icon">
                <Info aria-hidden="true" />
            </span>
            <div>
                <strong>Full localisation is a Phase 2 feature</strong>
                <p>
                    The prototype UI is in English. Arabic text appears in
                    notification templates and RTL input fields. Full
                    Arabic/English switching, RTL layout mirroring, and
                    locale-aware date/number formatting will be implemented once
                    the i18n strategy is approved.
                </p>
                <p className="settings-phase2__note">{PHASE2_NOTE}</p>
            </div>
        </div>
    );
}

export default Language;
