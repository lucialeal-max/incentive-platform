import { DEMO_INSTANCES, DEMO_OBJECTIVES, DEMO_PROFILES, DEMO_PAYOUT_RUN } from "@/lib/demo-data";
import Link from "next/link";

export default function DashboardPage() {
  const instances = DEMO_INSTANCES;
  const approved = instances.filter(i => i.status === "approved");
  const inReview = instances.filter(i => i.status === "validation");
  const rejected = instances.filter(i => i.status === "rejected");
  const total = instances.length;
  const totalPayout = approved.reduce((s, i) => s + (i.bonusAmount ?? 0), 0);
  const fmt = (n: number) => "$" + n.toLocaleString();

  // Per-person summary
  const employees = DEMO_PROFILES.filter(p => !p.isAdmin || p.jobRole === "AE / Admin");
  const perPerson = employees.map(p => {
    const inst = instances.filter(i => i.userId === p.id);
    const earned = inst.filter(i => i.status === "approved").reduce((s, i) => s + (i.bonusAmount ?? 0), 0);
    const pending = inst.filter(i => i.status === "validation").length;
    return { ...p, inst, earned, pending };
  }).filter(p => p.inst.length > 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Dashboard de incentivos</h1>
          <p className="text-sm text-gray-500 mt-0.5">Plan Comercial Q1 2026 · Marzo 2026</p>
        </div>
        <Link href="/payout"
          className="flex items-center gap-2 text-sm px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-medium">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Ver payout run
        </Link>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Aprobados",       value: approved.length, sub: "de " + total + " total",           color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
          { label: "En revision",     value: inReview.length, sub: "requieren atencion",               color: "text-amber-600",   bg: "bg-amber-50",   border: "border-amber-100" },
          { label: "Rechazados",      value: rejected.length, sub: "no cumplen condiciones",           color: "text-red-500",     bg: "bg-red-50",     border: "border-red-100" },
          { label: "Payout estimado", value: fmt(totalPayout), sub: "objetivos aprobados",             color: "text-indigo-600",  bg: "bg-indigo-50",  border: "border-indigo-100" },
        ].map(s => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-5`}>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-gray-900">Distribucion de estados</p>
          <span className="text-xs text-gray-400">{total} objetivos en total</span>
        </div>
        <div className="flex h-3 rounded-full overflow-hidden gap-px">
          <div className="bg-emerald-400 transition-all" style={{ width: (approved.length/total*100) + "%" }} />
          <div className="bg-amber-400 transition-all" style={{ width: (inReview.length/total*100) + "%" }} />
          <div className="bg-red-400 transition-all" style={{ width: (rejected.length/total*100) + "%" }} />
        </div>
        <div className="flex gap-5 mt-3 text-xs text-gray-500">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400"/>Aprobados {approved.length}</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400"/>En revision {inReview.length}</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-400"/>Rechazados {rejected.length}</span>
        </div>
      </div>

      {/* Per-person table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-900">Resumen por persona</p>
          <span className="text-xs text-gray-400">{perPerson.length} personas con objetivos</span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Empleado</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Rol</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide text-center">Obj. aprobados</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide text-center">En revision</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide text-right">Bono desbloqueado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {perPerson.sort((a,b) => b.earned - a.earned).map(p => {
              const initials = p.fullName.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase();
              const colors: Record<string, string> = { AG:"bg-purple-600", CL:"bg-indigo-600", MP:"bg-blue-600", JT:"bg-teal-600", SR:"bg-orange-600", DV:"bg-green-600" };
              return (
                <tr key={p.id} className="hover:bg-gray-50/50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${colors[initials] ?? "bg-gray-500"} flex items-center justify-center text-white text-xs font-bold`}>
                        {initials}
                      </div>
                      <span className="font-medium text-gray-900">{p.fullName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-500">{p.jobRole}</td>
                  <td className="px-5 py-3 text-center">
                    <span className="text-emerald-700 font-semibold">{p.inst.filter(i => i.status === "approved").length}</span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    {p.pending > 0 ? (
                      <span className="inline-flex items-center gap-1 text-amber-600 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"/>
                        {p.pending}
                      </span>
                    ) : <span className="text-gray-300">-</span>}
                  </td>
                  <td className="px-5 py-3 text-right font-bold text-gray-900">{fmt(p.earned)}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-indigo-50">
              <td colSpan={4} className="px-5 py-3 font-semibold text-indigo-900">Total a pagar</td>
              <td className="px-5 py-3 text-right font-bold text-indigo-900 text-base">{fmt(totalPayout)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Exceptions preview */}
      {inReview.length > 0 && (
        <div className="bg-white rounded-2xl border border-amber-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-amber-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"/>
              <p className="text-sm font-semibold text-gray-900">Excepciones pendientes</p>
            </div>
            <Link href="/exceptions" className="text-xs text-indigo-600 hover:underline">Revisar todas</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {inReview.slice(0,3).map(inst => {
              const obj = DEMO_OBJECTIVES.find(o => o.id === inst.objectiveId);
              const user = DEMO_PROFILES.find(p => p.id === inst.userId);
              const dealName = (inst.crmSnapshot?.deal_name as string) ?? "";
              return (
                <div key={inst.id} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{obj?.name}</p>
                    <p className="text-xs text-gray-400">{user?.fullName} {dealName ? "· " + dealName : ""}</p>
                  </div>
                  <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full font-medium">Pendiente</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}