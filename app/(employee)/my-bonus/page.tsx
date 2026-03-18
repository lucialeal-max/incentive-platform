"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/session";
import { DEMO_INSTANCES, DEMO_OBJECTIVES } from "@/lib/demo-data";
import Link from "next/link";

export default function MyBonusPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const s = getSession();
    if (!s) { router.push("/login"); return; }
    setUserId(s.id);
  }, [router]);

  if (!userId) return null;

  const instances = DEMO_INSTANCES.filter(i => i.userId === userId);
  const approved  = instances.filter(i => i.status === "approved");
  const inReview  = instances.filter(i => i.status === "validation");
  const rejected  = instances.filter(i => i.status === "rejected");
  const totalApproved = approved.reduce((s, i) => s + (i.bonusAmount ?? 0), 0);
  const fmt = (n: number) => "$" + n.toLocaleString();

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Mi bono</h1>
        <p className="text-sm text-gray-500 mt-0.5">Marzo 2026</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 col-span-1">
          <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wide">Desbloqueado</p>
          <p className="text-3xl font-bold text-emerald-700 mt-1">{fmt(totalApproved)}</p>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
          <p className="text-xs text-amber-600 font-semibold uppercase tracking-wide">En revision</p>
          <p className="text-3xl font-bold text-amber-600 mt-1">{inReview.length}</p>
          <p className="text-xs text-amber-500 mt-0.5">objetivo{inReview.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Rechazados</p>
          <p className="text-3xl font-bold text-gray-400 mt-1">{rejected.length}</p>
          <p className="text-xs text-gray-400 mt-0.5">objetivo{rejected.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50">
          <h2 className="text-sm font-semibold text-gray-900">Detalle del periodo</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Objetivo</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Deal</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide text-right">Monto</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide text-right">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {instances.map(inst => {
              const obj = DEMO_OBJECTIVES.find(o => o.id === inst.objectiveId)!;
              const dealName = (inst.crmSnapshot?.deal_name as string) ?? "-";
              return (
                <tr key={inst.id} className="hover:bg-gray-50/50">
                  <td className="px-5 py-3">
                    <Link href={"/my-objectives/" + inst.id} className="text-gray-900 hover:text-indigo-600 transition font-medium line-clamp-1">
                      {obj?.name ?? "-"}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-gray-400 text-xs">{dealName}</td>
                  <td className="px-5 py-3 text-right font-semibold text-gray-900">
                    {inst.bonusAmount != null ? fmt(inst.bonusAmount) : "-"}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      inst.status === "approved" ? "bg-emerald-50 text-emerald-700" :
                      inst.status === "validation" ? "bg-amber-50 text-amber-700" :
                      "bg-red-50 text-red-600"
                    }`}>
                      {inst.status === "approved" ? "Aprobado" : inst.status === "validation" ? "En revision" : "Rechazado"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-indigo-50">
              <td colSpan={2} className="px-5 py-3 font-semibold text-indigo-900 text-sm">Total desbloqueado</td>
              <td className="px-5 py-3 text-right font-bold text-indigo-900 text-base">{fmt(totalApproved)}</td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}