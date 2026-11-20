
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import { useRouter } from "expo-router";

import {
  SlidersHorizontal,
  Bell,
  Palette,
  ChevronRight,
} from "lucide-react-native";

import { HeaderInterno } from "../../shared/components/Header";
import { BackgroundGradient } from "@/shared/components/backgroundGradient";
import { Card } from "../../shared/components/Cards";

import { Cores } from "../../shared/constants/Cores";
import { styles } from "../../styles/configuracoes";

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

export default function Configuracoes() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <BackgroundGradient variante="funcional" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conteudo}
      >
        <HeaderInterno titulo="Configurações" />

        <View style={styles.lista}>
          {ITENS.map(({ id, label, icon: Icone, rota }) => (
            <TouchableOpacity
              key={id}
              activeOpacity={0.85}
              onPress={() => router.push(rota)}
            >
              <Card
                gradiente={[
                  "rgba(44, 27, 67, 0.83)",
                  "rgba(33, 18, 53, 0.8)",
                ]}
                style={styles.card}
              >
                <View style={styles.linha}>
                  <View style={styles.iconeCirculo}>
                    <Icone
                      size={20}
                      color={Cores.destaque.limao}
                    />
                  </View>

                  <Text style={styles.rotulo}>
                    {label}
                  </Text>

                  <ChevronRight
                    size={19}
                    color="#BFA7DD"
                  />
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
