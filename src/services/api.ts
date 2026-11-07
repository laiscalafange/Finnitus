import axios from "axios";

const baseURL = process.env.EXPO_PUBLIC_API_URL?.trim();

export const api = axios.create({
  baseURL,
  timeout: 15000,

  headers: {
    "Content-Type": "application/json",
  },
});

let accessToken: string | null = null;
let expiredHandler: (() => void) | undefined;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

export function onSessionExpired(
  handler: (() => void) | undefined
) {
  expiredHandler = handler;
}

api.interceptors.request.use((config) => {
  if (!baseURL) {
    throw new Error(
      "Configure EXPO_PUBLIC_API_URL no arquivo .env do aplicativo."
    );
  }

  // As rotas públicas de autenticação não precisam do JWT.
  if (
    accessToken &&
    !config.url?.startsWith("/auth/")
  ) {
    config.headers.set(
      "Authorization",
      `Bearer ${accessToken}`
    );
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,

  (error) => {
    // Não registrar corpo da resposta, payload, tokens ou dados financeiros.
    if (__DEV__) console.warn("Falha na API", { status: error.response?.status });
    const sent = error.config?.headers?.Authorization;

    // Uma resposta antiga não encerra uma sessão mais recente.
    if (
      error.response?.status === 401 &&
      accessToken &&
      sent === `Bearer ${accessToken}`
    ) {
      expiredHandler?.();
    }

    return Promise.reject(error);
  }
);

export function errorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 429) {
      const seconds = Number(
        error.response.headers["retry-after"]
      );

      if (Number.isFinite(seconds) && seconds > 0) {
        return (
          `Muitas tentativas. Aguarde ${Math.ceil(seconds)} ` +
          "segundos e tente novamente."
        );
      }

      return "Muitas tentativas. Aguarde e tente novamente.";
    }

    if (error.response?.status === 401) {
      if (error.config?.url?.includes('/auth/login')) return "E-mail ou senha incorretos.";
      if (error.config?.url?.includes('/auth/google')) return "Não foi possível autenticar com Google.";
      return "Sua sessão expirou. Entre novamente.";
    }
    if (error.response?.status === 403) return "Você não tem permissão para esta ação.";
    if (error.response?.status === 404) return "Registro não encontrado ou indisponível.";
    if ((error.response?.status ?? 0) >= 500) return "Não foi possível concluir. Tente novamente mais tarde.";
    // Erros de validação (4xx) podem ser mostrados quando são curtos e objetivos.
    const detail = error.response?.data?.error ?? error.response?.data?.mensagem;
    if (error.response?.status === 400 && typeof detail === "string" && detail.length <= 140) {
      return detail;
    }

    if (!error.response) {
      return (
        "Não foi possível acessar o servidor. " +
        "Confira a conexão e o endereço da API."
      );
    }

    return "Não foi possível concluir a operação.";
  }

  return error instanceof Error && !/Bearer|token|sql|stack|prisma|database|postgres/i.test(error.message)
    ? error.message
    : "Não foi possível concluir a operação.";
}