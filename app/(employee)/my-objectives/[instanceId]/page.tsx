import { DEMO_INSTANCES, DEMO_OBJECTIVES } from "@/lib/demo-data";
import { ConditionResultRow } from "@/components/objectives/condition-result-row";
import { StatusBadge } from "@/components/ui/status-badge";
import { notFound } from "next/navigation";

export default function ObjectiveDetailPage({ params }: { params: { instanceId: string } }) {
  const instance = DEMO_INSTANCES.find(i => i.id === params.instanceId);
  if (!instance) notFound();
  const objective = DEMO_OBJECTIVES.find(o => o.id === instance.objectiveId)!;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <a href="/my-objectives" className="text-sm text-indigo-600 hover:underline">← Mis objetivos</a>
        <h1 className="text-xl font-semibold text-gray-900 mt-2">{objective.name}</h1>
        <p className="text-sm text-gray-500 mt-1">{objective.description}</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Estado</span>
          <StatusBadge status={instance.status} />
        </div>
        {instance.bonusAmount != null && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Bono desbloqueado</span>
            <span className="text-lg font-semibold text-emerald-600">
              ${instance.bonusAmount.toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {instance.status === "validation" && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-sm font-medium text-amber-800">🔍 En revisión manual</p>
          <p className="text-sm text-amber-700 mt-1">
            Este objetivo está siendo revisado por tu manager. Te notificaremos cuando haya una resolución.
          </p>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Condiciones</h2>
        <div className="space-y-2">
          {instance.conditionResults.map((cr, i) => (
            <ConditionResultRow key={i} result={cr} />
          ))}
        </div>
      </div>
    </div>
  );
}