"use client";
import { use } from "react";
import { ObjectiveForm } from "@/components/objectives/objective-form";
export default function EditObjectivePage({ params }: { params: Promise<{id: string}> }) {
  const { id } = use(params);
  return <ObjectiveForm mode="edit" objectiveId={id} />;
}