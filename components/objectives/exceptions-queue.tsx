import { DEMO_INSTANCES, DEMO_OBJECTIVES, DEMO_PROFILES } from "@/lib/demo-data";
import { StatusBadge } from "@/components/ui/status-badge";
import Link from "next/link";

export function ExceptionsQueue() {
  const exceptions = DEMO_INSTANCES.filter(i => i.status === "validation").slice(0, 3);
  if (exceptions.length === 0) return null;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-900">Cola de revisión</p>
        <Link href="/exceptions" className="text-xs text-indigo-600 hover:underline">Ver todas</Link>
      </div>
      <div className="divide-y divide-gray-50">
        {exceptions.map(inst => {
          const obj = DEMO_OBJECTIVES.find(o => o.id === inst.objectiveId);
          const user = DEMO_PROFILES.find(p => p.id === inst.userId);
          return (
            <div key={inst.id} className="px-5 py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{obj?.name}</p>
                <p className="text-xs text-gray-500">{user?.fullName}</p>
              </div>
              <StatusBadge status={inst.status} />
            </div>
          );
        })}
      </div>
    </div>
  );
}