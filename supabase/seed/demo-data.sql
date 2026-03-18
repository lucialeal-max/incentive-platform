-- =============================================================
-- DEMO SEED — Incentive Platform Hackathon
-- Run after migrations. UUIDs are fixed for reproducibility.
-- =============================================================

-- PROFILES (passwords handled by Supabase Auth — these are just the extended profiles)
insert into profiles (id, full_name, email, is_admin, job_role) values
  ('00000000-0000-0000-0000-000000000001', 'Ana García',    'ana@demo.com',     true,  'RevOps'),
  ('00000000-0000-0000-0000-000000000002', 'Carlos López',  'carlos@demo.com',  true,  'AE'),
  ('00000000-0000-0000-0000-000000000003', 'María Pérez',   'maria@demo.com',   false, 'AE'),
  ('00000000-0000-0000-0000-000000000004', 'Juan Torres',   'juan@demo.com',    false, 'SAM'),
  ('00000000-0000-0000-0000-000000000005', 'Sofía Ramos',   'sofia@demo.com',   false, 'BDR'),
  ('00000000-0000-0000-0000-000000000006', 'Diego Vega',    'diego@demo.com',   false, 'OL')
on conflict (id) do nothing;

-- INCENTIVE PLAN — Marzo 2026
insert into incentive_plans (id, name, period_month, period_year, currency, status, version, created_by) values
  ('10000000-0000-0000-0000-000000000001', 'Plan Comercial Q1 2026', 3, 2026, 'USD', 'active', 1,
   '00000000-0000-0000-0000-000000000001')
on conflict do nothing;

-- OBJECTIVES (4 tipos según PRD)

-- 1. Boolean: Bono Sales
insert into objectives (id, plan_id, name, description, type, conditions, routing_rules, bonus_formula, created_by) values
(
  '20000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000001',
  'Bono Sales',
  'Deal cerrado con quién tomó la llamada completo y fuera de Red List',
  'boolean',
  '{"logic":"AND","conditions":[
    {"field":"who_got_the_call","operator":"known"},
    {"field":"deal_stage","operator":"neq","value":"Success Red List 🚨"},
    {"field":"deal_stage","operator":"eq","value":"Won"}
  ]}',
  '[
    {"condition":{"logic":"AND","conditions":[
      {"field":"deal_source","operator":"eq","value":"AE"},
      {"field":"days_since_booked","operator":"lt","value":120}
    ]},"result":"validation","reason":"Deal source AE con contacto reciente en deal perdido — requiere revisión"},
    {"condition":{"logic":"AND","conditions":[
      {"field":"who_got_the_call","operator":"known"},
      {"field":"deal_stage","operator":"eq","value":"Won"}
    ]},"result":"approved"}
  ]',
  '{"type":"conditional","cases":[
    {"condition":{"field":"deal_source","operator":"in","value":["BDR","Inbound","Event","Alliance","CX"]},"formula":{"type":"percentage_of_field","field":"mrr","percentage":100}},
    {"condition":{"field":"deal_source","operator":"in","value":["Referral","BP","Outbound Partner"]},"formula":{"type":"percentage_of_field","field":"mrr","percentage":80}},
    {"condition":{"field":"deal_source","operator":"eq","value":"AE"},"formula":{"type":"percentage_of_field","field":"mrr","percentage":115}}
  ],"default":{"type":"percentage_of_field","field":"mrr","percentage":100}}',
  '00000000-0000-0000-0000-000000000001'
) on conflict do nothing;

-- 2. Percentage: Clients Moved to Success
insert into objectives (id, plan_id, name, description, type, conditions, routing_rules, bonus_formula, created_by) values
(
  '20000000-0000-0000-0000-000000000002',
  '10000000-0000-0000-0000-000000000001',
  'Bono Clients Moved to Success',
  'Cliente con >50% usuarios activos, al menos 1 feature sticky y fecha de éxito conocida',
  'percentage',
  '{"logic":"AND","conditions":[
    {"field":"percent_active_users","operator":"gt","value":50},
    {"field":"sticky_feature_count","operator":"gte","value":1},
    {"field":"date_ready_to_success","operator":"known"}
  ]}',
  '[
    {"condition":{"logic":"AND","conditions":[
      {"field":"is_red_list","operator":"eq","value":true}
    ]},"result":"validation","reason":"Cliente en Red List — requiere aprobación manual"},
    {"condition":{"logic":"AND","conditions":[
      {"field":"percent_active_users","operator":"gt","value":50},
      {"field":"sticky_feature_count","operator":"gte","value":1}
    ]},"result":"approved"}
  ]',
  '{"type":"fixed","amount":500}',
  '00000000-0000-0000-0000-000000000001'
) on conflict do nothing;

-- 3. Numeric: Super Engagement
insert into objectives (id, plan_id, name, description, type, conditions, routing_rules, bonus_formula, created_by) values
(
  '20000000-0000-0000-0000-000000000003',
  '10000000-0000-0000-0000-000000000001',
  'Bono Super Engagement',
  'Alto engagement con CSAT alto, múltiples procesos resueltos y WAU condicional por tamaño',
  'numeric',
  '{"logic":"AND","conditions":[
    {"field":"deal_stage","operator":"in","value":["Pilot","Final Negotiation","Won"]},
    {"field":"days_since_handoff","operator":"gt","value":90},
    {"field":"csat_score","operator":"eq","value":"High"},
    {"field":"resolved_processes_feature_count","operator":"gt","value":6}
  ]}',
  '[
    {"condition":{"logic":"OR","conditions":[
      {"field":"is_red_list","operator":"eq","value":true},
      {"field":"csat_is_stale","operator":"eq","value":true},
      {"field":"wau_is_stale","operator":"eq","value":true}
    ]},"result":"validation","reason":"Datos desactualizados o cliente en Red List"},
    {"condition":{"logic":"AND","conditions":[
      {"field":"csat_score","operator":"eq","value":"High"},
      {"field":"resolved_processes_feature_count","operator":"gt","value":6}
    ]},"result":"approved"}
  ]',
  '{"type":"percentage_of_field","field":"mrr","percentage":20}',
  '00000000-0000-0000-0000-000000000001'
) on conflict do nothing;

-- 4. Status: SQOs
insert into objectives (id, plan_id, name, description, type, conditions, routing_rules, bonus_formula, created_by) values
(
  '20000000-0000-0000-0000-000000000004',
  '10000000-0000-0000-0000-000000000001',
  'Bono SQOs',
  'Lead con status Validated',
  'status',
  '{"logic":"AND","conditions":[
    {"field":"lead_status","operator":"eq","value":"Validated"}
  ]}',
  '[
    {"condition":{"logic":"AND","conditions":[
      {"field":"lead_status","operator":"eq","value":"Booked"},
      {"field":"days_since_booked","operator":"gt","value":30}
    ]},"result":"validation","reason":"Lead en Booked por más de 30 días sin avanzar"},
    {"condition":{"logic":"AND","conditions":[
      {"field":"lead_status","operator":"eq","value":"Validated"}
    ]},"result":"approved"}
  ]',
  '{"type":"fixed","amount":300}',
  '00000000-0000-0000-0000-000000000001'
) on conflict do nothing;

-- ASSIGNMENTS — asignar objetivos a usuarios demo
insert into assignments (objective_id, assignee_type, assignee_id, start_date, end_date) values
  ('20000000-0000-0000-0000-000000000001', 'user', '00000000-0000-0000-0000-000000000003', '2026-03-01', '2026-03-31'),
  ('20000000-0000-0000-0000-000000000001', 'user', '00000000-0000-0000-0000-000000000002', '2026-03-01', '2026-03-31'),
  ('20000000-0000-0000-0000-000000000002', 'user', '00000000-0000-0000-0000-000000000004', '2026-03-01', '2026-03-31'),
  ('20000000-0000-0000-0000-000000000003', 'user', '00000000-0000-0000-0000-000000000004', '2026-03-01', '2026-03-31'),
  ('20000000-0000-0000-0000-000000000004', 'user', '00000000-0000-0000-0000-000000000005', '2026-03-01', '2026-03-31')
on conflict do nothing;

-- CRM SNAPSHOTS (datos simulados para que el rules engine funcione en demo)
insert into crm_snapshots (deal_id, deal_name, deal_stage, deal_owner_id, cx_owner_id, who_got_the_call, deal_source, mrr, percent_active_users, sticky_feature_count, date_ready_to_success, csat_score, resolved_processes_feature_count, wau_percent, wau_last_update_date, csat_last_update_date, handoff_early_success_date, lead_status, booked_date, period_month, period_year)
values
  -- Deal para María (AE) → approved
  ('deal-001','Acme Corp','Won','00000000-0000-0000-0000-000000000003',null,'Ana García','Inbound',5000,null,null,null,null,null,null,null,null,null,null,null,3,2026),
  -- Deal para Juan (SAM) → Clients Moved approved
  ('deal-002','Beta SRL',null,null,'00000000-0000-0000-0000-000000000004',null,null,null,72,2,'2026-02-15',null,null,null,null,null,null,null,null,3,2026),
  -- Deal para Juan (SAM) → Super Engagement under_review (csat_is_stale)
  ('deal-003','Gamma Inc','Won',null,'00000000-0000-0000-0000-000000000004',null,null,8000,null,null,null,'High',9,80,'2025-11-01','2025-10-01','2025-11-15',null,null,3,2026),
  -- Lead para Sofía (BDR) → SQO approved
  ('deal-004','Delta SA',null,'00000000-0000-0000-0000-000000000005',null,null,null,null,null,null,null,null,null,null,null,null,null,'Validated','2026-02-20',3,2026)
on conflict do nothing;

-- OBJECTIVE INSTANCES (estados variados para demo visual)
insert into objective_instances (id, objective_id, user_id, period_month, period_year, status, condition_results, bonus_amount, crm_snapshot) values
  -- María: Bono Sales → approved
  ('30000000-0000-0000-0000-000000000001',
   '20000000-0000-0000-0000-000000000001',
   '00000000-0000-0000-0000-000000000003',
   3, 2026, 'approved',
   '[{"field":"who_got_the_call","passed":true,"actualValue":"Ana García","expectedValue":null,"operator":"known"},{"field":"deal_stage","passed":true,"actualValue":"Won","expectedValue":"Success Red List 🚨","operator":"neq"},{"field":"deal_stage","passed":true,"actualValue":"Won","expectedValue":"Won","operator":"eq"}]',
   5000,
   '{"deal_stage":"Won","who_got_the_call":"Ana García","deal_source":"Inbound","mrr":5000}'),

  -- Carlos: Bono Sales → validation (AE source)
  ('30000000-0000-0000-0000-000000000002',
   '20000000-0000-0000-0000-000000000001',
   '00000000-0000-0000-0000-000000000002',
   3, 2026, 'validation',
   '[{"field":"who_got_the_call","passed":true,"actualValue":"Ana García","expectedValue":null,"operator":"known"},{"field":"deal_stage","passed":true,"actualValue":"Won","expectedValue":"Success Red List 🚨","operator":"neq"},{"field":"deal_stage","passed":true,"actualValue":"Won","expectedValue":"Won","operator":"eq"}]',
   null,
   '{"deal_stage":"Won","deal_source":"AE","mrr":6000,"days_since_booked":45}'),

  -- Juan: Clients Moved → approved
  ('30000000-0000-0000-0000-000000000003',
   '20000000-0000-0000-0000-000000000002',
   '00000000-0000-0000-0000-000000000004',
   3, 2026, 'approved',
   '[{"field":"percent_active_users","passed":true,"actualValue":72,"expectedValue":50,"operator":"gt"},{"field":"sticky_feature_count","passed":true,"actualValue":2,"expectedValue":1,"operator":"gte"},{"field":"date_ready_to_success","passed":true,"actualValue":"2026-02-15","expectedValue":null,"operator":"known"}]',
   500,
   '{"percent_active_users":72,"sticky_feature_count":2,"date_ready_to_success":"2026-02-15"}'),

  -- Juan: Super Engagement → validation (datos stale)
  ('30000000-0000-0000-0000-000000000004',
   '20000000-0000-0000-0000-000000000003',
   '00000000-0000-0000-0000-000000000004',
   3, 2026, 'validation',
   '[{"field":"deal_stage","passed":true,"actualValue":"Won","expectedValue":["Pilot","Final Negotiation","Won"],"operator":"in"},{"field":"days_since_handoff","passed":true,"actualValue":123,"expectedValue":90,"operator":"gt"},{"field":"csat_score","passed":true,"actualValue":"High","expectedValue":"High","operator":"eq"},{"field":"resolved_processes_feature_count","passed":true,"actualValue":9,"expectedValue":6,"operator":"gt"}]',
   null,
   '{"deal_stage":"Won","csat_score":"High","resolved_processes_feature_count":9,"wau_is_stale":true,"csat_is_stale":true}'),

  -- Sofía: SQOs → approved
  ('30000000-0000-0000-0000-000000000005',
   '20000000-0000-0000-0000-000000000004',
   '00000000-0000-0000-0000-000000000005',
   3, 2026, 'approved',
   '[{"field":"lead_status","passed":true,"actualValue":"Validated","expectedValue":"Validated","operator":"eq"}]',
   300,
   '{"lead_status":"Validated"}')
on conflict do nothing;

-- PAYOUT RUN — draft listo para aprobar
insert into payout_runs (id, plan_id, period_month, period_year, status, total_amount, items) values
  ('40000000-0000-0000-0000-000000000001',
   '10000000-0000-0000-0000-000000000001',
   3, 2026, 'draft', 5800,
   '[
     {"userId":"00000000-0000-0000-0000-000000000003","objectiveInstanceId":"30000000-0000-0000-0000-000000000001","amount":5000,"userName":"María Pérez","objectiveName":"Bono Sales"},
     {"userId":"00000000-0000-0000-0000-000000000004","objectiveInstanceId":"30000000-0000-0000-0000-000000000003","amount":500,"userName":"Juan Torres","objectiveName":"Bono Clients Moved to Success"},
     {"userId":"00000000-0000-0000-0000-000000000005","objectiveInstanceId":"30000000-0000-0000-0000-000000000005","amount":300,"userName":"Sofía Ramos","objectiveName":"Bono SQOs"}
   ]')
on conflict do nothing;