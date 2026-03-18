"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/session";
import { getStore, addObjective, updateObjective } from "@/lib/objectives-store";
import Link from "next/link";

const FIELDS = [
  { value: "deal_stage", label: "Etapa del deal" },
  { value: "deal_source", label: "Fuente del deal" },
  { value: "who_got_the_call", label: "Quien tomo la llamada" },
  { value: "lead_status", label: "Estado del lead" },
  { value: "percent_active_users", label: "% usuarios activos" },
  { value: "sticky_feature_count", label: "Features stickies" },
  { value: "date_ready_to_success", label: "Fecha lista para Success" },
  { value: "csat_score", label: "CSAT Score" },
  { value: "resolved_processes_feature_count", label: "Procesos resueltos" },
  { value: "days_since_handoff", label: "Dias desde handoff" },
  { value: "days_since_booked", label: "Dias desde booked" },
  { value: "expansion_amount", label: "Monto de expansion" },
  { value: "mrr", label: "MRR" },
  { value: "is_red_list", label: "Red List" },
  { value: "csat_is_stale", label: "CSAT desactualizado" },
  { value: "wau_is_stale", label: "WAU desactualizado" },
];

const OPERATORS = [
  { value: "eq", label: "es igual a" },
  { value: "neq", label: "es distinto de" },
  { value: "gt", label: "es mayor que" },
  { value: "gte", label: "mayor o igual que" },
  { value: "lt", label: "es menor que" },
  { value: "lte", label: "menor o igual que" },
  { value: "known", label: "tiene valor" },
  { value: "unknown", label: "no tiene valor" },
  { value: "in", label: "esta en lista (separar por coma)" },
];

function makeDefaultCond() { return { field: "deal_stage", operator: "eq", value: "" }; }

export function ObjectiveForm({ mode, objectiveId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("boolean");
  const [logic, setLogic] = useState("AND");
  const [conditions, setConditions] = useState([makeDefaultCond()]);
  const [routingRules, setRoutingRules] = useState([{ condition: makeDefaultCond(), result: "approved", reason: "" }]);
  const [bonusType, setBonusType] = useState("fixed");
  const [bonusAmount, setBonusAmount] = useState("500");
  const [bonusField, setBonusField] = useState("mrr");
  const [bonusPct, setBonusPct] = useState("100");

  useEffect(() => {
    const s = getSession();
    if (!s || !s.isAdmin) { router.push("/login"); return; }
    if (mode === "edit" && objectiveId) {
      const store = getStore();
      const obj = store.objectives.find((o) => o.id === objectiveId);
      if (obj) {
        setName(obj.name);
        setDescription(obj.description || "");
        setType(obj.type);
        setLogic(obj.conditions.logic);
        setConditions(obj.conditions.conditions.map((c) => ({
          field: c.field, operator: c.operator,
          value: c.value != null ? String(c.value) : "",
        })));
        setRoutingRules(obj.routingRules.map((r) => {
          const rc = r.condition.conditions[0] || {};
          return { condition: { field: rc.field || "deal_stage", operator: rc.operator || "eq", value: rc.value != null ? String(rc.value) : "" }, result: r.result, reason: r.reason || "" };
        }));
        const bf = obj.bonusFormula;
        if (bf.type === "fixed") { setBonusType("fixed"); setBonusAmount(String(bf.amount)); }
        else if (bf.type === "percentage_of_field") { setBonusType("percentage_of_field"); setBonusField(bf.field); setBonusPct(String(bf.percentage)); }
      }
    }
    setLoading(false);
  }, [mode, objectiveId, router]);

  const addCond = () => setConditions((c) => [...c, makeDefaultCond()]);
  const removeCond = (i) => setConditions((c) => c.filter((_, idx) => idx !== i));
  const updateCond = (i, key, val) => setConditions((c) => c.map((row, idx) => idx === i ? { ...row, [key]: val } : row));
  const addRule = () => setRoutingRules((r) => [...r, { condition: makeDefaultCond(), result: "approved", reason: "" }]);
  const removeRule = (i) => setRoutingRules((r) => r.filter((_, idx) => idx !== i));
  const updateRule = (i, key, val) => setRoutingRules((r) => r.map((row, idx) => idx === i ? { ...row, [key]: val } : row));
  const updateRuleCond = (i, key, val) => setRoutingRules((r) => r.map((row, idx) => idx === i ? { ...row, condition: { ...row.condition, [key]: val } } : row));

  function handleSave() {
    const parseValue = (op, val) => {
      if (op === "known" || op === "unknown") return undefined;
      if (op === "in") return val.split(",").map((v) => v.trim());
      return isNaN(Number(val)) ? val : Number(val);
    };
    const condGroup = { logic, conditions: conditions.map((c) => ({ field: c.field, operator: c.operator, value: parseValue(c.operator, c.value) })) };
    const bf = bonusType === "fixed" ? { type: "fixed", amount: Number(bonusAmount) } : { type: "percentage_of_field", field: bonusField, percentage: Number(bonusPct) };
    const obj = {
      id: objectiveId || ("obj-" + Date.now()),
      planId: "10000000-0000-0000-0000-000000000001",
      name, description, type,
      conditions: condGroup,
      routingRules: routingRules.map((r) => ({
        condition: { logic: "AND", conditions: [{ field: r.condition.field, operator: r.condition.operator, value: parseValue(r.condition.operator, r.condition.value) }] },
        result: r.result, reason: r.reason || undefined,
      })),
      bonusFormula: bf,
      createdBy: "00000000-0000-0000-0000-000000000001",
      createdAt: new Date().toISOString(),
    };
    if (mode === "create") addObjective(obj); else updateObjective(obj);
    setSaved(true);
    setTimeout(() => router.push("/objectives"), 1200);
  }

  if (loading) return <div className="p-8 text-gray-400">Cargando...</div>;

  const inputCls = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";
  const selectCls = inputCls + " bg-white";

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/objectives" className="text-indigo-600 hover:underline text-sm flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
          Objetivos
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-semibold text-gray-900">{mode === "create" ? "Nuevo objetivo" : "Editar objetivo"}</h1>
      </div>

      {saved && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm text-emerald-700 font-medium flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
          Guardado. Redirigiendo...
        </div>
      )}

      {/* Info basica */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
        <h2 className="text-sm font-semibold text-gray-900">Informacion basica</h2>
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">Nombre</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} placeholder="Ej: Bono Sales" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">Descripcion</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className={inputCls + " resize-none"} placeholder="Describe las condiciones..." />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">Tipo</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className={selectCls}>
            <option value="boolean">Boolean — cumple o no cumple</option>
            <option value="percentage">Porcentaje — metrica sobre umbral</option>
            <option value="numeric">Numerico — valor con rangos</option>
            <option value="status">Status — campo en valor especifico</option>
          </select>
        </div>
      </div>

      {/* Condiciones */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Condiciones base</h2>
          <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1">
            {["AND","OR"].map((l) => (
              <button key={l} onClick={() => setLogic(l)} className={"text-xs px-2.5 py-1 rounded-md font-medium transition " + (logic === l ? "bg-white text-indigo-700 shadow-sm" : "text-gray-400 hover:text-gray-600")}>{l}</button>
            ))}
          </div>
        </div>
        <p className="text-xs text-gray-400">Se evaluan {logic === "AND" ? "todas" : "al menos una"} las condiciones para que el objetivo sea valido.</p>
        {conditions.map((cond, i) => (
          <div key={i} className="flex items-center gap-2 flex-wrap">
            {i > 0 ? <span className="text-xs font-bold text-indigo-600 w-8 text-center flex-shrink-0">{logic}</span> : <span className="w-8 flex-shrink-0"/>}
            <select value={cond.field} onChange={(e) => updateCond(i, "field", e.target.value)} className="flex-1 border border-gray-200 rounded-lg px-2.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white min-w-0">
              {FIELDS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
            </select>
            <select value={cond.operator} onChange={(e) => updateCond(i, "operator", e.target.value)} className="flex-1 border border-gray-200 rounded-lg px-2.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white min-w-0">
              {OPERATORS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            {cond.operator !== "known" && cond.operator !== "unknown" && (
              <input value={cond.value} onChange={(e) => updateCond(i, "value", e.target.value)} className="w-28 border border-gray-200 rounded-lg px-2.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Valor" />
            )}
            {conditions.length > 1 && (
              <button onClick={() => removeCond(i)} className="text-gray-300 hover:text-red-400 transition flex-shrink-0">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            )}
          </div>
        ))}
        <button onClick={addCond} className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-700 font-medium">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
          Agregar condicion
        </button>
      </div>

      {/* Reglas de ruteo */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Reglas de ruteo</h2>
          <p className="text-xs text-gray-400 mt-0.5">La primera regla que se cumple determina el estado final. Default: rechazado.</p>
        </div>
        {routingRules.map((rule, i) => (
          <div key={i} className="border border-gray-100 rounded-xl p-3 space-y-2 bg-gray-50/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500">Regla {i + 1}</span>
              {routingRules.length > 1 && (
                <button onClick={() => removeRule(i)} className="text-gray-300 hover:text-red-400 transition">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-400 w-5">Si</span>
              <select value={rule.condition.field} onChange={(e) => updateRuleCond(i, "field", e.target.value)} className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-0">
                {FIELDS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
              <select value={rule.condition.operator} onChange={(e) => updateRuleCond(i, "operator", e.target.value)} className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-0">
                {OPERATORS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              {rule.condition.operator !== "known" && rule.condition.operator !== "unknown" && (
                <input value={rule.condition.value} onChange={(e) => updateRuleCond(i, "value", e.target.value)} className="w-24 border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Valor" />
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-400 w-5">-&gt;</span>
              <select value={rule.result} onChange={(e) => updateRule(i, "result", e.target.value)} className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="approved">Aprobado</option>
                <option value="validation">En revision manual</option>
                <option value="rejected">Rechazado</option>
              </select>
              {rule.result === "validation" && (
                <input value={rule.reason} onChange={(e) => updateRule(i, "reason", e.target.value)} className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Motivo para el manager..." />
              )}
            </div>
          </div>
        ))}
        <button onClick={addRule} className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-700 font-medium">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
          Agregar regla
        </button>
      </div>

      {/* Formula de bono */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
        <h2 className="text-sm font-semibold text-gray-900">Formula de bono</h2>
        <div className="flex gap-2">
          {[["fixed","Monto fijo"],["percentage_of_field","% de campo CRM"]].map(([v,l]) => (
            <button key={v} onClick={() => setBonusType(v)} className={"flex-1 py-2.5 rounded-xl text-xs font-semibold border transition " + (bonusType === v ? "bg-indigo-50 border-indigo-300 text-indigo-700" : "border-gray-200 text-gray-400 hover:bg-gray-50")}>{l}</button>
          ))}
        </div>
        {bonusType === "fixed" ? (
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Monto en USD</label>
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500">
              <span className="px-3 py-2.5 bg-gray-50 text-gray-400 text-sm border-r border-gray-200">$</span>
              <input type="number" value={bonusAmount} onChange={(e) => setBonusAmount(e.target.value)} className="flex-1 px-3 py-2.5 text-sm focus:outline-none" placeholder="500" />
            </div>
          </div>
        ) : (
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs font-medium text-gray-500 mb-1 block">Campo base</label>
              <select value={bonusField} onChange={(e) => setBonusField(e.target.value)} className={selectCls}>
                <option value="mrr">MRR</option>
                <option value="expansion_amount">Monto de expansion</option>
              </select>
            </div>
            <div className="w-32">
              <label className="text-xs font-medium text-gray-500 mb-1 block">Porcentaje</label>
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500">
                <input type="number" value={bonusPct} onChange={(e) => setBonusPct(e.target.value)} className="flex-1 px-3 py-2.5 text-sm focus:outline-none w-16" />
                <span className="px-3 py-2.5 bg-gray-50 text-gray-400 text-sm border-l border-gray-200">%</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button onClick={handleSave} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition text-sm">
          {mode === "create" ? "Crear objetivo" : "Guardar cambios"}
        </button>
        <Link href="/objectives" className="px-6 py-3 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition text-sm text-center">
          Cancelar
        </Link>
      </div>
    </div>
  );
}