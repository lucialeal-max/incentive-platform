import { DEMO_INSTANCES, DEMO_OBJECTIVES, DEMO_PROFILES } from "@/lib/demo-data";
import { StatusBadge } from "@/components/ui/status-badge";

export default function ExceptionsPage() {
  const exceptions = DEMO_INSTANCES.filter(i => i.status === "validation");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Cola de revisión</h1>
        <p className="text-sm text-gray-500 mt-0.5">{exceptions.length} casos requieren atención</p>
      </div>

      <div className="space-y-3">
        {exceptions.map(inst => {
          const obj = DEMO_OBJECTIVES.find(o => o.id === inst.objectiveId)!;
          const user = DEMO_PROFILES.find(p => p.id === inst.userId)!;
          return (
            <div key={inst.id} className="bg-white rounded-2xl border border-amber-100 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-gray-900">{obj?.name}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{user?.fullName} · {user?.jobRole}</p>
                </div>
                <StatusBadge status={inst.status} />
              </div>

              <div className="mt-3 space-y-1">
                {inst.conditionResults.map((cr, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className={cr.passed ? "text-emerald-500" : "text-red-400"}>
                      {cr.passed ? "✓" : "✗"}
                    </span>
                    <span className="text-gray-600">{cr.field.replace(/_/g," ")}</span>
                    <span className="text-gray-400 text-xs">= {String(cr.actualValue ?? "—")}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mt-4">
                <button className="flex-1 text-sm py-2 px-4 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition font-medium">
                  ✓ Aprobar excepción
                </button>
                <button className="flex-1 text-sm py-2 px-4 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium">
                  ✗ Rechazar
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}