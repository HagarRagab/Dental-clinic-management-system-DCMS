import { ChevronRight, Globe } from "lucide-react";

function Notifications() {
    return (
        <div className="settings-phase2">
            <span className="settings-phase2__icon">
                <Globe aria-hidden="true" />
            </span>
            <div>
                <strong>
                    Manage notification templates in the Notifications workspace
                </strong>
                <p>
                    Email channel settings, sender configuration, reminder
                    timing, and Arabic/English templates are managed in the
                    dedicated Notifications screen.
                </p>
                <a
                    href="/notifications"
                    className="button button--secondary"
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        marginTop: 12,
                        textDecoration: "none",
                        fontSize: 13,
                    }}
                >
                    Go to Notifications{" "}
                    <ChevronRight aria-hidden="true" style={{ width: 15 }} />
                </a>
            </div>
        </div>
    );
}

export default Notifications;
