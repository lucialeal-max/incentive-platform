import { describe, it, expect } from "vitest";
import { calculateBonus } from "@/lib/domain/bonus-calculator/calculator";
import type { BonusFormula } from "@/lib/domain/types";

describe("calculateBonus", () => {
  it("retorna monto fijo", () => {
    const f: BonusFormula = { type: "fixed", amount: 500 };
    expect(calculateBonus(f, {})).toBe(500);
  });

  it("calcula porcentaje de campo", () => {
    const f: BonusFormula = { type: "percentage_of_field", field: "mrr", percentage: 100 };
    expect(calculateBonus(f, { mrr: 5000 })).toBe(5000);
  });

  it("calcula porcentaje parcial", () => {
    const f: BonusFormula = { type: "percentage_of_field", field: "mrr", percentage: 80 };
    expect(calculateBonus(f, { mrr: 5000 })).toBe(4000);
  });

  it("aplica fórmula condicional correctamente", () => {
    const f: BonusFormula = {
      type: "conditional",
      cases: [
        { condition: { field: "deal_source", operator: "eq", value: "AE" }, formula: { type: "percentage_of_field", field: "mrr", percentage: 115 } },
        { condition: { field: "deal_source", operator: "eq", value: "Inbound" }, formula: { type: "percentage_of_field", field: "mrr", percentage: 100 } },
      ],
      default: { type: "fixed", amount: 0 },
    };
    expect(calculateBonus(f, { deal_source: "AE", mrr: 6000 })).toBe(6900);
    expect(calculateBonus(f, { deal_source: "Inbound", mrr: 5000 })).toBe(5000);
    expect(calculateBonus(f, { deal_source: "Other", mrr: 5000 })).toBe(0);
  });
});