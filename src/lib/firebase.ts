import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore, initializeFirestore } from "firebase/firestore";

// Configuração vinda do Firebase Console (Configurações do projeto → Seus apps → Web).
// Copie .env.example para .env e preencha os valores.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  // valor de reserva só para o app abrir sem .env (as telas mostram um aviso)
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "nao-configurado",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const firebaseConfigurado = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId,
);

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Long polling: evita o Firestore ficar "pendurado" em redes de escola/proxy,
// onde a conexão de streaming é bloqueada sem mostrar erro.
function criarDb() {
  try {
    return initializeFirestore(app, { experimentalForceLongPolling: true });
  } catch {
    return getFirestore(app); // já inicializado (recarga a quente do Vite)
  }
}
export const db = criarDb();

/** Faz a operação falhar com mensagem clara se o Firestore não responder a tempo. */
export function comTimeout<T>(promessa: Promise<T>, ms = 10000): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(
      () =>
        reject(
          new Error(
            "O Firestore não respondeu em 10s. Confira se o banco foi criado, se as regras foram PUBLICADAS e se a rede permite acesso ao Firebase.",
          ),
        ),
      ms,
    );
    promessa.then(
      (v) => { clearTimeout(t); resolve(v); },
      (e) => { clearTimeout(t); reject(e); },
    );
  });
}

// Nomes das duas coleções do Cloud Firestore
export const COLECAO_ITENS = "itens";
export const COLECAO_PESSOAS = "pessoas";
