import type { RequestHandler } from "express";

export function rateLimit(
  max: number,
  windowMs: number,
): RequestHandler {
  const hits = new Map<
    string,
    {
      count: number;
      until: number;
    }
  >();

  const cleanup = setInterval(() => {
    const now = Date.now();

    for (const [key, value] of hits) {
      if (value.until <= now) {
        hits.delete(key);
      }
    }
  }, 60000);

  cleanup.unref();

  return (req, res, next) => {
    const key = req.ip ?? "unknown";
    const now = Date.now();

    let entry = hits.get(key);

    if (!entry || entry.until <= now) {
      entry = {
        count: 0,
        until: now + windowMs,
      };

      hits.set(key, entry);
    }

    entry.count++;

    if (entry.count > max) {
      res.set(
        "Retry-After",
        String(Math.ceil((entry.until - now) / 1000)),
      );

      res.status(429).json({
        error: "Muitas tentativas. Aguarde e tente novamente.",
      });

      return;
    }

    next();
  };
}

export const loginLimiter = rateLimit(20, 15 * 60000);
export const recoveryLimiter = rateLimit(5, 15 * 60000);
export const sensitiveLimiter = rateLimit(20, 15 * 60000);