import { ScrollView, Text, View, useWindowDimensions } from "react-native";

import { Lightbulb } from "lucide-react-native";
import { VictoryAxis, VictoryBar, VictoryChart } from "victory-native";

import { HeaderInterno } from "../../shared/components/Header";
import { BackgroundGradient } from "@/shared/components/backgroundGradient";
import { Card } from "../../shared/components/Cards";
import { Progress } from "../../shared/components/Progress";
import { Cores } from "../../shared/constants/Cores";
import { FONTS } from "../../shared/constants/Tipografia";

import { CATEGORIAS_POR_ID } from "@/features/menuMais/constants";
import { formatarMoeda } from "@/features/menuMais/utils";
import { useFinanceiro } from "@/features/financeiroContext";
import { habitoGuardar, percentualMeta } from "@/features/metasData";
import { styles } from "../../styles/Metasanalises";

// Mesmo roxo dos cards da tela Metas (mês e longo prazo)
const GRADIENTE_CARD: [string, string] = [Cores.fundo.destaque, "#5a2dc7"];

// A meta com maior progresso fica em verde-limão, mas só se passou desse %
const PERCENTUAL_DESTAQUE = 75;

// Tela "Análises" de Metas: resumo, progresso de cada meta em andamento,
// hábito de guardar por mês e uma dica. Aberta pelo botão "Análises" da
// tela Metas.
export default function MetasAnalises() {
  const { width: larguraTela } = useWindowDimensions();

  // Mesma largura do gráfico da Home: cabe dentro do card
  const larguraGrafico = Math.max(280, larguraTela - 70);

  // As mesmas metas das outras telas de Metas (FinanceiroProvider)
  const { metas } = useFinanceiro();

  // Metas em andamento: as do mês + as de longo prazo
  const emAndamento = metas
    .filter((meta) => meta.status === "andamento")
    .map((meta) => ({
      id: meta.id,
      nome: meta.nome,
      categoriaId: meta.categoriaId ?? "outros",
      valorAtual: meta.valorAtual,
      pct: percentualMeta(meta),
    }));

  const totalGuardado = emAndamento.reduce(
    (soma, meta) => soma + meta.valorAtual,
    0
  );

  const concluidas = metas.filter((meta) => meta.status === "concluida").length;

  const maiorPct = Math.max(...emAndamento.map((meta) => meta.pct), 0);

  // Hábito de guardar calculado com os depósitos reais das metas
  const HABITO_GUARDAR = habitoGuardar(metas);
  const temHabito = HABITO_GUARDAR.some((item) => item.valor > 0);

  // Variação (%) do último mês em relação ao anterior (null = não dá pra comparar)
  const anterior = HABITO_GUARDAR[HABITO_GUARDAR.length - 2]?.valor ?? 0;
  const atual = HABITO_GUARDAR[HABITO_GUARDAR.length - 1]?.valor ?? 0;
  const variacao =
    anterior > 0 ? Math.round(((atual - anterior) / anterior) * 100) : null;

  return (
    <View style={styles.container}>
      <BackgroundGradient variante="funcional" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conteudo}
      >
        {/* Cabeçalho: só a seta de voltar e o título, igual ao protótipo */}
        <HeaderInterno titulo="Análises" />

        {/* Conteúdo (logo abaixo do cabeçalho) */}
        <View style={styles.conteudoSobreHeader}>
          {/* Resumo: total guardado | em andamento | concluídas */}
          <View style={styles.linhaResumo}>
            <Card gradiente={GRADIENTE_CARD} style={styles.cardResumo}>
              <Text
                style={[styles.valorResumo, { color: Cores.destaque.limao }]}
              >
                {formatarMoeda(totalGuardado).replace(",00", "")}
              </Text>
              <Text style={styles.rotuloResumo}>Total guardado</Text>
            </Card>

            <Card gradiente={GRADIENTE_CARD} style={styles.cardResumo}>
              <Text
                style={[styles.valorResumo, { color: Cores.roxo.principal }]}
              >
                {emAndamento.length}
              </Text>
              <Text style={styles.rotuloResumo}>Em andamento</Text>
            </Card>

            <Card gradiente={GRADIENTE_CARD} style={styles.cardResumo}>
              <Text
                style={[styles.valorResumo, { color: Cores.estado.perigo }]}
              >
                {concluidas}
              </Text>
              <Text style={styles.rotuloResumo}>Concluídas</Text>
            </Card>
          </View>

          {/* Progresso de cada meta em andamento */}
          <Card gradiente={GRADIENTE_CARD}>
            <Text style={styles.tituloCard}>Progresso das metas</Text>

            {emAndamento.length === 0 ? (
              <Text style={styles.vazio}>Nenhuma meta em andamento.</Text>
            ) : null}

            {emAndamento.map((meta) => {
              const destaque =
                meta.pct === maiorPct && maiorPct >= PERCENTUAL_DESTAQUE;

              // Mesmo ícone da categoria usado no Novo gasto
              const Icone = (
                CATEGORIAS_POR_ID[meta.categoriaId] ?? CATEGORIAS_POR_ID.outros
              ).icone;

              return (
                <View key={meta.id} style={styles.itemMeta}>
                  <View style={styles.linhaMeta}>
                    <View style={styles.nomeMeta}>
                      <Icone size={18} color={Cores.destaque.limao} />

                      <Text numberOfLines={1} style={styles.textoNome}>
                        {meta.nome}
                      </Text>
                    </View>

                    <Text
                      style={[
                        styles.percentual,
                        destaque && styles.percentualDestaque,
                      ]}
                    >
                      {meta.pct}%
                    </Text>
                  </View>

                  <Progress
                    value={meta.pct}
                    height={6}
                    color={
                      destaque ? Cores.destaque.limao : Cores.texto.principal
                    }
                    backgroundColor={Cores.fundo.navBarra}
                  />
                </View>
              );
            })}
          </Card>

          {/* Quanto foi guardado em cada mês (mesmo gráfico de barras do Dashboard) */}
          <Card gradiente={GRADIENTE_CARD}>
            <Text style={styles.tituloCard}>Hábito de guardar</Text>

            {!temHabito ? (
              <Text style={styles.vazio}>
                Ainda não há depósitos para mostrar.
              </Text>
            ) : (
            <VictoryChart
              width={larguraGrafico}
              height={160}
              padding={{ top: 8, bottom: 30, left: 8, right: 8 }}
              domainPadding={{ x: 24, y: 8 }}
            >
              <VictoryAxis
                tickValues={HABITO_GUARDAR.map((_, indice) => indice + 1)}
                tickFormat={HABITO_GUARDAR.map((item) => item.mes)}
                style={{
                  axis: { stroke: "transparent" },
                  grid: { stroke: "transparent" },
                  ticks: { stroke: "transparent" },
                  tickLabels: {
                    fill: Cores.texto.claro,
                    fontSize: 11,
                    fontFamily: FONTS.quicksand.regular,
                  },
                }}
              />

              {/* Última barra (mês atual) em verde-limão */}
              <VictoryBar
                data={HABITO_GUARDAR.map((item, indice) => ({
                  x: indice + 1,
                  y: item.valor,
                }))}
                cornerRadius={{ top: 6 }}
                style={{
                  data: {
                    width: 28,
                    fill: ({ index }: { index?: number | string }) =>
                      Number(index) === HABITO_GUARDAR.length - 1
                        ? Cores.destaque.limao
                        : Cores.roxo.principal,
                  },
                }}
              />
            </VictoryChart>
            )}
          </Card>

          {/* Dica final */}
          {variacao !== null && (
            <Card
              gradiente={[Cores.base.cinza, Cores.fundo.principal]}
              style={styles.cardDica}
            >
              <View style={styles.linhaDica}>
                <Lightbulb size={22} color={Cores.estado.alerta} />

                <Text style={styles.textoDica}>
                  Você guardou{" "}
                  <Text style={styles.textoDicaDestaque}>
                    {Math.abs(variacao)}% {variacao >= 0 ? "mais" : "menos"}
                  </Text>{" "}
                  do que no mês passado.{" "}
                  {variacao >= 0 ? "Continue assim!" : "Vamos retomar o ritmo!"}
                </Text>
              </View>
            </Card>
          )}
        </View>
      </ScrollView>
    </View>
  );
}