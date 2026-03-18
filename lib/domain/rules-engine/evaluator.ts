import type { EvaluationInput, EvaluationResult } from '../types';
import { evaluateConditionGroup } from './condition-evaluator';
import { applyRoutingRules } from './routing';
import { calculateBonus } from '../bonus-calculator/calculator';
import { buildFriendlyExplanation } from '../friendly-explainer/explainer';

export function evaluateObjective(input: EvaluationInput): EvaluationResult {
  const { objective, crmData } = input;
  const { results } = evaluateConditionGroup(objective.conditions, crmData);
  const { status, reason } = applyRoutingRules(objective.routingRules, crmData);
  const bonusAmount = status === 'approved'
    ? calculateBonus(objective.bonusFormula, crmData)
    : null;
  const friendlyExplanation = buildFriendlyExplanation(results, status, reason);
  return {
    status,
    conditionResults: results,
    bonusAmount,
    routingReason: reason,
    friendlyExplanation,
  };
}