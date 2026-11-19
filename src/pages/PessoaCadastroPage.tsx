import { useNavigate, useSearchParams } from "react-router";
import { ArrowLeft } from "lucide-react";
import { PessoaForm } from "../components/PessoaForm";
import { AvisoFirebase } from "../components/FormUI";
import { firebaseConfigurado } from "../lib/firebase";

export default function PessoaCadastroPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const tipo = params.get("tipo") === "recebe" ? "recebe" : "doa";
  return (
    <div className="flex flex-col pb-6">
      <div className="px-5 pt-4 pb-4 flex items-center gap-3">
        <button onClick={() => navigate("/pessoas")} className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600" aria-label="Voltar para a lista">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-800">Cadastrar Pessoa</h1>
          <p className="text-sm text-slate-500 mt-0.5">Quem doa ou quem recebe</p>
        </div>
      </div>
      <div className="px-5 flex flex-col gap-3">
        {!firebaseConfigurado && <AvisoFirebase mensagem="Firebase não configurado. Preencha o arquivo .env (veja .env.example) para salvar no Firestore." />}
        <PessoaForm tipoInicial={tipo} />
      </div>
    </div>
  );
}
