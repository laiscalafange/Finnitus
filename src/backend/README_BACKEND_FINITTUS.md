# Finitus — Configuração inicial do Backend

## Objetivo

Este documento registra a configuração feita no backend do projeto Finitus até a etapa em que o **Node.js + TypeScript + Prisma 7.9.1** conseguiu se conectar ao **MySQL do XAMPP**, acessível pelo phpMyAdmin.

Também registra os problemas encontrados, as correções realizadas e o que outra pessoa precisa instalar/configurar para conseguir rodar o backend em outra máquina.

---

# 1. Tecnologias utilizadas

O backend está sendo preparado com:

- **Node.js** — ambiente de execução do backend.
- **TypeScript** — linguagem utilizada no backend.
- **Express** — framework para criação da API REST.
- **Prisma ORM 7.9.1** — comunicação entre o backend e o banco.
- **MySQL** — banco de dados utilizado inicialmente para desenvolvimento/testes.
- **XAMPP** — utilizado localmente para executar o MySQL e acessar o phpMyAdmin.
- **dotenv** — leitura das variáveis do arquivo `.env`.
- **tsx** — execução de arquivos TypeScript durante o desenvolvimento.
- **@types/node** — definições de tipos do Node.js para o TypeScript.

> O frontend do projeto utiliza React Native/TSX. O backend é um projeto separado, escrito em TypeScript.

---

# 2. Pré-requisitos

Para configurar o backend em outra máquina, é necessário instalar:

## Node.js

Instalar o Node.js.

Após a instalação, verificar:

```bash
node -v
npm -v
```

O projeto foi desenvolvido/testado com Node.js 24.x.

## XAMPP

Instalar o XAMPP para disponibilizar o MySQL localmente.

Depois de instalar:

1. Abrir o XAMPP.
2. Iniciar o **MySQL**.
3. Abrir o phpMyAdmin pelo botão correspondente do XAMPP ou pelo navegador.

> A porta do MySQL utilizada nesta configuração é **3307**. Em outra máquina ela pode ser diferente, portanto deve ser conferida no XAMPP.

---

# 3. Estrutura esperada do backend

O backend está dentro do projeto em:

```text
Finnitus/
└── src/
    └── backend/
        ├── prisma/
        │   └── schema.prisma
        ├── prisma.config.ts
        ├── .env
        ├── package.json
        ├── tsconfig.json
        └── ...
```

O arquivo `.env` não deve ser versionado no Git caso contenha credenciais reais.

---

# 4. Instalação das dependências

Entrar na pasta do backend:

```bash
cd C:\xampp\htdocs\Finnitus\src\backend
```

Depois instalar as dependências:

```bash
npm install
```

As principais dependências utilizadas atualmente são:

```text
@prisma/client
dotenv
express
```

E as principais dependências de desenvolvimento:

```text
@types/express
@types/node
prisma
tsx
typescript
```

As versões são controladas pelo `package.json` e pelo `package-lock.json`.

Por isso, para reproduzir exatamente o ambiente do projeto, o ideal é usar:

```bash
npm install
```

e manter o `package-lock.json` no projeto.

---

# 5. Prisma

A versão utilizada durante esta configuração foi:

```text
Prisma 7.9.1
@prisma/client 7.9.1
```

Para verificar:

```bash
npx prisma -v
```

O resultado deve indicar uma versão compatível com a utilizada pelo projeto.

---

# 6. Configuração do banco MySQL

No XAMPP, o MySQL foi configurado na porta:

```text
3307
```

O banco utilizado para testes é:

```text
finitus_test
```

O usuário padrão utilizado localmente é:

```text
root
```

e, nessa configuração, a senha está vazia.

> Em uma instalação diferente do XAMPP, o usuário, senha, porta ou nome do banco podem ser diferentes.

---

# 7. Criar o banco no phpMyAdmin

Abrir o phpMyAdmin.

Normalmente:

```text
http://localhost/phpmyadmin
```

Criar um banco chamado:

```text
finitus_test
```

Não é necessário criar as tabelas manualmente quando o projeto estiver utilizando migrations do Prisma.

---

# 8. Arquivo `.env`

Na raiz do backend:

```text
src/backend/.env
```

criar:

```env
DATABASE_URL="mysql://root:@localhost:3307/finitus_test"
```

A estrutura da URL é:

```text
mysql://USUARIO:SENHA@HOST:PORTA/BANCO
```

Neste caso:

```text
mysql://root:@localhost:3307/finitus_test
```

significa:

- Banco: MySQL
- Usuário: `root`
- Senha: vazia
- Host: `localhost`
- Porta: `3307`
- Banco: `finitus_test`

### Se a senha do MySQL for diferente

Por exemplo, se o usuário `root` tiver a senha `1234`:

```env
DATABASE_URL="mysql://root:1234@localhost:3307/finitus_test"
```

### Importante

Não utilizar:

```text
http://localhost/phpmyadmin
```

como `DATABASE_URL`.

O phpMyAdmin é uma interface web para administrar o banco. O Prisma se conecta diretamente ao servidor MySQL.

---

# 9. `prisma.config.ts`

Como o projeto utiliza **Prisma 7**, a URL da conexão é configurada no `prisma.config.ts`.

Arquivo:

```text
src/backend/prisma.config.ts
```

Conteúdo:

```ts
import "dotenv/config";

import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",

  migrations: {
    path: "prisma/migrations",
  },

  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
```

O `dotenv/config` carrega as variáveis do arquivo `.env`.

---

# 10. `schema.prisma`

O provider do banco precisa ser MySQL:

```prisma
generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}

datasource db {
  provider = "mysql"
}
```

Uma configuração inicial do Prisma pode ter vindo com:

```prisma
provider = "postgresql"
```

Isso precisou ser alterado para:

```prisma
provider = "mysql"
```

porque o banco utilizado no desenvolvimento é o MySQL do XAMPP.

---

# 11. Configuração do TypeScript

O backend utiliza módulos ES (ES Modules).

O `package.json` precisa conter apenas uma definição:

```json
"type": "module"
```

### Atenção

Não deixar simultaneamente:

```json
"type": "module",
"type": "commonjs"
```

O projeto chegou a apresentar esse problema. A definição `commonjs` foi removida.

---

# 12. `tsconfig.json`

Uma configuração utilizada para o backend é:

```json
{
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "target": "ES2022",

    "types": ["node"],

    "sourceMap": true,
    "declaration": true,
    "declarationMap": true,

    "strict": true,

    "verbatimModuleSyntax": true,
    "isolatedModules": true,
    "moduleDetection": "force",

    "skipLibCheck": true
  },
  "include": ["src/**/*.ts", "prisma.config.ts"]
}
```

### Por que `"types": ["node"]`?

Isso permite que o TypeScript reconheça recursos do Node.js, como:

```ts
process.env
```

Sem isso, pode aparecer:

```text
Não é possível encontrar o nome 'process'.
```

---

# 13. Problema com `exactOptionalPropertyTypes`

Durante a configuração, apareceu um erro no:

```ts
url: process.env["DATABASE_URL"]
```

porque `process.env["DATABASE_URL"]` pode ser:

```text
string | undefined
```

e o Prisma esperava uma string opcional mais restritiva devido a:

```json
"exactOptionalPropertyTypes": true
```

Essa opção foi removida da configuração para evitar o conflito com o `PrismaConfig`.

Portanto, o `tsconfig.json` atual não precisa conter:

```json
"exactOptionalPropertyTypes": true
```

---

# 14. `@types/node`

O projeto utiliza:

```text
@types/node
```

Caso não esteja instalado:

```bash
npm install -D @types/node
```

Depois garantir no `tsconfig.json`:

```json
"types": ["node"]
```

---

# 15. Testar a configuração do Prisma

Depois de configurar o `.env` e o `schema.prisma`:

```bash
npx prisma validate
```

O objetivo é obter uma mensagem indicando que o schema é válido.

Depois:

```bash
npx prisma generate
```

Isso gera o Prisma Client.

---

# 16. Testar a conexão com o MySQL

Um comando utilizado durante a configuração foi:

```bash
npx prisma db pull
```

O resultado obtido foi semelhante a:

```text
Datasource "db": MySQL database "finitus_test" at "localhost:3307"
```

Isso confirmou que o Prisma conseguiu acessar o MySQL do XAMPP.

Foi exibido também:

```text
P4001 The introspected database was empty
```

Isso aconteceu porque o banco ainda estava sem tabelas.

### Importante

Esse resultado **não significou que a conexão estava errada**.

Na verdade, a mensagem:

```text
MySQL database "finitus_test" at "localhost:3307"
```

confirmou que a conexão funcionou.

O `db pull` é utilizado principalmente quando já existem tabelas no banco e queremos trazer a estrutura delas para o Prisma.

---

# 17. `migrate dev`

Quando o schema do Prisma estiver definido com os modelos do sistema, as tabelas devem ser criadas através de migrations.

Comando:

```bash
npx prisma migrate dev --name initial
```

Não é necessário criar manualmente as tabelas pelo phpMyAdmin se elas forem gerenciadas pelo Prisma.

Depois de uma migration, é possível verificar as tabelas no phpMyAdmin.

---

# 18. Erros encontrados e soluções

## Erro: ECMAScript imports/exports em CommonJS

Mensagem semelhante a:

```text
Importações e exportações ECMAScript não podem ser gravadas em um arquivo CommonJS...
```

### Causa

O `package.json` estava com:

```json
"type": "commonjs"
```

ou chegou a conter:

```json
"type": "module"
```

e:

```json
"type": "commonjs"
```

ao mesmo tempo.

### Solução

Manter somente:

```json
"type": "module"
```

---

## Erro: `process` não encontrado

Mensagem:

```text
Não é possível encontrar o nome 'process'.
```

### Solução

Instalar:

```bash
npm install -D @types/node
```

e colocar no `tsconfig.json`:

```json
"types": ["node"]
```

---

## Erro envolvendo `string | undefined`

Mensagem semelhante:

```text
O tipo 'string | undefined' não pode ser atribuído ao tipo 'string'.
```

### Causa

O `process.env` pode retornar `undefined`, e a opção:

```json
"exactOptionalPropertyTypes": true
```

deixava a checagem mais restritiva.

### Solução utilizada

Remover:

```json
"exactOptionalPropertyTypes": true
```

---

## Erro Prisma P4001

Mensagem:

```text
The introspected database was empty
```

### Causa

O banco `finitus_test` estava vazio.

### Importante

A conexão com o MySQL estava funcionando.

Para um banco novo, o fluxo correto é definir os modelos no `schema.prisma` e utilizar:

```bash
npx prisma migrate dev --name initial
```

---

# 19. Como outra pessoa deve configurar o projeto

Depois de clonar/receber o projeto:

### Passo 1 — instalar Node.js

Verificar:

```bash
node -v
npm -v
```

### Passo 2 — instalar XAMPP

Iniciar o MySQL.

Conferir a porta no XAMPP.

### Passo 3 — entrar na pasta do backend

```bash
cd Finnitus/src/backend
```

### Passo 4 — instalar dependências

```bash
npm install
```

### Passo 5 — criar o banco

No phpMyAdmin, criar:

```text
finitus_test
```

### Passo 6 — criar `.env`

Criar:

```text
src/backend/.env
```

com:

```env
DATABASE_URL="mysql://root:@localhost:3307/finitus_test"
```

Ajustar usuário, senha e porta caso sejam diferentes na máquina.

### Passo 7 — verificar Prisma

```bash
npx prisma validate
```

### Passo 8 — gerar o Prisma Client

```bash
npx prisma generate
```

### Passo 9 — executar migrations

Quando houver migrations no repositório:

```bash
npx prisma migrate dev
```

Para uma migration inicial ainda não criada:

```bash
npx prisma migrate dev --name initial
```

---

# 20. O que ainda precisa ser feito

A conexão com o banco é apenas a primeira etapa do backend.

Ainda será necessário implementar:

```text
Backend
│
├── Express
│   ├── servidor
│   └── rotas
│
├── Prisma
│   ├── User
│   └── PasswordReset
│
├── Recuperação de senha
│   ├── receber e-mail
│   ├── procurar usuário
│   ├── gerar código temporário
│   ├── armazenar hash do código
│   ├── definir validade
│   ├── enviar e-mail
│   ├── validar código
│   └── permitir nova senha
│
├── Segurança
│   ├── hash da senha com bcrypt
│   ├── não armazenar senha em texto puro
│   ├── expiração do código
│   ├── uso único do código
│   └── proteção das rotas
│
└── Integração
    └── React Native → API → Banco
```

---

# 21. Fluxo planejado para recuperação de senha

O fluxo esperado para o Finitus é:

```text
Usuário
   │
   ▼
Tela "Esqueci minha senha"
   │
   │ envia e-mail
   ▼
POST /forgot-password
   │
   ▼
Backend
   │
   ├── verifica e-mail
   ├── gera código
   ├── cria hash do código
   ├── salva código/expiração
   └── envia e-mail
          │
          ▼
      Usuário recebe código
          │
          ▼
Tela "Código enviado"
          │
          ▼
Usuário informa código
          │
          ▼
POST /verify-code
          │
          ▼
Backend valida código
          │
          ▼
Tela "Trocar senha"
          │
          ▼
POST /reset-password
          │
          ▼
Backend faz hash da nova senha
          │
          ▼
Banco de dados atualizado
```

---

# 22. Próximas tecnologias que serão necessárias

Para implementar a recuperação de senha, provavelmente serão adicionados:

### Nodemailer

Para enviar e-mails:

```bash
npm install nodemailer
```

### Tipos do Nodemailer

```bash
npm install -D @types/nodemailer
```

### bcrypt

Para gerar hash das senhas:

```bash
npm install bcrypt
```

Dependendo da implementação escolhida, também pode ser necessário:

```bash
npm install -D @types/bcrypt
```

Essas dependências devem ser adicionadas somente quando a implementação da funcionalidade começar.

---

# 23. Banco de testes x PostgreSQL

O MySQL do XAMPP está sendo utilizado como banco de desenvolvimento/testes neste momento.

Posteriormente, o projeto poderá migrar para PostgreSQL.

Isso exigirá principalmente:

1. Criar o banco PostgreSQL.
2. Alterar a `DATABASE_URL`.
3. Alterar o `provider` do Prisma.
4. Executar as migrations no novo banco.
5. Testar a aplicação novamente.

No Prisma, a diferença principal no schema será:

```prisma
datasource db {
  provider = "postgresql"
}
```

em vez de:

```prisma
datasource db {
  provider = "mysql"
}
```

A arquitetura do backend pode continuar utilizando Node.js + TypeScript + Express + Prisma.

---

# 24. Checklist rápido para rodar o backend

Antes de iniciar o desenvolvimento:

- [ ] Node.js instalado
- [ ] npm funcionando
- [ ] XAMPP instalado
- [ ] MySQL iniciado no XAMPP
- [ ] Porta do MySQL conferida
- [ ] Banco `finitus_test` criado
- [ ] `.env` criado
- [ ] `DATABASE_URL` configurada
- [ ] `npm install` executado
- [ ] `@types/node` instalado
- [ ] `package.json` com `"type": "module"`
- [ ] `tsconfig.json` configurado para NodeNext
- [ ] `schema.prisma` usando `provider = "mysql"`
- [ ] `npx prisma validate` funcionando
- [ ] `npx prisma generate` executado
- [ ] migrations executadas

---

# 25. Comandos principais

### Instalar dependências

```bash
npm install
```

### Verificar Prisma

```bash
npx prisma -v
```

### Validar schema

```bash
npx prisma validate
```

### Gerar Prisma Client

```bash
npx prisma generate
```

### Criar migration

```bash
npx prisma migrate dev --name initial
```

### Aplicar migrations existentes

```bash
npx prisma migrate dev
```

### Abrir Prisma Studio

```bash
npx prisma studio
```

### Verificar TypeScript

```bash
npx tsc --noEmit
```

---

# 26. Observação sobre `.env`

O arquivo `.env` pode conter informações sensíveis.

Adicionar ao `.gitignore`:

```gitignore
.env
```

Se o projeto for compartilhado pelo Git, recomenda-se criar um arquivo:

```text
.env.example
```

com:

```env
DATABASE_URL="mysql://root:@localhost:3307/finitus_test"
```

Assim, outras pessoas sabem quais variáveis precisam configurar sem receber as credenciais reais.

---

## Estado atual

Ao final desta etapa, o ambiente possui:

```text
React Native / TSX
        │
        │ (integração ainda será feita)
        ▼
Node.js + TypeScript
        │
        ▼
Express
        │
        ▼
Prisma 7.9.1
        │
        ▼
MySQL
        │
        ▼
XAMPP / phpMyAdmin
```

A conexão **Prisma → MySQL do XAMPP** foi validada com sucesso utilizando o banco:

```text
finitus_test
```

na porta:

```text
3307
```

O próximo grande passo é implementar a API Express e a funcionalidade de recuperação de senha.
