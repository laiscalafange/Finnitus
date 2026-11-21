import { useIdioma } from "@/features/idioma";

import {
  View,
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
import { EstadoConfiguracoes } from "@/shared/components/EstadoConfiguracoes";
import { Text } from "@/shared/components/Texto";
import { useConfiguracoes } from "@/features/configuracoesContext";

import { Cores } from "../../shared/constants/Cores";
import { styles } from "../../styles/alertasNotificacoes";

const ALERTAS = [
  {
    id: "vencimento",
    label: "Vencimento de contas",
    descricao: "Receba lembretes sobre contas próximas do vencimento.",
    icon: Receipt,
  },
  {
    id: "gastos",
    label: "Lembretes de gastos",
    descricao: "Avisos para manter seus registros financeiros em dia.",
    icon: PiggyBank,
  },
  {
    id: "calendario",
    label: "Calendário financeiro",
    descricao: "Notificações sobre os eventos do seu calendário.",
    icon: CalendarClock,
  },
  {
    id: "planoB",
    label: "Alertas do Plano B",
    descricao: "Acompanhe os avisos do seu planejamento financeiro.",
    icon: ShieldAlert,
  },
  {
    id: "resumo",
    label: "Resumo financeiro",
    descricao: "Receba um resumo da sua movimentação mensal.",
    icon: Sparkles,
  },
  {
    id: "metas",
    label: "Lembretes de metas",
    descricao: "Acompanhe seus objetivos e prazos financeiros.",
    icon: Target,
  },
] as const;

const GRADIENTE_CARD: [string, string] = [
  "rgba(44, 27, 67, 0.81)",
  "rgba(33, 18, 53, 0.83)",
];

export default function AlertasNotificacoes() {
  const { t } = useIdioma();
  const { configuracoes, carregando, salvando, atualizar } = useConfiguracoes();

  return (
    <View style={styles.container}>
      <BackgroundGradient variante="padrao" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conteudo}
      >
        <HeaderInterno titulo={t("Alertas e notificações")} />

        <View style={styles.lista}>
          <EstadoConfiguracoes />
          <Card
            gradiente={GRADIENTE_CARD}
            style={styles.card}
          >
            {ALERTAS.map(
              ({ id, label, descricao, icon: Icone }, index) => (
                <View
                  key={id}
                  style={[
                    styles.item,
                    index !== ALERTAS.length - 1 &&
                      styles.itemComDivisor,
                  ]}
                >
                  <View style={styles.iconeContainer}>
                    <Icone
                      size={19}
                      color={Cores.destaque.limao}
                    />
                  </View>

                  <View style={styles.textosItem}>
                    <Text style={styles.tituloItem}>
                      {t(label)}
                    </Text>

                    <Text style={styles.descricaoItem}>
                      {t(descricao)}
                    </Text>
                  </View>

                  <Switch
                    accessibilityLabel={t(label)}
                    disabled={!configuracoes || carregando || salvando}
                    value={configuracoes?.[id] === true}
                    onValueChange={(value) => void atualizar({ [id]: value })}
                    trackColor={{
                      false: "rgba(163, 87, 255, 0.25)",
                      true: Cores.destaque.limao,
                    }}
                    thumbColor={Cores.base.branco}
                  />
                </View>
              )
            )}
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}
