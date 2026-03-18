import { DEMO_INSTANCES, DEMO_OBJECTIVES } from "@/lib/demo-data";
import { ObjectiveCard } from "@/components/objectives/objective-card";
import { BonusSummaryBar } from "@/components/objectives/bonus-summary-bar";

export default function MyObjectivesPage() {
  const instances = DEMO_INSTANCES.filter(i => i.userId === "00000000-0000-0000-0000-000000000003");
  const totalApproved = instances
    .filter(i => i.status === "approved")
    .reduce((s, i) => s + (i.bonusAmount ?? 0), 0);
  const totalPotential = instances.reduce((s, i) => s + (i.bonusAmount ?? 0), 0);
  const underReview = instances.filter(i => i.status === "validation").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Mis objetivos</h1>
        <p className="text-sm text-gray-500 mt-0.5">Marzo 2026</p>
      </div>
      <BonusSummaryBar
        approved={totalApproved}
        potential={totalPotential}
        underReview={underReview}
      />
      <div className="space-y-3">
        {instances.map(instance => {
          const obj = DEMO_OBJECTIVES.find(o => o.id === instance.objectiveId)!;
          return <ObjectiveCard key={instance.id} instance={instance} objective={obj} />;
        })}
      </div>
    </div>
  );
}