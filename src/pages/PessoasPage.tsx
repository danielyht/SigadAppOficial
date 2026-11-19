import { useState } from "react";
import { useNavigate } from "react-router";
import { Heart, Gift, Plus, Search, Info, Mail, Phone } from "lucide-react";
import { useColecao, type Pessoa } from "../lib/useColecao";
import { COLECAO_PESSOAS } from "../lib/firebase";
import { AvisoFirebase, NAVY } from "../components/FormUI";

type PeopleTab = "doa" | "recebe";

/** Lista da entidade 2: ListView com os documentos da coleção "pessoas", em cards. */
export default function PessoasPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<PeopleTab>("doa");
  const [search, setSearch] = useState("");
  const isDoa = tab === "doa";
  const { dados: pessoas, carregando, erro } = useColecao<Pessoa>(COLECAO_PESSOAS);

  const termo = search.trim().toLowerCase();
  const filtradas = pessoas.filter(
    (p) =>
      p.tipo === tab &&
      [p.nome, p.email, p.telefone].some((c) => (c ?? "").toLowerCase().includes(termo)),
  );

  return (
    <div className="flex flex-col pb-6">
      <div className="px-5 pt-4 pb-4 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Pessoas</h1>
          <p className="text-sm text-slate-500 mt-0.5">Quem doa e quem recebe</p>
        </div>
        <button
          onClick={() => navigate(`/pessoas/novo?tipo=${tab}`)}
          className="w-10 h-10 rounded-full text-white flex items-center justify-center shadow-md flex-shrink-0 mt-5"
          style={{ background: NAVY }}
          aria-label="Cadastrar pessoa"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="px-5 flex flex-col gap-3">
        {erro && <AvisoFirebase mensagem={erro} />}

        <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
          {([
            { id: "doa" as PeopleTab, label: "Quem doa", icon: Heart },
            { id: "recebe" as PeopleTab, label: "Quem recebe", icon: Gift },
          ]).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-semibold transition-all ${tab === t.id ? "bg-white shadow-sm" : "text-slate-500"}`}
              style={tab === t.id ? { color: NAVY } : {}}
            >
              <t.icon size={14} />
              {t.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="w-full h-10 pl-9 pr-3.5 border border-slate-200 rounded-xl text-sm text-slate-800 bg-white placeholder:text-slate-400 outline-none focus:border-[#1B3A6B] transition-all"
            placeholder="Buscar por nome, e-mail ou telefone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {carregando ? (
          <p className="text-sm text-slate-400 text-center py-10">Carregando...</p>
        ) : filtradas.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm flex flex-col items-center justify-center py-10 gap-3 text-center">
            <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center">
              {isDoa ? <Heart size={24} className="text-slate-400" /> : <Gift size={24} className="text-slate-400" />}
            </div>
            <p className="text-sm text-slate-400 max-w-[220px] leading-relaxed">
              {isDoa ? "Nenhum beneficiário cadastrado." : "Nenhum beneficiado cadastrado."} Toque em + para cadastrar.
            </p>
          </div>
        ) : (
          filtradas.map((p) => (
            <div key={p.id} className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isDoa ? "bg-green-50 text-green-600" : "bg-purple-50 text-purple-600"}`}
              >
                {isDoa ? <Heart size={18} /> : <Gift size={18} />}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">{p.nome}</p>
                {p.email && (
                  <p className="text-xs text-slate-500 flex items-center gap-1 truncate">
                    <Mail size={11} /> {p.email}
                  </p>
                )}
                {p.telefone && (
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <Phone size={11} /> {p.telefone}
                  </p>
                )}
              </div>
            </div>
          ))
        )}

        <div className={`rounded-xl p-3 flex items-start gap-2.5 border ${isDoa ? "bg-green-50 border-green-100" : "bg-purple-50 border-purple-100"}`}>
          <Info size={15} className={`flex-shrink-0 mt-0.5 ${isDoa ? "text-green-600" : "text-purple-600"}`} />
          <p className={`text-xs leading-relaxed ${isDoa ? "text-green-800" : "text-purple-800"}`}>
            {isDoa
              ? "Beneficiários são pessoas ou organizações que realizam doações de itens ao estoque."
              : "Beneficiados são pessoas que recebem itens do estoque através das distribuições."}
          </p>
        </div>
      </div>
    </div>
  );
}
