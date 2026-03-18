export function BonusSummaryBar({
  approved, potential, underReview
}: { approved: number; potential: number; underReview: number }) {
  return (
    <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-2xl p-5 text-white">
      <p className="text-indigo-200 text-xs uppercase tracking-wide mb-1">Bono desbloqueado</p>
      <p className="text-3xl font-bold">${approved.toLocaleString()}</p>
      <div className="flex gap-4 mt-3 text-sm text-indigo-200">
        <span>Potencial: <strong className="text-white">${potential.toLocaleString()}</strong></span>
        {underReview > 0 && <span>En revisión: <strong className="text-amber-300">{underReview}</strong></span>}
      </div>
    </div>
  );
}