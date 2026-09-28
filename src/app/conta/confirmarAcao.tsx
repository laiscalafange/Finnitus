import {
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  ScrollView,
} from "react-native";

import {
  useRouter,
  useLocalSearchParams,
} from "expo-router";

import { LinearGradient } from "expo-linear-gradient";
import {
  LogOut,
  Trash2,
} from "lucide-react-native";

import { HeaderInterno } from "../../shared/components/Header";
import { Card } from "../../shared/components/Cards";
import { Button } from "../../shared/components/Button";

import { Cores } from "../../shared/constants/Cores";
import { useAuth } from "../../features/authContext";
import { useAction } from "../../shared/hooks/useAction";
import { styles } from "../../styles/confirmarAcao";

// Segundos até o botão "Confirmar" liberar
const ESPERA_SEGUNDOS = 10;

// Textos de cada ação. A mesma tela serve pras duas: quem chama passa
// ?acao=sair (botão "Sair da conta" do Perfil) ou ?acao=excluir
// (botão "Excluir conta" da Segurança).
const ACOES = {
  sair: {
    titulo: "Sair da conta",
    pergunta: "Você tem certeza que deseja sair da conta?",
    descricao: "Você precisará entrar novamente para acessar seus dados.",
    confirmar: "Confirmar saída",
    icone: LogOut,
    variante: "terciario",
  },
  excluir: {
    titulo: "Excluir conta",
    pergunta: "Você tem certeza que deseja excluir sua conta?",
    descricao:
      "Todos os seus dados serão apagados permanentemente. Essa ação não pode ser desfeita.",
    confirmar: "Confirmar exclusão",
    icone: Trash2,
    variante: "perigo",
  },
} as const;

// Tela de confirmação de "Sair da conta" e "Excluir conta".
export default function ConfirmarAcao() {
  const router = useRouter();

  const params = useLocalSearchParams<{ acao?: string }>();
  const acao = params.acao === "excluir" ? "excluir" : "sair";
  const { titulo, pergunta, descricao, confirmar, icone: Icone, variante } =
    ACOES[acao];

  const { logout } = useAuth();
  const { busy, error, run } = useAction();

  // Contagem regressiva: o botão só libera quando chega em zero,
  // pra evitar que a pessoa confirme sem querer.
  const [restante, setRestante] = useState(ESPERA_SEGUNDOS);

  useEffect(() => {
    const timer = setInterval(() => {
      setRestante((valor) => Math.max(0, valor - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  function confirmarAcao() {
    void run(async () => {
      if (acao === "excluir") {
        // TODO (backend): não existe endpoint de exclusão de conta ainda.
        // Por enquanto, confirmar aqui só desconecta o usuário (logout).
      }

      await logout();
    });
  }

  return (
    <LinearGradient
      colors={["#160B24", "#08070A", "#160B24"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conteudo}
      >
        <HeaderInterno
          titulo={titulo}
          subtitulo="Perfil"
          mostrarPremium={false}
          mostrarNotificacao={false}
        />

        <View style={styles.lista}>
          <Card
            gradiente={["rgba(73, 38, 155, 0.71)", "rgba(45, 17, 108, 0.48)"]}
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
          </Card>

          {error ? (
            <Text style={styles.erro} accessibilityRole="alert">
              {error}
            </Text>
          ) : null}

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
            onPress={() => router.back()}
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
}