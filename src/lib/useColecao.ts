import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db, firebaseConfigurado } from "./firebase";

export interface Item {
  id: string;
  categoria: string;
  nome: string;
  quantidade: number;
  unidade: string;
  validade: string;
  observacoes: string;
}

export interface Pessoa {
  id: string;
  tipo: "doa" | "recebe";
  nome: string;
  email: string;
  telefone: string;
}

/**
 * Equivalente ao "Backend Query → List of Documents" do FlutterFlow:
 * lê a coleção em tempo real, do registro mais recente para o mais antigo.
 * Quando um documento novo é criado na tela de cadastro, a lista atualiza sozinha.
 */
export function useColecao<T>(nomeColecao: string) {
  const [dados, setDados] = useState<T[]>([]);
  const [carregando, setCarregando] = useState(firebaseConfigurado);
  const [erro, setErro] = useState<string | null>(
    firebaseConfigurado ? null : "Firebase não configurado. Preencha o arquivo .env (veja .env.example).",
  );

  useEffect(() => {
    if (!firebaseConfigurado) return;
    const q = query(collection(db, nomeColecao), orderBy("criadoEm", "desc"));
    return onSnapshot(
      q,
      (snap) => {
        setDados(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T));
        setCarregando(false);
        setErro(null);
      },
      (e) => {
        setErro(`Não foi possível ler "${nomeColecao}": ${e.message}`);
        setCarregando(false);
      },
    );
  }, [nomeColecao]);

  return { dados, carregando, erro };
}
