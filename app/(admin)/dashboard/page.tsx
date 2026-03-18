import { DEMO_INSTANCES, DEMO_PLANS, DEMO_OBJECTIVES, DEMO_PROFILES } from "@/lib/demo-data";
import { ExceptionsQueue } from "@/components/objectives/exceptions-queue";

export default function DashboardPage() {
  const instances = DEMO_INSTANCES;
  const approved = instances.filter(i => i.status === "approved").length;
  const inReview = instances.filter(i => i.status === "validation").length;
  const rejected = instances.filter(i => i.status === "rejected").length;
  const total = instances.length;
  const totalPayout = instances
    .filter(i => i.status === "approved")
    .reduce((s, i) => s + (i.bonusAmount ?? 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Dashboard de incentivos</h1>
        <p className="text-sm text-gray-500 mt-0.5">Plan Comercial Q1 2026 · Marzo 2026</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Aprobados", value: approved, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "En revisión", value: inReview, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Rechazados", value: rejected, color: "text-red-500", bg: "bg-red-50" },
          { label: "Payout estimado", value: `$${totalPayout.toLocaleString()}`, color: "text-indigo-600", bg: "bg-indigo-50" },
        ].map(stat => (
          <div key={stat.label} className={`${stat.bg} rounded-2xl p-5`}>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <p className="text-sm font-medium text-gray-700 mb-3">Distribución de estados</p>
        <div className="flex rounded-full overflow-hidden h-3 gap-0.5">
          <div className="bg-emerald-400 transition-all" style={{ width: `${(approved/total)*100}%` }} />
          <div className="bg-amber-400 transition-all" style={{ width: `${(inReview/total)*100}%` }} />
          <div className="bg-red-400 transition-all" style={{ width: `${(rejected/total)*100}%` }} />
        </div>
        <div className="flex gap-4 mt-2 text-xs text-gray-500">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"/>Aprobados {approved}</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block"/>En revisión {inReview}</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400 inline-block"/>Rechazados {rejected}</span>
        </div>
      </div>

      <ExceptionsQueue />
    </div>
  );
}