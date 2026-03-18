"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/session";
import { DEMO_INSTANCES, DEMO_OBJECTIVES, DEMO_PROFILES, DEMO_PAYOUT_RUN } from "@/lib/demo-data";

function downloadCSV(filename, rows) {
  const csv = rows.map((r) => r.map((v) => '"' + String(v).replace(/"/g, '""') + '"').join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

export default function ExportPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const s = getSession();
    if (!s || !s.isAdmin) { router.push("/login"); return; }
    setReady(true);
  }, [router]);

  function exportInstances() {
    const headers = ["Empleado","Email","Rol","Objetivo","Tipo","Estado","Bono USD","Deal/Cliente","Periodo"];
    const rows = DEMO_INSTANCES.map((inst) => {
      const user = DEMO_PROFILES.find((p) => p.id === inst.userId);
      const obj  = DEMO_OBJECTIVES.find((o) => o.id === inst.objectiveId);
      return [
        user?.fullName ?? "", user?.email ?? "", user?.jobRole ?? "",
        obj?.name ?? "", obj?.type ?? "",
        inst.status, inst.bonusAmount ?? 0,
        inst.crmSnapshot?.deal_name ?? "",
        "03/2026",
      ];
    });
    downloadCSV("incentivos-detalle-marzo-2026.csv", [headers, ...rows]);
  }

  function exportPayout() {
    const headers = ["Empleado","Email","Objetivo","Monto USD","Periodo"];
    const rows = DEMO_PAYOUT_RUN.items.map((item) => {
      const user = DEMO_PROFILES.find((p) => p.id === item.userId);
      return [item.userName, user?.email ?? "", item.objectiveName, item.amount, "03/2026"];
    });
    rows.push(["TOTAL","","",DEMO_PAYOUT_RUN.totalAmount,""]);
    downloadCSV("payout-run-marzo-2026.csv", [headers, ...rows]);
  }

  function exportSummary() {
    const headers = ["Empleado","Email","Rol","Aprobados","En revision","Rechazados","Bono total USD"];
    const rows = DEMO_PROFILES.map((p) => {
      const inst = DEMO_INSTANCES.filter((i) => i.userId === p.id);
      const approved = inst.filter((i) => i.status === "approved");
      return [
        p.fullName, p.email, p.jobRole,
        approved.length,
        inst.filter((i) => i.status === "validation").length,
        inst.filter((i) => i.status === "rejected").length,
        approved.reduce((s,i) => s + (i.bonusAmount ?? 0), 0),
      ];
    });
    downloadCSV("resumen-equipo-marzo-2026.csv", [headers, ...rows]);
  }

  if (!ready) return null;

  const totalApproved = DEMO_INSTANCES.filter((i) => i.status === "approved").reduce((s,i) => s + (i.bonusAmount ?? 0), 0);
  const fmt = (n) => "$" + n.toLocaleString();

  const exports = [
    {
      title: "Detalle de instancias",
      description: "Todos los objetivos evaluados por persona: estado, condiciones y monto de bono.",
      icon: (
        <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
      ),
      stat: DEMO_INSTANCES.length + " registros",
      action: exportInstances,
      filename: "incentivos-detalle-marzo-2026.csv",
    },
    {
      title: "Resumen por equipo",
      description: "Una fila por persona con totales de aprobados, en revision y bono acumulado.",
      icon: (
        <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
      ),
      stat: DEMO_PROFILES.length + " personas",
      action: exportSummary,
      filename: "resumen-equipo-marzo-2026.csv",
    },
    {
      title: "Payout run",
      description: "Lista de pagos a procesar este periodo con monto por objetivo y total.",
      icon: (
        <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
        </svg>
      ),
      stat: fmt(DEMO_PAYOUT_RUN.totalAmount) + " total",
      action: exportPayout,
      filename: "payout-run-marzo-2026.csv",
    },
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Exportar datos</h1>
        <p className="text-sm text-gray-500 mt-0.5">Descarga los reportes del periodo en formato CSV.</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Instancias totales", value: DEMO_INSTANCES.length },
          { label: "Aprobadas", value: DEMO_INSTANCES.filter((i) => i.status === "approved").length },
          { label: "Bono aprobado", value: fmt(totalApproved) },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Export cards */}
      <div className="space-y-3">
        {exports.map((exp) => (
          <div key={exp.title} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-5">
            <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
              {exp.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900">{exp.title}</p>
              <p className="text-sm text-gray-500 mt-0.5">{exp.description}</p>
              <p className="text-xs text-gray-300 mt-1 font-mono">{exp.filename}</p>
            </div>
            <div className="flex flex-col items-end gap-2 flex-shrink-0">
              <span className="text-xs font-medium text-gray-500">{exp.stat}</span>
              <button onClick={exp.action}
                className="flex items-center gap-1.5 text-sm px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-medium">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
                Descargar CSV
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
        <p className="text-xs text-gray-400">Los archivos CSV son compatibles con Excel, Google Sheets y cualquier herramienta de BI. El periodo actual es Marzo 2026.</p>
      </div>
    </div>
  );
}