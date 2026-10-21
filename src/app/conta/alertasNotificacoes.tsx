import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Switch,
} from "react-native";

import {
  Receipt,
  PiggyBank,
  CalendarClock,
  ShieldAlert,
  Sparkles,
  Target,
} from "lucide-react-native";

import { HeaderInterno } from "../../shared/components/Header";
import { BackgroundGradient } from "@/shared/components/backgroundGradient";
import { Card } from "../../shared/components/Cards";

import { Cores } from "../../shared/constants/Cores";
import { styles } from "../../styles/alertasNotificacoes";

// Alertas e notificações: cada um começa ligado por padrão.
// TODO (backend): nada aqui é persistido ainda — é tudo estado local,
// só pra representar o layout do protótipo.
const ALERTAS = [
  {
    id: "vencimento",
    label: "Vencimento de contas",
    icon: Receipt,
  },
  {
    id: "gastos",
    label: "Lembretes de gastos",
    icon: PiggyBank,
  },
  {
    id: "calendario",
    label: "Avisos do Calendário Financeiro",
    icon: CalendarClock,
  },
  {
    id: "planoB",
    label: "Alertas do Plano B",
    icon: ShieldAlert,
  },
  {
    id: "resumo",
    label: "Resumo financeiro do mês",
    icon: Sparkles,
  },
  {
    id: "metas",
    label: "Lembretes de metas",
    icon: Target,
  },
] as const;

type AlertaId = (typeof ALERTAS)[number]["id"];

// Tela "Alertas e notificações" (dentro de Configurações).
export default function AlertasNotificacoes() {
  const [alertas, setAlertas] = useState<Record<AlertaId, boolean>>({
    vencimento: true,
    gastos: true,
    calendario: true,
    planoB: true,
    resumo: true,
    metas: true,
  });

  function alternar(id: AlertaId) {
    setAlertas((atual) => ({ ...atual, [id]: !atual[id] }));
  }

  return (
    <View style={styles.container}>
      <BackgroundGradient variante="funcional" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conteudo}
      >
        <HeaderInterno titulo="Alertas e notificações" />

        <View style={styles.lista}>
          <Card
            gradiente={["rgba(73, 38, 155, 0.71)", "rgba(45, 17, 108, 0.48)"]}
            style={styles.card}
          >
            {ALERTAS.map(({ id, label, icon: Icone }) => (
              <View key={id} style={styles.linhaSwitch}>
                <View style={styles.linhaIcone}>
                  <Icone size={18} color={Cores.roxo.claro} />
                  <Text style={styles.rotuloSwitch}>{label}</Text>
                </View>

                <Switch
                  value={alertas[id]}
                  onValueChange={() => alternar(id)}
                  trackColor={{
                    false: Cores.interface.borda,
                    true: Cores.destaque.limao,
                  }}
                  thumbColor={Cores.base.branco}
                />
              </View>
            ))}
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}