import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";
import { db, firebaseConfigurado, comTimeout, COLECAO_ITENS } from "../lib/firebase";
import { Field, SelectWrap, inputCls, selectCls, NAVY } from "./FormUI";

const VAZIO = { categoria: "", nome: "", quantidade: "", unidade: "", validade: "", observacoes: "" };

/** Formulário de cadastro da entidade 1 (coleção "itens"). */
export function ItemForm({ aoSalvar }: { aoSalvar?: () => void }) {
  const [form, setForm] = useState(VAZIO);
  const [salvando, setSalvando] = useState(false);

  const set =
    (campo: keyof typeof VAZIO) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((v) => ({ ...v, [campo]: e.target.value }));

  const salvar = async () => {
    // Validação: campos obrigatórios preenchidos
    if (!form.categoria || !form.nome.trim() || !form.quantidade || !form.unidade) {
      toast.error("Preencha categoria, nome, quantidade e unidade.");
      return;
    }
    if (Number(form.quantidade) <= 0) {
      toast.error("A quantidade deve ser maior que zero.");
      return;
    }
    if (!firebaseConfigurado) {
      toast.error("Firebase não configurado. Preencha o arquivo .env.");
      return;
    }

    setSalvando(true);
    try {
      // Create Document
      await comTimeout(addDoc(collection(db, COLECAO_ITENS), {
        categoria: form.categoria,
        nome: form.nome.trim(),
        quantidade: Number(form.quantidade),
        unidade: form.unidade,
        validade: form.validade,
        observacoes: form.observacoes.trim(),
        criadoEm: serverTimestamp(), // data do cadastro
      }));
      setForm(VAZIO); // limpa os campos
      toast.success("Item cadastrado com sucesso!"); // Show Snack Bar
      aoSalvar?.();
    } catch (e) {
      console.error("Erro ao salvar no Firestore:", e);
      toast.error(`Erro ao salvar: ${e instanceof Error ? e.message : "tente novamente"}`);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-4">
        <Field label="Categoria" required>
          <SelectWrap>
            <select className={selectCls} value={form.categoria} onChange={set("categoria")}>
              <option value="">Selecione...</option>
              <option>Alimentos</option>
              <option>Higiene</option>
              <option>Roupas</option>
              <option>Medicamentos</option>
              <option>Outros</option>
            </select>
          </SelectWrap>
        </Field>
        <Field label="Nome do item" required>
          <input className={inputCls} placeholder="Ex: Arroz branco" value={form.nome} onChange={set("nome")} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Quantidade" required>
            <input type="number" min="1" className={inputCls} placeholder="0" value={form.quantidade} onChange={set("quantidade")} />
          </Field>
          <Field label="Unidade" required>
            <SelectWrap>
              <select className={selectCls} value={form.unidade} onChange={set("unidade")}>
                <option value="">Selecione</option>
                <option>kg</option>
                <option>g</option>
                <option>L</option>
                <option>mL</option>
                <option>un</option>
                <option>cx</option>
                <option>pc</option>
              </select>
            </SelectWrap>
          </Field>
        </div>
        <Field label="Data de validade">
          <input className={inputCls} placeholder="dd/mm/aaaa" value={form.validade} onChange={set("validade")} />
        </Field>
        <Field label="Observações">
          <textarea
            className={`${inputCls} h-20 resize-none py-2.5`}
            placeholder="Informações adicionais..."
            value={form.observacoes}
            onChange={set("observacoes")}
          />
        </Field>
      </div>
      <button
        onClick={salvar}
        disabled={salvando}
        className="w-full h-11 rounded-xl text-white text-sm font-bold shadow-md disabled:opacity-60"
        style={{ background: NAVY }}
      >
        {salvando ? "Salvando..." : "Salvar"}
      </button>
    </div>
  );
}
