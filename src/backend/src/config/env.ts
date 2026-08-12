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

export const env = {
  PORT: Number(getEnvVarOptional("PORT", "3000")),
  NODE_ENV: getEnvVarOptional("NODE_ENV", "development"),

  // usada pelo prisma.config.ts (CLI: migrate, db pull, studio...)
  DATABASE_URL: getEnvVar("DATABASE_URL"),

  // usadas pelo adapter em runtime (lib/prisma.ts)
  DATABASE_HOST: getEnvVarOptional("DATABASE_HOST", "localhost"),
  DATABASE_PORT: Number(getEnvVarOptional("DATABASE_PORT", "3307")),
  DATABASE_USER: getEnvVarOptional("DATABASE_USER", "root"),
  DATABASE_PASSWORD: getEnvVarOptional("DATABASE_PASSWORD", ""),
  DATABASE_NAME: getEnvVar("DATABASE_NAME"),
};