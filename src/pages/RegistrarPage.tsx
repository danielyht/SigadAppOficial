import { useState } from "react";
import { Package, Shuffle, ChevronDown, X, CheckCircle2, UserPlus } from "lucide-react";
import { ItemForm } from "../components/ItemForm";

type RegisterTab = "item" | "distribuicao";

const inputCls = "w-full h-11 px-3.5 border border-slate-200 rounded-xl text-sm text-slate-800 bg-white placeholder:text-slate-400 outline-none focus:border-[#1B3A6B] focus:ring-2 focus:ring-[#1B3A6B]/10 transition-all";
const selectCls = "w-full h-11 px-3.5 pr-9 border border-slate-200 rounded-xl text-sm text-slate-500 bg-white outline-none focus:border-[#1B3A6B] focus:ring-2 focus:ring-[#1B3A6B]/10 transition-all appearance-none";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-slate-700">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

function SelectWrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {children}
      <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
    </div>
  );
}

export default function RegistrarPage() {
  const [tab, setTab] = useState<RegisterTab>("item");
  const [formDist, setFormDist] = useState({ beneficiado: "", item: "", quantidade: "" });
  const [distItems, setDistItems] = useState<{ item: string; quantidade: string }[]>([]);

  return (
    <div className="flex flex-col pb-6">
      <div className="px-5 pt-4 pb-4">
        <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
          {([
            { id: "item" as RegisterTab, label: "Registrar Item", icon: Package },
            { id: "distribuicao" as RegisterTab, label: "Distribuição", icon: Shuffle },
          ]).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${tab === t.id ? "bg-white text-[#1B3A6B] shadow-sm" : "text-slate-500"}`}
            >
              <t.icon size={13} />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === "item" ? (
        <div className="px-5 flex flex-col gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Registrar Item</h1>
            <p className="text-sm text-slate-500 mt-0.5">Cadastre novos itens recebidos no estoque</p>
          </div>
          <ItemForm />
        </div>
      ) : (
        <div className="px-5 flex flex-col gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Registrar Distribuição</h1>
            <p className="text-sm text-slate-500 mt-0.5">Registre a saída de itens do estoque para um beneficiado</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col gap-3">
            <h2 className="text-sm font-bold text-slate-800">Beneficiado</h2>
            <Field label="Beneficiado * (quem recebe)">
              <SelectWrap>
                <select className={selectCls} value={formDist.beneficiado} onChange={(e) => setFormDist((f) => ({ ...f, beneficiado: e.target.value }))}>
                  <option value="">Selecione o beneficiado...</option>
                </select>
              </SelectWrap>
              <p className="text-xs text-slate-400 mt-0.5">Cadastre um beneficiado antes de registrar distribuições</p>
            </Field>
            <button className="w-full h-9 border border-[#1B3A6B] text-[#1B3A6B] rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5">
              <UserPlus size={14} /> + Novo beneficiado
            </button>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col gap-3">
            <h2 className="text-sm font-bold text-slate-800">Itens da distribuição</h2>
            <Field label="Item">
              <SelectWrap>
                <select className={selectCls} value={formDist.item} onChange={(e) => setFormDist((f) => ({ ...f, item: e.target.value }))}>
                  <option value="">Selecione o item...</option>
                </select>
              </SelectWrap>
            </Field>
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <Field label="Quantidade">
                  <input type="number" className={inputCls} placeholder="0" value={formDist.quantidade} onChange={(e) => setFormDist((f) => ({ ...f, quantidade: e.target.value }))} />
                </Field>
              </div>
              <button
                onClick={() => { if (formDist.item && formDist.quantidade) { setDistItems([...distItems, { item: formDist.item, quantidade: formDist.quantidade }]); setFormDist((f) => ({ ...f, item: "", quantidade: "" })); } }}
                className="h-11 px-4 rounded-xl text-white text-sm font-semibold flex-shrink-0" style={{ background: "#1B3A6B" }}>
                + Adicionar
              </button>
            </div>
            {distItems.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 py-5 px-4 text-center">
                <p className="text-xs text-slate-400 leading-relaxed">Nenhum item adicionado. Selecione o item, a quantidade e clique em Adicionar.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                {distItems.map((it, i) => (
                  <div key={i} className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2">
                    <div>
                      <p className="text-xs font-semibold text-slate-800">{it.item}</p>
                      <p className="text-xs text-slate-400">Qtd: {it.quantidade}</p>
                    </div>
                    <button onClick={() => setDistItems(distItems.filter((_, j) => j !== i))} className="p-1 text-slate-400 hover:text-red-500 transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button className="w-full h-11 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2 shadow-md" style={{ background: "#1B3A6B" }}>
            <CheckCircle2 size={16} /> Confirmar distribuição
          </button>
        </div>
      )}
    </div>
  );
}
