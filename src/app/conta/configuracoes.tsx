import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  SlidersHorizontal,
  Bell,
  Palette,
  ChevronRight,
} from "lucide-react-native";

import { HeaderInterno } from "../../shared/components/Header";
import { Card } from "../../shared/components/Cards";

import { Cores } from "../../shared/constants/Cores";
import { styles } from "../../styles/configuracoes";

// Itens do menu de Configurações — cada um leva pra sua própria tela.
const ITENS = [
  {
    id: "preferencias",
    label: "Preferências",
    icon: SlidersHorizontal,
    rota: "/conta/preferencias",
  },
  {
    id: "alertas",
    label: "Alertas e notificações",
    icon: Bell,
    rota: "/conta/alertasNotificacoes",
  },
  {
    id: "aparencia",
    label: "Aparência",
    icon: Palette,
    rota: "/conta/aparencia",
  },
] as const;

// Tela "Configurações": só o menu, igual ao protótipo (um card por
// funcionalidade, com o mesmo fundo/borda roxos usados no Ajuda).
export default function Configuracoes() {
  const router = useRouter();

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
        {/* Cabeçalho: só a seta de voltar e o título, igual às outras
            telas de Perfil */}
        <HeaderInterno
          titulo="Configurações"
          subtitulo="Perfil"
          mostrarPremium={false}
          mostrarNotificacao={false}
        />

        <View style={styles.lista}>
          {ITENS.map(({ id, label, icon: Icone, rota }) => (
            <TouchableOpacity
              key={id}
              activeOpacity={0.85}
              onPress={() => router.push(rota)}
            >
              <Card
                gradiente={["rgba(73, 38, 155, 0.71)", "rgba(45, 17, 108, 0.48)"]}
                style={styles.card}
              >
                <View style={styles.linha}>
                  <View style={styles.iconeCirculo}>
                    <Icone size={20} color={Cores.destaque.limao} />
                  </View>

                  <Text style={styles.rotulo}>{label}</Text>

                  <ChevronRight size={20} color={Cores.texto.claro} />
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}