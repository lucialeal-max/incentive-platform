import type { ConditionResult } from '../types';

const FIELD_LABELS: Record<string, string> = {
  deal_stage: 'etapa del deal',
  who_got_the_call: 'quién tomó la llamada',
  deal_source: 'fuente del deal',
  percent_active_users: '% de usuarios activos',
  sticky_feature_count: 'features stickies utilizados',
  date_ready_to_success: 'fecha de paso a éxito',
  csat_score: 'puntaje de CSAT',
  resolved_processes_feature_count: 'procesos resueltos con la feature',
  wau_percent: '% de usuarios activos semanales (WAU)',
  lead_status: 'estado del lead',
  is_red_list: 'estado Red List',
  csat_is_stale: 'CSAT desactualizado',
  wau_is_stale: 'WAU desactualizado',
  handoff_early_success_date: 'fecha de handoff a early success',
  mrr: 'MRR',
};

function labelOf(field: string): string {
  return FIELD_LABELS[field] ?? field.replace(/_/g, ' ');
}

export function buildFriendlyExplanation(
  results: ConditionResult[],
  status: string,
  reason: string | null
): string {
  const failed = results.filter(r => !r.passed);
  const passed = results.filter(r => r.passed);

  if (status === 'approved') {
    return `✅ Objetivo cumplido. Todas las condiciones fueron verificadas correctamente.`;
  }

  if (status === 'validation') {
    const base = reason
      ? `🔍 Este objetivo está en revisión manual. Motivo: ${reason}.`
      : `🔍 Este objetivo requiere revisión manual por parte de tu manager.`;
    return base;
  }

  if (failed.length === 0) {
    return `❌ Objetivo no cumplido por razones de ruteo.`;
  }

  const items = failed
    .map(r => `• ${labelOf(r.field)}: valor actual "${r.actualValue ?? '(sin dato)'}" no cumple la condición requerida.`)
    .join('
');

  return `❌ No se cumplieron ${failed.length} condición(es):
${items}`;
}