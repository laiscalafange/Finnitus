import type { Request, RequestHandler } from "express";
import { createHash } from "node:crypto";

// Proteção por instância: em produção com múltiplos processos usar Redis
// e aplicar limites também no proxy/WAF. Nunca usar X-Forwarded-For sem
// trust proxy cuidadosamente configurado.
function keyIdentity(req: Request): string {
  const email = typeof req.body?.email === "string"
    ? req.body.email.trim().toLowerCase().slice(0, 100) : "";
  const hash = createHash("sha256").update(email).digest("hex").slice(0, 24);
  return `login:${hash}`;
}

export function rateLimit(
  max: number,
  windowMs: number,
  keyFor: (req: Request) => string = req => `ip:${req.ip ?? "unknown"}`,
): RequestHandler {
  const hits = new Map<string, { count: number; until: number }>();
  const cleanup = setInterval(() => {
    const now = Date.now();
    for (const [key, val] of hits) if (val.until <= now) hits.delete(key);
  }, 60000);
  cleanup.unref();

  return (req, res, next) => {
    const now = Date.now();
    const key = keyFor(req);
    let entry = hits.get(key);
    if (!entry || entry.until <= now) {
      if (hits.size >= 20000) {
        for (const [k, v] of hits) if (v.until <= now) hits.delete(k);
        if (hits.size >= 20000) hits.delete(hits.keys().next().value!);
      }
      entry = { count: 0, until: now + windowMs };
      hits.set(key, entry);
    }
    entry.count++;
    if (entry.count > max) {
      res.set("Retry-After", String(Math.max(1, Math.ceil((entry.until - now) / 1000))));
      res.status(429).json({ error: "Muitas tentativas. Aguarde antes de tentar novamente." });
      return;
    }
    next();
  };
}
export const loginLimiter = rateLimit(20, 15 * 60000);
export const loginAccountLimiter = rateLimit(8, 15 * 60000, keyIdentity);
export const registerLimiter = rateLimit(5, 60 * 60000);
export const recoveryLimiter = rateLimit(5, 15 * 60000);
export const sensitiveLimiter = rateLimit(10, 15 * 60000);
