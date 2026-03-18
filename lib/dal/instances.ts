import { createClient } from '../supabase/server';
import type { ObjectiveInstance } from '../domain/types';

export async function getInstancesByUser(
  userId: string,
  periodMonth: number,
  periodYear: number
): Promise<ObjectiveInstance[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('objective_instances')
    .select('*')
    .eq('user_id', userId)
    .eq('period_month', periodMonth)
    .eq('period_year', periodYear);
  if (error) throw error;
  return (data ?? []).map(mapInstance);
}

export async function getAllInstances(
  periodMonth: number,
  periodYear: number
): Promise<ObjectiveInstance[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('objective_instances')
    .select('*')
    .eq('period_month', periodMonth)
    .eq('period_year', periodYear);
  if (error) throw error;
  return (data ?? []).map(mapInstance);
}

export async function upsertInstance(instance: Omit<ObjectiveInstance, 'id'>): Promise<ObjectiveInstance> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('objective_instances')
    .upsert({
      objective_id: instance.objectiveId,
      user_id: instance.userId,
      period_month: instance.periodMonth,
      period_year: instance.periodYear,
      status: instance.status,
      condition_results: instance.conditionResults,
      bonus_amount: instance.bonusAmount,
      crm_snapshot: instance.crmSnapshot,
      resolved_by: instance.resolvedBy,
      resolved_at: instance.resolvedAt,
      resolution_note: instance.resolutionNote,
    }, { onConflict: 'objective_id,user_id,period_month,period_year' })
    .select()
    .single();
  if (error) throw error;
  return mapInstance(data);
}

export async function updateInstanceStatus(
  id: string,
  status: ObjectiveInstance['status'],
  resolvedBy: string,
  note?: string
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('objective_instances')
    .update({ status, resolved_by: resolvedBy, resolved_at: new Date().toISOString(), resolution_note: note })
    .eq('id', id);
  if (error) throw error;
}

function mapInstance(row: Record<string, unknown>): ObjectiveInstance {
  return {
    id: row.id as string,
    objectiveId: row.objective_id as string,
    userId: row.user_id as string,
    periodMonth: row.period_month as number,
    periodYear: row.period_year as number,
    status: row.status as ObjectiveInstance['status'],
    conditionResults: (row.condition_results ?? []) as ObjectiveInstance['conditionResults'],
    bonusAmount: row.bonus_amount as number | null,
    crmSnapshot: (row.crm_snapshot ?? {}) as Record<string, unknown>,
    resolvedBy: row.resolved_by as string | undefined,
    resolvedAt: row.resolved_at as string | undefined,
    resolutionNote: row.resolution_note as string | undefined,
  };
}