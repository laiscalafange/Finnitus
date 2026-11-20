
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";

import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";

import { LogOut, Trash2 } from "lucide-react-native";

import { Card } from "../Cards";
import { Button } from "../Button";

import { Cores } from "../../constants/Cores";
import { FONTS } from "../../constants/Tipografia";
import { useAuth } from "../../../features/authContext";
import { useAction } from "../../hooks/useAction";

// Segundos até o botão "Confirmar" liberar
const ESPERA_SEGUNDOS = 10;

const ACOES = {
  sair: {
    pergunta: "Você tem certeza que deseja sair da conta?",
    descricao:
      "Você precisará entrar novamente para acessar seus dados.",
    confirmar: "Confirmar saída",
    icone: LogOut,
    variante: "terciario",
  },
  excluir: {
    pergunta: "Você tem certeza que deseja excluir sua conta?",
    descricao:
      "Na próxima tela, confirme a exclusão com sua senha. Todos os seus dados serão apagados permanentemente.",
    confirmar: "Continuar para exclusão",
    icone: Trash2,
    variante: "perigo",
  },
} as const;

type Props = {
  visible: boolean;
  acao: "sair" | "excluir";
  onClose: () => void;
};

export function ModalConfirmarAcao({
  visible,
  acao,
  onClose,
}: Props) {
  const {
    pergunta,
    descricao,
    confirmar,
    icone: Icone,
    variante,
  } = ACOES[acao];

  const router = useRouter();
  const { logout } = useAuth();
  const { busy, error, run } = useAction();

  const [restante, setRestante] = useState(ESPERA_SEGUNDOS);

  useEffect(() => {
    if (!visible) {
      return;
    }

    setRestante(ESPERA_SEGUNDOS);

    const timer = setInterval(() => {
      setRestante((valor) => Math.max(0, valor - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [visible]);

  function confirmarAcao() {
    if (acao === "excluir") {
      onClose();
      router.push("/conta/excluir");
      return;
    }

    void run(logout);
  }

  function fechar() {
    if (!busy) {
      onClose();
    }
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={fechar}
    >
      <View style={styles.overlay}>
        <Pressable
          style={styles.fundo}
          onPress={fechar}
        />

        <Card
          gradiente={[
            "rgba(44, 27, 67, 0.98)",
            "rgba(33, 18, 53, 0.98)",
          ]}
          style={[
            styles.card,
            acao === "excluir"
              ? styles.cardExcluir
              : null,
          ]}
        >
          <View
            style={[
              styles.iconeCirculo,
              acao === "excluir"
                ? styles.iconeCirculoExcluir
                : null,
            ]}
          >
            <Icone
              size={26}
              color={
                acao === "excluir"
                  ? "#FF7777"
                  : Cores.destaque.limao
              }
            />
          </View>

          <Text style={styles.pergunta}>
            {pergunta}
          </Text>

          <Text style={styles.descricao}>
            {descricao}
          </Text>

          {error ? (
            <Text
              style={styles.erro}
              accessibilityRole="alert"
            >
              {error}
            </Text>
          ) : null}

          <View style={styles.botoes}>
            <View style={styles.botaoContainer}>
              <Button
                titulo={
                  busy
                    ? "Aguarde..."
                    : restante > 0
                      ? `${confirmar} (${restante}s)`
                      : confirmar
                }
                variante={variante}
                disabled={busy || restante > 0}
                onPress={confirmarAcao}
              />
            </View>

            <View style={styles.botaoContainer}>
              <Button
                titulo="Cancelar"
                variante="outline"
                disabled={busy}
                onPress={fechar}
              />
            </View>
          </View>
        </Card>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  fundo: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0, 0, 0, 0.72)",
  },

  card: {
    width: "100%",
    maxWidth: 440,
    alignSelf: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(163, 87, 255, 0.30)",
    borderRadius: 22,
    paddingHorizontal: 22,
    paddingVertical: 28,
  },

  cardExcluir: {
    borderColor: "rgba(255, 119, 119, 0.40)",
  },

  iconeCirculo: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "rgba(163, 87, 255, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(163, 87, 255, 0.25)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  iconeCirculoExcluir: {
    backgroundColor: "rgba(255, 65, 65, 0.09)",
    borderColor: "rgba(255, 119, 119, 0.30)",
  },

  pergunta: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 20,
    lineHeight: 27,
    color: Cores.base.branco,
    textAlign: "center",
    marginBottom: 10,
  },

  descricao: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 14,
    lineHeight: 21,
    color: "#C7A9F5",
    textAlign: "center",
    marginBottom: 24,
  },

  erro: {
    color: "#FF7777",
    fontSize: 14,
    fontFamily: FONTS.quicksand.semibold,
    marginBottom: 12,
    textAlign: "center",
  },

  botoes: {
    alignSelf: "stretch",
    width: "100%",
    gap: 10,
  },

  botaoContainer: {
    width: "100%",
    borderRadius: 14,
    overflow: "hidden",
  },
});
