import type { RoutingRule, ConditionGroup } from '../types';
import { evaluateConditionGroup } from './condition-evaluator';

export function applyRoutingRules(
  rules: RoutingRule[],
  data: Record<string, unknown>
): { status: 'approved' | 'validation' | 'rejected'; reason: string | null } {
  for (const rule of rules) {
    const { passed } = evaluateConditionGroup(rule.condition, data);
    if (passed) {
      return {
        status: rule.result === 'validation' ? 'validation' : rule.result,
        reason: rule.reason ?? null,
      };
    }
  }
  return { status: 'rejected', reason: 'No matching routing rule — default rejected.' };
}