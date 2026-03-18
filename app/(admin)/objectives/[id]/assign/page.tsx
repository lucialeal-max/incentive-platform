"use client";
import { use } from "react";
import { AssignObjective } from "@/components/objectives/assign-objective";
export default function AssignPage({ params }: { params: Promise<{id: string}> }) {
  const { id } = use(params);
  return <AssignObjective objectiveId={id} />;
}