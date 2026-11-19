# SIGAD MOBILE

App React + Vite conectado ao **Cloud Firestore** (duas coleções: `itens` e `pessoas`).

## Telas da atividade (3º trimestre)

| Tela | Rota | Coleção |
|---|---|---|
| Tela Inicial (Dashboard) → atalhos para as listas | `/dashboard` | lê as duas |
| Lista de itens (ListView em tempo real) + botão **+** | `/estoque` | `itens` |
| Cadastro de item (Salvar → Create Document, limpa campos, snack bar) | `/estoque/novo` | `itens` |
| Lista de pessoas (abas Quem doa / Quem recebe) + botão **+** | `/pessoas` | `pessoas` |
| Cadastro de pessoa | `/pessoas/novo` | `pessoas` |

Navegação: Tela Inicial → Lista → (+) Cadastro. Ao salvar, o novo registro aparece na lista automaticamente.

## Como rodar

1. No [Firebase Console](https://console.firebase.google.com): crie o projeto, adicione um app **Web** e crie o banco **Firestore Database**.
2. Copie `.env.example` para `.env` e preencha com os valores do app Web.
3. Em **Firestore → Regras**, cole o conteúdo de `firestore.rules` e clique em **Publicar** (Deploy). Sem isso o botão Salvar fica em "loading infinito".
4. `npm i` e `npm run dev`.

## Campos

- `itens`: categoria, nome, quantidade, unidade, validade, observacoes, criadoEm
- `pessoas`: tipo (`doa` | `recebe`), nome, email, telefone, criadoEm
