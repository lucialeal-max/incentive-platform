import type {
  EvaluationInput,
  EvaluationResult,
  ConditionResult,
} from '../types';
import { evaluateConditionGroup } from './condition-evaluator';
import { applyRoutingRules } from './routing';
import { calculateBonus } from '../bonus-calculator/calculator';
import { buildFriendlyExplanation } from '../friendly-explainer/explainer';

export function evaluateObjective(input: EvaluationInput): EvaluationResult {
  const { objective, crmData } = input;

  // Step 1: evaluate base conditions
  const { passed, results } = evaluateConditionGroup(objective.conditions, crmData);

  // Step 2: apply routing rules to determine final status
  const { status, reason } = applyRoutingRules(objective.routingRules, crmData);

  // Step 3: calculate bonus only if approved
  const bonusAmount =
    status === 'approved' ? calculateBonus(objective.bonusFormula, crmData) : null;

  // Step 4: build friendly explanation for the end user
  const friendlyExplanation = buildFriendlyExplanation(results, status, reason);

  return {
    status,
    conditionResults: results,
    bonusAmount,
    routingReason: reason,
    friendlyExplanation,
  };
}