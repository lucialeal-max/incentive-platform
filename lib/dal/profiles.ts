import { createClient } from '../supabase/server';
import type { Profile } from '../domain/types';

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) return null;
  return mapProfile(data);
}

export async function getAllProfiles(): Promise<Profile[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('profiles').select('*');
  if (error) throw error;
  return (data ?? []).map(mapProfile);
}

function mapProfile(row: Record<string, unknown>): Profile {
  return {
    id: row.id as string,
    fullName: row.full_name as string,
    email: row.email as string,
    isAdmin: row.is_admin as boolean,
    teamId: row.team_id as string | undefined,
    jobRole: row.job_role as string | undefined,
  };
}