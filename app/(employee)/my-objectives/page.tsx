"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/session";
import { DEMO_INSTANCES, DEMO_OBJECTIVES } from "@/lib/demo-data";
import Link from "next/link";

const STATUS_LABEL: Record<string, string> = {
  approved: "Aprobado", validation: "En revision", rejected: "Rechazado", pending: "Pendiente",
};
const STATUS_COLOR: Record<string, string> = {
  approved: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  validation: "bg-amber-50 text-amber-700 border border-amber-200",
  rejected: "bg-red-50 text-red-600 border border-red-200",
  pending: "bg-gray-100 text-gray-500 border border-gray-200",
};
const STATUS_DOT: Record<string, string> = {
  approved: "bg-emerald-500", validation: "bg-amber-500", rejected: "bg-red-500", pending: "bg-gray-400",
};

export default function MyObjectivesPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const s = getSession();
    if (!s) { router.push("/login"); return; }
    setUserId(s.id);
    setUserName(s.fullName);
  }, [router]);

  if (!userId) return null;

  const instances = DEMO_INSTANCES.filter(i => i.userId === userId);
  const totalApproved = instances.filter(i => i.status === "approved").reduce((s, i) => s + (i.bonusAmount ?? 0), 0);
  const totalPotential = instances.filter(i => i.status !== "rejected").reduce((s, i) => s + (i.bonusAmount ?? 0), 0);
  const inReview = instances.filter(i => i.status === "validation").length;
  const fmt = (n: number) => "$" + n.toLocaleString();

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Mis objetivos</h1>
        <p className="text-sm text-gray-500 mt-0.5">Marzo 2026 — {userName}</p>
      </div>

      {/* Bonus summary */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-500 rounded-2xl p-6 text-white">
        <p className="text-indigo-200 text-xs uppercase tracking-widest mb-1">Bono desbloqueado este mes</p>
        <p className="text-4xl font-bold">{fmt(totalApproved)}</p>
        <div className="flex gap-5 mt-3 text-sm">
          <span className="text-indigo-200">Potencial: <strong className="text-white">{fmt(totalPotential)}</strong></span>
          {inReview > 0 && <span className="text-amber-300">{inReview} en revision</span>}
        </div>
        {/* Progress bar */}
        {totalPotential > 0 && (
          <div className="mt-4 h-1.5 bg-indigo-400/40 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full transition-all" style={{ width: Math.min((totalApproved/totalPotential)*100, 100) + "%" }} />
          </div>
        )}
      </div>

      {/* List */}
      {instances.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400">
          <p className="text-lg font-medium">Sin objetivos asignados</p>
          <p className="text-sm mt-1">No hay objetivos para este periodo.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {instances.map(instance => {
            const obj = DEMO_OBJECTIVES.find(o => o.id === instance.objectiveId)!;
            const passed = instance.conditionResults.filter(c => c.passed).length;
            const total = instance.conditionResults.length;
            const dealName = (instance.crmSnapshot?.deal_name as string) ?? "";
            return (
              <Link key={instance.id} href={"/my-objectives/" + instance.id}
                className="block bg-white rounded-2xl border border-gray-100 p-5 hover:border-indigo-200 hover:shadow-sm transition-all group">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${STATUS_DOT[instance.status] ?? "bg-gray-400"}`} />
                      <p className="font-medium text-gray-900 truncate">{obj?.name}</p>
                    </div>
                    {dealName && <p className="text-sm text-gray-400 ml-4">{dealName}</p>}
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {instance.status === "approved" && instance.bonusAmount != null && (
                      <span className="text-sm font-bold text-emerald-600">{fmt(instance.bonusAmount)}</span>
                    )}
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLOR[instance.status] ?? "bg-gray-100 text-gray-500"}`}>
                      {STATUS_LABEL[instance.status] ?? instance.status}
                    </span>
                  </div>
                </div>
                {total > 0 && (
                  <div className="mt-3 ml-4">
                    <div className="flex justify-between text-xs text-gray-300 mb-1">
                      <span>{passed}/{total} condiciones cumplidas</span>
                      <span>{Math.round((passed/total)*100)}%</span>
                    </div>
                    <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${instance.status === "approved" ? "bg-emerald-400" : instance.status === "validation" ? "bg-amber-400" : "bg-red-400"}`}
                        style={{ width: (passed/total*100) + "%" }} />
                    </div>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}