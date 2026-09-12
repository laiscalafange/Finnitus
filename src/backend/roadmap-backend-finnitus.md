# Roadmap — Backend Finnitus

Plano completo do backend do Finnitus, desde a configuração do ambiente até a autenticação completa, integração com o React Native e preparação para as funcionalidades financeiras.

Cada fase pode ser desenvolvida seguindo:

**Objetivo → arquivos → implementação → explicação → testes → confirmação**

### Legenda

* ✅ Concluído
* 🔵 Em andamento
* ⬜ A fazer

---

## Fase 0 — Ambiente ✅

* Node.js instalado e configurado.
* Prisma `7.9.1` instalado.
* PostgreSQL configurado no **Neon**.
* Conexão Prisma → PostgreSQL/Neon validada.
* Banco `neondb` conectado ao backend.
* `.env` e `.env.example` criados.
* `DATABASE_URL` configurada.
* Prisma Client gerado corretamente.

Comandos principais utilizados:

```bash
npx prisma db pull
npx prisma generate
```

---

## Fase 1 — Servidor Express ✅

* `app.ts` criado.
* `server.ts` criado.
* Express configurado.
* `express.json()` configurado para receber JSON.
* Rota `GET /health`.
* Script funcionando:

```bash
npm run dev
```

Servidor local:

```text
http://localhost:3333
```

---

## Fase 2 — Estrutura do backend ✅

Estrutura organizada em:

```text
src/
├── config/
├── controllers/
├── lib/
├── middlewares/
├── routes/
├── services/
├── utils/
└── Servidor/
```

Implementado:

* ✅ `routes/` — definição das rotas.
* ✅ `controllers/` — controle das requisições.
* ✅ `config/env.ts` — leitura centralizada das variáveis de ambiente.
* ✅ `lib/prisma.ts` — instância central do Prisma Client.
* ✅ `services/` — regras de negócio.
* ✅ `utils/` — funções auxiliares.
* ✅ `middlewares/` — estrutura criada.
* ⬜ Middleware JWT de autenticação será implementado em uma fase própria.

---

## Fase 3 — Prisma e banco PostgreSQL ✅

O projeto atualmente utiliza:

```text
PostgreSQL
   ↓
Neon
   ↓
Prisma
   ↓
Backend Node.js
```

O banco foi conectado e introspectado através do Prisma.

Foram identificados os modelos existentes no banco, incluindo:

* `Usuario`
* `RedefinicaoSenha`
* `EntradaDinheiro`
* `Gastos`
* `Metas`
* `Imprevistos`
* `Eventos`
* `AnaliseSentimental`

Comandos utilizados:

```bash
npx prisma db pull
npx prisma generate
```

A estrutura do banco pode ser conferida através de:

```bash
npx prisma studio
```

ou diretamente pelo painel do **Neon**.

---

## Fase 4 — Cadastro e login básico ✅

Implementação da autenticação inicial dos usuários.

### Cadastro

Endpoint:

```http
POST /register
```

Implementado:

* Recebimento dos dados do usuário.
* Validação dos campos obrigatórios.
* Validação do tamanho mínimo da senha.
* Verificação de e-mail já cadastrado.
* Hash da senha utilizando `bcrypt`.
* Cadastro do usuário no PostgreSQL.

### Login

Endpoint:

```http
POST /login
```

Implementado:

* Busca do usuário pelo e-mail.
* Comparação da senha utilizando `bcrypt`.
* Tratamento de credenciais inválidas.
* Emissão de JWT.
* Configuração de `JWT_SECRET`.
* Configuração de `JWT_EXPIRES_IN`.

Fluxo:

```text
E-mail + senha
      ↓
Busca Usuario
      ↓
bcrypt.compare()
      ↓
JWT
      ↓
Login realizado
```

---

## Fase 5 — Recuperação de senha no banco ✅

Modelo utilizado:

```text
RedefinicaoSenha
```

Principais campos:

* `id_Redefinicao`
* `id_Usuario`
* `codigo_hash`
* `expira_em`
* `usado`
* `criado_em`

Implementado:

* Relação com `Usuario`.
* Código armazenado como **hash**, nunca em texto puro.
* Controle de expiração.
* Controle de uso único.

O código de recuperação possui validade de:

```text
15 minutos
```

---

## Migração de MySQL para PostgreSQL ✅

O projeto utilizava inicialmente MySQL/MariaDB e foi alterado para PostgreSQL hospedado no Neon.

### Adapter antigo removido

```bash
npm uninstall @prisma/adapter-mariadb
```

### Dependências do PostgreSQL instaladas

```bash
npm install @prisma/adapter-pg pg
npm install -D @types/pg
```

### Prisma configurado para PostgreSQL

Conexão utilizando:

```text
DATABASE_URL
```

### Banco sincronizado e Prisma Client regenerado

```bash
npx prisma db pull
npx prisma generate
```

A conexão com o PostgreSQL no Neon foi validada com sucesso.

---

## Fase 6 — Envio de e-mail com Nodemailer ✅

Dependências:

```bash
npm install nodemailer
npm install -D @types/nodemailer
```

Configuração SMTP através do `.env`:

```text
EMAIL_HOST
EMAIL_PORT
EMAIL_SECURE
EMAIL_USER
EMAIL_PASSWORD
EMAIL_FROM
```

Criado:

```text
services/emailService.ts
```

Funções reutilizáveis para envio de e-mails.

Implementado envio do código de recuperação de senha por e-mail.

---

## Fase 7 — `POST /forgot-password` ✅

Tela relacionada:

**Esqueci minha senha / Recuperação de senha**

Endpoint:

```http
POST /forgot-password
```

Fluxo:

```text
Recebe e-mail
      ↓
Busca Usuario
      ↓
Gera código de 4 dígitos
      ↓
Gera hash do código com Argon2
      ↓
Salva em RedefinicaoSenha
      ↓
Define validade de 15 minutos
      ↓
Envia código por e-mail
```

Dependência utilizada:

```bash
npm install argon2
```

A resposta é propositalmente genérica:

```text
Se o e-mail existir, um código de redefinição foi enviado.
```

Isso evita revelar se determinado e-mail possui ou não uma conta no Finnitus.

---

## Fase 8 — `POST /verify-code` ✅

Tela relacionada:

**Verificação de e-mail / Inserção do código**

Endpoint:

```http
POST /verify-code
```

Recebe:

```json
{
  "email": "usuario@email.com",
  "code": "1234"
}
```

Implementado:

* Busca do usuário.
* Busca da redefinição mais recente.
* Verificação de `usado = false`.
* Verificação da data de expiração.
* Comparação do código com o hash Argon2.
* Código válido somente uma vez.
* Alteração de `usado` para `true`.
* Geração de `resetToken`.

Fluxo:

```text
E-mail + código
      ↓
Valida código
      ↓
Valida expiração
      ↓
Valida uso único
      ↓
Gera resetToken
```

---

## Fase 9 — `POST /reset-password` ✅

Tela relacionada:

**Nova senha**

Endpoint:

```http
POST /reset-password
```

Recebe:

```json
{
  "resetToken": "...",
  "newPassword": "NovaSenha123"
}
```

Implementado:

* Verificação do `resetToken`.
* Identificação do usuário.
* Senha mínima de 8 caracteres.
* Hash da nova senha utilizando `bcrypt`.
* Atualização de `Usuario.Usenha`.

Após a redefinição, foi confirmado que o usuário consegue fazer login utilizando a nova senha.

---

## Fase 10 — Testes do fluxo de autenticação e recuperação ✅

Os testes foram realizados diretamente pelo **PowerShell**, utilizando:

```powershell
Invoke-RestMethod
```

Não foi necessário utilizar Postman ou Insomnia.

### Fluxo principal testado

```text
POST /forgot-password
        ↓
POST /verify-code
        ↓
resetToken
        ↓
POST /reset-password
        ↓
POST /login
```

### Casos testados

* ✅ E-mail existente.
* ✅ E-mail inexistente.
* ✅ Código correto.
* ✅ Código incorreto.
* ✅ Código expirado.
* ✅ Código já utilizado.
* ✅ Senha válida.
* ✅ Senha menor que 8 caracteres.
* ✅ Token inválido.
* ✅ Campos obrigatórios ausentes.
* ✅ Login com nova senha.
* ✅ Login com senha antiga bloqueado.

### Conferência do banco

Realizada através do:

```bash
npx prisma studio
```

e/ou Neon.

Verificado:

* `codigo_hash` armazenado como hash.
* `expira_em` armazenado corretamente.
* `usado = false` antes da validação.
* `usado = true` após a validação.
* Nova senha armazenada como hash bcrypt.

---

# Fase 11 — Finalização da autenticação no backend ⬜

Antes de conectar completamente o React Native, finalizar os recursos necessários para identificar e proteger o usuário autenticado.

---

## Fase 11.1 — Middleware JWT ⬜

Criar:

```text
src/middlewares/auth.middleware.ts
```

Responsabilidades:

* Ler o header:

```http
Authorization: Bearer TOKEN
```

* Verificar se o token existe.
* Validar o JWT.
* Verificar se o token está expirado.
* Recuperar o `id_Usuario` através do `sub` do token.
* Disponibilizar o usuário autenticado para os controllers seguintes.

Resultados esperados:

```text
Token válido → acesso permitido
Token ausente → HTTP 401
Token inválido → HTTP 401
Token expirado → HTTP 401
```

Esse middleware será usado posteriormente em:

* Perfil.
* Gestão financeira.
* Metas.
* Calendário.
* Dashboard.
* Plano B.
* Configurações.

---

## Fase 11.2 — `GET /me` ⬜

Criar endpoint:

```http
GET /me
```

Rota protegida pelo middleware JWT.

Objetivo:

Retornar os dados do usuário atualmente autenticado.

Exemplo:

```json
{
  "id": 2,
  "name": "Laís",
  "email": "usuario@email.com",
  "telefone": "...",
  "data_nasc": "...",
  "tipo": "..."
}
```

Nunca retornar:

```text
Usenha
```

Fluxo:

```text
JWT
 ↓
authMiddleware
 ↓
id_Usuario
 ↓
Usuario
 ↓
dados do perfil
```

---

## Fase 11.3 — Testes das rotas protegidas ⬜

Testar pelo PowerShell:

### Sem token

```text
GET /me
```

Resultado esperado:

```text
401 Não autorizado
```

### Token inválido

Resultado esperado:

```text
401 Token inválido ou expirado
```

### Token válido

Resultado esperado:

```text
200 + dados do usuário
```

---

## Fase 11.4 — Alteração de senha pelo usuário logado ⬜

Diferente do fluxo **Esqueci minha senha**.

Criar:

```http
PATCH /me/password
```

Receber:

```json
{
  "currentPassword": "SenhaAtual123",
  "newPassword": "NovaSenha456"
}
```

Fluxo:

```text
JWT
 ↓
Usuário autenticado
 ↓
Verifica senha atual
 ↓
Valida nova senha
 ↓
bcrypt.hash()
 ↓
Atualiza Usenha
```

Testar:

* senha atual correta;
* senha atual incorreta;
* nova senha menor que 8 caracteres;
* alteração realizada com sucesso;
* login posterior com a nova senha.

---

## Fase 11.5 — Editar dados da conta ⬜

Criar:

```http
PATCH /me
```

Permitir alteração de dados como:

* nome;
* telefone;
* data de nascimento.

Validar os campos recebidos antes da atualização.

A alteração de e-mail deve ser tratada separadamente ou com validações adicionais, pois o e-mail participa da autenticação e da recuperação de senha.

---

## Fase 11.6 — Excluir conta ⬜

Criar:

```http
DELETE /me
```

Rota protegida por JWT.

Antes de excluir:

* identificar o usuário autenticado;
* solicitar confirmação;
* preferencialmente confirmar novamente a senha;
* analisar as relações do usuário no Prisma;
* remover corretamente dados relacionados;
* excluir o usuário.

Dados relacionados podem incluir:

```text
Usuario
├── RedefinicaoSenha
├── EntradaDinheiro
├── Gastos
├── Metas
├── Imprevistos
├── Eventos
└── AnaliseSentimental
```

Antes de utilizar:

```prisma
onDelete: Cascade
```

analisar quais relações realmente devem ser removidas automaticamente.

Preferir transações quando necessário.

---

## Fase 11.7 — Logout ⬜

No modelo atual com JWT simples, não é necessário criar obrigatoriamente:

```http
POST /logout
```

O logout será realizado principalmente no frontend.

Fluxo:

```text
Usuário toca "Sair"
        ↓
Remove JWT armazenado
        ↓
Limpa dados da sessão
        ↓
Volta para Login
```

Um endpoint de logout no backend só seria necessário posteriormente caso fossem implementados:

* refresh tokens;
* blacklist de tokens;
* sessões armazenadas no banco;
* gerenciamento de vários dispositivos.

---

# Fase 12 — Integração da autenticação com React Native ⬜

Depois que a autenticação do backend estiver finalizada, conectar as telas existentes do Finnitus.

---

## Fase 12.1 — Serviço de API/autenticação ⬜

Criar um serviço centralizado no frontend, por exemplo:

```text
services/authService.ts
```

Centralizar chamadas como:

```text
register()
login()
forgotPassword()
verifyCode()
resetPassword()
getMe()
changePassword()
updateProfile()
deleteAccount()
```

Evitar chamadas `fetch()` espalhadas pelas telas.

---

## Fase 12.2 — Login real ⬜

Conectar a tela de Login ao:

```http
POST /login
```

Após login:

```text
E-mail + senha
      ↓
Backend
      ↓
JWT
      ↓
Salvar token
      ↓
Usuário autenticado
```

Tratar:

* credenciais inválidas;
* campos vazios;
* erro de conexão;
* carregamento.

---

## Fase 12.3 — Armazenamento da sessão ⬜

Armazenar o JWT de forma apropriada no aplicativo.

Ao iniciar o Finnitus:

```text
Aplicativo abre
      ↓
Existe token?
   ↙        ↘
 não        sim
 ↓           ↓
Login      GET /me
             ↓
        token válido?
         ↙       ↘
       sim       não
        ↓         ↓
      Home       Login
```

---

## Fase 12.4 — Logout no React Native ⬜

Na opção:

```text
Configurações → Sair
```

Executar:

```text
Remover JWT
      ↓
Limpar usuário da sessão
      ↓
router.replace("/login")
```

---

## Fase 12.5 — Recuperação de senha ⬜

Integrar as telas existentes:

```text
Esqueci minha senha
       ↓
POST /forgot-password
       ↓
Verificação do código
       ↓
POST /verify-code
       ↓
resetToken
       ↓
Nova senha
       ↓
POST /reset-password
       ↓
Login
```

Tratamentos:

* código incorreto;
* código expirado;
* token inválido;
* senha menor que 8 caracteres;
* confirmação de senha diferente;
* erro de conexão.

Não revelar no frontend se determinado e-mail está ou não cadastrado.

---

## Fase 12.6 — Tela de perfil/conta ⬜

Integrar:

```http
GET /me
```

para carregar dados reais do usuário.

Substituir informações mockadas relacionadas à conta por dados reais.

---

## Fase 12.7 — Editar conta ⬜

Integrar:

```http
PATCH /me
```

com a tela:

```text
Configurações → Editar conta
```

Permitir atualização dos dados pessoais disponíveis.

---

## Fase 12.8 — Segurança / alterar senha ⬜

Integrar:

```http
PATCH /me/password
```

com:

```text
Configurações → Segurança → Alterar senha
```

Fluxo:

```text
Senha atual
   ↓
Nova senha
   ↓
Confirmar nova senha
   ↓
Backend
   ↓
Senha atualizada
```

---

## Fase 12.9 — Excluir conta ⬜

Integrar:

```http
DELETE /me
```

Adicionar confirmação antes da exclusão:

```text
Excluir minha conta?

Esta ação não poderá ser desfeita.
```

Após sucesso:

```text
Excluir conta
     ↓
Remover JWT
     ↓
Limpar sessão
     ↓
Login / tela inicial
```

---

# Fase 13 — Onboarding financeiro com dados reais ⬜

Depois da autenticação estar integrada, iniciar a conexão do onboarding financeiro ao usuário autenticado.

Objetivo:

```text
JWT
 ↓
id_Usuario
 ↓
dados financeiros daquele usuário
```

Evitar depender de IDs enviados manualmente pelo frontend.

O usuário deve ser identificado através do JWT.

Integrar posteriormente:

* dados iniciais do usuário;
* entradas;
* gastos;
* informações utilizadas no onboarding financeiro;
* dados necessários para personalização inicial do Finnitus.

---

# Fase 14 — Integração das funcionalidades principais ⬜

Com autenticação e identificação do usuário funcionando, substituir progressivamente dados mockados por dados reais.

Ordem sugerida:

```text
1. Gestão financeira
2. Metas
3. Calendário
4. Dashboard
5. Plano B
```

Todas as funcionalidades devem utilizar:

```text
JWT
 ↓
authMiddleware
 ↓
id_Usuario
 ↓
dados pertencentes ao usuário autenticado
```

---

# Estado atual do projeto

```text
Ambiente                              ✅
Express                               ✅
PostgreSQL / Neon                     ✅
Prisma                                ✅
Cadastro                              ✅
Login                                 ✅
JWT                                   ✅
Recuperação de senha                  ✅
Código por e-mail                     ✅
Verificação do código                 ✅
Reset de senha                        ✅
Testes pelo terminal                  ✅

Middleware JWT                        ⬜
GET /me                               ⬜
Alterar senha logado                  ⬜
Editar conta                          ⬜
Excluir conta                         ⬜
Logout no frontend                    ⬜

Integração React Native               ⬜
Sessão persistente                    ⬜
Onboarding financeiro real            ⬜
Funcionalidades com dados reais       ⬜
```

## Próxima etapa recomendada

A próxima implementação deve ser:

```text
Fase 11.1 — Middleware JWT
          ↓
Fase 11.2 — GET /me
          ↓
Testes de autenticação
          ↓
Alterar senha
Editar conta
Excluir conta
          ↓
Integração React Native
```

Assim, quando o React Native começar a consumir o backend, a base de autenticação já estará pronta para também proteger **metas, gastos, entradas, calendário, dashboard**
