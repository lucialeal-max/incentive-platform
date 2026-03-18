import { createClient } from '../supabase/server';
import type { IncentivePlan } from '../domain/types';

export async function getPlans(): Promise<IncentivePlan[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('incentive_plans')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapPlan);
}

export async function getPlanById(id: string): Promise<IncentivePlan | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('incentive_plans')
    .select('*')
    .eq('id', id)
    .single();
  if (error) return null;
  return mapPlan(data);
}

export async function createPlan(input: Omit<IncentivePlan, 'id' | 'createdAt'>): Promise<IncentivePlan> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('incentive_plans')
    .insert({
      name: input.name,
      period_month: input.periodMonth,
      period_year: input.periodYear,
      currency: input.currency,
      status: input.status,
      version: input.version,
      created_by: input.createdBy,
    })
    .select()
    .single();
  if (error) throw error;
  return mapPlan(data);
}

function mapPlan(row: Record<string, unknown>): IncentivePlan {
  return {
    id: row.id as string,
    name: row.name as string,
    periodMonth: row.period_month as number,
    periodYear: row.period_year as number,
    currency: row.currency as string,
    status: row.status as IncentivePlan['status'],
    version: row.version as number,
    clonedFrom: row.cloned_from as string | undefined,
    createdBy: row.created_by as string,
    createdAt: row.created_at as string,
  };
}