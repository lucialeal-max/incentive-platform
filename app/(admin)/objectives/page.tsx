"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/session";
import { getStore } from "@/lib/objectives-store";
import type { Objective } from "@/lib/domain/types";
import Link from "next/link";

const TYPE_LABEL = { boolean:"Boolean", percentage:"Porcentaje", numeric:"Numerico", status:"Status" };
const TYPE_COLOR = { boolean:"bg-blue-50 text-blue-700", percentage:"bg-purple-50 text-purple-700", numeric:"bg-teal-50 text-teal-700", status:"bg-orange-50 text-orange-700" };

export default function ObjectivesPage() {
  const router = useRouter();
  const [objectives, setObjectives] = useState([]);
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const s = getSession();
    if (!s || !s.isAdmin) { router.push("/login"); return; }
    const store = getStore();
    setObjectives(store.objectives);
    setAssignments(store.assignments);
  }, [router]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Objetivos e incentivos</h1>
          <p className="text-sm text-gray-500 mt-0.5">Plan Comercial Q1 2026</p>
        </div>
        <Link href="/objectives/new"
          className="flex items-center gap-2 text-sm px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-medium">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
          </svg>
          Nuevo objetivo
        </Link>
      </div>

      <div className="space-y-3">
        {objectives.map((obj) => {
          const assigned = assignments.filter((a) => a.objectiveId === obj.id);
          const typeLabel = TYPE_LABEL[obj.type] || obj.type;
          const typeColor = TYPE_COLOR[obj.type] || "bg-gray-100 text-gray-600";
          const bf = obj.bonusFormula;
          const bonusSummary = bf.type === "fixed"
            ? "Bono fijo: $" + bf.amount.toLocaleString()
            : bf.type === "percentage_of_field"
            ? "Bono: " + bf.percentage + "% del " + bf.field.toUpperCase()
            : "Bono condicional";
          return (
            <div key={obj.id} className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={"text-xs font-semibold px-2 py-0.5 rounded-full " + typeColor}>{typeLabel}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900">{obj.name}</h3>
                  <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{obj.description}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link href={"/objectives/" + obj.id + "/assign"}
                    className="text-xs px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition">
                    Asignar
                  </Link>
                  <Link href={"/objectives/" + obj.id + "/edit"}
                    className="text-xs px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition font-medium">
                    Editar
                  </Link>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
                <span className="text-xs text-gray-400">{bonusSummary}</span>
                <div className="flex flex-wrap gap-1">
                  {assigned.length === 0 && <span className="text-xs text-gray-300 italic">Sin asignar</span>}
                  {assigned.slice(0,3).map((a, i) => (
                    <span key={i} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">{a.assigneeName}</span>
                  ))}
                  {assigned.length > 3 && (
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">+{assigned.length - 3} mas</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}