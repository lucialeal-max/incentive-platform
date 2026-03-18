import type { ObjectiveInstance, Objective } from "@/lib/domain/types";
import { StatusBadge } from "@/components/ui/status-badge";
import Link from "next/link";

export function ObjectiveCard({ instance, objective }: { instance: ObjectiveInstance; objective: Objective }) {
  const passed = instance.conditionResults.filter(c => c.passed).length;
  const total = instance.conditionResults.length;

  return (
    <Link href={"/my-objectives/" + instance.id}
      className="block bg-white rounded-2xl border border-gray-100 p-5 hover:border-indigo-200 hover:shadow-sm transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 truncate">{objective.name}</p>
          <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{objective.description}</p>
        </div>
        <StatusBadge status={instance.status} />
      </div>

      {total > 0 && (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>{passed}/{total} condiciones</span>
            <span>{Math.round((passed/total)*100)}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={"h-full rounded-full transition-all " + (instance.status === "approved" ? "bg-emerald-400" : instance.status === "validation" ? "bg-amber-400" : "bg-indigo-400")}
              style={{ width: (passed/total*100) + "%" }}
            />
          </div>
        </div>
      )}

      {instance.bonusAmount != null && instance.status === "approved" && (
        <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
          <span className="text-xs text-gray-400">Bono desbloqueado</span>
          <span className="text-sm font-semibold text-emerald-600">${instance.bonusAmount.toLocaleString()}</span>
        </div>
      )}
    </Link>
  );
}