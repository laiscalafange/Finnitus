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

    if (
      typeof error.response?.data?.error === "string"
    ) {
      return error.response.data.error;
    }

    if (!error.response) {
      return (
        "Não foi possível acessar o servidor. " +
        "Confira a conexão e o endereço da API."
      );
    }

    return "Não foi possível concluir a operação.";
  }

  return error instanceof Error
    ? error.message
    : "Ocorreu um erro. Tente novamente.";
}