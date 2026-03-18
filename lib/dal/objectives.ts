import { createClient } from '../supabase/server';
import type { Objective } from '../domain/types';

export async function getObjectivesByPlan(planId: string): Promise<Objective[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('objectives')
    .select('*')
    .eq('plan_id', planId);
  if (error) throw error;
  return (data ?? []).map(mapObjective);
}

export async function getObjectiveById(id: string): Promise<Objective | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('objectives')
    .select('*')
    .eq('id', id)
    .single();
  if (error) return null;
  return mapObjective(data);
}

export async function createObjective(input: Omit<Objective, 'id' | 'createdAt'>): Promise<Objective> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('objectives')
    .insert({
      plan_id: input.planId,
      name: input.name,
      description: input.description,
      type: input.type,
      conditions: input.conditions,
      routing_rules: input.routingRules,
      bonus_formula: input.bonusFormula,
      created_by: input.createdBy,
    })
    .select()
    .single();
  if (error) throw error;
  return mapObjective(data);
}

function mapObjective(row: Record<string, unknown>): Objective {
  return {
    id: row.id as string,
    planId: row.plan_id as string,
    name: row.name as string,
    description: row.description as string | undefined,
    type: row.type as Objective['type'],
    conditions: row.conditions as Objective['conditions'],
    routingRules: row.routing_rules as Objective['routingRules'],
    bonusFormula: row.bonus_formula as Objective['bonusFormula'],
    createdBy: row.created_by as string,
    createdAt: row.created_at as string,
  };
}