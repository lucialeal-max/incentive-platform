"use client";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/session";
import { DEMO_INSTANCES, DEMO_OBJECTIVES } from "@/lib/demo-data";
import Link from "next/link";

const FIELD_LABEL: Record<string, string> = {
  who_got_the_call: "Quien tomo la llamada", deal_stage: "Etapa del deal",
  deal_source: "Fuente del deal", percent_active_users: "% usuarios activos",
  sticky_feature_count: "Features stickies adoptadas", date_ready_to_success: "Fecha de transicion a Success",
  csat_score: "CSAT Score", resolved_processes_feature_count: "Procesos resueltos con la plataforma",
  lead_status: "Estado del lead", days_since_handoff: "Dias desde handoff",
  expansion_amount: "Monto de expansion", days_since_booked: "Dias en estado Booked",
};

type Props = { params: Promise<{ instanceId: string }> };

export default function ObjectiveDetailPage({ params }: Props) {
  const { instanceId } = use(params);
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const s = getSession();
    if (!s) { router.push("/login"); return; }
    setReady(true);
  }, [router]);

  if (!ready) return null;

  const instance = DEMO_INSTANCES.find(i => i.id === instanceId);
  if (!instance) return <div className="p-8 text-gray-400">Objetivo no encontrado.</div>;
  const obj = DEMO_OBJECTIVES.find(o => o.id === instance.objectiveId)!;
  const fmt = (n: number) => "$" + n.toLocaleString();
  const dealName = (instance.crmSnapshot?.deal_name as string) ?? "";

  const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    approved:   { label: "Aprobado",     color: "text-emerald-700", bg: "bg-emerald-50 border border-emerald-200" },
    validation: { label: "En revision",  color: "text-amber-700",   bg: "bg-amber-50 border border-amber-200" },
    rejected:   { label: "Rechazado",    color: "text-red-600",     bg: "bg-red-50 border border-red-200" },
    pending:    { label: "Pendiente",    color: "text-gray-600",    bg: "bg-gray-50 border border-gray-200" },
  };
  const sc = statusConfig[instance.status] ?? statusConfig.pending;

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <Link href="/my-objectives" className="text-sm text-indigo-600 hover:underline flex items-center gap-1 mb-3">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Mis objetivos
        </Link>
        <h1 className="text-xl font-semibold text-gray-900">{obj?.name}</h1>
        {dealName && <p className="text-sm text-gray-400 mt-0.5">{dealName}</p>}
        <p className="text-sm text-gray-500 mt-2 leading-relaxed">{obj?.description}</p>
      </div>

      {/* Status card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Estado del objetivo</span>
          <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${sc.bg} ${sc.color}`}>{sc.label}</span>
        </div>
        {instance.bonusAmount != null && (
          <div className="flex items-center justify-between pt-3 border-t border-gray-50">
            <span className="text-sm font-medium text-gray-700">Bono desbloqueado</span>
            <span className="text-2xl font-bold text-emerald-600">{fmt(instance.bonusAmount)}</span>
          </div>
        )}
      </div>

      {/* Review notice */}
      {instance.status === "validation" && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex gap-3">
            <span className="text-amber-500 text-lg">⏳</span>
            <div>
              <p className="text-sm font-semibold text-amber-900">Objetivo en revision manual</p>
              <p className="text-sm text-amber-700 mt-1">
                Tu manager esta revisando este objetivo. Te notificaremos cuando haya una resolucion. Esto suele resolverse dentro de 24-48 horas habiles.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Conditions */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Condiciones evaluadas</h2>
        <div className="space-y-2.5">
          {instance.conditionResults.map((cr, i) => (
            <div key={i} className={`flex items-start gap-3 p-3.5 rounded-xl ${cr.passed ? "bg-emerald-50" : "bg-red-50"}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${cr.passed ? "bg-emerald-500" : "bg-red-400"}`}>
                <span className="text-white text-xs font-bold">{cr.passed ? "+" : "-"}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${cr.passed ? "text-emerald-900" : "text-red-900"}`}>
                  {FIELD_LABEL[cr.field] ?? cr.field.replace(/_/g," ")}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Valor registrado: <strong className="text-gray-700">{String(cr.actualValue ?? "sin dato")}</strong>
                  {cr.expectedValue != null && (
                    <span className="ml-2 text-gray-400">· requerido: {Array.isArray(cr.expectedValue) ? cr.expectedValue.join(", ") : String(cr.expectedValue)}</span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CRM snapshot */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Datos del CRM al momento de evaluacion</h2>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(instance.crmSnapshot).filter(([k]) => k !== "deal_name").map(([k, v]) => (
            <div key={k} className="bg-gray-50 rounded-lg px-3 py-2">
              <p className="text-xs text-gray-400">{FIELD_LABEL[k] ?? k.replace(/_/g," ")}</p>
              <p className="text-sm font-medium text-gray-800 truncate">{String(v)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}