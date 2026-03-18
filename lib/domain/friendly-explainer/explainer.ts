import type { ConditionResult } from "../types";

const FL: Record<string, string> = {
  deal_stage: "etapa del deal",
  who_got_the_call: "quien tomo la llamada",
  deal_source: "fuente del deal",
  percent_active_users: "% usuarios activos",
  sticky_feature_count: "features stickies",
  date_ready_to_success: "fecha de exito",
  csat_score: "CSAT",
  resolved_processes_feature_count: "procesos resueltos",
  wau_percent: "WAU %",
  lead_status: "estado del lead",
  is_red_list: "Red List",
  csat_is_stale: "CSAT desactualizado",
  wau_is_stale: "WAU desactualizado",
  handoff_early_success_date: "fecha de handoff",
  mrr: "MRR",
};

function labelOf(field: string): string {
  return FL[field] ?? field.replace(/_/g, " ");
}

export function buildFriendlyExplanation(
  results: ConditionResult[],
  status: string,
  reason: string | null
): string {
  const failed = results.filter(r => !r.passed);
  if (status === "approved") {
    return "Objetivo cumplido. Todas las condiciones verificadas.";
  }
  if (status === "validation") {
    if (reason) return "En revision: " + reason;
    return "Requiere revision manual por tu manager.";
  }
  if (failed.length === 0) {
    return "No cumple las condiciones de ruteo.";
  }
  const items = failed
    .map(r => "- " + labelOf(r.field) + ": valor actual \"" + String(r.actualValue ?? "-") + "\".")
    .join("\n");
  return "No se cumplieron " + failed.length + " condicion(es):\n" + items;
}