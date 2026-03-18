import { DEMO_INSTANCES, DEMO_OBJECTIVES } from "@/lib/demo-data";
import Link from "next/link";
import { notFound } from "next/navigation";

const FL: Record<string, string> = {
  who_got_the_call: "Quien tomo la llamada", deal_stage: "Etapa del deal",
  deal_source: "Fuente del deal", percent_active_users: "% usuarios activos",
  sticky_feature_count: "Features stickies", date_ready_to_success: "Fecha de exito",
  csat_score: "CSAT", resolved_processes_feature_count: "Procesos resueltos",
  lead_status: "Estado del lead", days_since_handoff: "Dias desde handoff",
};

type Props = { params: Promise<{ instanceId: string }> };

export default async function Page({ params }: Props) {
  const { instanceId } = await params;
  const instance = DEMO_INSTANCES.find(i => i.id === instanceId);
  if (!instance) notFound();
  const obj = DEMO_OBJECTIVES.find(o => o.id === instance.objectiveId)!;
  const fmt = (n: number) => "$" + n.toLocaleString();
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <Link href="/my-objectives" className="text-sm text-indigo-600 hover:underline">Mis objetivos</Link>
        <h1 className="text-xl font-semibold text-gray-900 mt-2">{obj?.name}</h1>
        <p className="text-sm text-gray-500 mt-1">{obj?.description}</p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700 font-medium">Estado</span>
          <span className={"text-xs font-medium px-2.5 py-1 rounded-full " + (instance.status === "approved" ? "bg-emerald-50 text-emerald-700" : instance.status === "validation" ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-600")}>
            {instance.status === "approved" ? "Aprobado" : instance.status === "validation" ? "En revision" : "Rechazado"}
          </span>
        </div>
        {instance.bonusAmount != null && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700 font-medium">Bono desbloqueado</span>
            <span className="text-lg font-semibold text-emerald-600">{fmt(instance.bonusAmount)}</span>
          </div>
        )}
      </div>
      {instance.status === "validation" && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-sm font-medium text-amber-800">En revision manual</p>
          <p className="text-sm text-amber-700 mt-1">Tu manager esta revisando este objetivo.</p>
        </div>
      )}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Condiciones</h2>
        <div className="space-y-2">
          {instance.conditionResults.map((cr, i) => (
            <div key={i} className={"flex items-center gap-3 p-3 rounded-xl " + (cr.passed ? "bg-emerald-50" : "bg-red-50")}>
              <span className={cr.passed ? "text-emerald-500" : "text-red-400"}>{cr.passed ? "OK" : "NO"}</span>
              <div>
                <p className={"text-sm font-medium " + (cr.passed ? "text-emerald-900" : "text-red-900")}>{FL[cr.field] ?? cr.field.replace(/_/g," ")}</p>
                <p className="text-xs text-gray-500">Valor: <strong>{String(cr.actualValue ?? "-")}</strong></p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}