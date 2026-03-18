import type { ObjectiveStatus } from "@/lib/domain/types";

const CONFIG: Record<string, { label: string; className: string }> = {
  draft:             { label: "Borrador",     className: "bg-gray-100 text-gray-600" },
  active:            { label: "Activo",       className: "bg-blue-50 text-blue-700" },
  in_progress:       { label: "En progreso",  className: "bg-blue-50 text-blue-700" },
  pending:           { label: "Pendiente",    className: "bg-gray-100 text-gray-500" },
  achieved:          { label: "Cumplido",     className: "bg-emerald-50 text-emerald-700" },
  approved:          { label: "Aprobado",     className: "bg-emerald-50 text-emerald-700" },
  validation:        { label: "En revisión",  className: "bg-amber-50 text-amber-700" },
  under_review:      { label: "En revisión",  className: "bg-amber-50 text-amber-700" },
  rejected:          { label: "Rechazado",    className: "bg-red-50 text-red-600" },
  payout_requested:  { label: "Pago sol.",    className: "bg-indigo-50 text-indigo-700" },
};

export function StatusBadge({ status }: { status: string }) {
  const cfg = CONFIG[status] ?? { label: status, className: "bg-gray-100 text-gray-500" };
  return (
    <span className={"text-xs font-medium px-2.5 py-1 rounded-full " + cfg.className}>
      {cfg.label}
    </span>
  );
}