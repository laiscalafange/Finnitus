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
  type Desafio2FA,
  type ResultadoLogin,
  type Session,
  type User,
} from "../services/auth";

import {
  errorMessage,
  onSessionExpired,
  setAccessToken,
} from "../services/api";

import { tokenStorage } from "../services/tokenStorage";
import { segurancaService } from "../services/seguranca";
import { ModalCodigoSeguranca } from "../shared/components/Modal/ModalCodigoSeguranca";

type Auth = {
  user: User | null;
  loading: boolean;
  startupError: string;

  retry: () => Promise<void>;

  // O último argumento é obrigatório na API. O default false mantém
  // chamadas antigas compatíveis, mas elas serão rejeitadas pelo servidor.
  login: (
    email: string,
    password: string,
    aceite?: boolean
  ) => Promise<void>;

  googleLogin: (
    idToken: string,
    aceite?: boolean
  ) => Promise<void>;

  logout: () => Promise<void>;
  clearSession: (options?: { senhaRedefinida?: boolean }) => Promise<void>;
  senhaRedefinida: boolean;
  confirmarAlteracao2FA: (ativar: boolean, challengeId: string, codigo: string) => Promise<boolean>;
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
  const [senhaRedefinida, setSenhaRedefinida] = useState(false);
  const [desafio, setDesafio] = useState<(Desafio2FA & { revision: number }) | null>(null);

  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [resetToken, setResetToken] = useState<string | null>(null);

  const revision = useRef(0);
  const rotacaoToken = useRef<{ expirou: boolean } | null>(null);

  const clearRecovery = useCallback(() => {
    setRecoveryEmail("");
    setResetToken(null);
  }, []);

  const clearSession = useCallback(async (options?: { senhaRedefinida?: boolean }) => {
    revision.current++;

    setAccessToken(null);
    setDesafio(null);
    setSenhaRedefinida(options?.senhaRedefinida === true);
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
      if (rotacaoToken.current) {
        rotacaoToken.current.expirou = true;
      } else {
        void clearSession();
      }
    });

    void retry();

    return () => {
      revision.current++;
      onSessionExpired(undefined);
    };
  }, [clearSession, retry]);

  async function establish(session: Session, current: number) {
    if (current !== revision.current) {
      return;
    }

    await tokenStorage.set(session.token);

    if (current !== revision.current) {
      return;
    }

    setAccessToken(session.token);
    setDesafio(null);
    setSenhaRedefinida(false);
    setUser(session.user);
    clearRecovery();
  }

  async function processarLogin(resultado: ResultadoLogin, current: number) {
    if (current !== revision.current) return;
    if ("requires2FA" in resultado) {
      setDesafio({ ...resultado, revision: current });
      return;
    }
    await establish(resultado, current);
  }

  async function confirmarLogin2FA(codigo: string) {
    if (!desafio) return;
    const sessao = await authService.verificarDuasEtapas(desafio.challengeId, codigo);
    await establish(sessao, desafio.revision);
  }

  async function confirmarAlteracao2FA(ativar: boolean, challengeId: string, codigo: string) {
    const current = revision.current;
    const rotacao = { expirou: false };
    rotacaoToken.current = rotacao;
    try {
      const sessao = await segurancaService.confirmarAlteracao(ativar, challengeId, codigo);
      if (current === revision.current) {
        // As outras requisições podem ter sido iniciadas com o token já revogado.
        setAccessToken(sessao.token);
        try {
          await establish(sessao, current);
        } catch (error) {
          await clearSession();
          throw error;
        }
      }
      return sessao.ativa;
    } catch (error) {
      if (rotacao.expirou && current === revision.current) {
        try {
          await authService.me();
        } catch (checkError) {
          if (axios.isAxiosError(checkError) && checkError.response?.status === 401) {
            await clearSession();
          }
        }
      }
      throw error;
    } finally {
      rotacaoToken.current = null;
    }
  }

  async function login(
    email: string,
    password: string,
    aceite = false
  ) {
    // Defesa extra para que qualquer tela que use o contexto não burle o aceite.
    if (aceite !== true) {
      throw new Error(
        "Confirme que tem 18 anos ou mais e que leu os documentos legais para entrar."
      );
    }

    const current = ++revision.current;
    const resultado = await authService.login(email, password, aceite);
    await processarLogin(resultado, current);
  }

  async function googleLogin(idToken: string, aceite = false) {
    if (aceite !== true) {
      throw new Error(
        "Confirme que tem 18 anos ou mais e que leu os documentos legais para continuar."
      );
    }

    const current = ++revision.current;
    const resultado = await authService.google(idToken, aceite);
    await processarLogin(resultado, current);
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
        "Não foi possível confirmar a revogação desta sessão no servidor."
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
        senhaRedefinida,
        confirmarAlteracao2FA,

        updateUser: (updated) => {
          setUser((current) =>
            current?.id === updated.id ? updated : current
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
      {desafio && (
        <ModalCodigoSeguranca
          key={desafio.challengeId}
          titulo="Verificação em duas etapas"
          instrucao="Digite o código enviado ao e-mail da sua conta. O código expira em 5 minutos."
          onConfirmar={confirmarLogin2FA}
          onCancelar={() => setDesafio(null)}
        />
      )}
    </Context.Provider>
  );
}

export function useAuth() {
  const value = useContext(Context);

  if (!value) {
    throw new Error("useAuth precisa de AuthProvider.");
  }

  return value;
}
