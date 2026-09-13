import type { DashboardMetric } from "@/features/dashboard/dashboard.types";

export function MetricCard({ detail, icon: Icon, label, tone, value }: DashboardMetric) {
  return <article className={`metric-card metric-card--${tone}`}><div className="metric-card__icon"><Icon aria-hidden="true" /></div><p>{label}</p><strong>{value}</strong><span>{detail}</span></article>;
}
