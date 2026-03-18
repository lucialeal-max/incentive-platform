import type { BonusFormula } from '../types';
import { applyOperator } from '../rules-engine/operators';

export function calculateBonus(
  formula: BonusFormula,
  data: Record<string, unknown>
): number {
  switch (formula.type) {
    case 'fixed':
      return formula.amount;
    case 'percentage_of_field': {
      const fieldValue = Number(data[formula.field] ?? 0);
      return (fieldValue * formula.percentage) / 100;
    }
    case 'conditional': {
      for (const c of formula.cases) {
        const actual = data[c.condition.field];
        if (applyOperator(c.condition.operator, actual, c.condition.value)) {
          return calculateBonus(c.formula, data);
        }
      }
      return calculateBonus(formula.default, data);
    }
    default:
      return 0;
  }
}