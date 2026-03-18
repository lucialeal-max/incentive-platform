import { createClient } from '../supabase/server';
import type { PayoutRun } from '../domain/types';

export async function getPayoutRuns(planId: string): Promise<PayoutRun[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('payout_runs')
    .select('*')
    .eq('plan_id', planId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapRun);
}

export async function createPayoutRun(run: Omit<PayoutRun, 'id'>): Promise<PayoutRun> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('payout_runs')
    .insert({
      plan_id: run.planId,
      period_month: run.periodMonth,
      period_year: run.periodYear,
      status: run.status,
      total_amount: run.totalAmount,
      items: run.items,
    })
    .select()
    .single();
  if (error) throw error;
  return mapRun(data);
}

export async function approvePayoutRun(id: string, approvedBy: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('payout_runs')
    .update({ status: 'approved', approved_by: approvedBy, approved_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
}

function mapRun(row: Record<string, unknown>): PayoutRun {
  return {
    id: row.id as string,
    planId: row.plan_id as string,
    periodMonth: row.period_month as number,
    periodYear: row.period_year as number,
    status: row.status as PayoutRun['status'],
    totalAmount: row.total_amount as number,
    approvedBy: row.approved_by as string | undefined,
    approvedAt: row.approved_at as string | undefined,
    items: (row.items ?? []) as PayoutRun['items'],
  };
}