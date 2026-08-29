# Roadmap — Backend Finnitus

Plano completo, do ambiente até o backend das telas de **Troca de senha** e **Onboarding financeiro**. Cada fase vira uma ou mais "etapas" no formato que já vimos usando (objetivo → arquivos → código → explicação → testar → confirmar).

Legenda: ✅ concluído · 🔵 em andamento · ⬜ a fazer

---

## Fase 0 — Ambiente ✅
- Node.js, XAMPP/MySQL, Prisma 7.9.1 instalados e configurados
- Conexão Prisma → MySQL (`finitus_test`, porta 3307) validada
- `.env` / `.env.example` criados

## Fase 1 — Servidor Express ✅
- `app.ts` + `server.ts`
- Rota `GET /health`
- Script `npm run dev` funcionando

## Fase 2 — Estrutura de pastas ✅
- `routes/` + `controllers/` (feito, com `/health` como exemplo)
- ⬜ `config/` — validação centralizada das variáveis de `.env` (evita `process.env` espalhado pelo código)
- ⬜ `lib/prisma.ts` — instância única do Prisma Client (evitar criar uma conexão nova em cada arquivo)
- ⬜ `middlewares/` — pasta criada (vazia por enquanto, vai receber tratamento de erro e depois autenticação)
- ⬜ `services/` — pasta criada (vazia por enquanto, vai receber a lógica de negócio)

## Fase 3 — Prisma: modelo `User` ✅
- Definir `User` no `schema.prisma` (id, name, email único, password, createdAt, updatedAt)
- Rodar `npx prisma migrate dev --name create_user`
- Conferir a tabela criada no phpMyAdmin

## Fase 4 — Cadastro e login básico ✅
> Pré-requisito das telas seguintes: recuperação de senha e onboarding financeiro só fazem sentido para um usuário que já existe e está autenticado. Se você **já tem** essas telas/rotas prontas em outro lugar, pulamos essa fase — só me confirma quando chegarmos lá.
- `bcrypt` para hash de senha no cadastro
- `POST /register` (cadastro)
- `POST /login` + emissão de JWT
- Middleware `auth.middleware.ts` para proteger rotas depois

## Fase 5 — Prisma: modelo `PasswordReset` ✅
- Campos: id, userId (FK), codeHash, expiresAt, used, createdAt
- Migration
- Explicação de por que armazenar hash do código e não o código puro
- npx prisma migrate dev --name create_password_reset

## Mudança para o psotgreeSQL
- no terminal:
Trocar o driver adapter
npm uninstall @prisma/adapter-mariadb
npm install @prisma/adapter-pg pg
npm install -D @types/pg

Regenerar e aplicar
npx prisma validate
npx prisma generate
npx prisma migrate dev --name postgres_migration

## Fase 6 — Envio de e-mail (Nodemailer) ⬜
- npm install nodemailer
- npm install -D @types/nodemailer
- Configuração SMTP no `.env` (`EMAIL_USER`, `EMAIL_PASSWORD`, host/porta do provedor)
- `services/email.service.ts` com função reutilizável de envio

## Fase 7 — `POST /forgot-password` ⬜
*(tela "Troca de senha" → botão Enviar)*
- Recebe e-mail → localiza usuário → gera código → hash → salva com expiração → envia e-mail
- Resposta genérica (não revela se o e-mail existe ou não)

## Fase 8 — `POST /verify-code` ⬜
*(tela "Verificação de e-mail")*
- Recebe e-mail + código de 4 dígitos → valida hash, expiração e uso único
- Emite um token temporário de "autorização para trocar senha" (evita reenviar o código na etapa seguinte)

## Fase 9 — `POST /reset-password` ⬜
*(tela "Troca de senha" — nova senha + confirmação)*
- Recebe token da etapa anterior + nova senha
- Valida força da senha, gera hash, atualiza `User`, marca `PasswordReset` como usado

## Fase 10 — Testes do fluxo de senha (Postman/Insomnia) ⬜
- Roteiro de teste dos 3 endpoints, incluindo casos de erro (código expirado, código errado, e-mail inexistente)
- Conferência no phpMyAdmin: hash salvo, expiração salva, `used = true` após uso

## Fase 11 — Integração com as telas de senha no React Native ⬜
- `forgot-password` → `verify-code` → `reset-password` → navegação até "Login"
- Tratamento de erro em cada tela (código errado, e-mail não encontrado, etc.)

---

## Fase 12 — Prisma: onboarding financeiro ⬜
*(telas "Dados financeiros", "Economia futura", "Metas futuras")*
- Modelos `DespesaFixa` e `Meta` (já esboçados no seu doc de aprofundamento, seção 11)
- Adaptar aos campos reais das telas: salário, despesas mensais, valor a economizar, prazo estimado, tipo de meta (fundo de emergência, viagem, carro, casa, dívida, reforma, personalizado)
- Migration

## Fase 13 — `POST /onboarding/dados-financeiros` ⬜
- Recebe salário + despesas → salva vinculado ao usuário autenticado (precisa do middleware da Fase 4)

## Fase 14 — `POST /onboarding/economia` ⬜
- Recebe valor pretendido de economia + prazo estimado

## Fase 15 — `POST /onboarding/metas` ⬜
- Recebe lista de metas selecionadas (pode ser mais de uma por usuário)
- Suporte a "objetivo personalizado" (nome livre + valor)

## Fase 16 — Endpoint de resumo ("Visão de futuro") ⬜
- `GET /onboarding/resumo` — devolve o cálculo de margem livre já usando a lógica do seu `calcularOrcamentoMensal`, para a tela final exibir algo real em vez de estático

## Fase 17 — Testes do fluxo de onboarding ⬜
- Roteiro Postman + conferência no phpMyAdmin

## Fase 18 — Integração com as telas de onboarding no React Native ⬜
- Conectar as 4 telas na ordem, com estado entre elas (provavelmente um contexto ou os dados acumulando até o `POST` final)

## Fase 19 — Revisão final de segurança ⬜
- Checklist: nada sensível hardcoded, `.env` fora do Git, rate limit no `/forgot-password`, mensagens de erro não vazando dados

---

### Onde estamos agora
Fase 2, terminando a estrutura de pastas. Próxima etapa concreta: `lib/prisma.ts` (instância única do Prisma Client) — vamos precisar dela já na Fase 3 para o modelo `User`.
