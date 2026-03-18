import { DEMO_INSTANCES, DEMO_OBJECTIVES } from "@/lib/demo-data";

export default function MyBonusPage() {
  const instances = DEMO_INSTANCES.filter(i => i.userId === "00000000-0000-0000-0000-000000000003");
  const approved = instances.filter(i => i.status === "approved");
  const inReview = instances.filter(i => i.status === "validation");
  const totalApproved = approved.reduce((s, i) => s + (i.bonusAmount ?? 0), 0);

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Mi bono</h1>
        <p className="text-sm text-gray-500 mt-0.5">Período: Marzo 2026</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Desbloqueado</p>
          <p className="text-3xl font-bold text-emerald-600 mt-1">${totalApproved.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wide">En revisión</p>
          <p className="text-3xl font-bold text-amber-500 mt-1">{inReview.length} obj.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Detalle</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 border-b border-gray-50">
              <th className="pb-2 font-medium">Objetivo</th>
              <th className="pb-2 font-medium text-right">Monto</th>
              <th className="pb-2 font-medium text-right">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {instances.map(inst => {
              const obj = DEMO_OBJECTIVES.find(o => o.id === inst.objectiveId)!;
              return (
                <tr key={inst.id}>
                  <td className="py-3 text-gray-700">{obj?.name ?? "—"}</td>
                  <td className="py-3 text-right text-gray-900 font-medium">
                    {inst.bonusAmount != null ? `$${inst.bonusAmount.toLocaleString()}` : "—"}
                  </td>
                  <td className="py-3 text-right">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      inst.status === "approved" ? "bg-emerald-50 text-emerald-700" :
                      inst.status === "validation" ? "bg-amber-50 text-amber-700" :
                      "bg-red-50 text-red-700"
                    }`}>
                      {inst.status === "approved" ? "✓ Aprobado" :
                       inst.status === "validation" ? "⏳ En revisión" : "✗ Rechazado"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}