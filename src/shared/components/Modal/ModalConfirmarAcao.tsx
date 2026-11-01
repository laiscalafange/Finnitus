import {
  useEffect,
  useState,
} from "react";

import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";

import {
  LogOut,
  Trash2,
} from "lucide-react-native";

import { Card } from "../Cards";
import { Button } from "../Button";

import { Cores } from "../../constants/Cores";
import { FONTS } from "../../constants/Tipografia";
import { useAuth } from "../../../features/authContext";
import { useAction } from "../../hooks/useAction";

// Segundos até o botão "Confirmar" liberar
const ESPERA_SEGUNDOS = 10;

// Textos de cada ação. O mesmo modal serve pras duas:
// acao="sair" (botão "Sair da conta" do Perfil) e
// acao="excluir" (botão "Excluir conta" da Segurança).
const ACOES = {
  sair: {
    pergunta: "Você tem certeza que deseja sair da conta?",
    descricao: "Você precisará entrar novamente para acessar seus dados.",
    confirmar: "Confirmar saída",
    icone: LogOut,
    variante: "terciario",
  },
  excluir: {
    pergunta: "Você tem certeza que deseja excluir sua conta?",
    descricao:
      "Todos os seus dados serão apagados permanentemente. Essa ação não pode ser desfeita.",
    confirmar: "Confirmar exclusão",
    icone: Trash2,
    variante: "perigo",
  },
} as const;

type Props = {
  visible: boolean;
  acao: "sair" | "excluir";
  onClose: () => void;
};

// Card flutuante de confirmação (igual ao ModalFotoPerfil: fica por cima
// da tela atual, com o fundo escurecido). O botão de confirmar só libera
// depois de 10 segundos, pra evitar confirmar sem querer.
export function ModalConfirmarAcao({
  visible,
  acao,
  onClose,
}: Props) {
  const { pergunta, descricao, confirmar, icone: Icone, variante } =
    ACOES[acao];

  const { logout } = useAuth();
  const { busy, error, run } = useAction();

  const [restante, setRestante] = useState(ESPERA_SEGUNDOS);

  // A contagem recomeça do zero toda vez que o modal abre
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
    void run(async () => {
      if (acao === "excluir") {
        // TODO (backend): não existe endpoint de exclusão de conta ainda.
        // Por enquanto, confirmar aqui só desconecta o usuário (logout).
      }

      await logout();
    });
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
        {/* Fundo escurecido (mesmo do menu do +): tocar fora fecha */}
        <Pressable style={styles.fundo} onPress={fechar} />

        <Card
          gradiente={["rgba(73, 38, 155, 0.95)", "rgba(45, 17, 108, 0.95)"]}
          style={[
            styles.card,
            acao === "excluir" ? styles.cardExcluir : null,
          ]}
        >
          <View style={styles.iconeCirculo}>
            <Icone
              size={28}
              color={
                acao === "excluir"
                  ? Cores.estado.erro
                  : Cores.destaque.limao
              }
            />
          </View>

          <Text style={styles.pergunta}>{pergunta}</Text>
          <Text style={styles.descricao}>{descricao}</Text>

          {error ? (
            <Text style={styles.erro} accessibilityRole="alert">
              {error}
            </Text>
          ) : null}

          <View style={styles.botoes}>
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

            <Button
              titulo="Cancelar"
              variante="outline"
              disabled={busy}
              onPress={fechar}
            />
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

  // Mesmo escurecimento do fundo do menu do + na barra de navegação
  fundo: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },

  card: {
    alignItems: "center",
    borderColor: "rgba(168, 79, 255, 0.35)",
  },

  // Card de "Excluir conta": borda vermelha de alerta
  cardExcluir: {
    borderColor: "rgba(239, 68, 68, 0.4)",
  },

  iconeCirculo: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  pergunta: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 18,
    color: Cores.base.branco,
    textAlign: "center",
    marginBottom: 8,
  },

  descricao: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 14,
    lineHeight: 20,
    color: Cores.texto.claro,
    textAlign: "center",
    marginBottom: 20,
  },

  erro: {
    color: "#ffb4b4",
    fontSize: 14,
    fontFamily: FONTS.quicksand.semibold,
    marginBottom: 12,
    textAlign: "center",
  },

  botoes: {
    alignSelf: "stretch",
  },
});