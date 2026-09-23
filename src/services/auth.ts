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

export type RegisterData = {
  name: string;
  email: string;
  password: string;
};

export type UpdateProfileData = {
  name: string;
  telefone: string;
  data_nasc: string;
};

export const authService = {
  register: async (data: RegisterData) => {
    const response = await api.post<{ user: User }>(
      "/auth/register",
      data
    );

    return response.data;
  },

  login: async (
    email: string,
    password: string
  ) => {
    const response = await api.post<Session>(
      "/auth/login",
      {
        email,
        password,
      }
    );

    return response.data;
  },

  google: async (idToken: string) => {
    const response = await api.post<Session>(
      "/auth/google",
      { idToken }
    );

    return response.data;
  },

  me: async () => {
    const response = await api.get<{ user: User }>(
      "/me"
    );

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
    const response = await api.post<{
      message: string;
    }>("/auth/forgot-password", { email });

    return response.data;
  },

  verify: async (
    email: string,
    code: string
  ) => {
    const response = await api.post<{
      resetToken: string;
    }>("/auth/verify-code", {
      email,
      code,
    });

    return response.data;
  },

  reset: async (
    resetToken: string,
    newPassword: string
  ) => {
    return api.post("/auth/reset-password", {
      resetToken,
      newPassword,
    });
  },

  logout: async () => {
    return api.post("/logout");
  },
};