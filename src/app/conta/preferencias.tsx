import { useState } from "react";
import { Alert, ScrollView, Switch, TouchableOpacity, View } from "react-native";
import { Check, ChevronDown, Coins, Globe, RotateCcw } from "lucide-react-native";

import { useConfiguracoes, useMoedaExibicao, type Moeda } from "@/features/configuracoesContext";
import { IDIOMAS, useIdioma, type Idioma } from "@/features/idioma";
import { BackgroundGradient } from "@/shared/components/backgroundGradient";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Cards";
import { EstadoConfiguracoes } from "@/shared/components/EstadoConfiguracoes";
import { HeaderInterno } from "@/shared/components/Header";
import { Input } from "@/shared/components/Input";
import { Text } from "@/shared/components/Texto";
import { Cores } from "@/shared/constants/Cores";
import { useAction } from "@/shared/hooks/useAction";
import { styles } from "@/styles/preferencias";

const GRADIENTE_CARD: [string, string] = [
  "rgba(44, 27, 67, 0.94)",
  "rgba(33, 18, 53, 0.94)",
];
const CONFIRMACAO = "RECOMEÇAR";

function SeletorPreferencia<Valor extends string>({
  rotulo, valor, opcoes, aberto, opcoesBloqueadas, aoAlternar, aoEscolher,
}: {
  rotulo: string;
  valor: Valor;
  opcoes: Record<Valor, string>;
  aberto: boolean;
  opcoesBloqueadas: boolean;
  aoAlternar: () => void;
  aoEscolher: (valor: Valor) => void;
}) {
  return (
    <>
      <TouchableOpacity
        style={[styles.seletor, aberto && styles.seletorAberto]}
        accessibilityRole="button"
        accessibilityLabel={rotulo}
        accessibilityValue={{ text: opcoes[valor] }}
        accessibilityState={{ expanded: aberto }}
        onPress={aoAlternar}
      >
        <Text style={styles.valorSelecionado}>{opcoes[valor]}</Text>
        <ChevronDown size={19} color={Cores.destaque.limao} />
      </TouchableOpacity>
      {aberto && (
        <View style={styles.opcoesContainer}>
          {(Object.keys(opcoes) as Valor[]).map(opcao => {
            const selecionada = valor === opcao;
            return (
              <TouchableOpacity
                key={opcao}
                style={[
                  styles.opcao,
                  selecionada && styles.opcaoAtiva,
                  opcoesBloqueadas && styles.opcaoBloqueada,
                ]}
                accessibilityRole="button"
                accessibilityState={{ selected: selecionada, disabled: opcoesBloqueadas }}
                disabled={opcoesBloqueadas}
                onPress={() => aoEscolher(opcao)}
              >
                <Text style={[styles.textoOpcao, selecionada && styles.textoOpcaoAtiva]}>{opcoes[opcao]}</Text>
                {selecionada && <Check size={17} color={Cores.destaque.limao} />}
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </>
  );
}

export default function Preferencias() {
  const { configuracoes, atualizar, salvando, carregando, recomecar } = useConfiguracoes();
  const { idioma, t } = useIdioma();
  const { estado: estadoCotacao, dataReferencia } = useMoedaExibicao();
  const { busy, error, run, clearError } = useAction();
  const [confirmando, setConfirmando] = useState(false);
  const [confirmacao, setConfirmacao] = useState("");
  const [seletor, setSeletor] = useState<"idioma" | "moeda" | null>(null);
  const podeRecomecar = confirmacao.trim() === CONFIRMACAO && !busy;
  const bloqueado = !configuracoes || salvando || carregando;
  const moeda = configuracoes?.moeda ?? "BRL";
  const moedas: Record<Moeda, string> = {
    BRL: t("Real (R$)"),
    USD: t("Dólar (US$)"),
    EUR: t("Euro (€)"),
  };
  const avisoCotacao = estadoCotacao === "carregando"
    ? t("Carregando cotação. Valores exibidos em real.")
    : estadoCotacao === "indisponivel"
      ? t("Cotação indisponível. Valores exibidos em real.")
      : dataReferencia
        ? t("Cotação de referência do BCE em {data}.", {
            data: new Intl.DateTimeFormat(idioma, { dateStyle: "short", timeZone: "UTC" })
              .format(new Date(`${dataReferencia}T00:00:00Z`)),
          })
        : null;

  function fecharConfirmacao() {
    setConfirmando(false);
    setConfirmacao("");
    clearError();
  }

  function confirmarReset() {
    if (!podeRecomecar) return;
    void run(async () => {
      await recomecar(CONFIRMACAO);
      Alert.alert(t("Você recomeçou do zero"), t("Seus dados financeiros foram apagados."));
    });
  }

  return (
    <View style={styles.container}>
      <BackgroundGradient variante="padrao" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.conteudo}
      >
        <HeaderInterno titulo={t("Preferências")} />
        <View style={styles.lista}>
          <EstadoConfiguracoes />

          <Card gradiente={GRADIENTE_CARD} style={styles.card}>
            <View style={styles.linhaIcone}>
              <Globe size={18} color={Cores.destaque.limao} />
              <Text style={styles.rotuloItem}>{t("Idioma")}</Text>
            </View>
            <SeletorPreferencia<Idioma>
              rotulo={t("Idioma")}
              valor={idioma}
              opcoes={IDIOMAS}
              opcoesBloqueadas={bloqueado}
              aberto={seletor === "idioma"}
              aoAlternar={() => setSeletor(atual => atual === "idioma" ? null : "idioma")}
              aoEscolher={novoIdioma => {
                setSeletor(null);
                if (novoIdioma !== idioma) void atualizar({ idioma: novoIdioma });
              }}
            />

            <View style={[styles.linhaIcone, styles.espacoTopo]}>
              <Coins size={18} color={Cores.destaque.limao} />
              <Text style={styles.rotuloItem}>{t("Moeda utilizada")}</Text>
            </View>
            <SeletorPreferencia<Moeda>
              rotulo={t("Moeda utilizada")}
              valor={moeda}
              opcoes={moedas}
              opcoesBloqueadas={bloqueado}
              aberto={seletor === "moeda"}
              aoAlternar={() => setSeletor(atual => atual === "moeda" ? null : "moeda")}
              aoEscolher={novaMoeda => {
                setSeletor(null);
                if (novaMoeda !== moeda) void atualizar({ moeda: novaMoeda });
              }}
            />
            {moeda !== "BRL" && avisoCotacao && (
              <Text style={styles.descricaoSwitch} accessibilityLiveRegion="polite">{avisoCotacao}</Text>
            )}

            <View style={styles.divisor} />

            <View style={styles.linhaSwitch}>
              <View style={styles.textoSwitchContainer}>
                <Text style={styles.rotuloSwitch}>{t("Mostrar valores financeiros")}</Text>
                <Text style={styles.descricaoSwitch}>
                  {t("Exibir valores nos painéis e nas telas de consulta financeira.")}
                </Text>
              </View>
              <Switch
                accessibilityLabel={t("Mostrar valores financeiros")}
                disabled={bloqueado}
                value={configuracoes?.mostrarValores === true}
                onValueChange={(mostrarValores) => void atualizar({ mostrarValores })}
                trackColor={{
                  false: "rgba(163, 87, 255, 0.25)",
                  true: Cores.destaque.limao,
                }}
                thumbColor={Cores.base.branco}
              />
            </View>
          </Card>

          {!confirmando ? (
            <TouchableOpacity
              style={styles.cardPerigo}
              activeOpacity={0.8}
              accessibilityRole="button"
              onPress={() => setConfirmando(true)}
            >
              <View style={styles.iconePerigoContainer}>
                <RotateCcw size={20} color="#FF8585" />
              </View>
              <View style={styles.textosPerigo}>
                <Text style={styles.tituloPerigo}>{t("Recomeçar do zero")}</Text>
                <Text style={styles.descricaoPerigo}>{t("Apagar seus registros financeiros.")}</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <Card gradiente={GRADIENTE_CARD} style={[styles.card, { gap: 12 }]}>
              <Text style={styles.tituloPerigo}>{t("Recomeçar do zero")}</Text>
              <Text style={styles.descricaoSwitch}>
                {t("Receitas, despesas, metas, dívidas, reserva e outros registros financeiros serão apagados permanentemente. Sua conta e preferências serão mantidas.")}
              </Text>
              <Input
                label={t("Digite RECOMEÇAR para confirmar")}
                placeholder={CONFIRMACAO}
                value={confirmacao}
                onChangeText={setConfirmacao}
                editable={!busy}
                autoCapitalize="characters"
                autoCorrect={false}
              />
              {error ? (
                <Text style={{ color: "#FF8585" }} accessibilityRole="alert">{error}</Text>
              ) : null}
              <Button
                titulo={busy ? t("Apagando dados...") : t("Apagar dados financeiros")}
                variante="perigo"
                disabled={!podeRecomecar}
                onPress={confirmarReset}
              />
              <Button titulo={t("Cancelar")} variante="outline" disabled={busy} onPress={fecharConfirmacao} />
            </Card>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
