import type { ConditionResult } from "@/lib/domain/types";

const LABELS: Record<string, string> = {
  who_got_the_call: "Quién tomó la llamada",
  deal_stage: "Etapa del deal",
  deal_source: "Fuente del deal",
  percent_active_users: "% usuarios activos",
  sticky_feature_count: "Features stickies",
  date_ready_to_success: "Fecha de paso a éxito",
  csat_score: "CSAT Score",
  resolved_processes_feature_count: "Procesos resueltos",
  wau_percent: "WAU %",
  lead_status: "Estado del lead",
  is_red_list: "Red List",
  days_since_handoff: "Días desde handoff",
};

export function ConditionResultRow({ result }: { result: ConditionResult }) {
  const label = LABELS[result.field] ?? result.field.replace(/_/g, " ");
  return (
    <div className={"flex items-center gap-3 p-3 rounded-xl " + (result.passed ? "bg-emerald-50" : "bg-red-50")}>
      <span className={"text-lg " + (result.passed ? "text-emerald-500" : "text-red-400")}>
        {result.passed ? "✓" : "✗"}
      </span>
      <div className="flex-1 min-w-0">
        <p className={"text-sm font-medium " + (result.passed ? "text-emerald-900" : "text-red-900")}>{label}</p>
        <p className="text-xs text-gray-500 mt-0.5">
          Valor actual: <strong>{String(result.actualValue ?? "—")}</strong>
        </p>
      </div>
    </div>
  );
}