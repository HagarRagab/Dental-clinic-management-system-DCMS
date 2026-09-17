import Link from "next/link";
import {
    AlertTriangle,
    ArrowUpRight,
    ClipboardCheck,
    Plus,
    Search,
    WalletCards,
} from "lucide-react";
import type { UserRole } from "@/types";

export function DashboardAside({ role }: { role: UserRole }) {
    if (role === "dentist")
        return (
            <aside className="dashboard-aside">
                <section
                    className="dashboard-panel current-patient"
                    aria-labelledby="current-patient-title"
                >
                    <span className="panel-kicker">Current patient</span>
                    <h2 id="current-patient-title">Mariam Adel</h2>
                    <p>Root canal follow-up · Arrived 18 min ago</p>
                    <div className="medical-flag">
                        <AlertTriangle aria-hidden="true" /> Penicillin allergy
                    </div>
                    <Link
                        className="button button--primary button--full"
                        href="/clinical/current-visit?role=dentist"
                        style={{ textAlign: "center", textDecoration: "none", display: "flex", justifyContent: "center" }}
                    >
                        Start visit
                    </Link>
                </section>
                <section
                    className="dashboard-panel"
                    aria-labelledby="clinical-activity-title"
                >
                    <div className="panel-header">
                        <div>
                            <h2 id="clinical-activity-title">
                                Clinical activity
                            </h2>
                            <p>Recent updates</p>
                        </div>
                        <ClipboardCheck aria-hidden="true" />
                    </div>
                    <ul className="activity-list">
                        <li>
                            <strong>Ahmed Samir</strong>
                            <span>Clinical record finalized · 12:42</span>
                        </li>
                        <li>
                            <strong>Hana Youssef</strong>
                            <span>Treatment plan needs approval · 11:15</span>
                        </li>
                        <li>
                            <strong>Omar Nabil</strong>
                            <span>Visit completed · 10:30</span>
                        </li>
                    </ul>
                </section>
            </aside>
        );
    return (
        <aside className="dashboard-aside">
            {role === "receptionist" ? (
                <section className="quick-actions" aria-label="Quick actions">
                    <button
                        className="quick-action quick-action--primary"
                        type="button"
                    >
                        <Plus aria-hidden="true" />
                        New appointment
                    </button>
                    <button className="quick-action" type="button">
                        <Search aria-hidden="true" />
                        Find patient
                    </button>
                    <button className="quick-action" type="button">
                        <WalletCards aria-hidden="true" />
                        Collect payment
                    </button>
                </section>
            ) : null}
            <section
                className="dashboard-panel attention-panel"
                aria-labelledby="attention-title"
            >
                <div className="panel-header">
                    <div>
                        <h2 id="attention-title">Needs attention</h2>
                        <p>Operational items today</p>
                    </div>
                    <AlertTriangle aria-hidden="true" />
                </div>
                <ul className="attention-list">
                    <li>
                        <span className="alert-icon alert-icon--warning">
                            <AlertTriangle aria-hidden="true" />
                        </span>
                        <div>
                            <strong>Gloves, medium</strong>
                            <span>Low stock · 2 boxes remaining</span>
                        </div>
                        <ArrowUpRight aria-hidden="true" />
                    </li>
                    <li>
                        <span className="alert-icon alert-icon--error">
                            <WalletCards aria-hidden="true" />
                        </span>
                        <div>
                            <strong>9 patient balances</strong>
                            <span>EGP 6,200 outstanding</span>
                        </div>
                        <ArrowUpRight aria-hidden="true" />
                    </li>
                    <li>
                        <span className="alert-icon alert-icon--info">
                            <ClipboardCheck aria-hidden="true" />
                        </span>
                        <div>
                            <strong>2 records pending</strong>
                            <span>Clinical notes need finalization</span>
                        </div>
                        <ArrowUpRight aria-hidden="true" />
                    </li>
                </ul>
            </section>
        </aside>
    );
}
