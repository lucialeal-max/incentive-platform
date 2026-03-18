"use client";
import { useState } from "react";
import { DEMO_INSTANCES, DEMO_OBJECTIVES, DEMO_PROFILES } from "@/lib/demo-data";

export default function ExceptionsPage() {
  const exceptions = DEMO_INSTANCES.filter(i => i.status === "validation");
  const [resolved, setResolved] = useState<Record<string, "approved" | "rejected">>({});

  const FIELD_LABEL: Record<string, string> = {
    who_got_the_call: "Quien tomo la llamada", deal_stage: "Etapa del deal",
    deal_source: "Fuente del deal", percent_active_users: "% usuarios activos",
    sticky_feature_count: "Features stickies", csat_score: "CSAT",
    resolved_processes_feature_count: "Procesos resueltos", lead_status: "Estado del lead",
    days_since_handoff: "Dias desde handoff", expansion_amount: "Monto expansion",
    days_since_booked: "Dias en Booked",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Cola de revision</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {exceptions.length - Object.keys(resolved).length} casos pendientes de atencion
        </p>
      </div>

      {exceptions.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400">
          <p className="text-lg">Todo al dia</p>
          <p className="text-sm mt-1">No hay excepciones pendientes.</p>
        </div>
      )}

      <div className="space-y-4">
        {exceptions.map(inst => {
          const obj = DEMO_OBJECTIVES.find(o => o.id === inst.objectiveId)!;
          const user = DEMO_PROFILES.find(p => p.id === inst.userId)!;
          const initials = user?.fullName.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase();
          const colors: Record<string, string> = { MP:"bg-blue-600", JT:"bg-teal-600", CL:"bg-indigo-600", SR:"bg-orange-600" };
          const dealName = (inst.crmSnapshot?.deal_name as string) ?? "";
          const isResolved = resolved[inst.id];
          const routingReason = obj?.routingRules.find(r => r.result === "validation")?.reason;

          return (
            <div key={inst.id} className={`bg-white rounded-2xl border overflow-hidden transition-all ${
              isResolved === "approved" ? "border-emerald-200" :
              isResolved === "rejected" ? "border-red-200 opacity-60" :
              "border-amber-100"
            }`}>
              <div className="px-5 pt-5 pb-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl ${colors[initials ?? ""] ?? "bg-gray-500"} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                      {initials}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{user?.fullName}</p>
                      <p className="text-sm text-gray-400">{user?.jobRole} {dealName ? "· " + dealName : ""}</p>
                    </div>
                  </div>
                  {isResolved ? (
                    <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${isResolved === "approved" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
                      {isResolved === "approved" ? "Aprobado" : "Rechazado"}
                    </span>
                  ) : (
                    <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full font-medium">Pendiente</span>
                  )}
                </div>

                {/* Objective name */}
                <p className="text-sm font-medium text-gray-900 mb-1">{obj?.name}</p>

                {/* Reason */}
                {routingReason && (
                  <div className="bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mb-4">
                    <p className="text-xs font-semibold text-amber-700 mb-0.5">Motivo de revision</p>
                    <p className="text-xs text-amber-600">{routingReason}</p>
                  </div>
                )}

                {/* Conditions */}
                <div className="space-y-1.5 mb-4">
                  {inst.conditionResults.map((cr, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 ${cr.passed ? "bg-emerald-500" : "bg-red-400"}`}>
                        {cr.passed ? "+" : "-"}
                      </span>
                      <span className="text-gray-600">{FIELD_LABEL[cr.field] ?? cr.field.replace(/_/g," ")}</span>
                      <span className="text-gray-400">= <strong className="text-gray-600">{String(cr.actualValue ?? "-")}</strong></span>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                {!isResolved && (
                  <div className="flex gap-2 pt-3 border-t border-gray-50">
                    <button onClick={() => setResolved(r => ({ ...r, [inst.id]: "approved" }))}
                      className="flex-1 text-sm py-2.5 px-4 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition font-medium flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Aprobar excepcion
                    </button>
                    <button onClick={() => setResolved(r => ({ ...r, [inst.id]: "rejected" }))}
                      className="flex-1 text-sm py-2.5 px-4 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Rechazar
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}