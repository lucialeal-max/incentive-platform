import { describe, it, expect } from "vitest";
import { evaluateObjective } from "@/lib/domain/rules-engine/evaluator";
import type { EvaluationInput } from "@/lib/domain/types";
import { DEMO_OBJECTIVES } from "@/lib/demo-data";

const salesObjective = DEMO_OBJECTIVES[0];

describe("evaluateObjective — Bono Sales", () => {
  it("aprueba un deal Won con Inbound source", () => {
    const input: EvaluationInput = {
      objective: salesObjective,
      crmData: { who_got_the_call: "Ana García", deal_stage: "Won", deal_source: "Inbound", mrr: 5000 },
      userContext: { userId: "test-user", role: "AE" },
    };
    const result = evaluateObjective(input);
    expect(result.status).toBe("approved");
    expect(result.bonusAmount).toBe(5000); // 100% de 5000 MRR
  });

  it("manda a validation si deal_source es AE", () => {
    const input: EvaluationInput = {
      objective: salesObjective,
      crmData: { who_got_the_call: "Ana García", deal_stage: "Won", deal_source: "AE", mrr: 6000 },
      userContext: { userId: "test-user", role: "AE" },
    };
    const result = evaluateObjective(input);
    expect(result.status).toBe("validation");
    expect(result.bonusAmount).toBeNull();
  });

  it("rechaza si deal_stage no es Won", () => {
    const input: EvaluationInput = {
      objective: salesObjective,
      crmData: { who_got_the_call: "Ana García", deal_stage: "In Progress", deal_source: "Inbound", mrr: 4000 },
      userContext: { userId: "test-user", role: "AE" },
    };
    const result = evaluateObjective(input);
    expect(result.status).toBe("rejected");
  });

  it("rechaza si who_got_the_call es desconocido", () => {
    const input: EvaluationInput = {
      objective: salesObjective,
      crmData: { who_got_the_call: null, deal_stage: "Won", deal_source: "Inbound", mrr: 4000 },
      userContext: { userId: "test-user", role: "AE" },
    };
    const result = evaluateObjective(input);
    expect(result.status).toBe("rejected");
  });
});

const sqoObjective = DEMO_OBJECTIVES[3];
describe("evaluateObjective — Bono SQOs", () => {
  it("aprueba si lead_status es Validated", () => {
    const input: EvaluationInput = {
      objective: sqoObjective,
      crmData: { lead_status: "Validated" },
      userContext: { userId: "test-user", role: "BDR" },
    };
    const result = evaluateObjective(input);
    expect(result.status).toBe("approved");
    expect(result.bonusAmount).toBe(300);
  });
});