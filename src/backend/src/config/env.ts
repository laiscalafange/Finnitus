// vai ser usado para pegar as variáveis obrigatórias de ambiente do sistema operacional
function getEnvVar(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Variável de ambiente ausente: ${name}`);
  }

  return value;
}

// vai ser usado para pegar as variáveis padrões (PORT, NODE_ENV) opcionais de ambiente do sistema operacional,
// caso não exista, será usado o valor padrão (fallback)
function getEnvVarOptional(name: string, fallback: string): string {
  return process.env[name] ?? fallback;
}

// vai ser usado para variáveis booleanas opcionais (ex: EMAIL_SECURE)
function getEnvVarBoolean(name: string, fallback: boolean): boolean {
  const value = process.env[name];

  if (!value) {
    return fallback;
  }

  return value === "true";
}

export const env = {
  PORT: Number(getEnvVarOptional("PORT", "3333")),
  NODE_ENV: getEnvVarOptional("NODE_ENV", "development"),

  // usada pelo prisma.config.ts E pelo adapter em runtime (lib/prisma.ts)
  DATABASE_URL: getEnvVar("DATABASE_URL"),

  JWT_SECRET: getEnvVar("JWT_SECRET"),
  JWT_EXPIRES_IN: getEnvVarOptional("JWT_EXPIRES_IN", "7d"),

  // usadas pelo services/email.service.ts (Nodemailer)
  EMAIL_HOST: getEnvVarOptional("EMAIL_HOST", "smtp.gmail.com"),
  EMAIL_PORT: Number(getEnvVarOptional("EMAIL_PORT", "465")),
  EMAIL_SECURE: getEnvVarBoolean("EMAIL_SECURE", true),
  EMAIL_USER: getEnvVar("EMAIL_USER"),
  EMAIL_PASSWORD: getEnvVar("EMAIL_PASSWORD"),
  EMAIL_FROM: getEnvVar("EMAIL_FROM"),
};