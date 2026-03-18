"use client";
import type { Objective, ConditionGroup } from "./domain/types";
import { DEMO_OBJECTIVES as INITIAL } from "./demo-data";

export interface Assignment {
  id: string;
  objectiveId: string;
  assigneeType: "user" | "team";
  assigneeId: string;
  assigneeName: string;
}

export interface ObjectiveStore {
  objectives: Objective[];
  assignments: Assignment[];
}

const KEY = "incentive_objectives_store";

function defaultStore(): ObjectiveStore {
  return {
    objectives: INITIAL,
    assignments: [
      { id: "a1", objectiveId: "20000000-0000-0000-0000-000000000001", assigneeType: "user",  assigneeId: "00000000-0000-0000-0000-000000000003", assigneeName: "Maria Perez" },
      { id: "a2", objectiveId: "20000000-0000-0000-0000-000000000001", assigneeType: "user",  assigneeId: "00000000-0000-0000-0000-000000000002", assigneeName: "Carlos Lopez" },
      { id: "a3", objectiveId: "20000000-0000-0000-0000-000000000002", assigneeType: "team",  assigneeId: "cs-team",                             assigneeName: "Equipo CS" },
      { id: "a4", objectiveId: "20000000-0000-0000-0000-000000000003", assigneeType: "user",  assigneeId: "00000000-0000-0000-0000-000000000004", assigneeName: "Juan Torres" },
      { id: "a5", objectiveId: "20000000-0000-0000-0000-000000000004", assigneeType: "team",  assigneeId: "bdr-team",                            assigneeName: "Equipo BDR" },
      { id: "a6", objectiveId: "20000000-0000-0000-0000-000000000005", assigneeType: "user",  assigneeId: "00000000-0000-0000-0000-000000000003", assigneeName: "Maria Perez" },
    ],
  };
}

export function getStore(): ObjectiveStore {
  if (typeof window === "undefined") return defaultStore();
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return defaultStore();
}

export function saveStore(store: ObjectiveStore) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(store));
}

export function addObjective(obj: Objective) {
  const store = getStore();
  store.objectives.push(obj);
  saveStore(store);
}

export function updateObjective(obj: Objective) {
  const store = getStore();
  const idx = store.objectives.findIndex(o => o.id === obj.id);
  if (idx >= 0) store.objectives[idx] = obj;
  saveStore(store);
}

export function saveAssignments(objectiveId: string, assignments: Omit<Assignment, "id">[]) {
  const store = getStore();
  store.assignments = store.assignments.filter(a => a.objectiveId !== objectiveId);
  assignments.forEach((a, i) => store.assignments.push({ ...a, id: objectiveId + "-" + i }));
  saveStore(store);
}