-- Enable RLS
alter table profiles enable row level security;
alter table incentive_plans enable row level security;
alter table objectives enable row level security;
alter table assignments enable row level security;
alter table objective_instances enable row level security;
alter table payout_runs enable row level security;
alter table audit_logs enable row level security;
alter table crm_snapshots enable row level security;

-- Profiles: users see their own, admins see all
create policy "profiles_own" on profiles for select
  using (auth.uid() = id);

create policy "profiles_admin" on profiles for all
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin = true));

-- Plans: admins manage, all authenticated can read active
create policy "plans_read" on incentive_plans for select
  using (auth.role() = 'authenticated');

create policy "plans_admin" on incentive_plans for all
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin = true));

-- Objectives: same as plans
create policy "objectives_read" on objectives for select
  using (auth.role() = 'authenticated');

create policy "objectives_admin" on objectives for all
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin = true));

-- Instances: users see their own, admins see all
create policy "instances_own" on objective_instances for select
  using (auth.uid() = user_id);

create policy "instances_admin" on objective_instances for all
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin = true));

-- Payout runs: admin only
create policy "payout_admin" on payout_runs for all
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin = true));

-- CRM snapshots: admin only
create policy "crm_admin" on crm_snapshots for all
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin = true));