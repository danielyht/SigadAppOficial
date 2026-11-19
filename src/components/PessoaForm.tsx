import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";
import { db, firebaseConfigurado, comTimeout, COLECAO_PESSOAS } from "../lib/firebase";
import { Field, SelectWrap, inputCls, selectCls, NAVY } from "./FormUI";

/** Formulário de cadastro da entidade 2 (coleção "pessoas"). */
export function PessoaForm({ tipoInicial = "doa" }: { tipoInicial?: "doa" | "recebe" }) {
  const vazio = { tipo: tipoInicial as string, nome: "", email: "", telefone: "" };
  const [form, setForm] = useState(vazio);
  const [salvando, setSalvando] = useState(false);

  const set =
    (campo: keyof typeof vazio) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((v) => ({ ...v, [campo]: e.target.value }));

  const salvar = async () => {
    if (!form.tipo || !form.nome.trim()) {
      toast.error("Informe o tipo e o nome.");
      return;
    }
    if (!firebaseConfigurado) {
      toast.error("Firebase não configurado. Preencha o arquivo .env.");
      return;
    }

    setSalvando(true);
    try {
      // Create Document
      await comTimeout(addDoc(collection(db, COLECAO_PESSOAS), {
        tipo: form.tipo,
        nome: form.nome.trim(),
        email: form.email.trim(),
        telefone: form.telefone.trim(),
        criadoEm: serverTimestamp(),
      }));
      setForm({ ...vazio, tipo: form.tipo }); // limpa os campos (mantém o tipo escolhido)
      toast.success("Pessoa cadastrada com sucesso!");
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
        <Field label="Tipo" required>
          <SelectWrap>
            <select className={selectCls} value={form.tipo} onChange={set("tipo")}>
              <option value="doa">Quem doa (beneficiário)</option>
              <option value="recebe">Quem recebe (beneficiado)</option>
            </select>
          </SelectWrap>
        </Field>
        <Field label="Nome" required>
          <input className={inputCls} placeholder="Nome da pessoa ou organização" value={form.nome} onChange={set("nome")} />
        </Field>
        <Field label="E-mail">
          <input type="email" className={inputCls} placeholder="email@exemplo.com" value={form.email} onChange={set("email")} />
        </Field>
        <Field label="Telefone">
          <input className={inputCls} placeholder="(41) 90000-0000" value={form.telefone} onChange={set("telefone")} />
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
