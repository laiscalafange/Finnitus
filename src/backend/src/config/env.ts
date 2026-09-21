function getEnvVar(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Variável de ambiente ausente: ${name}`);
  }

  return value;
}

function getEnvVarOptional(
  name: string,
  fallback: string
): string {
  return process.env[name] ?? fallback;
}

function getEnvVarBoolean(
  name: string,
  fallback: boolean
): boolean {
  const value = process.env[name];

  if (!value) {
    return fallback;
  }

  return value === "true";
}

export const env = {
  PORT: Number(getEnvVarOptional("PORT", "3333")),

  NODE_ENV: getEnvVarOptional(
    "NODE_ENV",
    "development"
  ),

  DATABASE_URL: getEnvVar("DATABASE_URL"),

  JWT_SECRET: getEnvVar("JWT_SECRET"),

  JWT_EXPIRES_IN: getEnvVarOptional(
    "JWT_EXPIRES_IN",
    "7d"
  ),

  GOOGLE_CLIENT_ID: getEnvVarOptional(
    "GOOGLE_CLIENT_ID",
    ""
  ),

  CORS_ORIGINS: getEnvVarOptional(
    "CORS_ORIGINS",
    "http://localhost:8081,http://localhost:19006"
  ),

  EMAIL_HOST: getEnvVarOptional(
    "EMAIL_HOST",
    "smtp.gmail.com"
  ),

  EMAIL_PORT: Number(
    getEnvVarOptional("EMAIL_PORT", "465")
  ),

  EMAIL_SECURE: getEnvVarBoolean(
    "EMAIL_SECURE",
    true
  ),

  EMAIL_USER: getEnvVarOptional(
    "EMAIL_USER",
    ""
  ),

  EMAIL_PASSWORD: getEnvVarOptional(
    "EMAIL_PASSWORD",
    ""
  ),

  EMAIL_FROM: getEnvVarOptional(
    "EMAIL_FROM",
    ""
  ),
};

if (
  env.JWT_SECRET.length < 32 ||
  env.JWT_SECRET.includes("SUBSTITUA")
) {
  throw new Error(
    "JWT_SECRET deve ter ao menos 32 caracteres aleatórios."
  );
}