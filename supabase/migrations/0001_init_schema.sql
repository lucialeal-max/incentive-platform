-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES (extends Supabase auth.users)
create table profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text not null,
  email       text not null unique,
  is_admin    boolean not null default false,
  team_id     uuid,
  job_role    text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- INCENTIVE PLANS
create table incentive_plans (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,
  period_month  int  not null check (period_month between 1 and 12),
  period_year   int  not null check (period_year >= 2020),
  currency      text not null default 'USD',
  status        text not null default 'draft' check (status in ('draft','active','closed')),
  version       int  not null default 1,
  cloned_from   uuid references incentive_plans(id),
  created_by    uuid not null references profiles(id),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (name, period_month, period_year, version)
);

-- OBJECTIVES
create table objectives (
  id              uuid primary key default uuid_generate_v4(),
  plan_id         uuid not null references incentive_plans(id) on delete cascade,
  name            text not null,
  description     text,
  type            text not null check (type in ('boolean','percentage','numeric','status')),
  conditions      jsonb not null default '{"logic":"AND","conditions":[]}',
  routing_rules   jsonb not null default '[]',
  bonus_formula   jsonb not null default '{"type":"fixed","amount":0}',
  created_by      uuid not null references profiles(id),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ASSIGNMENTS
create table assignments (
  id              uuid primary key default uuid_generate_v4(),
  objective_id    uuid not null references objectives(id) on delete cascade,
  assignee_type   text not null check (assignee_type in ('role','team','user')),
  assignee_id     text not null,
  start_date      date not null,
  end_date        date not null,
  created_at      timestamptz not null default now()
);

-- OBJECTIVE INSTANCES
create table objective_instances (
  id                uuid primary key default uuid_generate_v4(),
  objective_id      uuid not null references objectives(id),
  user_id           uuid not null references profiles(id),
  period_month      int not null,
  period_year       int not null,
  status            text not null default 'pending'
                      check (status in ('pending','in_progress','approved','validation','rejected','payout_requested')),
  condition_results jsonb not null default '[]',
  bonus_amount      numeric,
  crm_snapshot      jsonb not null default '{}',
  resolved_by       uuid references profiles(id),
  resolved_at       timestamptz,
  resolution_note   text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  unique (objective_id, user_id, period_month, period_year)
);

-- PAYOUT RUNS
create table payout_runs (
  id            uuid primary key default uuid_generate_v4(),
  plan_id       uuid not null references incentive_plans(id),
  period_month  int not null,
  period_year   int not null,
  status        text not null default 'draft' check (status in ('draft','approved','payout_requested')),
  total_amount  numeric not null default 0,
  approved_by   uuid references profiles(id),
  approved_at   timestamptz,
  items         jsonb not null default '[]',
  created_at    timestamptz not null default now()
);

-- AUDIT LOG
create table audit_logs (
  id            uuid primary key default uuid_generate_v4(),
  entity_type   text not null,
  entity_id     uuid not null,
  action        text not null,
  old_value     jsonb,
  new_value     jsonb,
  performed_by  uuid not null references profiles(id),
  performed_at  timestamptz not null default now()
);

-- CRM SNAPSHOT TABLE
create table crm_snapshots (
  id                                uuid primary key default uuid_generate_v4(),
  deal_id                           text not null,
  deal_name                         text,
  deal_stage                        text,
  pipeline_name                     text,
  deal_owner                        text,
  deal_owner_id                     text,
  cx_owner                          text,
  cx_owner_id                       text,
  createdate                        date,
  booked_date                       date,
  date_ready_to_success             date,
  handoff_early_success_date        date,
  churn_date                        date,
  close_date                        date,
  percent_active_users              numeric,
  sticky_feature_count              int,
  resolved_processes_feature_count  int,
  wau_percent                       numeric,
  wau_last_update_date              date,
  csat_score                        text,
  csat_last_update_date             date,
  total_users_from_communities      int,
  mrr                               numeric,
  expansion_amount                  numeric,
  churn_amount                      numeric,
  currency                          text,
  lead_status                       text,
  is_red_list                       boolean generated always as (deal_stage like '%Red List%') stored,
  days_since_booked                 int generated always as (
                                      case when booked_date is not null
                                        then (current_date - booked_date)
                                      end
                                    ) stored,
  days_since_handoff                int generated always as (
                                      case when handoff_early_success_date is not null
                                        then (current_date - handoff_early_success_date)
                                      end
                                    ) stored,
  csat_is_stale                     boolean generated always as (
                                      csat_last_update_date < current_date - interval '90 days'
                                    ) stored,
  wau_is_stale                      boolean generated always as (
                                      wau_last_update_date < current_date - interval '90 days'
                                    ) stored,
  synced_at                         timestamptz not null default now(),
  period_month                      int not null,
  period_year                       int not null
);

-- Indexes
create index on objective_instances (user_id, period_month, period_year);
create index on objective_instances (status);
create index on crm_snapshots (deal_owner_id, period_month, period_year);
create index on crm_snapshots (cx_owner_id, period_month, period_year);