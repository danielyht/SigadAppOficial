import { useState } from "react";
import { useNavigate } from "react-router";
import { Search, Archive, Package, Plus } from "lucide-react";
import { useColecao, type Item } from "../lib/useColecao";
import { COLECAO_ITENS } from "../lib/firebase";
import { AvisoFirebase, inputCls, selectCls, NAVY } from "../components/FormUI";

/** Lista da entidade 1: ListView com os documentos da coleção "itens", em cards. */
export default function EstoquePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [categoria, setCategoria] = useState("todas");
  const { dados: itens, carregando, erro } = useColecao<Item>(COLECAO_ITENS);

  const filtrados = itens.filter(
    (i) =>
      (categoria === "todas" || i.categoria.toLowerCase() === categoria) &&
      i.nome.toLowerCase().includes(search.trim().toLowerCase()),
  );
  const totalUnidades = filtrados.reduce((soma, i) => soma + (Number(i.quantidade) || 0), 0);

  return (
    <div className="flex flex-col pb-6">
      <div className="px-5 pt-4 pb-4 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Estoque</h1>
          <p className="text-sm text-slate-500 mt-0.5">Itens cadastrados no banco de dados</p>
        </div>
        <button
          onClick={() => navigate("/estoque/novo")}
          className="w-10 h-10 rounded-full text-white flex items-center justify-center shadow-md flex-shrink-0 mt-5"
          style={{ background: NAVY }}
          aria-label="Cadastrar item"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="px-5 flex flex-col gap-3">
        {erro && <AvisoFirebase mensagem={erro} />}

        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className={`${inputCls} pl-9`} placeholder="Buscar por item..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className={selectCls} value={categoria} onChange={(e) => setCategoria(e.target.value)}>
          <option value="todas">Todas as categorias</option>
          <option value="alimentos">Alimentos</option>
          <option value="higiene">Higiene</option>
          <option value="roupas">Roupas</option>
          <option value="medicamentos">Medicamentos</option>
          <option value="outros">Outros</option>
        </select>

        {carregando ? (
          <p className="text-sm text-slate-400 text-center py-10">Carregando...</p>
        ) : filtrados.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm flex flex-col items-center justify-center py-10 gap-3 text-center">
            <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center">
              <Package size={24} className="text-slate-400" />
            </div>
            <p className="text-sm text-slate-400 max-w-[220px] leading-relaxed">
              {itens.length === 0 ? "Nenhum item cadastrado. Toque em + para cadastrar." : "Nenhum item encontrado com os filtros atuais."}
            </p>
          </div>
        ) : (
          filtrados.map((i) => (
            <div key={i.id} className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">{i.nome}</p>
                <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                  {i.categoria}
                </span>
                {i.validade && <p className="text-xs text-slate-400 mt-1.5">Validade: {i.validade}</p>}
                {i.observacoes && <p className="text-xs text-slate-500 mt-1 line-clamp-2">{i.observacoes}</p>}
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-lg font-extrabold text-slate-800 leading-none">{i.quantidade}</p>
                <p className="text-xs text-slate-400 mt-0.5">{i.unidade}</p>
              </div>
            </div>
          ))
        )}

        <div className="bg-white rounded-xl border border-slate-100 shadow-sm px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Archive size={15} className="text-slate-400" />
            <span className="text-sm text-slate-500">Total de unidades:</span>
          </div>
          <span className="text-sm font-bold text-slate-800">{totalUnidades} unidades</span>
        </div>
      </div>
    </div>
  );
}
