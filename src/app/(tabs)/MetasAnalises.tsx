
import { useMemo } from "react";
import {
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import { Lightbulb, Wallet } from "lucide-react-native";
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLabel,
} from "victory-native";

import { HeaderInterno } from "../../shared/components/Header";
import { BackgroundGradient } from "@/shared/components/backgroundGradient";
import { Card } from "../../shared/components/Cards";
import { Progress } from "../../shared/components/Progress";
import { Cores } from "../../shared/constants/Cores";
import { FONTS } from "../../shared/constants/Tipografia";

import { CATEGORIAS_POR_ID } from "@/features/menuMais/constants";
import { formatarMoeda } from "@/features/menuMais/utils";
import { useFinanceiro } from "@/features/financeiroContext";
import {
  habitoGuardar,
  percentualMeta,
} from "@/features/metasData";

import { styles } from "../../styles/Metasanalises";

const GRADIENTE_CARD: [string, string] = [
  "rgba(44, 27, 67, 0.94)",
  "rgba(44, 27, 67, 0.90)",
];

const VERDE = Cores.destaque.limao;
const LILAS = "#C7A9F5";
const ROXO = "#A357FF";

const PERCENTUAL_DESTAQUE = 75;

function moedaSegura(valor: unknown): string {
  const numero = Number(valor);

  if (!Number.isFinite(numero)) {
    return "—";
  }

  return formatarMoeda(numero);
}

function valorCompacto(valor: number): string {
  if (valor >= 1000000) {
    return `R$ ${(valor / 1000000)
      .toFixed(1)
      .replace(".", ",")} mi`;
  }

  if (valor >= 1000) {
    return `R$ ${(valor / 1000)
      .toFixed(1)
      .replace(".", ",")} mil`;
  }

  return `R$ ${Math.round(valor).toLocaleString("pt-BR")}`;
}

export default function MetasAnalises() {
  const { width: larguraTela } = useWindowDimensions();
  const { metas } = useFinanceiro();

  const emAndamento = useMemo(
    () =>
      metas
        .filter((meta) => meta.status === "andamento")
        .map((meta) => {
          const valorAtual = Number(meta.valorAtual) || 0;

          // Usa o valor-alvo cadastrado quando disponível.
          // Evita exibir NaN caso o campo não exista.
          const dadosMeta = meta as unknown as Record<
            string,
            unknown
          >;

          const objetivoBruto =
            dadosMeta.valorObjetivo ??
            dadosMeta.valorMeta ??
            dadosMeta.valorAlvo ??
            dadosMeta.valorDesejado;

          const objetivoNumero = Number(objetivoBruto);

          const valorObjetivo =
            objetivoBruto != null &&
            Number.isFinite(objetivoNumero)
              ? objetivoNumero
              : null;

          return {
            id: meta.id,
            nome: meta.nome,
            categoriaId: meta.categoriaId ?? "outros",
            valorAtual,
            valorObjetivo,
            pct: percentualMeta(meta),
          };
        }),
    [metas]
  );

  const concluidas = useMemo(
    () => metas.filter((meta) => meta.status === "concluida"),
    [metas]
  );

  const totalGuardado = useMemo(
    () =>
      emAndamento.reduce(
        (soma, meta) => soma + meta.valorAtual,
        0
      ),
    [emAndamento]
  );

  const maiorPct = Math.max(
    ...emAndamento.map((meta) => meta.pct),
    0
  );

  const habito = useMemo(
    () => habitoGuardar(metas),
    [metas]
  );

  const temHabito = habito.some((item) => item.valor > 0);

  const totalPeriodo = habito.reduce(
    (soma, item) => soma + item.valor,
    0
  );

  const anterior = habito[habito.length - 2]?.valor ?? 0;
  const atual = habito[habito.length - 1]?.valor ?? 0;

  const variacao =
    anterior > 0
      ? Math.round(((atual - anterior) / anterior) * 100)
      : null;

  const larguraGrafico = Math.max(
    250,
    larguraTela - 90
  );

  const dadosGrafico = habito.map((item, indice) => ({
    x: indice + 1,
    y: item.valor,
    mes: item.mes,
  }));

  const maiorValorGrafico = Math.max(
    ...habito.map((item) => item.valor),
    0
  );

  return (
    <View style={styles.container}>
      <BackgroundGradient variante="funcional" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conteudo}
      >
        <HeaderInterno titulo="Análises" />

        <View style={styles.conteudoSobreHeader}>
          {/* TOTAL GUARDADO */}
          <Card
            gradiente={GRADIENTE_CARD}
            style={styles.cardTotal}
          >
            <View style={styles.iconeTotal}>
              <Wallet size={23} color={VERDE} />
            </View>

            <Text style={styles.rotuloTotal}>
              Total guardado
            </Text>

            <Text
              style={styles.valorTotal}
              adjustsFontSizeToFit
              numberOfLines={1}
            >
              {formatarMoeda(totalGuardado)}
            </Text>

            <Text style={styles.descricaoTotal}>
              Valor guardado nas metas em andamento
            </Text>
          </Card>

          {/* EM ANDAMENTO E CONCLUÍDAS */}
          <View style={styles.linhaResumo}>
            <Card
              gradiente={GRADIENTE_CARD}
              style={styles.cardResumo}
            >
              <Text
                style={[
                  styles.valorResumo,
                  { color: ROXO },
                ]}
              >
                {emAndamento.length}
              </Text>

              <Text style={styles.rotuloResumo}>
                Em andamento
              </Text>
            </Card>

            <Card
              gradiente={GRADIENTE_CARD}
              style={styles.cardResumo}
            >
              <Text
                style={[
                  styles.valorResumo,
                  { color: VERDE },
                ]}
              >
                {concluidas.length}
              </Text>

              <Text style={styles.rotuloResumo}>
                Concluídas
              </Text>
            </Card>
          </View>

          {/* PROGRESSO DAS METAS */}
          <Card
            gradiente={GRADIENTE_CARD}
            style={styles.cardSecao}
          >
            <Text style={styles.tituloCard}>
              Progresso das metas
            </Text>

            {emAndamento.length === 0 ? (
              <Text style={styles.vazio}>
                Nenhuma meta em andamento.
              </Text>
            ) : (
              emAndamento.map((meta, indice) => {
                const destaque =
                  meta.pct === maiorPct &&
                  maiorPct >= PERCENTUAL_DESTAQUE;

                const categoria =
                  CATEGORIAS_POR_ID[meta.categoriaId] ??
                  CATEGORIAS_POR_ID.outros;

                const Icone = categoria.icone;

                return (
                  <View
                    key={meta.id}
                    style={[
                      styles.itemMeta,
                      indice === emAndamento.length - 1 &&
                        styles.ultimoItemMeta,
                    ]}
                  >
                    <View style={styles.linhaMeta}>
                      <View style={styles.nomeMeta}>
                        <Icone
                          size={19}
                          color={VERDE}
                        />

                        <Text
                          numberOfLines={2}
                          style={styles.textoNome}
                        >
                          {meta.nome}
                        </Text>
                      </View>

                      <Text
                        style={[
                          styles.percentual,
                          destaque &&
                            styles.percentualDestaque,
                        ]}
                      >
                        {meta.pct}%
                      </Text>
                    </View>

                    <Progress
                      value={Math.min(
                        100,
                        Math.max(0, meta.pct)
                      )}
                      height={7}
                      color={destaque ? VERDE : ROXO}
                      backgroundColor="#160B29"
                    />

                    <View style={styles.linhaValoresMeta}>
                      <Text style={styles.valorGuardado}>
                        {moedaSegura(meta.valorAtual)}
                      </Text>

                      <Text style={styles.valorObjetivo}>
                        {meta.valorObjetivo !== null
                          ? `de ${moedaSegura(meta.valorObjetivo)}`
                          : "Objetivo indisponível"}
                      </Text>
                    </View>
                  </View>
                );
              })
            )}
          </Card>

          {/* HÁBITO DE GUARDAR */}
          <Card
            gradiente={GRADIENTE_CARD}
            style={styles.cardSecao}
          >
            <Text style={styles.tituloCard}>
              Hábito de guardar
            </Text>

            <Text style={styles.subtituloCard}>
              Depósitos realizados nos últimos meses
            </Text>

            {temHabito ? (
              <>
                <View style={styles.areaGrafico}>
                  <VictoryChart
                    width={larguraGrafico}
                    height={175}
                    padding={{
                      top: 35,
                      bottom: 28,
                      left: 10,
                      right: 10,
                    }}
                    domainPadding={{
                      x: 20,
                      y: [0, 18],
                    }}
                    domain={{
                      y: [
                        0,
                        Math.max(
                          maiorValorGrafico * 1.3,
                          1
                        ),
                      ],
                    }}
                  >
                    <VictoryAxis
                      tickValues={dadosGrafico.map(
                        (item) => item.x
                      )}
                      tickFormat={dadosGrafico.map(
                        (item) => item.mes
                      )}
                      style={{
                        axis: {
                          stroke: "transparent",
                        },
                        grid: {
                          stroke: "transparent",
                        },
                        ticks: {
                          stroke: "transparent",
                        },
                        tickLabels: {
                          fill: LILAS,
                          fontSize: 11,
                          fontFamily:
                            FONTS.quicksand.regular,
                          padding: 8,
                        },
                      }}
                    />

                    <VictoryBar
                      data={dadosGrafico}
                      barWidth={Math.min(
                        28,
                        larguraGrafico /
                          Math.max(habito.length * 2.2, 1)
                      )}
                      cornerRadius={{
                        top: 6,
                      }}
                      labels={({ datum }) =>
                        datum.y > 0
                          ? valorCompacto(datum.y)
                          : ""
                      }
                      labelComponent={
                        <VictoryLabel dy={-7} />
                      }
                      style={{
                        data: {
                          fill: ({
                            index,
                          }: {
                            index?: number | string;
                          }) =>
                            Number(index) ===
                            habito.length - 1
                              ? VERDE
                              : ROXO,
                        },
                        labels: {
                          fill: "#FFFFFF",
                          fontSize: 9,
                          fontFamily:
                            FONTS.quicksand.bold,
                        },
                      }}
                    />
                  </VictoryChart>
                </View>

                <View style={styles.resumoHabito}>
                  <Text style={styles.rotuloHabito}>
                    Total depositado no período
                  </Text>

                  <Text style={styles.valorHabito}>
                    {formatarMoeda(totalPeriodo)}
                  </Text>
                </View>

                <View style={styles.listaMeses}>
                  {habito.map((item, indice) => (
                    <View
                      key={`${item.mes}-${indice}`}
                      style={styles.itemMes}
                    >
                      <Text style={styles.nomeMes}>
                        {item.mes}
                      </Text>

                      <Text
                        style={[
                          styles.valorMes,
                          indice === habito.length - 1 &&
                            styles.valorMesAtual,
                        ]}
                        adjustsFontSizeToFit
                        numberOfLines={1}
                      >
                        {formatarMoeda(item.valor)}
                      </Text>
                    </View>
                  ))}
                </View>
              </>
            ) : (
              <Text style={styles.vazio}>
                Ainda não há depósitos para mostrar.
              </Text>
            )}
          </Card>

          {/* COMPARAÇÃO MENSAL */}
          {variacao !== null && (
            <Card
              gradiente={GRADIENTE_CARD}
              style={styles.cardDica}
            >
              <View style={styles.linhaDica}>
                <Lightbulb
                  size={23}
                  color={Cores.estado.alerta}
                />

                <Text style={styles.textoDica}>
                  Você guardou{" "}
                  <Text style={styles.textoDicaDestaque}>
                    {Math.abs(variacao)}%{" "}
                    {variacao >= 0
                      ? "mais"
                      : "menos"}
                  </Text>{" "}
                  do que no mês passado.{" "}
                  {variacao >= 0
                    ? "Continue assim!"
                    : "Vamos retomar o ritmo!"}
                </Text>
              </View>
            </Card>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
