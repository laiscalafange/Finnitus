import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Alert } from "react-native";
import axios from "axios";

import {
  authService,
  type Session,
  type User,
} from "../services/auth";

import {
  errorMessage,
  onSessionExpired,
  setAccessToken,
} from "../services/api";

import { tokenStorage } from "../services/tokenStorage";

type Auth = {
  user: User | null;
  loading: boolean;
  startupError: string;

  retry: () => Promise<void>;

  login: (
    email: string,
    password: string
  ) => Promise<void>;

  googleLogin: (
    idToken: string
  ) => Promise<void>;

  logout: () => Promise<void>;
  clearSession: () => Promise<void>;
  updateUser: (user: User) => void;

  recoveryEmail: string;
  resetToken: string | null;

  startRecovery: (email: string) => void;
  setResetToken: (token: string | null) => void;
  clearRecovery: () => void;
};

const Context = createContext<Auth | null>(null);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);
  const [startupError, setStartupError] = useState("");

  const [recoveryEmail, setRecoveryEmail] = useState("");

  const [resetToken, setResetToken] = useState<
    string | null
  >(null);

  const revision = useRef(0);

  const clearRecovery = useCallback(() => {
    setRecoveryEmail("");
    setResetToken(null);
  }, []);

  const clearSession = useCallback(async () => {
    revision.current++;

    setAccessToken(null);
    setUser(null);
    clearRecovery();

    setStartupError("");
    setLoading(false);

    try {
      await tokenStorage.remove();
    } catch {
      setStartupError(
        "Não foi possível remover a sessão salva. Tente sair novamente antes de fechar o aplicativo."
      );
    }
  }, [clearRecovery]);

  const retry = useCallback(async () => {
    const current = ++revision.current;

    setLoading(true);
    setStartupError("");

    try {
      const token = await tokenStorage.get();

      if (current !== revision.current) {
        return;
      }

      if (!token) {
        setAccessToken(null);
        setUser(null);
        return;
      }

      setAccessToken(token);

      const restored = await authService.me();

      if (current === revision.current) {
        setUser(restored);
      }
    } catch (error) {
      if (current !== revision.current) {
        return;
      }

      if (
        axios.isAxiosError(error) &&
        error.response?.status === 401
      ) {
        await clearSession();
      } else {
        // Erro de rede não apaga uma sessão potencialmente válida.
        setStartupError(errorMessage(error));
      }
    } finally {
      if (current === revision.current) {
        setLoading(false);
      }
    }
  }, [clearSession]);

  useEffect(() => {
    onSessionExpired(() => {
      void clearSession();
    });

    void retry();

    return () => {
      revision.current++;
      onSessionExpired(undefined);
    };
  }, [clearSession, retry]);

  async function establish(
    session: Session,
    current: number
  ) {
    if (current !== revision.current) {
      return;
    }

    await tokenStorage.set(session.token);

    if (current !== revision.current) {
      return;
    }

    setAccessToken(session.token);
    setUser(session.user);
    clearRecovery();
  }

  async function login(
    email: string,
    password: string
  ) {
    const current = ++revision.current;

    const session = await authService.login(
      email,
      password
    );

    await establish(session, current);
  }

  async function googleLogin(idToken: string) {
    const current = ++revision.current;

    const session = await authService.google(idToken);

    await establish(session, current);
  }

  async function logout() {
    let failed = false;

    try {
      await authService.logout();
    } catch {
      failed = true;
    }

    await clearSession();

    if (failed) {
      Alert.alert(
        "Você saiu deste aparelho",
        "Não foi possível confirmar a saída das outras sessões no servidor. Elas continuam válidas até expirar ou até um novo logout online."
      );
    }
  }

  return (
    <Context.Provider
      value={{
        user,
        loading,
        startupError,
        retry,
        login,
        googleLogin,
        logout,
        clearSession,

        updateUser: (updated) => {
          setUser((current) =>
            current?.id === updated.id
              ? updated
              : current
          );
        },

        recoveryEmail,
        resetToken,

        startRecovery: (email) => {
          setRecoveryEmail(email);
          setResetToken(null);
        },

        setResetToken,
        clearRecovery,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function useAuth() {
  const value = useContext(Context);

  if (!value) {
    throw new Error(
      "useAuth precisa de AuthProvider."
    );
  }

  return value;
}