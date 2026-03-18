import type { ObjectiveInstance, Objective, IncentivePlan, Profile, PayoutRun } from "./domain/types";

export const DEMO_PROFILES: Profile[] = [
  { id: "00000000-0000-0000-0000-000000000001", fullName: "Ana Garcia",   email: "ana@demo.com",    isAdmin: true,  jobRole: "RevOps" },
  { id: "00000000-0000-0000-0000-000000000002", fullName: "Carlos Lopez", email: "carlos@demo.com", isAdmin: true,  jobRole: "AE" },
  { id: "00000000-0000-0000-0000-000000000003", fullName: "Maria Perez",  email: "maria@demo.com",  isAdmin: false, jobRole: "AE" },
  { id: "00000000-0000-0000-0000-000000000004", fullName: "Juan Torres",  email: "juan@demo.com",   isAdmin: false, jobRole: "SAM" },
  { id: "00000000-0000-0000-0000-000000000005", fullName: "Sofia Ramos",  email: "sofia@demo.com",  isAdmin: false, jobRole: "BDR" },
];

export const DEMO_PLANS: IncentivePlan[] = [
  { id: "10000000-0000-0000-0000-000000000001", name: "Plan Comercial Q1 2026",
    periodMonth: 3, periodYear: 2026, currency: "USD", status: "active", version: 1,
    createdBy: "00000000-0000-0000-0000-000000000001", createdAt: "2026-03-01T00:00:00Z" },
];

export const DEMO_OBJECTIVES: Objective[] = [
  { id: "20000000-0000-0000-0000-000000000001",
    planId: "10000000-0000-0000-0000-000000000001",
    name: "Bono Sales", description: "Deal cerrado con quien tomo la llamada completo y fuera de Red List",
    type: "boolean",
    conditions: { logic: "AND", conditions: [
      { field: "who_got_the_call", operator: "known" },
      { field: "deal_stage", operator: "neq", value: "Success Red List" },
      { field: "deal_stage", operator: "eq", value: "Won" },
    ]},
    routingRules: [
      { condition: { logic: "AND", conditions: [{ field: "deal_source", operator: "eq", value: "AE" }]}, result: "validation", reason: "Deal source AE requiere revision" },
      { condition: { logic: "AND", conditions: [{ field: "deal_stage", operator: "eq", value: "Won" }]}, result: "approved" },
    ],
    bonusFormula: { type: "conditional", cases: [
      { condition: { field: "deal_source", operator: "in", value: ["BDR","Inbound","Event","Alliance","CX"] }, formula: { type: "percentage_of_field", field: "mrr", percentage: 100 } },
      { condition: { field: "deal_source", operator: "in", value: ["Referral","BP","Outbound Partner"] },     formula: { type: "percentage_of_field", field: "mrr", percentage: 80 } },
      { condition: { field: "deal_source", operator: "eq",  value: "AE" },                                    formula: { type: "percentage_of_field", field: "mrr", percentage: 115 } },
    ], default: { type: "percentage_of_field", field: "mrr", percentage: 100 } },
    createdBy: "00000000-0000-0000-0000-000000000001", createdAt: "2026-03-01T00:00:00Z",
  },
  { id: "20000000-0000-0000-0000-000000000002",
    planId: "10000000-0000-0000-0000-000000000001",
    name: "Bono Clients Moved to Success",
    description: "Mas del 50% usuarios activos, al menos 1 feature sticky y fecha de exito conocida",
    type: "percentage",
    conditions: { logic: "AND", conditions: [
      { field: "percent_active_users", operator: "gt", value: 50 },
      { field: "sticky_feature_count",  operator: "gte", value: 1 },
      { field: "date_ready_to_success", operator: "known" },
    ]},
    routingRules: [
      { condition: { logic: "AND", conditions: [{ field: "is_red_list", operator: "eq", value: true }]}, result: "validation", reason: "Cliente en Red List" },
      { condition: { logic: "AND", conditions: [{ field: "percent_active_users", operator: "gt", value: 50 }]}, result: "approved" },
    ],
    bonusFormula: { type: "fixed", amount: 500 },
    createdBy: "00000000-0000-0000-0000-000000000001", createdAt: "2026-03-01T00:00:00Z",
  },
  { id: "20000000-0000-0000-0000-000000000003",
    planId: "10000000-0000-0000-0000-000000000001",
    name: "Bono Super Engagement",
    description: "Alto engagement con CSAT High, mas de 6 procesos resueltos y WAU condicional",
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
      ]}, result: "validation", reason: "Datos desactualizados o cliente en Red List" },
      { condition: { logic: "AND", conditions: [{ field: "csat_score", operator: "eq", value: "High" }]}, result: "approved" },
    ],
    bonusFormula: { type: "percentage_of_field", field: "mrr", percentage: 20 },
    createdBy: "00000000-0000-0000-0000-000000000001", createdAt: "2026-03-01T00:00:00Z",
  },
  { id: "20000000-0000-0000-0000-000000000004",
    planId: "10000000-0000-0000-0000-000000000001",
    name: "Bono SQOs", description: "Lead con status Validated", type: "status",
    conditions: { logic: "AND", conditions: [{ field: "lead_status", operator: "eq", value: "Validated" }]},
    routingRules: [
      { condition: { logic: "AND", conditions: [
        { field: "lead_status", operator: "eq", value: "Booked" },
        { field: "days_since_booked", operator: "gt", value: 30 },
      ]}, result: "validation", reason: "Lead en Booked por mas de 30 dias" },
      { condition: { logic: "AND", conditions: [{ field: "lead_status", operator: "eq", value: "Validated" }]}, result: "approved" },
    ],
    bonusFormula: { type: "fixed", amount: 300 },
    createdBy: "00000000-0000-0000-0000-000000000001", createdAt: "2026-03-01T00:00:00Z",
  },
];

export const DEMO_INSTANCES: ObjectiveInstance[] = [
  { id: "30000000-0000-0000-0000-000000000001",
    objectiveId: "20000000-0000-0000-0000-000000000001",
    userId: "00000000-0000-0000-0000-000000000003",
    periodMonth: 3, periodYear: 2026, status: "approved",
    conditionResults: [
      { field: "who_got_the_call", passed: true,  actualValue: "Ana Garcia", expectedValue: null, operator: "known" },
      { field: "deal_stage",       passed: true,  actualValue: "Won",        expectedValue: "Won", operator: "eq" },
    ],
    bonusAmount: 5000, crmSnapshot: { deal_stage: "Won", deal_source: "Inbound", mrr: 5000 },
  },
  { id: "30000000-0000-0000-0000-000000000002",
    objectiveId: "20000000-0000-0000-0000-000000000001",
    userId: "00000000-0000-0000-0000-000000000002",
    periodMonth: 3, periodYear: 2026, status: "validation",
    conditionResults: [
      { field: "who_got_the_call", passed: true, actualValue: "Ana Garcia", expectedValue: null, operator: "known" },
      { field: "deal_stage",       passed: true, actualValue: "Won",        expectedValue: "Won", operator: "eq" },
    ],
    bonusAmount: null, crmSnapshot: { deal_stage: "Won", deal_source: "AE", mrr: 6000 },
  },
  { id: "30000000-0000-0000-0000-000000000003",
    objectiveId: "20000000-0000-0000-0000-000000000002",
    userId: "00000000-0000-0000-0000-000000000004",
    periodMonth: 3, periodYear: 2026, status: "approved",
    conditionResults: [
      { field: "percent_active_users",  passed: true, actualValue: 72, expectedValue: 50,   operator: "gt" },
      { field: "sticky_feature_count",  passed: true, actualValue: 2,  expectedValue: 1,    operator: "gte" },
      { field: "date_ready_to_success", passed: true, actualValue: "2026-02-15", expectedValue: null, operator: "known" },
    ],
    bonusAmount: 500, crmSnapshot: { percent_active_users: 72, sticky_feature_count: 2 },
  },
  { id: "30000000-0000-0000-0000-000000000004",
    objectiveId: "20000000-0000-0000-0000-000000000003",
    userId: "00000000-0000-0000-0000-000000000004",
    periodMonth: 3, periodYear: 2026, status: "validation",
    conditionResults: [
      { field: "deal_stage",                       passed: true, actualValue: "Won",  expectedValue: ["Pilot","Final Negotiation","Won"], operator: "in" },
      { field: "days_since_handoff",               passed: true, actualValue: 123,    expectedValue: 90,    operator: "gt" },
      { field: "csat_score",                       passed: true, actualValue: "High", expectedValue: "High", operator: "eq" },
      { field: "resolved_processes_feature_count", passed: true, actualValue: 9,      expectedValue: 6,     operator: "gt" },
    ],
    bonusAmount: null, crmSnapshot: { deal_stage: "Won", csat_score: "High", resolved_processes_feature_count: 9, wau_is_stale: true, mrr: 8000 },
  },
  { id: "30000000-0000-0000-0000-000000000005",
    objectiveId: "20000000-0000-0000-0000-000000000004",
    userId: "00000000-0000-0000-0000-000000000005",
    periodMonth: 3, periodYear: 2026, status: "approved",
    conditionResults: [{ field: "lead_status", passed: true, actualValue: "Validated", expectedValue: "Validated", operator: "eq" }],
    bonusAmount: 300, crmSnapshot: { lead_status: "Validated" },
  },
];

export const DEMO_PAYOUT_RUN: PayoutRun = {
  id: "40000000-0000-0000-0000-000000000001",
  planId: "10000000-0000-0000-0000-000000000001",
  periodMonth: 3, periodYear: 2026, status: "draft", totalAmount: 5800,
  items: [
    { userId: "00000000-0000-0000-0000-000000000003", objectiveInstanceId: "30000000-0000-0000-0000-000000000001", amount: 5000, userName: "Maria Perez",  objectiveName: "Bono Sales" },
    { userId: "00000000-0000-0000-0000-000000000004", objectiveInstanceId: "30000000-0000-0000-0000-000000000003", amount: 500,  userName: "Juan Torres",  objectiveName: "Bono Clients Moved to Success" },
    { userId: "00000000-0000-0000-0000-000000000005", objectiveInstanceId: "30000000-0000-0000-0000-000000000005", amount: 300,  userName: "Sofia Ramos",  objectiveName: "Bono SQOs" },
  ],
};