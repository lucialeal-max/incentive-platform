"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/session";
import { getStore, saveAssignments } from "@/lib/objectives-store";
import { DEMO_PROFILES } from "@/lib/demo-data";
import Link from "next/link";

const TEAMS = [
  { id: "ae-team",  name: "Equipo AE",      members: ["Maria Perez","Carlos Lopez"] },
  { id: "cs-team",  name: "Equipo CS",       members: ["Juan Torres","Diego Vega"] },
  { id: "bdr-team", name: "Equipo BDR",      members: ["Sofia Ramos"] },
  { id: "all",      name: "Todos los roles", members: [] },
];

export function AssignObjective({ objectiveId }) {
  const router = useRouter();
  const [obj, setObj] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const s = getSession();
    if (!s || !s.isAdmin) { router.push("/login"); return; }
    const store = getStore();
    const found = store.objectives.find((o) => o.id === objectiveId);
    setObj(found || null);
    const existing = store.assignments.filter((a) => a.objectiveId === objectiveId);
    setSelectedUsers(existing.filter((a) => a.assigneeType === "user").map((a) => a.assigneeId));
    setSelectedTeams(existing.filter((a) => a.assigneeType === "team").map((a) => a.assigneeId));
  }, [objectiveId, router]);

  function toggleUser(id) {
    setSelectedUsers((u) => u.includes(id) ? u.filter((x) => x !== id) : [...u, id]);
  }
  function toggleTeam(id) {
    setSelectedTeams((t) => t.includes(id) ? t.filter((x) => x !== id) : [...t, id]);
  }

  function handleSave() {
    const userAssignments = selectedUsers.map((uid) => {
      const p = DEMO_PROFILES.find((p) => p.id === uid);
      return { objectiveId, assigneeType: "user", assigneeId: uid, assigneeName: p ? p.fullName : uid };
    });
    const teamAssignments = selectedTeams.map((tid) => {
      const t = TEAMS.find((t) => t.id === tid);
      return { objectiveId, assigneeType: "team", assigneeId: tid, assigneeName: t ? t.name : tid };
    });
    saveAssignments(objectiveId, [...userAssignments, ...teamAssignments]);
    setSaved(true);
    setTimeout(() => router.push("/objectives"), 1200);
  }

  const employees = DEMO_PROFILES;

  const colors = { AG:"bg-purple-600", CL:"bg-indigo-600", MP:"bg-blue-600", JT:"bg-teal-600", SR:"bg-orange-600", DV:"bg-green-600" };
  function initials(name) { return name.split(" ").map((n) => n[0]).join("").slice(0,2).toUpperCase(); }

  if (!obj) return <div className="p-8 text-gray-400">Objetivo no encontrado.</div>;

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/objectives" className="text-indigo-600 hover:underline text-sm flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
          Objetivos
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-semibold text-gray-900">Asignar objetivo</h1>
      </div>

      <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3">
        <p className="text-sm font-semibold text-indigo-900">{obj.name}</p>
        <p className="text-xs text-indigo-600 mt-0.5">{obj.description}</p>
      </div>

      {saved && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm text-emerald-700 font-medium flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
          Asignaciones guardadas. Redirigiendo...
        </div>
      )}

      {/* Usuarios individuales */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Usuarios individuales</h2>
        <div className="space-y-2">
          {employees.map((p) => {
            const ini = initials(p.fullName);
            const bg = colors[ini] || "bg-gray-500";
            const checked = selectedUsers.includes(p.id);
            return (
              <button key={p.id} onClick={() => toggleUser(p.id)}
                className={"w-full flex items-center gap-3 p-3 rounded-xl border transition " + (checked ? "border-indigo-200 bg-indigo-50" : "border-gray-100 hover:border-gray-200 hover:bg-gray-50")}>
                <div className={"w-9 h-9 rounded-full " + bg + " flex items-center justify-center text-white text-xs font-bold flex-shrink-0"}>
                  {ini}
                </div>
                <div className="flex-1 text-left">
                  <p className={"text-sm font-medium " + (checked ? "text-indigo-900" : "text-gray-900")}>{p.fullName}</p>
                  <p className="text-xs text-gray-400">{p.jobRole}</p>
                </div>
                <div className={"w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition " + (checked ? "border-indigo-600 bg-indigo-600" : "border-gray-300")}>
                  {checked && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Equipos */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Equipos</h2>
        <div className="space-y-2">
          {TEAMS.map((team) => {
            const checked = selectedTeams.includes(team.id);
            return (
              <button key={team.id} onClick={() => toggleTeam(team.id)}
                className={"w-full flex items-center gap-3 p-3 rounded-xl border transition " + (checked ? "border-indigo-200 bg-indigo-50" : "border-gray-100 hover:border-gray-200 hover:bg-gray-50")}>
                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                </div>
                <div className="flex-1 text-left">
                  <p className={"text-sm font-medium " + (checked ? "text-indigo-900" : "text-gray-900")}>{team.name}</p>
                  {team.members.length > 0 && <p className="text-xs text-gray-400">{team.members.join(", ")}</p>}
                </div>
                <div className={"w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition " + (checked ? "border-indigo-600 bg-indigo-600" : "border-gray-300")}>
                  {checked && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Summary + save */}
      {(selectedUsers.length + selectedTeams.length) > 0 && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3 text-xs text-indigo-700">
          Asignando a: {selectedUsers.map((id) => { const p = DEMO_PROFILES.find((p) => p.id === id); return p ? p.fullName : id; }).concat(selectedTeams.map((id) => { const t = TEAMS.find((t) => t.id === id); return t ? t.name : id; })).join(", ")}
        </div>
      )}

      <div className="flex gap-3">
        <button onClick={handleSave} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition text-sm">
          Guardar asignaciones
        </button>
        <Link href="/objectives" className="px-6 py-3 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition text-sm text-center">
          Cancelar
        </Link>
      </div>
    </div>
  );
}