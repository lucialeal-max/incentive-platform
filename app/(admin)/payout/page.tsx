"use client";
import { useState } from "react";
import { DEMO_PAYOUT_RUN, DEMO_PROFILES } from "@/lib/demo-data";

export default function PayoutPage() {
  const [approved, setApproved] = useState(false);
  const run = DEMO_PAYOUT_RUN;
  const fmt = (n: number) => "$" + n.toLocaleString();

  // Group by person
  const byPerson: Record<string, typeof run.items> = {};
  for (const item of run.items) {
    if (!byPerson[item.userId]) byPerson[item.userId] = [];
    byPerson[item.userId].push(item);
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Payout Run — Marzo 2026</h1>
          <p className="text-sm text-gray-500 mt-0.5">Plan Comercial Q1 2026</p>
        </div>
        <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${approved ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"}`}>
          {approved ? "Aprobado" : "Draft — pendiente de aprobacion"}
        </span>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
          <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wide">Total a pagar</p>
          <p className="text-2xl font-bold text-indigo-700 mt-1">{fmt(run.totalAmount)}</p>
        </div>
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Personas</p>
          <p className="text-2xl font-bold text-gray-700 mt-1">{Object.keys(byPerson).length}</p>
        </div>
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Objetivos</p>
          <p className="text-2xl font-bold text-gray-700 mt-1">{run.items.length}</p>
        </div>
      </div>

      {/* Items by person */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50">
          <p className="text-sm font-semibold text-gray-900">Detalle por persona</p>
        </div>
        <div className="divide-y divide-gray-50">
          {Object.entries(byPerson).map(([uid, items]) => {
            const user = DEMO_PROFILES.find(p => p.id === uid);
            const personTotal = items.reduce((s, i) => s + i.amount, 0);
            const initials = user?.fullName.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase() ?? "??";
            const colors: Record<string, string> = { AG:"bg-purple-600", CL:"bg-indigo-600", MP:"bg-blue-600", JT:"bg-teal-600", SR:"bg-orange-600" };
            return (
              <div key={uid} className="px-5 py-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full ${colors[initials] ?? "bg-gray-500"} flex items-center justify-center text-white text-xs font-bold`}>
                      {initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{user?.fullName}</p>
                      <p className="text-xs text-gray-400">{user?.jobRole}</p>
                    </div>
                  </div>
                  <span className="text-base font-bold text-gray-900">{fmt(personTotal)}</span>
                </div>
                <div className="ml-12 space-y-1">
                  {items.map((item, i) => (
                    <div key={i} className="flex justify-between text-xs text-gray-500">
                      <span>{item.objectiveName}</span>
                      <span className="font-medium text-gray-700">{fmt(item.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div className="px-5 py-4 bg-indigo-50 border-t border-indigo-100 flex justify-between items-center">
          <span className="font-semibold text-indigo-900">Total</span>
          <span className="text-xl font-bold text-indigo-900">{fmt(run.totalAmount)}</span>
        </div>
      </div>

      {/* Approve button */}
      {!approved ? (
        <button onClick={() => setApproved(true)}
          className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-semibold text-base hover:bg-indigo-700 transition flex items-center justify-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Aprobar payout run — {fmt(run.totalAmount)} USD
        </button>
      ) : (
        <div className="w-full py-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl font-semibold text-base flex items-center justify-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Payout aprobado — en proceso de pago
        </div>
      )}
    </div>
  );
}