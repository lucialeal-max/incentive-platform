import { DEMO_PAYOUT_RUN } from "@/lib/demo-data";

export default function PayoutPage() {
  const run = DEMO_PAYOUT_RUN;
  const fmt = (n: number) => "$" + n.toLocaleString();
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Payout Run — Marzo 2026</h1>
        <p className="text-sm text-gray-500 mt-0.5">Borrador listo para aprobar</p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Ítems a pagar</span>
          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">Draft</span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 bg-gray-50">
              <th className="px-5 py-3 font-medium">Empleado</th>
              <th className="px-5 py-3 font-medium">Objetivo</th>
              <th className="px-5 py-3 font-medium text-right">Monto</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {run.items.map((item, i) => (
              <tr key={i} className="hover:bg-gray-50/50">
                <td className="px-5 py-3 text-gray-900">{item.userName}</td>
                <td className="px-5 py-3 text-gray-600">{item.objectiveName}</td>
                <td className="px-5 py-3 text-right font-semibold">{fmt(item.amount)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-indigo-50">
              <td colSpan={2} className="px-5 py-3 font-semibold text-indigo-900">Total</td>
              <td className="px-5 py-3 text-right font-bold text-indigo-900 text-base">{fmt(run.totalAmount)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <button className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition">
        Aprobar payout — {fmt(run.totalAmount)} USD
      </button>
    </div>
  );
}