import type { ConditionOperator } from '../types';

export function applyOperator(
  operator: ConditionOperator,
  actual: unknown,
  expected: unknown
): boolean {
  if (operator === 'known') return actual !== null && actual !== undefined && actual !== '';
  if (operator === 'unknown') return actual === null || actual === undefined || actual === '';

  const a = actual as number | string;
  const e = expected as number | string;

  switch (operator) {
    case 'eq':  return a === e;
    case 'neq': return a !== e;
    case 'gt':  return Number(a) > Number(e);
    case 'gte': return Number(a) >= Number(e);
    case 'lt':  return Number(a) < Number(e);
    case 'lte': return Number(a) <= Number(e);
    case 'in':
      return Array.isArray(expected) && expected.includes(a);
    case 'not_in':
      return Array.isArray(expected) && !expected.includes(a);
    case 'days_ago_gt': {
      if (!actual) return false;
      const date = new Date(a as string);
      const diffDays = (Date.now() - date.getTime()) / 86400000;
      return diffDays > Number(e);
    }
    case 'days_ago_lt': {
      if (!actual) return false;
      const date = new Date(a as string);
      const diffDays = (Date.now() - date.getTime()) / 86400000;
      return diffDays < Number(e);
    }
    default: return false;
  }
}