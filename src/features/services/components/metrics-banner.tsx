import { Calendar, CheckCircle2, Coins, Stethoscope } from "lucide-react";
import { formatEgp } from "../services/mock-services-service";
import { AppointmentTypeConfig, ClinicalProcedure } from "../services.types";

function MetricsBanner({
    appointmentTypes,
    procedures,
}: {
    appointmentTypes: AppointmentTypeConfig[];
    procedures: ClinicalProcedure[];
}) {
    // Calculations for summary metrics
    const activeProcsCount = procedures.filter((p) => p.active).length;
    const avgPrice = Math.round(
        procedures.reduce((sum, p) => sum + p.defaultPrice, 0) /
            (procedures.length || 1),
    );

    return (
        <section className="metric-grid" aria-label="Services overview metrics">
            <article className="metric-card">
                <span className="metric-card__icon">
                    <Stethoscope aria-hidden="true" />
                </span>
                <p>Total Procedures</p>
                <strong>{procedures.length}</strong>
                <span>In clinical catalog</span>
            </article>
            <article className="metric-card metric-card--success">
                <span className="metric-card__icon">
                    <CheckCircle2 aria-hidden="true" />
                </span>
                <p>Active Procedures</p>
                <strong>{activeProcsCount}</strong>
                <span>Available for treatment</span>
            </article>
            <article className="metric-card">
                <span className="metric-card__icon">
                    <Calendar aria-hidden="true" />
                </span>
                <p>Appointment Templates</p>
                <strong>{appointmentTypes.length}</strong>
                <span>Booking slot options</span>
            </article>
            <article className="metric-card metric-card--neutral">
                <span className="metric-card__icon">
                    <Coins aria-hidden="true" />
                </span>
                <p>Average Fee</p>
                <strong>{formatEgp(avgPrice)}</strong>
                <span>Across all procedures</span>
            </article>
        </section>
    );
}

export default MetricsBanner;
