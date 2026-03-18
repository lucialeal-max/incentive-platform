export type ConditionOperator =
  | 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte'
  | 'in' | 'not_in' | 'known' | 'unknown'
  | 'days_ago_gt' | 'days_ago_lt';

export interface Condition {
  field: string;
  operator: ConditionOperator;
  value?: unknown;
}

export interface ConditionGroup {
  logic: 'AND' | 'OR';
  conditions: (Condition | ConditionGroup)[];
}

export type ObjectiveStatus =
  | 'draft' | 'active' | 'in_progress' | 'achieved'
  | 'under_review' | 'validation' | 'rejected'
  | 'approved' | 'payout_requested' | 'pending';

export interface RoutingRule {
  condition: ConditionGroup;
  result: 'approved' | 'validation' | 'rejected';
  reason?: string;
}

export type BonusFormula =
  | { type: 'fixed'; amount: number }
  | { type: 'percentage_of_field'; field: string; percentage: number }
  | { type: 'conditional'; cases: BonusCase[]; default: BonusFormula };

export interface BonusCase {
  condition: Condition;
  formula: BonusFormula;
}

export type ObjectiveType = 'boolean' | 'percentage' | 'numeric' | 'status';

export interface Objective {
  id: string;
  planId: string;
  name: string;
  description?: string;
  type: ObjectiveType;
  conditions: ConditionGroup;
  routingRules: RoutingRule[];
  bonusFormula: BonusFormula;
  createdBy: string;
  createdAt: string;
}

export interface IncentivePlan {
  id: string;
  name: string;
  periodMonth: number;
  periodYear: number;
  currency: string;
  status: 'draft' | 'active' | 'closed';
  version: number;
  clonedFrom?: string;
  createdBy: string;
  createdAt: string;
}

export interface Profile {
  id: string;
  fullName: string;
  email: string;
  isAdmin: boolean;
  teamId?: string;
  jobRole?: string;
}

export interface ConditionResult {
  field: string;
  passed: boolean;
  actualValue: unknown;
  expectedValue: unknown;
  operator: ConditionOperator;
}

export interface EvaluationInput {
  objective: Objective;
  crmData: Record<string, unknown>;
  userContext: { userId: string; role: string };
}

export interface EvaluationResult {
  status: string;
  conditionResults: ConditionResult[];
  bonusAmount: number | null;
  routingReason: string | null;
  friendlyExplanation: string;
}

export interface ObjectiveInstance {
  id: string;
  objectiveId: string;
  userId: string;
  periodMonth: number;
  periodYear: number;
  status: ObjectiveStatus;
  conditionResults: ConditionResult[];
  bonusAmount: number | null;
  crmSnapshot: Record<string, unknown>;
  resolvedBy?: string;
  resolvedAt?: string;
  resolutionNote?: string;
}

export interface PayoutRun {
  id: string;
  planId: string;
  periodMonth: number;
  periodYear: number;
  status: 'draft' | 'approved' | 'payout_requested';
  totalAmount: number;
  approvedBy?: string;
  approvedAt?: string;
  items: PayoutItem[];
}

export interface PayoutItem {
  userId: string;
  objectiveInstanceId: string;
  amount: number;
  userName?: string;
  objectiveName?: string;
}