# Códigos completos — calendário do Finnitus

Use este documento se preferir criar/alterar cada arquivo manualmente. Leia o roadmap e o guia antes. Caminhos relativos à raiz `Finnitus`. Os blocos mostram o conteúdo completo final de cada arquivo, e não apenas fragmentos.

**Antes de aplicar:** se sua versão de autenticação/finanças for mais recente do que o anexo, incorpore a alteração específica nos arquivos existentes; não substitua cegamente. Nunca substitua seu `.env` real por valores de exemplo.

A ordem dos blocos vai do banco à API, depois sessão, front, configuração e testes. Após alterar o package.json, execute npm install na raiz e no backend para atualizar os respectivos lockfiles. No ZIP, eles já estão atualizados.

## 1. ALTERAR `src/backend/prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}

datasource db {
  provider = "postgresql"
}

model Usuario {
  id_Usuario     Int                @id @default(autoincrement())
  Unome          String             @db.VarChar(100)
  Usenha         String             @db.VarChar(255)
  Uemail         String             @unique @db.VarChar(100)
  Utelefone      String             @db.VarChar(15)
  Udata_nasc     DateTime           @db.Date
  Udata_cadastro DateTime
  UTipo          String
  redefinicoes   RedefinicaoSenha[]
  gastos         Gastos[]
  eventos        Eventos[]
}

model RedefinicaoSenha {
  id_Redefinicao Int      @id @default(autoincrement())
  id_Usuario     Int
  codigo_hash    String   @db.VarChar(255)
  expira_em      DateTime
  usado          Boolean  @default(false)
  criado_em      DateTime @default(now())
  Usuario        Usuario  @relation(fields: [id_Usuario], references: [id_Usuario], onDelete: Cascade)
}

model EntradaDinheiro {
  id_Dinheiro Int      @id @default(autoincrement())
  id_Usuario  Int
  Dnome       String   @db.VarChar(100)
  Dvalor      Decimal  @db.Decimal(10, 2)
  Ddata       DateTime @db.Date
  Ddescricao  String   @db.VarChar(50)
}

model Gastos {
  id_Gasto Int @id @default(autoincrement())

  id_Usuario Int

  Usuario Usuario @relation(fields: [id_Usuario], references: [id_Usuario], onDelete: Cascade)

  Gnome      String
  Gvalor     Decimal
  Gcategoria String
  Gdata      DateTime
  Gdescricao String
}

model Metas {
  id_Meta         Int      @id @default(autoincrement())
  id_Usuario      Int
  Mnome           String   @db.VarChar(100)
  Mvalor_objetivo Decimal  @db.Decimal(10, 2)
  Mvalor_atual    Decimal  @db.Decimal(10, 2)
  Mprazo          DateTime @db.Date
  Mstatus         String
}

model Imprevistos {
  id_Imprevisto     Int      @id @default(autoincrement())
  id_Usuario        Int
  Inome             String   @db.VarChar(100)
  Ivalor            Decimal  @db.Decimal(10, 2)
  solucao_escolhida String   @db.VarChar(100)
  Idata             DateTime @db.Date
  Idescricao        String   @db.VarChar(50)
}

model Eventos {
  id_Evento          Int      @id @default(autoincrement())
  id_Usuario         Int
  Enome              String   @db.VarChar(100)
  impacto_financeiro Decimal  @db.Decimal(10, 2)
  Edata              DateTime @db.Date
  Edescricao         String   @db.VarChar(1000)
  inicio             DateTime @db.Timestamptz(3)
  fim                DateTime @db.Timestamptz(3)
  diaInteiro         Boolean  @default(false)
  Usuario            Usuario  @relation(fields: [id_Usuario], references: [id_Usuario], onDelete: Cascade)

  @@index([id_Usuario, inicio])
}

model AnaliseSentimental {
  id_Sentimento      Int      @id @default(autoincrement())
  id_Usuario         Int
  Shumor             String   @db.VarChar(40)
  nivel_estresse     Int
  estado_sentimental String   @db.VarChar(50)
  Sdata              DateTime @db.Date
  Scomentario        String   @db.VarChar(50)
}
```

## 2. CRIAR `src/backend/prisma/migrations/20260913000100_calendario/migration.sql`

```sql
-- Não remove a tabela nem os dados. Registros antigos tornam-se eventos de dia inteiro em UTC.
-- Se houver Eventos órfãos, a FK falhará: corrigir os vínculos antes, sem excluir silenciosamente.
ALTER TABLE "Eventos" ADD COLUMN "inicio" TIMESTAMPTZ(3),
 ADD COLUMN "fim" TIMESTAMPTZ(3), ADD COLUMN "diaInteiro" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Eventos" ALTER COLUMN "Edescricao" TYPE VARCHAR(1000);
UPDATE "Eventos" SET "inicio" = "Edata"::timestamp AT TIME ZONE 'UTC',
 "fim" = ("Edata"::timestamp + interval '1 day') AT TIME ZONE 'UTC', "diaInteiro" = true;
ALTER TABLE "Eventos" ALTER COLUMN "inicio" SET NOT NULL, ALTER COLUMN "fim" SET NOT NULL;
ALTER TABLE "Eventos" ADD CONSTRAINT "Eventos_intervalo_check" CHECK ("fim" > "inicio");
CREATE INDEX "Eventos_id_Usuario_inicio_idx" ON "Eventos"("id_Usuario", "inicio");
ALTER TABLE "Eventos" ADD CONSTRAINT "Eventos_id_Usuario_fkey"
 FOREIGN KEY ("id_Usuario") REFERENCES "Usuario"("id_Usuario") ON DELETE CASCADE ON UPDATE CASCADE;
```

## 3. CRIAR `src/backend/src/utils/calendar.validation.ts`

```typescript
// Validação pura: usada nas rotas e testável sem abrir conexão com PostgreSQL.
export class CalendarError extends Error {
  status: number;
  constructor(message: string, status = 400) { super(message); this.status = status; }
}
export function dateOnly(value: unknown): string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value))
    throw new CalendarError("Data deve usar AAAA-MM-DD.");
  const d = new Date(`${value}T00:00:00.000Z`);
  if (!Number.isFinite(d.getTime()) || d.toISOString().slice(0, 10) !== value)
    throw new CalendarError("Data inexistente.");
  return value;
}
export function instant(value: unknown): Date {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/.test(value))
    throw new CalendarError("Horário deve estar em ISO 8601 com fuso.");
  dateOnly(value.slice(0, 10));
  if (+value.slice(11, 13) > 23 || +value.slice(14, 16) > 59 || +value.slice(17, 19) > 59)
    throw new CalendarError("Horário inválido.");
  const d = new Date(value);
  if (!Number.isFinite(d.getTime())) throw new CalendarError("Horário inválido.");
  return d;
}
export function interval(start: unknown, end: unknown) {
  const inicio = instant(start), fim = instant(end);
  if (fim <= inicio || +fim - +inicio > 62 * 86400000)
    throw new CalendarError("O período deve ser positivo e ter no máximo 62 dias.");
  return { inicio, fim };
}
export function eventId(value: unknown) {
  if (typeof value !== "string" || !/^[1-9]\d*$/.test(value) || !Number.isSafeInteger(Number(value)))
    throw new CalendarError("ID inválido.");
  return Number(value);
}
export function eventInput(body: unknown) {
  if (!body || typeof body !== "object" || Array.isArray(body)) throw new CalendarError("Corpo inválido.");
  const b = body as Record<string, unknown>;
  const keys = ["titulo", "descricao", "inicio", "fim", "diaInteiro", "impactoPrevisto", "dataLocal"];
  if (Object.keys(b).some(k => !keys.includes(k))) throw new CalendarError("Campo desconhecido. O usuário vem do token.");
  if (typeof b.titulo !== "string" || !b.titulo.trim() || b.titulo.trim().length > 100)
    throw new CalendarError("Título deve ter de 1 a 100 caracteres.");
  if (typeof b.descricao !== "string" || b.descricao.length > 1000)
    throw new CalendarError("Descrição deve ter até 1000 caracteres.");
  if (typeof b.diaInteiro !== "boolean") throw new CalendarError("diaInteiro deve ser booleano.");
  // Dinheiro é uma string decimal: evita arredondar 0,1 + 0,2 em ponto flutuante.
  if (typeof b.impactoPrevisto !== "string" || !/^(0|[1-9]\d{0,7})(\.\d{1,2})?$/.test(b.impactoPrevisto))
    throw new CalendarError("Impacto deve ser de 0 a 99999999.99, com até duas casas decimais.");
  const { inicio, fim } = interval(b.inicio, b.fim);
  const data = dateOnly(b.dataLocal);
  if (!b.diaInteiro) {
    const earliest = new Date(+inicio - 14 * 3600000).toISOString().slice(0,10);
    const latest = new Date(+inicio + 14 * 3600000).toISOString().slice(0,10);
    if (data < earliest || data > latest) throw new CalendarError("Data local incompatível com o início.");
  }
  if (b.diaInteiro && (inicio.toISOString().slice(11) !== "00:00:00.000Z" || fim.toISOString().slice(11) !== "00:00:00.000Z" || inicio.toISOString().slice(0, 10) !== data))
    throw new CalendarError("Dia inteiro usa datas civis em 00:00Z, com fim exclusivo.");
  return { Enome: b.titulo.trim(), Edescricao: b.descricao.trim(), inicio, fim,
    diaInteiro: b.diaInteiro, impacto_financeiro: b.impactoPrevisto,
    Edata: new Date(`${data}T00:00:00.000Z`) };
}
```

## 4. CRIAR `src/backend/src/services/calendar.service.ts`

```typescript
import { prisma } from "../lib/prisma.js";
import { CalendarError, eventInput } from "../utils/calendar.validation.js";
import type { Eventos } from "../../generated/prisma/client.js";

function dto(e: Eventos) {
  return { id: e.id_Evento, titulo: e.Enome, descricao: e.Edescricao,
    inicio: e.inicio.toISOString(), fim: e.fim.toISOString(), diaInteiro: e.diaInteiro,
    dataLocal: e.Edata.toISOString().slice(0, 10), impactoPrevisto: e.impacto_financeiro.toFixed(2) };
}
const LIMIT = 2000;
export function createCalendarService(db = prisma) { return {
  async list(userId: number, inicio: Date, fim: Date, inicioDia: Date, fimDia: Date) {
    const rows = await db.eventos.findMany({ where: { id_Usuario: userId, OR: [
      { diaInteiro: false, inicio: { lt: fim }, fim: { gt: inicio } },
      { diaInteiro: true, inicio: { lt: fimDia }, fim: { gt: inicioDia } },
    ] }, orderBy: [{ inicio: "asc" }, { id_Evento: "asc" }], take: LIMIT + 1 });
    if (rows.length > LIMIT) throw new CalendarError("Muitos eventos. Consulte um período menor.", 422);
    return rows.map(dto);
  },
  async create(userId: number, body: unknown) {
    return dto(await db.eventos.create({ data: { ...eventInput(body), id_Usuario: userId } }));
  },
  async update(userId: number, id: number, body: unknown) {
    // O filtro de proprietário participa da própria escrita, não apenas da consulta prévia.
    const data = eventInput(body);
    const rows = await db.eventos.updateManyAndReturn({ where: { id_Evento: id, id_Usuario: userId }, data });
    if (!rows[0]) throw new CalendarError("Evento não encontrado.", 404);
    return dto(rows[0]);
  },
  async remove(userId: number, id: number) {
    const result = await db.eventos.deleteMany({ where: { id_Evento: id, id_Usuario: userId } });
    if (!result.count) throw new CalendarError("Evento não encontrado.", 404);
  },
  async finance(userId: number, inicio: Date, fim: Date, inicioDia: Date, fimDia: Date) {
    // Gdata e Ddata seguem o dia civil financeiro legado, sem conversão para fuso local.
    const [gastos, entradas] = await Promise.all([
      db.gastos.findMany({ where: { id_Usuario: userId, Gdata: { gte: inicioDia, lt: fimDia } }, orderBy: { Gdata: "asc" }, take: LIMIT + 1 }),
      db.entradaDinheiro.findMany({ where: { id_Usuario: userId, Ddata: { gte: inicioDia, lt: fimDia } }, orderBy: { Ddata: "asc" }, take: LIMIT + 1 }),
    ]);
    if (gastos.length > LIMIT || entradas.length > LIMIT) throw new CalendarError("Muitos lançamentos. Consulte um período menor.", 422);
    return {
      gastos: gastos.map(g => ({ id: g.id_Gasto, titulo: g.Gnome, data: g.Gdata.toISOString().slice(0, 10), valor: g.Gvalor.toFixed(2) })),
      entradas: entradas.map(e => ({ id: e.id_Dinheiro, titulo: e.Dnome, data: e.Ddata.toISOString().slice(0, 10), valor: e.Dvalor.toFixed(2) })),
    };
  },
};
}
export const calendarService = createCalendarService();
export type CalendarService = typeof calendarService;
```

## 5. CRIAR `src/backend/src/routes/calendar.router.ts`

```typescript
import { Router } from "express";
import type { Request, Response, NextFunction, RequestHandler } from "express";
import type { CalendarService } from "../services/calendar.service.js";
import { CalendarError, dateOnly, eventId, interval } from "../utils/calendar.validation.js";

// Injeção permite testar HTTP/autorização com armazenamento isolado.
export function createCalendarRouter(service: CalendarService, authenticate: RequestHandler) {
  const router = Router();
  router.use(authenticate);
  router.use((req, res, next) => {
    if (!Number.isSafeInteger(req.userId) || !req.userId || req.userId < 1) {
      res.status(401).json({ error: "Não autorizado." }); return;
    }
    next();
  });
  const range = (req: Request) => {
    const { inicio, fim } = interval(req.query.inicio, req.query.fim);
    const inicioDia = new Date(`${dateOnly(req.query.inicioDia)}T00:00:00Z`);
    const fimDia = new Date(`${dateOnly(req.query.fimDia)}T00:00:00Z`);
    if (fimDia <= inicioDia || +fimDia - +inicioDia > 62 * 86400000 ||
        Math.abs(+inicioDia - +inicio) > 86400000 || Math.abs(+fimDia - +fim) > 86400000)
      throw new CalendarError("Datas civis incompatíveis com o intervalo.");
    return { inicio, fim, inicioDia, fimDia };
  };
  router.get("/events", async (req, res) => {
    const r = range(req);
    res.json({ eventos: await service.list(req.userId!, r.inicio, r.fim, r.inicioDia, r.fimDia) });
  });
  router.post("/events", async (req, res) => {
    res.status(201).json({ evento: await service.create(req.userId!, req.body) });
  });
  router.put("/events/:id", async (req, res) => {
    res.json({ evento: await service.update(req.userId!, eventId(req.params.id), req.body) });
  });
  router.delete("/events/:id", async (req, res) => {
    await service.remove(req.userId!, eventId(req.params.id)); res.status(204).end();
  });
  router.get("/finance", async (req, res) => {
    const r = range(req);
    res.json(await service.finance(req.userId!, r.inicio, r.fim, r.inicioDia, r.fimDia));
  });
  router.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof CalendarError) { res.status(err.status).json({ error: err.message }); return; }
    console.error("Falha no calendário:", err instanceof Error ? err.name : "erro desconhecido");
    res.status(500).json({ error: "Não foi possível concluir a operação do calendário." });
  });
  return router;
}
```

## 6. CRIAR `src/backend/src/routes/calendar.routes.ts`

```typescript
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { calendarService } from "../services/calendar.service.js";
import { createCalendarRouter } from "./calendar.router.js";
export default createCalendarRouter(calendarService, authMiddleware);
```

## 7. ALTERAR `src/backend/src/routes/index.ts`

```typescript
import { Router } from "express";

import healthRoutes from "./health.routes.js";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";

import calendarRoutes from "./calendar.routes.js";

const routes = Router();
routes.use("/calendar", calendarRoutes);

routes.use(healthRoutes);
routes.use(authRoutes);
routes.use(userRoutes);

export default routes;
```

## 8. ALTERAR `src/backend/src/middlewares/auth.middleware.ts`

```typescript
import type {
  Request,
  Response,
  NextFunction,
} from "express";

import jwt from "jsonwebtoken";

import { env } from "../config/env.js";

interface AuthPayload {
  sub: string;
  purpose?: string;
}

declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authorization = req.headers.authorization;

  if (!authorization) {
    res.status(401).json({
      error: "Não autorizado.",
    });
    return;
  }

  const [type, token] = authorization.split(" ");

  if (type !== "Bearer" || !token) {
    res.status(401).json({
      error: "Token inválido.",
    });
    return;
  }

  try {
    const payload = jwt.verify(
      token,
      env.JWT_SECRET,
      { algorithms: ["HS256"] },
    ) as AuthPayload;

    const userId = Number(payload.sub);

    if (!payload.sub || !Number.isSafeInteger(userId) || userId < 1 || payload.purpose !== undefined) {
      res.status(401).json({
        error: "Token inválido.",
      });
      return;
    }

    req.userId = userId;

    next();
  } catch {
    res.status(401).json({
      error: "Token inválido ou expirado.",
    });
  }
}
```

## 9. ALTERAR `src/backend/src/Servidor/app.ts`

```typescript
// monta o Express (middlewares, rotas) e exporta o app, mas não coloca ele pra escutar em nenhuma porta.

import express from "express";
import routes from "../routes/index.js";
import authRoutes from "../routes/auth.routes.js";
import meRoutes from "../routes/me.routes.js";

const app = express();

// Permite o Express entender JSON no corpo das requisições (req.body)
app.use((req, res, next) => {
  const origin = process.env.WEB_ORIGIN;
  if (origin && req.headers.origin === origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  }
  if (req.method === "OPTIONS") { res.sendStatus(204); return; }
  next();
});
app.use(express.json({ limit: "100kb" }));

// Todas as rotas da API entram por aqui
app.use(routes);
app.use("/auth", authRoutes);
app.use("/me", meRoutes);

export default app;
```

## 10. CRIAR `src/features/api.js`

```javascript
const baseURL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '');
export class ApiError extends Error {
  constructor(message, status) { super(message); this.status = status; }
}
export async function api(path, { token, method = 'GET', body } = {}) {
  if (!baseURL) throw new Error('Defina EXPO_PUBLIC_API_URL no .env da raiz e reinicie o Expo.');
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(`${baseURL}${path}`, {
      method, signal: controller.signal,
      headers: { ...(body !== undefined && { 'Content-Type': 'application/json' }),
        ...(token && { Authorization: `Bearer ${token}` }) },
      ...(body !== undefined && { body: JSON.stringify(body) }),
    });
    if (response.status === 204) return null;
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new ApiError(data.error || 'Falha na comunicação com o servidor.', response.status);
    return data;
  } catch (err) {
    if (err.name === 'AbortError') throw new Error('O servidor demorou a responder. Tente novamente.');
    throw err;
  } finally { clearTimeout(timer); }
}
```

## 11. CRIAR `src/features/sessionStorage.native.js`

```javascript
import * as SecureStore from 'expo-secure-store';
const KEY = 'finnitus.session';
export const readSession = () => SecureStore.getItemAsync(KEY);
export const saveSession = value => SecureStore.setItemAsync(KEY, value);
export const removeSession = () => SecureStore.deleteItemAsync(KEY);
```

## 12. CRIAR `src/features/sessionStorage.web.js`

```javascript
// Sessão web em memória: não armazena o Bearer em localStorage.
let session = null;
export const readSession = async () => session;
export const saveSession = async value => { session = value; };
export const removeSession = async () => { session = null; };
```

## 13. CRIAR `src/features/authContext.jsx`

```jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { api } from './api';
import { readSession, saveSession, removeSession } from './sessionStorage';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    readSession().then(raw => {
      const saved = raw ? JSON.parse(raw) : null;
      if (active && typeof saved?.token === 'string' && Number.isSafeInteger(saved?.user?.id)) setSession(saved);
    }).catch(() => {}).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  async function signIn(email, password) {
    const result = await api('/auth/login', { method: 'POST', body: { email: email.trim(), password } });
    if (!result.token || !result.user?.id) throw new Error('Resposta de login inválida.');
    await saveSession(JSON.stringify(result));
    setSession(result);
  }
  async function signOut() {
    setSession(null);
    await removeSession();
  }
  return <AuthContext.Provider value={{ session, loading, signIn, signOut }}>{children}</AuthContext.Provider>;
}
export function useAuth() { return useContext(AuthContext); }
```

## 14. ALTERAR `src/app/_layout.jsx`

```jsx
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import {
  Raleway_400Regular,
  Raleway_500Medium,
  Raleway_600SemiBold,
  Raleway_700Bold,
  Raleway_800ExtraBold,
} from "@expo-google-fonts/raleway";
import {
  Quicksand_400Regular,
  Quicksand_500Medium,
  Quicksand_600SemiBold,
  Quicksand_700Bold,
} from "@expo-google-fonts/quicksand";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { AuthProvider } from "../features/authContext";
import { FinanceiroProvider } from "../features/financeiroContext";

// Mantém a splash screen visível até as fontes carregarem
SplashScreen.preventAutoHideAsync();

// Função principal do layout que define a navegação do aplicativo
export default function RootLayout() {

  // Carrega as fontes antes do aplicativo iniciar
  const [fontsLoaded] = useFonts({
    Raleway_400Regular,
    Raleway_500Medium,
    Raleway_600SemiBold,
    Raleway_700Bold,
    Raleway_800ExtraBold,
    Quicksand_400Regular,
    Quicksand_500Medium,
    Quicksand_600SemiBold,
    Quicksand_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Enquanto as fontes carregam, não renderiza nada
  // (a splash screen fica visível nesse meio tempo)
  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider><FinanceiroProvider>
      <Stack>

      {/* Tela inicial do aplicativo */}
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />

      {/* 
  Registra o grupo de rotas de onboarding.
  As telas internas (BemVindo e Trilhe) são gerenciadas pelo
  arquivo app/onboarding/_layout.jsx, portanto não é necessário
  registrá-las individualmente neste Stack principal.
*/}
      <Stack.Screen
        name="onboarding"
        options={{
          headerShown: false,
        }}
      />

      {/* Grupo de autenticação */}
      <Stack.Screen
        name="(auth)"
        options={{
          headerShown: false,
        }}
      />

      {/* Grupo das abas */}
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="configuracaoInicial"
        options={{
          headerShown: false,
        }}
      />

      </Stack>
    </FinanceiroProvider></AuthProvider>
  );
}
```

## 15. ALTERAR `src/app/(auth)/login.jsx`

```jsx
import { View, Text, Image, Pressable, useWindowDimensions, Alert } from "react-native";
import { BackgroundGradient } from "../../shared/components/backgroundGradient";
import { styles } from "../../styles/loginStyles";
import { useRouter } from "expo-router";
import { Button } from "../../shared/components/Button";
import { Underline } from "../../shared/components/underline";
import { Input } from "../../shared/components/Input";
import { useState, useRef } from "react";
import { useAuth } from "../../features/authContext";

export default function Login() {
const roteador = useRouter();

const [email, setEmail] = useState("");
const [senha, setSenha] = useState("");
const { signIn } = useAuth();
const [enviando, setEnviando] = useState(false);
const bloqueio = useRef(false);
async function entrar() {
  if (bloqueio.current) return;
  if (!email.trim() || !senha) { Alert.alert("Login", "Preencha email e senha."); return; }
  bloqueio.current = true; setEnviando(true);
  try { await signIn(email, senha); roteador.replace("/calendario"); }
  catch (error) { Alert.alert("Não foi possível entrar", error.message); }
  finally { bloqueio.current = false; setEnviando(false); }
}

return (
    <View style={{ flex: 1 }}>
      <BackgroundGradient />

    <View style={styles.content}>
        <Text style={styles.title2}>
       Entre na <Text style={styles.title}>
        sua conta </Text>
        </Text>
        <Text style={styles.subtitle}>
          Preencha seus dados.
        </Text>

            <Input
              label="Email"
              placeholder="Digite seu Email"
              icone={
                <Image
                  source={require("../../../assets/icones/email3.png")}
                  style={styles.iconeInput}
                />
              }
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <Input
          label="Senha"
          placeholder="Digite sua senha"
          icone={
            <Image
              source={require("../../../assets/icones/senha.png")}
              style={styles.iconeInput}
            />
          }
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
          />
      </View>

       <View style={styles.conteiner}>
       <Button
          variante="primario"
          titulo={enviando ? "Entrando..." : "Confirmar"}
          onPress={entrar}
        />

      <Pressable onPress={() => roteador.push("/forgotPassword")}>
      <Text style={styles.texto}>
        Esqueceu sua senha?
      </Text>
    </Pressable>
        </View>
    </View>
  );
}
```

## 16. CRIAR `src/features/calendario/dates.js`

```javascript
// Datas civis (dia inteiro/receitas) não são convertidas para o fuso do aparelho.
export function dayKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export function nextDay(key) {
  const d = new Date(`${key}T12:00:00`); d.setDate(d.getDate() + 1); return dayKey(d);
}
export function monthRange(key) {
  const d = new Date(`${key}T12:00:00`);
  const start = new Date(d.getFullYear(), d.getMonth(), 1);
  const end = new Date(d.getFullYear(), d.getMonth() + 1, 1);
  return { inicio: start.toISOString(), fim: end.toISOString(), inicioDia: dayKey(start), fimDia: dayKey(end) };
}
export function onDay(event, key) {
  if (event.diaInteiro) return event.inicio.slice(0, 10) <= key && event.fim.slice(0, 10) > key;
  return new Date(event.inicio) < new Date(`${nextDay(key)}T00:00:00`) && new Date(event.fim) > new Date(`${key}T00:00:00`);
}
export function localInput(date) { return `${dayKey(date)} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`; }
export function parseLocal(value) {
  if (!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(value)) throw new Error('Use AAAA-MM-DD HH:mm.');
  const d = new Date(value.replace(' ', 'T') + ':00');
  if (!Number.isFinite(+d) || localInput(d) !== value) throw new Error('Data ou horário inexistente.');
  return d;
}
export function civil(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error('Use AAAA-MM-DD.');
  const d = new Date(value + 'T00:00:00Z');
  if (!Number.isFinite(+d) || d.toISOString().slice(0, 10) !== value) throw new Error('Data inexistente.');
  return d.toISOString();
}
export function money(value) { return `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`; }
export function sumMoney(rows, field = 'valor') {
  const cents = rows.reduce((sum, r) => {
    const [whole, decimal = ''] = String(r[field]).split('.');
    const sign = whole.startsWith('-') ? -1n : 1n;
    return sum + BigInt(whole) * 100n + sign * BigInt(decimal.padEnd(2, '0').slice(0, 2));
  }, 0n);
  return (Number(cents) / 100).toFixed(2);
}
```

## 17. CRIAR `src/features/calendario/deviceCalendar.native.js`

```javascript
// SDK 57: a API funcional do material de pesquisa está no subpath /legacy.
import { Platform } from 'react-native';
import { dayKey } from './dates';
import * as Calendar from 'expo-calendar/legacy';
export const supported = true;
export async function chooseCalendars() {
  const permission = await Calendar.requestCalendarPermissionsAsync();
  if (permission.status !== 'granted') throw new Error('Acesso ao aparelho negado. Seus eventos do Finnitus continuam disponíveis. Você pode permitir nas configurações do celular.');
  return (await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT)).map(c => ({ id: c.id, titulo: c.title }));
}
export async function readDeviceEvents(ids, range) {
  const p = await Calendar.getCalendarPermissionsAsync();
  if (p.status !== 'granted') throw new Error('Permissão do calendário revogada.');
  if (!ids.length) return [];
  // Margem para eventos de dia inteiro representados em UTC pelo calendário nativo.
  const start = new Date(Math.min(+new Date(range.inicio), +new Date(range.inicioDia + 'T00:00:00Z')));
  const end = new Date(Math.max(+new Date(range.fim), +new Date(range.fimDia + 'T00:00:00Z')));
  const rows = await Calendar.getEventsAsync(ids, start, end);
  const unique = new Map();
  for (const e of rows) {
    const toCivil = value => (Platform.OS === 'ios' ? dayKey(new Date(value)) : new Date(value).toISOString().slice(0,10)) + 'T00:00:00.000Z';
    const inicio = e.allDay ? toCivil(e.startDate) : new Date(e.startDate).toISOString();
    const fim = e.allDay ? toCivil(e.endDate) : new Date(e.endDate).toISOString();
    const key = `${e.calendarId}:${e.id}:${inicio}`; // ocorrências da mesma série não colidem
    unique.set(key, { id: key, nativeId: e.id, titulo: e.title || 'Sem título', descricao: e.notes || '', inicio, fim, diaInteiro: !!e.allDay, externo: true });
  }
  return [...unique.values()];
}
export async function exportEvent(event) {
  // A UI do sistema confirma o destino e o salvamento. Nenhuma cópia é considerada sincronizada.
  const nativeDate = value => event.diaInteiro && Platform.OS === 'ios'
    ? new Date(value.slice(0,10) + 'T00:00:00') : new Date(value);
  return Calendar.createEventInCalendarAsync({ title: event.titulo, notes: event.descricao,
    startDate: nativeDate(event.inicio), endDate: nativeDate(event.fim), allDay: event.diaInteiro });
}
export async function openDeviceEvent(event) {
  return Calendar.openEventInCalendarAsync({ id: event.nativeId, instanceStartDate: event.inicio });
}
```

## 18. CRIAR `src/features/calendario/deviceCalendar.web.js`

```javascript
export const supported = false;
export async function chooseCalendars() { throw new Error('Calendário do aparelho disponível somente no Android/iOS.'); }
export async function readDeviceEvents() { return []; }
export async function exportEvent() { throw new Error('Exportação disponível somente no Android/iOS.'); }
export async function openDeviceEvent() { throw new Error('Abra este evento no celular.'); }
```

## 19. ALTERAR `src/app/(tabs)/calendario.jsx`

```jsx
import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Alert, AppState, Modal, Platform, Pressable, RefreshControl, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { Redirect, useFocusEffect, useRouter } from 'expo-router';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { LinearGradient } from 'expo-linear-gradient';
import { BackgroundGradient } from '../../shared/components/backgroundGradient';
import { useAuth } from '../../features/authContext';
import { api } from '../../features/api';
import { civil, dayKey, localInput, money, monthRange, nextDay, onDay, parseLocal, sumMoney } from '../../features/calendario/dates';
import * as device from '../../features/calendario/deviceCalendar';

LocaleConfig.locales.pt = {
  monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
  monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
  dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
  dayNamesShort: ['dom','seg','ter','qua','qui','sex','sáb'], today: 'Hoje',
};
LocaleConfig.defaultLocale = 'pt';

function Action({ children, onPress, disabled, danger }) {
  return <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress}
    style={[s.button, danger && { backgroundColor: '#7b243e' }, disabled && { opacity: 0.5 }]}>
    <Text style={s.buttonText}>{children}</Text>
  </Pressable>;
}
function Field({ label, ...props }) {
  return <View><Text style={s.text}>{label}</Text><TextInput placeholderTextColor="#b6a1cf" style={s.input} {...props} /></View>;
}
export default function Calendario() {
  const { session, loading } = useAuth();
  if (loading) return <ActivityIndicator accessibilityLabel="Carregando sessão" />;
  if (!session) return <Redirect href="/login" />;
  // Desmonta os dados privados ao trocar a conta.
  return <CalendarContent key={session.user.id} session={session} />;
}
function CalendarContent({ session }) {
  const { signOut } = useAuth();
  const router = useRouter();
  const [selected, setSelected] = useState(dayKey());
  const [month, setMonth] = useState(dayKey());
  const [events, setEvents] = useState([]);
  const [external, setExternal] = useState([]);
  const [finance, setFinance] = useState({ gastos: [], entradas: [] });
  const [error, setError] = useState('');
  const [financeError, setFinanceError] = useState('');
  const [deviceError, setDeviceError] = useState('');
  const [busy, setBusy] = useState(false);
  const [writing, setWriting] = useState(false);
  const [calendars, setCalendars] = useState([]);
  const [ids, setIds] = useState([]);
  const [form, setForm] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [formError, setFormError] = useState('');
  const generation = useRef(0);
  const writeLock = useRef(false);
  const mounted = useRef(true);
  const request = useCallback(async (path, options = {}) => {
    try { return await api(path, { ...options, token: session.token }); }
    catch (e) {
      if (e.status === 401) {
        await signOut().catch(() => {});
        router.replace('/login');
      }
      throw e;
    }
  }, [session.token, signOut, router]);
  // Não depende de request (a função do contexto pode mudar), mas do token/intervalo/seleção.
  const refresh = useCallback(async () => {
    const current = ++generation.current;
    setBusy(true); setError(''); setFinanceError(''); setDeviceError('');
    setEvents([]); setFinance({ gastos: [], entradas: [] }); setExternal([]);
    const range = monthRange(month);
    const query = new URLSearchParams(range).toString();
    const results = await Promise.allSettled([
      api(`/calendar/events?${query}`, { token: session.token }),
      api(`/calendar/finance?${query}`, { token: session.token }),
      ids.length ? device.readDeviceEvents(ids, range) : Promise.resolve([]),
    ]);
    if (current !== generation.current) return;
    if (results.slice(0, 2).some(r => r.status === 'rejected' && r.reason.status === 401)) {
      await signOut().catch(() => {}); router.replace('/login'); return;
    }
    const [a, b, c] = results;
    if (a.status === 'fulfilled') setEvents(a.value.eventos); else { setEvents([]); setError(a.reason.message); }
    if (b.status === 'fulfilled') setFinance(b.value); else { setFinance({ gastos: [], entradas: [] }); setFinanceError(b.reason.message); }
    if (c.status === 'fulfilled') setExternal(c.value); else { setExternal([]); setDeviceError(c.reason.message); }
    setBusy(false);
  }, [month, ids, session.token]);
  useFocusEffect(useCallback(() => {
    mounted.current = true;
    void refresh();
    const subscription = AppState.addEventListener('change', state => { if (state === 'active') void refresh(); });
    return () => { mounted.current = false; generation.current++; subscription.remove(); };
  }, [refresh]));

  function newForm() {
    setFormError('');
    setForm({ titulo: '', descricao: '', inicio: `${selected} 09:00`, fim: `${selected} 10:00`, diaInteiro: false, impactoPrevisto: '0.00' });
  }
  function edit(event) {
    setFormError('');
    setForm({ ...event, inicio: event.diaInteiro ? event.inicio.slice(0,10) : localInput(new Date(event.inicio)),
      fim: event.diaInteiro ? event.fim.slice(0,10) : localInput(new Date(event.fim)) });
  }
  async function save() {
    if (writeLock.current) return;
    setFormError('');
    let payload;
    try {
      const inicio = form.diaInteiro ? civil(form.inicio) : parseLocal(form.inicio).toISOString();
      const fim = form.diaInteiro ? civil(form.fim) : parseLocal(form.fim).toISOString();
      if (new Date(fim) <= new Date(inicio)) throw new Error('O fim precisa ser posterior ao início.');
      payload = { titulo: form.titulo, descricao: form.descricao, inicio, fim, diaInteiro: form.diaInteiro,
        dataLocal: form.inicio.slice(0,10), impactoPrevisto: form.impactoPrevisto.replace(',', '.') };
    } catch (e) { setFormError(e.message); return; }
    writeLock.current = true; setWriting(true);
    try {
      await request(form.id ? `/calendar/events/${form.id}` : '/calendar/events', { method: form.id ? 'PUT' : 'POST', body: payload });
      if (!mounted.current) return;
      setForm(null);
      setSelected(payload.dataLocal);
      if (payload.dataLocal.slice(0,7) !== month.slice(0,7)) setMonth(payload.dataLocal);
      else await refresh();
    } catch (e) { if (mounted.current) setFormError(e.message); }
    finally { writeLock.current = false; if (mounted.current) setWriting(false); }
  }
  async function remove() {
    if (writeLock.current) return;
    writeLock.current = true; setWriting(true);
    try {
      await request(`/calendar/events/${deleteId}`, { method: 'DELETE' });
      if (mounted.current) { setDeleteId(null); await refresh(); }
    } catch (e) { if (mounted.current) { setDeleteId(null); setError(e.message); } }
    finally { writeLock.current = false; if (mounted.current) setWriting(false); }
  }
  async function connect() {
    try { setCalendars(await device.chooseCalendars()); setDeviceError(''); }
    catch (e) { setDeviceError(e.message); }
  }
  async function nativeAction(event, exporting) {
    if (writeLock.current) return;
    writeLock.current = true; setWriting(true);
    try {
      if (exporting) await device.exportEvent(event); else await device.openDeviceEvent(event);
      if (mounted.current) await refresh();
    } catch (e) { if (mounted.current) setDeviceError(e.message); }
    finally { writeLock.current = false; if (mounted.current) setWriting(false); }
  }
  const all = [...events, ...external].sort((a,b) => a.inicio.localeCompare(b.inicio));
  const daily = all.filter(e => onDay(e, selected));
  const dailyExpenses = finance.gastos.filter(g => g.data === selected);
  const dailyIncome = finance.entradas.filter(e => e.data === selected);
  const marks = {};
  const range = monthRange(month);
  for (let key = range.inicioDia; key < range.fimDia; key = nextDay(key)) {
    if (all.some(e => onDay(e,key)) || finance.gastos.some(g => g.data === key) || finance.entradas.some(e => e.data === key))
      marks[key] = { marked: true, dotColor: '#dcff72' };
  }
  marks[selected] = { ...marks[selected], selected: true, selectedColor: '#7942cd' };

  return <View style={{ flex:1 }}><BackgroundGradient />
    <ScrollView contentContainerStyle={s.page} refreshControl={<RefreshControl refreshing={busy} onRefresh={refresh} tintColor="#fff" />}>
      <LinearGradient colors={['#8541f6','#53269d']} style={s.card}>
        <Text style={s.title}>Plano do mês</Text>
        <Text style={s.text}>Olá, {session.user.name}</Text>
        <Calendar key={month.slice(0,7)} current={month} firstDay={1} markedDates={marks}
          onDayPress={d => { setSelected(d.dateString); if (d.dateString.slice(0,7) !== month.slice(0,7)) setMonth(d.dateString); }}
          onMonthChange={m => { setMonth(m.dateString); setSelected(m.dateString.slice(0,7) + '-01'); }}
          theme={{ calendarBackground:'transparent', dayTextColor:'#fff', monthTextColor:'#dcff72', textSectionTitleColor:'#eee', arrowColor:'#dcff72', todayTextColor:'#dcff72', textDisabledColor:'#bba3dd' }} />
      </LinearGradient>
      <View style={s.row}><Action onPress={newForm} disabled={writing}>Novo evento</Action><Action onPress={refresh} disabled={busy}>Atualizar</Action></View>
      {!!error && <Text accessibilityRole="alert" style={s.error}>{error}</Text>}
      <Text style={s.title}>Eventos • {selected.split('-').reverse().join('/')}</Text>
      {busy && <ActivityIndicator color="#dcff72" />}
      {!busy && !error && daily.length === 0 && <Text style={s.text}>Nenhum evento neste dia.</Text>}
      {daily.map(event => <View key={`${event.externo ? 'device' : 'app'}:${event.id}`} style={s.card}>
        <Text style={s.subtitle}>{event.titulo}</Text>
        <Text style={s.muted}>{event.externo ? 'Calendário do aparelho' : 'Finnitus'} • {event.diaInteiro ? 'Dia inteiro' : `${new Date(event.inicio).toLocaleString('pt-BR')} — ${new Date(event.fim).toLocaleString('pt-BR')}`}</Text>
        {!!event.descricao && <Text style={s.text}>{event.descricao}</Text>}
        {!event.externo && <Text style={s.text}>Impacto previsto: {money(event.impactoPrevisto)}</Text>}
        <View style={s.row}>{event.externo
          ? <Action disabled={writing} onPress={() => nativeAction(event, false)}>Abrir no aparelho</Action>
          : <><Action disabled={writing} onPress={() => edit(event)}>Editar</Action><Action disabled={writing} danger onPress={() => setDeleteId(event.id)}>Excluir</Action>
            {device.supported && <Action disabled={writing} onPress={() => Alert.alert('Criar cópia no aparelho?', 'A cópia será independente. Repetir esta ação pode duplicar o evento. Alterações futuras no Finnitus não atualizarão essa cópia.', [{ text:'Cancelar',style:'cancel' },{ text:'Continuar',onPress:() => nativeAction(event,true) }])}>Exportar cópia</Action>}</>}
        </View>
      </View>)}
      <Text style={s.title}>Finanças do dia</Text>
      {!!financeError ? <Text style={s.error}>{financeError}</Text> : <>
        {!busy && !dailyExpenses.length && !dailyIncome.length && <Text style={s.text}>Nenhum lançamento salvo no banco para este dia.</Text>}
        {dailyExpenses.map(g => <Text key={`g${g.id}`} style={s.text}>Saída • {g.titulo}: {money(g.valor)}</Text>)}
        {dailyIncome.map(e => <Text key={`e${e.id}`} style={s.text}>Entrada • {e.titulo}: {money(e.valor)}</Text>)}
        <View style={s.card}><Text style={s.subtitle}>Totais do mês</Text>
          <Text style={s.text}>Entradas: {money(sumMoney(finance.entradas))}</Text><Text style={s.text}>Gastos: {money(sumMoney(finance.gastos))}</Text>
          <Text style={s.muted}>O impacto previsto dos eventos não é somado aos gastos realizados.</Text></View>
      </>}
      <Text style={s.title}>Calendários do aparelho</Text>
      {device.supported ? <>
        <Text style={s.text}>Selecione quais calendários deseja mostrar. Esses eventos ficam apenas neste aparelho.</Text>
        <Action onPress={connect}>Permitir e listar calendários</Action>
        {calendars.map(c => <View key={c.id} style={s.row}><Switch value={ids.includes(c.id)} onValueChange={value => {
          setExternal([]); setIds(previous => value ? [...previous,c.id] : previous.filter(id => id !== c.id));
        }} /><Text style={s.text}>{c.titulo}</Text></View>)}
        {!!ids.length && <Action onPress={() => { setIds([]); setExternal([]); }}>Ocultar todos</Action>}
      </> : <Text style={s.text}>No navegador, use o calendário interno. A conexão com o aparelho está disponível no Android e iOS.</Text>}
      {!!deviceError && <Text style={s.error}>{deviceError}</Text>}
      <Action onPress={async () => { await signOut().catch(() => {}); router.replace('/login'); }}>Sair da conta</Action>
    </ScrollView>
    <Modal visible={!!form} animationType="slide" onRequestClose={() => { if (!writing) setForm(null); }}>
      <ScrollView contentContainerStyle={s.modal} keyboardShouldPersistTaps="handled">
        <Text style={s.title}>{form?.id ? 'Editar evento' : 'Novo evento'}</Text>
        {!!form && <>
          <Field label="Título" maxLength={100} value={form.titulo} onChangeText={titulo => setForm({ ...form,titulo })} />
          <Field label="Descrição (opcional)" multiline maxLength={1000} value={form.descricao} onChangeText={descricao => setForm({ ...form,descricao })} />
          <View style={s.row}><Text style={s.text}>Dia inteiro</Text><Switch value={form.diaInteiro} onValueChange={diaInteiro => {
            const key = form.inicio.slice(0,10) || selected;
            setForm({ ...form,diaInteiro,inicio:diaInteiro ? key : `${key} 09:00`,fim:diaInteiro ? nextDay(key) : `${key} 10:00` });
          }} /></View>
          <Field label={form.diaInteiro ? 'Data inicial — AAAA-MM-DD' : 'Início — AAAA-MM-DD HH:mm (horário local)'} value={form.inicio} onChangeText={inicio => setForm({ ...form,inicio })} />
          <Field label={form.diaInteiro ? 'Data final exclusiva — AAAA-MM-DD' : 'Fim — AAAA-MM-DD HH:mm (horário local)'} value={form.fim} onChangeText={fim => setForm({ ...form,fim })} />
          {form.diaInteiro && <Text style={s.muted}>Para um evento só no dia 13, informe início 13 e fim 14. O dia final não entra no evento.</Text>}
          <Field label="Impacto previsto em R$ (opcional: deixe 0)" keyboardType="decimal-pad" value={form.impactoPrevisto} onChangeText={impactoPrevisto => setForm({ ...form,impactoPrevisto })} />
          {!!formError && <Text accessibilityRole="alert" style={s.error}>{formError}</Text>}
          <Action disabled={writing} onPress={save}>{writing ? 'Salvando...' : 'Salvar'}</Action>
          <Action disabled={writing} onPress={() => setForm(null)}>Cancelar</Action>
        </>}
      </ScrollView>
    </Modal>
    <Modal visible={deleteId !== null} transparent animationType="fade" onRequestClose={() => { if (!writing) setDeleteId(null); }}>
      <View style={s.overlay}><View style={s.card}><Text style={s.subtitle}>Excluir este evento do Finnitus?</Text>
        <Text style={s.text}>Uma cópia exportada para o aparelho continuará lá.</Text>
        <Action danger disabled={writing} onPress={remove}>Confirmar exclusão</Action>
        <Action disabled={writing} onPress={() => setDeleteId(null)}>Cancelar</Action>
      </View></View>
    </Modal>
  </View>;
}
const s = StyleSheet.create({
  page:{ padding:20,paddingTop:48,paddingBottom:140,gap:16 },
  title:{ color:'#fff',fontSize:24,fontWeight:'700' }, subtitle:{ color:'#dcff72',fontSize:19,fontWeight:'700' },
  text:{ color:'#fff',fontSize:16,flexShrink:1 }, muted:{ color:'#d4c1eb',fontSize:14 },
  card:{ backgroundColor:'#34176b',padding:18,borderRadius:20,gap:12 },
  row:{ flexDirection:'row',flexWrap:'wrap',gap:10,alignItems:'center' },
  button:{ backgroundColor:'#6533aa',padding:13,borderRadius:12,alignItems:'center' }, buttonText:{ color:'#fff',fontWeight:'700' },
  error:{ color:'#ffbdc9',fontSize:15 }, input:{ borderWidth:1,borderColor:'#ae86dd',borderRadius:10,padding:14,color:'#fff',marginTop:8,marginBottom:14 },
  modal:{ padding:24,paddingTop:Platform.OS === 'ios' ? 64 : 40,paddingBottom:60,backgroundColor:'#27104e',flexGrow:1,gap:12 },
  overlay:{ flex:1,backgroundColor:'#0009',justifyContent:'center',padding:24 },
});
```

## 20. ALTERAR `app.json`

```json
{
  "expo": {
    "name": "Finnitus",
    "slug": "finnitus",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "finnitusnovo",
    "userInterfaceStyle": "automatic",
    "ios": {
      "icon": "./assets/expo.icon",
      "infoPlist": {
        "NSCalendarsFullAccessUsageDescription": "Permita ao Finnitus mostrar os calendários que você selecionar."
      }
    },
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#E6F4FE",
        "foregroundImage": "./assets/images/android-icon-foreground.png",
        "backgroundImage": "./assets/images/android-icon-background.png",
        "monochromeImage": "./assets/images/android-icon-monochrome.png"
      },
      "predictiveBackGestureEnabled": false
    },
    "web": {
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "backgroundColor": "#208AEF",
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 76
        }
      ],
      "expo-font",
      [
        "expo-calendar",
        {
          "calendarPermission": "Permita ao Finnitus mostrar os calendários que você selecionar."
        }
      ],
      "expo-secure-store"
    ],
    "experiments": {
      "typedRoutes": true,
      "reactCompiler": true
    }
  }
}
```

## 21. ALTERAR `package.json`

```json
{
  "name": "finnitus",
  "main": "expo-router/entry",
  "version": "1.0.0",
  "dependencies": {
    "@expo-google-fonts/quicksand": "^0.4.1",
    "@expo-google-fonts/raleway": "^0.4.2",
    "@expo/ui": "~57.0.7",
    "expo": "~57.0.8",
    "expo-calendar": "~57.0.3",
    "expo-constants": "~57.0.7",
    "expo-device": "~57.0.1",
    "expo-font": "~57.0.1",
    "expo-glass-effect": "~57.0.1",
    "expo-image": "~57.0.1",
    "expo-linear-gradient": "~57.0.1",
    "expo-linking": "~57.0.4",
    "expo-router": "~57.0.8",
    "expo-secure-store": "~57.0.4",
    "expo-splash-screen": "~57.0.5",
    "expo-status-bar": "~57.0.1",
    "expo-symbols": "~57.0.1",
    "expo-system-ui": "~57.0.1",
    "expo-web-browser": "~57.0.2",
    "express": "^5.2.1",
    "lucide-react-native": "^1.27.0",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "react-native": "0.86.0",
    "react-native-calendars": "^1.1314.0",
    "react-native-gesture-handler": "~2.32.0",
    "react-native-reanimated": "4.5.0",
    "react-native-responsive-fontsize": "^0.5.1",
    "react-native-safe-area-context": "~5.7.0",
    "react-native-screens": "~4.26.0",
    "react-native-svg": "15.15.4",
    "react-native-web": "~0.21.0",
    "react-native-worklets": "0.10.0",
    "victory-native": "^37.3.6"
  },
  "devDependencies": {
    "@types/express": "^5.0.6",
    "@types/react": "~19.2.2",
    "babel-plugin-module-resolver": "^5.0.3",
    "react-native-svg-transformer": "^1.5.3",
    "typescript": "~6.0.3"
  },
  "scripts": {
    "start": "expo start",
    "reset-project": "node ./scripts/reset-project.js",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "lint": "expo lint"
  },
  "private": true
}
```

## 22. CRIAR `.env.example`

```text
# Celular físico: use o IPv4 do computador, ambos na mesma rede.
EXPO_PUBLIC_API_URL=http://192.168.1.100:3333
```

## 23. ALTERAR `src/backend/package.json`

```json
{
  "name": "backend",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/Servidor/server.ts",
    "build": "prisma generate && tsc",
    "start": "node dist/src/Servidor/server.js",
    "test": "echo \"Error: no test specified\" && exit 1",
    "test:calendar": "node --import tsx --test tests/calendar*.test.ts"
  },
  "prisma": {
    "schema": "prisma/schema.prisma"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@types/bcrypt": "^6.0.0",
    "@types/express": "^5.0.6",
    "@types/jsonwebtoken": "^9.0.10",
    "@types/node": "^26.4.1",
    "@types/nodemailer": "^8.0.1",
    "@types/pg": "^8.23.1",
    "dotenv": "^17.4.2",
    "prisma": "7.9.1",
    "tsx": "^4.23.11",
    "typescript": "^7.0.2"
  },
  "dependencies": {
    "@prisma/adapter-pg": "^7.10.0",
    "@prisma/client": "7.9.1",
    "argon2": "^0.45.1",
    "bcrypt": "^6.0.0",
    "express": "^5.2.1",
    "jsonwebtoken": "^9.0.3",
    "mariadb": "^3.5.3",
    "nodemailer": "^9.1.1",
    "pg": "^8.23.0"
  }
}
```

## 24. ALTERAR `src/backend/tsconfig.json`

```json
{
  "compilerOptions": {
    "rootDir": ".",
    "outDir": "./dist",
    "module": "nodenext",
    "target": "es2022",
    "types": [
      "node"
    ],
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "verbatimModuleSyntax": true,
    "isolatedModules": true,
    "skipLibCheck": true,
    "sourceMap": true
  },
  "include": [
    "src/**/*.ts",
    "generated/**/*.ts"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "tests"
  ]
}
```

## 25. ALTERAR `src/backend/.env.example`

```text
# exemplo para criar um arquivo .env com as variáveis de ambiente necessárias para o projeto.
DATABASE_URL="postgresql://usuario:senha@host-pooler.../Finnitus?sslmode=require"
DIRECT_URL="postgresql://usuario:senha@host.../Finnitus?sslmode=require"


# E-mail para envio do código de recuperação de senha 
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=465 # porta padrão para envio de e-mails com SSL
EMAIL_SECURE=true # deixa asim para usar SSL, false para usar TLS
EMAIL_USER="" # email do remetente (deve ser um e-mail válido)
EMAIL_PASSWORD="" # senha do app que criou no google
EMAIL_FROM="Finnitus <seuemail@gmail.com>"

# do servidor backend
PORT=3333

# -join ((48..57)+(65..90)+(97..122)|Get-Random -Count 48|%{[char]$_}) para gerar uma string aleatória de 48 caracteres para o JWT_SECRET(coloque no powershell e copie o resultado para a variável abaixo)
JWT_SECRET="troque_por_uma_string_longa_e_aleatoria_aqui"
JWT_EXPIRES_IN="7d"
# Somente para testar o front no navegador (origem exata).
WEB_ORIGIN=http://localhost:8081
```

## 26. ALTERAR `tsconfig.json`

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": [
        "./src/*"
      ],
      "@/assets/*": [
        "./assets/*"
      ]
    }
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    "**/*.d.ts",
    ".expo/types/**/*.ts",
    "expo-env.d.ts"
  ],
  "exclude": [
    "node_modules",
    "src/backend"
  ]
}
```

## 27. ALTERAR `src/features/homeSelectors.ts`

```typescript
import {
  DASHBOARD_MOCK,
  ESTATISTICAS_MOCK,
  EVENTOS_MES_MOCK,
  PLANOB_MOCK,
} from '../shared/components/Mocks'
import { METAS_DO_MES } from './metasData'
import type { EstatisticaResumo, EventoResumo, PlanoBResumo, PlanejamentoResumo } from './dashboard/types'

const DATA_FORMAT = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
})

export function obterProximoEvento(agora = new Date()): EventoResumo | undefined {
  const eventosFuturos = EVENTOS_MES_MOCK
    .map(evento => ({ ...evento, dataObjeto: new Date(`${evento.data}T12:00:00`) }))
    .filter(evento => evento.dataObjeto >= agora)
    .sort((a, b) => a.dataObjeto.getTime() - b.dataObjeto.getTime())

  const evento = eventosFuturos[0]
  return evento
    ? { titulo: evento.nome, data: DATA_FORMAT.format(evento.dataObjeto) }
    : undefined
}

export function obterEstatisticasHome(): EstatisticaResumo[] {
  return DASHBOARD_MOCK.estatisticas.semanaAtual.map((valor, index) => ({
    dia: ['seg', 'ter', 'qua', 'qui', 'sex', 'sáb', 'dom'][index],
    receitas: ESTATISTICAS_MOCK.semanaAtual[index] ?? valor,
    despesas: ESTATISTICAS_MOCK.semanaPassada[index] ?? 0,
  }))
}

export function obterPlanoBResumo(salario?: number, despesas?: number): PlanoBResumo {
  const valorMeta = salario ?? PLANOB_MOCK.limite
  const valorAtual = despesas ?? PLANOB_MOCK.gastoAtual

  return {
    nome: PLANOB_MOCK.status,
    valorAtual,
    valorMeta,
  }
}

export function obterPlanejamentoHome(): PlanejamentoResumo | undefined {
  const meta = METAS_DO_MES[0]
  if (!meta) return undefined

  return {
    titulo: meta.nome,
    valor: `${meta.prazo} • ${meta.valorAtual.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} de ${meta.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`,
  }
}
```

## 28. CRIAR `src/backend/tests/calendar.test.ts`

```typescript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dateOnly, eventId, eventInput, interval } from '../src/utils/calendar.validation.js';
const base = { titulo: 'Consulta', descricao: '', inicio: '2026-09-13T12:00:00Z', fim: '2026-09-13T13:00:00Z', dataLocal: '2026-09-13', diaInteiro: false, impactoPrevisto: '120.50' };
test('aceita horário com fuso e preserva decimal', () => {
  const parsed = eventInput({ ...base, inicio: '2026-09-13T09:00:00-03:00' });
  assert.equal(parsed.inicio.toISOString(), new Date(base.inicio).toISOString());
  assert.equal(parsed.impacto_financeiro, '120.50');
});
test('rejeita alteração de proprietário e campos inesperados', () => {
  assert.throws(() => eventInput({ ...base, id_Usuario: 999 }));
});
test('rejeita datas inexistentes, horários ambíguos e intervalos inválidos', () => {
  for (const v of ['2026-02-30','2026-13-01','abc']) assert.throws(() => dateOnly(v));
  assert.throws(() => eventInput({ ...base, inicio: '2026-09-13T09:00:00' }));
  assert.throws(() => eventInput({ ...base, fim: base.inicio }));
  assert.throws(() => interval('2026-01-01T00:00:00Z','2026-12-01T00:00:00Z'));
});
test('valida dinheiro, título, booleano e IDs', () => {
  for (const value of ['-1','NaN','1.234','100000000.00',120.5]) assert.throws(() => eventInput({ ...base, impactoPrevisto: value }));
  assert.throws(() => eventInput({ ...base, titulo: ' ' }));
  assert.throws(() => eventInput({ ...base, diaInteiro: 'false' }));
  for (const id of ['0','-1','1x','1.1','9007199254740993']) assert.throws(() => eventId(id));
});
test('dia inteiro usa meia noite UTC e fim exclusivo', () => {
  assert.doesNotThrow(() => eventInput({ ...base, diaInteiro:true, inicio:'2026-09-13T00:00:00Z', fim:'2026-09-14T00:00:00Z' }));
  assert.throws(() => eventInput({ ...base, diaInteiro:true }));
});
```

## 29. CRIAR `src/backend/tests/calendar.http.test.ts`

```typescript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import jwt from 'jsonwebtoken';
import { createCalendarRouter } from '../src/routes/calendar.router.js';
import { CalendarError, eventInput } from '../src/utils/calendar.validation.js';
import type { CalendarService } from '../src/services/calendar.service.js';
// Valores locais e descartáveis; nenhum segredo do projeto é carregado.
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
process.env.JWT_SECRET = 'calendar-test-only-secret';
process.env.EMAIL_USER = 'test'; process.env.EMAIL_PASSWORD = 'test'; process.env.EMAIL_FROM = 'test@example.test';
const { authMiddleware } = await import('../src/middlewares/auth.middleware.js');

test('HTTP: JWT, isolamento de usuário, CRUD, 400 e 404', async () => {
  const rows = new Map<number, { userId:number; body: unknown }>();
  let sequence = 0;
  // Double isolado: valida o contrato HTTP; o teste separado de serviço verifica os filtros Prisma.
  const service = {
    async list(userId:number) { return [...rows].filter(([,r]) => r.userId === userId).map(([id,r]) => ({ id, ...r.body as object })); },
    async create(userId:number, body:unknown) { eventInput(body); const id = ++sequence; rows.set(id,{ userId,body }); return { id,...body as object }; },
    async update(userId:number,id:number,body:unknown) { eventInput(body); if (rows.get(id)?.userId !== userId) throw new CalendarError('Evento não encontrado.',404); rows.set(id,{ userId,body }); return { id,...body as object }; },
    async remove(userId:number,id:number) { if (rows.get(id)?.userId !== userId) throw new CalendarError('Evento não encontrado.',404); rows.delete(id); },
    async finance() { return { gastos:[],entradas:[] }; },
  } as unknown as CalendarService;
  const app = express(); app.use(express.json()); app.use('/calendar',createCalendarRouter(service,authMiddleware));
  const server = app.listen(0,'127.0.0.1'); await new Promise<void>(r => server.once('listening',r));
  const address = server.address() as { port:number };
  const base = `http://127.0.0.1:${address.port}/calendar`;
  const token = (sub:string,extra={}) => jwt.sign({ sub,...extra },process.env.JWT_SECRET!,{ expiresIn:'1h' });
  async function call(path:string,method='GET',auth?:string,body?:unknown) {
    return fetch(base+path,{ method,headers:{ 'Content-Type':'application/json',...(auth && { Authorization:`Bearer ${auth}` }) },...(body !== undefined ? { body:JSON.stringify(body) } : {}) });
  }
  const range='?inicio=2026-09-01T03%3A00%3A00Z&fim=2026-10-01T03%3A00%3A00Z&inicioDia=2026-09-01&fimDia=2026-10-01';
  const input={ titulo:'Consulta',descricao:'',inicio:'2026-09-13T12:00:00Z',fim:'2026-09-13T13:00:00Z',dataLocal:'2026-09-13',diaInteiro:false,impactoPrevisto:'0.00' };
  try {
    assert.equal((await call('/events'+range)).status,401);
    assert.equal((await call('/events'+range,'GET',token('1',{ purpose:'reset-password' }))).status,401);
    assert.equal((await call('/events'+range,'GET',token('1.5'))).status,401);
    assert.equal((await call('/events','POST',token('1'),input)).status,201);
    assert.equal((await (await call('/events'+range,'GET',token('2'))).json()).eventos.length,0);
    assert.equal((await call('/events/1','PUT',token('2'),input)).status,404);
    assert.equal((await call('/events/1','DELETE',token('2'))).status,404);
    assert.equal((await call('/events/1','PUT',token('1'),{ ...input,titulo:'Atualizada' })).status,200);
    assert.equal((await call('/events','POST',token('1'),{ ...input,id_Usuario:2 })).status,400);
    assert.equal((await call('/events','GET',token('1'))).status,400);
    assert.equal((await call('/events/1','DELETE',token('1'))).status,204);
    assert.equal((await call('/events/1','DELETE',token('1'))).status,404);
  } finally { await new Promise<void>((resolve,reject) => server.close(e => e ? reject(e) : resolve())); }
});
```

## 30. CRIAR `src/backend/tests/calendar.service.test.ts`

```typescript
import { test } from 'node:test';
import assert from 'node:assert/strict';
process.env.DATABASE_URL='postgresql://test:test@localhost:5432/test';
process.env.JWT_SECRET='test'; process.env.EMAIL_USER='test'; process.env.EMAIL_PASSWORD='test'; process.env.EMAIL_FROM='test@example.test';
const { prisma } = await import('../src/lib/prisma.js');
const { createCalendarService } = await import('../src/services/calendar.service.js');
const { Prisma } = await import('../generated/prisma/client.js');
const input = { titulo:'Evento',descricao:'',inicio:'2026-09-13T12:00:00Z',fim:'2026-09-13T13:00:00Z',dataLocal:'2026-09-13',diaInteiro:false,impactoPrevisto:'12.34' };
test('serviço real: filtros de proprietário e intervalo chegam ao Prisma, serialização decimal', async t => {
  const row = { id_Evento:1,id_Usuario:7,Enome:'Evento',Edescricao:'',inicio:new Date(input.inicio),fim:new Date(input.fim),Edata:new Date('2026-09-13'),diaInteiro:false,impacto_financeiro:new Prisma.Decimal('12.34') };
  const calls: Record<string, any[]> = {};
  const recorder = (name:string,result:unknown) => async (...args:any[]) => { calls[name]=args; return result; };
  const db = { eventos: { create:recorder('create',row), updateManyAndReturn:recorder('update',[]), deleteMany:recorder('remove',{count:0}), findMany:recorder('find',[row]) } };
  const calendarService = createCalendarService(db as unknown as typeof prisma);
  const result = await calendarService.create(7,input);
  assert.equal(result.impactoPrevisto,'12.34');
  assert.equal(calls.create![0].data.id_Usuario,7);

  await assert.rejects(() => calendarService.update(8,1,input),{ status:404 });
  assert.deepEqual(calls.update![0].where,{ id_Evento:1,id_Usuario:8 });

  await assert.rejects(() => calendarService.remove(8,1),{ status:404 });
  assert.deepEqual(calls.remove![0].where,{ id_Evento:1,id_Usuario:8 });

  const start = new Date('2026-09-01T03:00:00Z'), end = new Date('2026-10-01T03:00:00Z');
  const ds = new Date('2026-09-01'), de = new Date('2026-10-01');
  await calendarService.list(7,start,end,ds,de);
  const where = calls.find![0].where;
  assert.equal(where.id_Usuario,7);
  assert.equal(where.OR[0].inicio.lt,end); assert.equal(where.OR[0].fim.gt,start);
  assert.equal(where.OR[1].inicio.lt,de); assert.equal(where.OR[1].fim.gt,ds);
  await prisma.$disconnect();
});
```

## 31. CRIAR `tests/calendar-dates.test.cjs`

```javascript
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const moduleURL = 'data:text/javascript;base64,' + Buffer.from(fs.readFileSync(path.join(__dirname,'../src/features/calendario/dates.js'))).toString('base64');
test('datas: meia noite, intervalo exclusivo, dia inteiro e fim de mês', async () => {
  const { onDay,nextDay,parseLocal,monthRange,sumMoney,civil } = await import(moduleURL);
  const night={ inicio:'2026-09-14T02:30:00Z',fim:'2026-09-14T03:00:00Z',diaInteiro:false };
  assert.equal(onDay(night,'2026-09-13'),true);
  assert.equal(onDay(night,'2026-09-14'),false);
  const allDay={ inicio:'2026-09-13T00:00:00Z',fim:'2026-09-14T00:00:00Z',diaInteiro:true };
  assert.equal(onDay(allDay,'2026-09-13'),true);
  assert.equal(onDay(allDay,'2026-09-12'),false);
  assert.equal(nextDay('2026-12-31'),'2027-01-01');
  assert.equal(monthRange('2026-09-15').inicio,'2026-09-01T03:00:00.000Z');
  assert.throws(() => parseLocal('2026-02-30 09:00'));
  assert.throws(() => civil('2026-02-30'));
  assert.equal(sumMoney([{valor:'0.10'},{valor:'0.20'}]),'0.30');
});
```

## 32. CRIAR `src/backend/tests/calendar-migration.mjs`

```javascript
import { PGlite } from '@electric-sql/pglite';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
const db = new PGlite();
const root = fileURLToPath(new URL('../prisma/migrations', import.meta.url));
for(const folder of ['20260814204520_criar_tabelas','20260829025631_postgres_e_redefinicao_senha']) await db.exec(fs.readFileSync(`${root}/${folder}/migration.sql`,'utf8'));
await db.exec(`INSERT INTO "Usuario" ("Unome","Usenha","Uemail","Utelefone","Udata_nasc","Udata_cadastro","UTipo") VALUES ('Teste','hash-teste','teste@example.test','11999999999','2000-01-01',now(),'usuario');
INSERT INTO "Eventos" ("id_Usuario","Enome","impacto_financeiro","Edata","Edescricao") VALUES (1,'Evento antigo',12.34,'2026-09-13','Preservar');`);
await db.exec(fs.readFileSync(`${root}/20260913000100_calendario/migration.sql`,'utf8'));
const {rows}=await db.query('SELECT * FROM "Eventos"');
assert.equal(rows.length,1); assert.equal(rows[0].Enome,'Evento antigo'); assert.equal(rows[0].diaInteiro,true); assert.equal(rows[0].inicio.toISOString(),'2026-09-13T00:00:00.000Z');
assert.equal(rows[0].fim.toISOString(),'2026-09-14T00:00:00.000Z');
await assert.rejects(() => db.exec(`UPDATE "Eventos" SET "fim"="inicio" WHERE "id_Evento"=1`));
await assert.rejects(() => db.exec(`UPDATE "Eventos" SET "id_Usuario"=999 WHERE "id_Evento"=1`));
await db.exec('DELETE FROM "Usuario" WHERE "id_Usuario"=1');
assert.equal((await db.query('SELECT * FROM "Eventos"')).rows.length,0);
await db.close(); console.log('PASS: migrations PostgreSQL (PGlite), preservação, intervalo, FK e cascade');
```
