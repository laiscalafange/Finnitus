import { isAxiosError } from "axios";
import { Platform } from "react-native";
import { api } from "./api";

export type User = {
  id: number;
  name: string;
  email: string;
  telefone: string | null;
  data_nasc: string | null;
  data_cadastro: string;
  tipo: string;
  profileComplete: boolean;
};

export type Session = {
  user: User;
  token: string;
  isNewUser?: boolean;
};

export type Desafio2FA = { requires2FA: true; challengeId: string; };
export type ResultadoLogin = Session | Desafio2FA;

export type RegisterData = {
  name: string;
  email: string;
  password: string;
  maiorDeIdade: boolean;
  leuTermos: boolean;
};

export type UpdateProfileData = {
  name: string;
  telefone: string;
  data_nasc: string;
};

function exigirAceite(aceite: boolean): void {
  if (aceite !== true) {
    throw new Error(
      "Confirme que tem 18 anos ou mais e que leu os documentos legais antes de continuar."
    );
  }
}

export const authService = {
  register: async (data: RegisterData) => {
    // Nunca envia cadastro sem as DUAS declarações.
    if (data.maiorDeIdade !== true || data.leuTermos !== true) {
      throw new Error(
        "Confirme sua maioridade e a leitura dos Termos e da Política de Privacidade."
      );
    }

    const response = await api.post<{ user: User }>(
      "/auth/register",
      data
    );

    return response.data;
  },

  login: async (
    email: string,
    password: string,
    aceite = false
  ) => {
    exigirAceite(aceite);
    const response = await api.post<ResultadoLogin>(
      "/auth/login",
      {
        email,
        password,
        maiorDeIdade: aceite,
        leuTermos: aceite,
        plataforma: Platform.OS,
      }
    );
    return response.data;
  },

  google: async (idToken: string, aceite = false) => {
    exigirAceite(aceite);
    const response = await api.post<ResultadoLogin>(
      "/auth/google",
      {
        idToken,
        maiorDeIdade: aceite,
        leuTermos: aceite,
        plataforma: Platform.OS,
      }
    );

    return response.data;
  },

  verificarDuasEtapas: async (challengeId: string, codigo: string) => {
    const { data } = await api.post<Session>("/auth/2fa", { challengeId, codigo });
    return data;
  },

  me: async () => {
    const response = await api.get<{ user: User }>("/me");
    return response.data.user;
  },

  update: async (data: UpdateProfileData) => {
    const response = await api.patch<{ user: User }>(
      "/me",
      data
    );
    return response.data.user;
  },

  forgot: async (email: string) => {
    try {
      const response = await api.post<{ message: string }>(
        "/auth/forgot-password",
        { email }
      );
      return response.data;
    } catch (error) {
      if (
        isAxiosError<{ code?: string }>(error) &&
        error.response?.status === 503 &&
        error.response.data?.code === "PASSWORD_RECOVERY_UNAVAILABLE"
      ) {
        throw new Error("A recuperação de senha está indisponível no momento. Tente novamente mais tarde.");
      }
      throw error;
    }
  },

  verify: async (email: string, code: string) => {
    const response = await api.post<{ resetToken: string }>(
      "/auth/verify-code",
      { email, code }
    );
    return response.data;
  },

  reset: async (resetToken: string, newPassword: string) => {
    return api.post("/auth/reset-password", {
      resetToken,
      newPassword,
    });
  },

  deleteAccount: async (currentPassword: string) => {
    await api.delete("/me", {
      data: {
        confirm: true,
        currentPassword,
      },
    });
  },

  logout: async () => {
    return api.post("/logout");
  },
};
