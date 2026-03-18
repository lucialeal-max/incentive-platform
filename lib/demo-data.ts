import type { ObjectiveInstance, Objective, IncentivePlan, Profile, PayoutRun } from "./domain/types";

export const DEMO_PROFILES: Profile[] = [
  { id: "00000000-0000-0000-0000-000000000001", fullName: "Ana Garcia",   email: "ana@humand.co",    isAdmin: true,  jobRole: "RevOps Lead" },
  { id: "00000000-0000-0000-0000-000000000002", fullName: "Carlos Lopez", email: "carlos@humand.co", isAdmin: true,  jobRole: "AE / Admin" },
  { id: "00000000-0000-0000-0000-000000000003", fullName: "Maria Perez",  email: "maria@humand.co",  isAdmin: false, jobRole: "Account Executive" },
  { id: "00000000-0000-0000-0000-000000000004", fullName: "Juan Torres",  email: "juan@humand.co",   isAdmin: false, jobRole: "Success Manager" },
  { id: "00000000-0000-0000-0000-000000000005", fullName: "Sofia Ramos",  email: "sofia@humand.co",  isAdmin: false, jobRole: "BDR" },
  { id: "00000000-0000-0000-0000-000000000006", fullName: "Diego Vega",   email: "diego@humand.co",  isAdmin: false, jobRole: "Onboarding Lead" },
];

export const DEMO_PLANS: IncentivePlan[] = [
  { id: "10000000-0000-0000-0000-000000000001", name: "Plan Comercial Q1 2026",
    periodMonth: 3, periodYear: 2026, currency: "USD", status: "active", version: 1,
    createdBy: "00000000-0000-0000-0000-000000000001", createdAt: "2026-03-01T00:00:00Z" },
];

export const DEMO_OBJECTIVES: Objective[] = [
  {
    id: "20000000-0000-0000-0000-000000000001",
    planId: "10000000-0000-0000-0000-000000000001",
    name: "Bono Sales — Deal cerrado",
    description: "Deal cerrado Won con campo 'quien tomo la llamada' completo y fuera de Red List. El monto varia segun la fuente del deal.",
    type: "boolean",
    conditions: { logic: "AND", conditions: [
      { field: "who_got_the_call", operator: "known" },
      { field: "deal_stage", operator: "neq", value: "Success Red List" },
      { field: "deal_stage", operator: "eq", value: "Won" },
    ]},
    routingRules: [
      { condition: { logic: "AND", conditions: [{ field: "deal_source", operator: "eq", value: "AE" }]}, result: "validation", reason: "Deal originado por el mismo AE — requiere revision de RevOps para evitar auto-asignacion." },
      { condition: { logic: "AND", conditions: [{ field: "deal_stage", operator: "eq", value: "Won" }]}, result: "approved" },
    ],
    bonusFormula: { type: "conditional", cases: [
      { condition: { field: "deal_source", operator: "in", value: ["BDR","Inbound","Event","Alliance","CX"] }, formula: { type: "percentage_of_field", field: "mrr", percentage: 100 } },
      { condition: { field: "deal_source", operator: "in", value: ["Referral","BP","Outbound Partner"] },     formula: { type: "percentage_of_field", field: "mrr", percentage: 80 } },
      { condition: { field: "deal_source", operator: "eq",  value: "AE" },                                    formula: { type: "percentage_of_field", field: "mrr", percentage: 115 } },
    ], default: { type: "percentage_of_field", field: "mrr", percentage: 100 } },
    createdBy: "00000000-0000-0000-0000-000000000001", createdAt: "2026-03-01T00:00:00Z",
  },
  {
    id: "20000000-0000-0000-0000-000000000002",
    planId: "10000000-0000-0000-0000-000000000001",
    name: "Bono Clients Moved to Success",
    description: "Cliente con mas del 50% de usuarios activos, al menos 1 feature sticky adoptada y fecha de transicion a Success conocida.",
    type: "percentage",
    conditions: { logic: "AND", conditions: [
      { field: "percent_active_users", operator: "gt", value: 50 },
      { field: "sticky_feature_count",  operator: "gte", value: 1 },
      { field: "date_ready_to_success", operator: "known" },
    ]},
    routingRules: [
      { condition: { logic: "AND", conditions: [{ field: "is_red_list", operator: "eq", value: true }]}, result: "validation", reason: "Cliente en Red List — la transicion a Success requiere aprobacion manual del lider de CS." },
      { condition: { logic: "AND", conditions: [{ field: "percent_active_users", operator: "gt", value: 50 }]}, result: "approved" },
    ],
    bonusFormula: { type: "fixed", amount: 500 },
    createdBy: "00000000-0000-0000-0000-000000000001", createdAt: "2026-03-01T00:00:00Z",
  },
  {
    id: "20000000-0000-0000-0000-000000000003",
    planId: "10000000-0000-0000-0000-000000000001",
    name: "Bono Super Engagement",
    description: "Cliente con alto engagement sostenido: CSAT High, mas de 6 procesos resueltos con la plataforma, y WAU estable por mas de 90 dias desde el handoff.",
    type: "numeric",
    conditions: { logic: "AND", conditions: [
      { field: "deal_stage", operator: "in", value: ["Pilot","Final Negotiation","Won"] },
      { field: "days_since_handoff", operator: "gt", value: 90 },
      { field: "csat_score", operator: "eq", value: "High" },
      { field: "resolved_processes_feature_count", operator: "gt", value: 6 },
    ]},
    routingRules: [
      { condition: { logic: "OR", conditions: [
        { field: "is_red_list", operator: "eq", value: true },
        { field: "csat_is_stale", operator: "eq", value: true },
        { field: "wau_is_stale",  operator: "eq", value: true },
      ]}, result: "validation", reason: "Datos de engagement desactualizados (CSAT o WAU sin actualizar en mas de 90 dias) o cliente en Red List. Requiere verificacion manual antes de aprobar el bono." },
      { condition: { logic: "AND", conditions: [{ field: "csat_score", operator: "eq", value: "High" }]}, result: "approved" },
    ],
    bonusFormula: { type: "percentage_of_field", field: "mrr", percentage: 20 },
    createdBy: "00000000-0000-0000-0000-000000000001", createdAt: "2026-03-01T00:00:00Z",
  },
  {
    id: "20000000-0000-0000-0000-000000000004",
    planId: "10000000-0000-0000-0000-000000000001",
    name: "Bono SQOs — Sales Qualified Opportunities",
    description: "Lead calificado con status Validated en CRM. Monto fijo por cada SQO generado en el periodo.",
    type: "status",
    conditions: { logic: "AND", conditions: [{ field: "lead_status", operator: "eq", value: "Validated" }]},
    routingRules: [
      { condition: { logic: "AND", conditions: [
        { field: "lead_status", operator: "eq", value: "Booked" },
        { field: "days_since_booked", operator: "gt", value: 30 },
      ]}, result: "validation", reason: "Lead lleva mas de 30 dias en estado Booked sin avanzar — posible lead frio que requiere revision." },
      { condition: { logic: "AND", conditions: [{ field: "lead_status", operator: "eq", value: "Validated" }]}, result: "approved" },
    ],
    bonusFormula: { type: "fixed", amount: 300 },
    createdBy: "00000000-0000-0000-0000-000000000001", createdAt: "2026-03-01T00:00:00Z",
  },
  {
    id: "20000000-0000-0000-0000-000000000005",
    planId: "10000000-0000-0000-0000-000000000001",
    name: "Bono Expansion — Upsell MRR",
    description: "Expansion de MRR en cuentas existentes. Se activa cuando el monto de expansion supera los $1.000 en el periodo.",
    type: "numeric",
    conditions: { logic: "AND", conditions: [
      { field: "expansion_amount", operator: "gte", value: 1000 },
      { field: "deal_stage", operator: "eq", value: "Won" },
    ]},
    routingRules: [
      { condition: { logic: "AND", conditions: [{ field: "expansion_amount", operator: "gte", value: 1000 }]}, result: "approved" },
    ],
    bonusFormula: { type: "percentage_of_field", field: "expansion_amount", percentage: 15 },
    createdBy: "00000000-0000-0000-0000-000000000001", createdAt: "2026-03-01T00:00:00Z",
  },
];

export const DEMO_INSTANCES: ObjectiveInstance[] = [
  // === MARIA PEREZ (AE) ===
  {
    id: "30000000-0000-0000-0000-000000000001",
    objectiveId: "20000000-0000-0000-0000-000000000001",
    userId: "00000000-0000-0000-0000-000000000003",
    periodMonth: 3, periodYear: 2026, status: "approved",
    conditionResults: [
      { field: "who_got_the_call", passed: true,  actualValue: "Ana Garcia",  expectedValue: null,              operator: "known" },
      { field: "deal_stage",       passed: true,  actualValue: "Won",         expectedValue: "Success Red List", operator: "neq" },
      { field: "deal_stage",       passed: true,  actualValue: "Won",         expectedValue: "Won",             operator: "eq" },
    ],
    bonusAmount: 5000,
    crmSnapshot: { deal_name: "Acme Corp", deal_stage: "Won", deal_source: "Inbound", who_got_the_call: "Ana Garcia", mrr: 5000 },
  },
  {
    id: "30000000-0000-0000-0000-000000000002",
    objectiveId: "20000000-0000-0000-0000-000000000001",
    userId: "00000000-0000-0000-0000-000000000003",
    periodMonth: 3, periodYear: 2026, status: "validation",
    conditionResults: [
      { field: "who_got_the_call", passed: true,  actualValue: "Maria Perez", expectedValue: null,              operator: "known" },
      { field: "deal_stage",       passed: true,  actualValue: "Won",         expectedValue: "Success Red List", operator: "neq" },
      { field: "deal_stage",       passed: true,  actualValue: "Won",         expectedValue: "Won",             operator: "eq" },
    ],
    bonusAmount: null,
    crmSnapshot: { deal_name: "Beta SRL", deal_stage: "Won", deal_source: "AE", who_got_the_call: "Maria Perez", mrr: 3200, days_since_booked: 45 },
  },
  {
    id: "30000000-0000-0000-0000-000000000003",
    objectiveId: "20000000-0000-0000-0000-000000000005",
    userId: "00000000-0000-0000-0000-000000000003",
    periodMonth: 3, periodYear: 2026, status: "approved",
    conditionResults: [
      { field: "expansion_amount", passed: true, actualValue: 2400, expectedValue: 1000, operator: "gte" },
      { field: "deal_stage",       passed: true, actualValue: "Won", expectedValue: "Won", operator: "eq" },
    ],
    bonusAmount: 360,
    crmSnapshot: { deal_name: "Gamma Inc — Expansion", deal_stage: "Won", expansion_amount: 2400 },
  },
  // === JUAN TORRES (SAM) ===
  {
    id: "30000000-0000-0000-0000-000000000004",
    objectiveId: "20000000-0000-0000-0000-000000000002",
    userId: "00000000-0000-0000-0000-000000000004",
    periodMonth: 3, periodYear: 2026, status: "approved",
    conditionResults: [
      { field: "percent_active_users",  passed: true, actualValue: 72,           expectedValue: 50,   operator: "gt" },
      { field: "sticky_feature_count",  passed: true, actualValue: 3,            expectedValue: 1,    operator: "gte" },
      { field: "date_ready_to_success", passed: true, actualValue: "2026-02-15", expectedValue: null, operator: "known" },
    ],
    bonusAmount: 500,
    crmSnapshot: { deal_name: "Delta SA", percent_active_users: 72, sticky_feature_count: 3, date_ready_to_success: "2026-02-15", cx_owner: "Juan Torres" },
  },
  {
    id: "30000000-0000-0000-0000-000000000005",
    objectiveId: "20000000-0000-0000-0000-000000000003",
    userId: "00000000-0000-0000-0000-000000000004",
    periodMonth: 3, periodYear: 2026, status: "validation",
    conditionResults: [
      { field: "deal_stage",                       passed: true,  actualValue: "Won",   expectedValue: ["Pilot","Final Negotiation","Won"], operator: "in" },
      { field: "days_since_handoff",               passed: true,  actualValue: 123,     expectedValue: 90,    operator: "gt" },
      { field: "csat_score",                       passed: true,  actualValue: "High",  expectedValue: "High", operator: "eq" },
      { field: "resolved_processes_feature_count", passed: true,  actualValue: 9,       expectedValue: 6,     operator: "gt" },
    ],
    bonusAmount: null,
    crmSnapshot: { deal_name: "Epsilon Corp", deal_stage: "Won", csat_score: "High", resolved_processes_feature_count: 9, wau_is_stale: true, csat_is_stale: true, mrr: 8000, cx_owner: "Juan Torres" },
  },
  {
    id: "30000000-0000-0000-0000-000000000006",
    objectiveId: "20000000-0000-0000-0000-000000000002",
    userId: "00000000-0000-0000-0000-000000000004",
    periodMonth: 3, periodYear: 2026, status: "approved",
    conditionResults: [
      { field: "percent_active_users",  passed: true, actualValue: 81,           expectedValue: 50,   operator: "gt" },
      { field: "sticky_feature_count",  passed: true, actualValue: 2,            expectedValue: 1,    operator: "gte" },
      { field: "date_ready_to_success", passed: true, actualValue: "2026-03-02", expectedValue: null, operator: "known" },
    ],
    bonusAmount: 500,
    crmSnapshot: { deal_name: "Zeta SA", percent_active_users: 81, sticky_feature_count: 2, date_ready_to_success: "2026-03-02", cx_owner: "Juan Torres" },
  },
  // === CARLOS LOPEZ (AE/Admin) — sus objetivos como IC ===
  {
    id: "30000000-0000-0000-0000-000000000007",
    objectiveId: "20000000-0000-0000-0000-000000000001",
    userId: "00000000-0000-0000-0000-000000000002",
    periodMonth: 3, periodYear: 2026, status: "approved",
    conditionResults: [
      { field: "who_got_the_call", passed: true,  actualValue: "Ana Garcia",  expectedValue: null,              operator: "known" },
      { field: "deal_stage",       passed: true,  actualValue: "Won",         expectedValue: "Success Red List", operator: "neq" },
      { field: "deal_stage",       passed: true,  actualValue: "Won",         expectedValue: "Won",             operator: "eq" },
    ],
    bonusAmount: 7475,
    crmSnapshot: { deal_name: "Omega Group", deal_stage: "Won", deal_source: "AE", who_got_the_call: "Ana Garcia", mrr: 6500 },
  },
  {
    id: "30000000-0000-0000-0000-000000000008",
    objectiveId: "20000000-0000-0000-0000-000000000004",
    userId: "00000000-0000-0000-0000-000000000002",
    periodMonth: 3, periodYear: 2026, status: "rejected",
    conditionResults: [
      { field: "lead_status", passed: false, actualValue: "Prospecting", expectedValue: "Validated", operator: "eq" },
    ],
    bonusAmount: null,
    crmSnapshot: { deal_name: "Theta Inc", lead_status: "Prospecting" },
  },
  // === SOFIA RAMOS (BDR) ===
  {
    id: "30000000-0000-0000-0000-000000000009",
    objectiveId: "20000000-0000-0000-0000-000000000004",
    userId: "00000000-0000-0000-0000-000000000005",
    periodMonth: 3, periodYear: 2026, status: "approved",
    conditionResults: [
      { field: "lead_status", passed: true, actualValue: "Validated", expectedValue: "Validated", operator: "eq" },
    ],
    bonusAmount: 300,
    crmSnapshot: { deal_name: "Kappa SA", lead_status: "Validated" },
  },
  {
    id: "30000000-0000-0000-0000-000000000010",
    objectiveId: "20000000-0000-0000-0000-000000000004",
    userId: "00000000-0000-0000-0000-000000000005",
    periodMonth: 3, periodYear: 2026, status: "approved",
    conditionResults: [
      { field: "lead_status", passed: true, actualValue: "Validated", expectedValue: "Validated", operator: "eq" },
    ],
    bonusAmount: 300,
    crmSnapshot: { deal_name: "Lambda Corp", lead_status: "Validated" },
  },
  {
    id: "30000000-0000-0000-0000-000000000011",
    objectiveId: "20000000-0000-0000-0000-000000000004",
    userId: "00000000-0000-0000-0000-000000000005",
    periodMonth: 3, periodYear: 2026, status: "validation",
    conditionResults: [
      { field: "lead_status",      passed: false, actualValue: "Booked",     expectedValue: "Validated", operator: "eq" },
      { field: "days_since_booked",passed: true,  actualValue: 38,           expectedValue: 30,         operator: "gt" },
    ],
    bonusAmount: null,
    crmSnapshot: { deal_name: "Mu Digital", lead_status: "Booked", days_since_booked: 38 },
  },
];

export const DEMO_PAYOUT_RUN = {
  id: "40000000-0000-0000-0000-000000000001",
  planId: "10000000-0000-0000-0000-000000000001",
  periodMonth: 3, periodYear: 2026, status: "draft" as const, totalAmount: 14435,
  items: [
    { userId: "00000000-0000-0000-0000-000000000003", objectiveInstanceId: "30000000-0000-0000-0000-000000000001", amount: 5000,  userName: "Maria Perez",  objectiveName: "Bono Sales — Acme Corp" },
    { userId: "00000000-0000-0000-0000-000000000003", objectiveInstanceId: "30000000-0000-0000-0000-000000000003", amount: 360,   userName: "Maria Perez",  objectiveName: "Bono Expansion — Gamma Inc" },
    { userId: "00000000-0000-0000-0000-000000000004", objectiveInstanceId: "30000000-0000-0000-0000-000000000004", amount: 500,   userName: "Juan Torres",  objectiveName: "Bono Clients Moved — Delta SA" },
    { userId: "00000000-0000-0000-0000-000000000004", objectiveInstanceId: "30000000-0000-0000-0000-000000000006", amount: 500,   userName: "Juan Torres",  objectiveName: "Bono Clients Moved — Zeta SA" },
    { userId: "00000000-0000-0000-0000-000000000002", objectiveInstanceId: "30000000-0000-0000-0000-000000000007", amount: 7475,  userName: "Carlos Lopez", objectiveName: "Bono Sales — Omega Group" },
    { userId: "00000000-0000-0000-0000-000000000005", objectiveInstanceId: "30000000-0000-0000-0000-000000000009", amount: 300,   userName: "Sofia Ramos",  objectiveName: "Bono SQOs — Kappa SA" },
    { userId: "00000000-0000-0000-0000-000000000005", objectiveInstanceId: "30000000-0000-0000-0000-000000000010", amount: 300,   userName: "Sofia Ramos",  objectiveName: "Bono SQOs — Lambda Corp" },
  ],
};
