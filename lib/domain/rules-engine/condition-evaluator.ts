import type { Condition, ConditionGroup, ConditionResult } from '../types';
import { applyOperator } from './operators';

export function evaluateCondition(
  condition: Condition,
  data: Record<string, unknown>
): ConditionResult {
  const actual = data[condition.field];
  const passed = applyOperator(condition.operator, actual, condition.value);
  return {
    field: condition.field,
    passed,
    actualValue: actual,
    expectedValue: condition.value,
    operator: condition.operator,
  };
}

export function evaluateConditionGroup(
  group: ConditionGroup,
  data: Record<string, unknown>
): { passed: boolean; results: ConditionResult[] } {
  const results: ConditionResult[] = [];

  for (const item of group.conditions) {
    if ('logic' in item) {
      const sub = evaluateConditionGroup(item as ConditionGroup, data);
      // flatten sub results
      results.push(...sub.results);
    } else {
      results.push(evaluateCondition(item as Condition, data));
    }
  }

  const passed =
    group.logic === 'AND'
      ? results.every(r => r.passed)
      : results.some(r => r.passed);

  return { passed, results };
}