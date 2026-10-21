import { useState } from "react";
import { ScrollView, Text, View } from "react-native";

import { useLocalSearchParams } from "expo-router";
import {
  ArrowRight,
  Lightbulb,
  Minus,
  TrendingDown,
  TrendingUp,
} from "lucide-react-native";

import { HeaderInterno } from "../../shared/components/Header";
import { BackgroundGradient } from "@/shared/components/backgroundGradient";
import { Card } from "../../shared/components/Cards";
import { Progress } from "../../shared/components/Progress";
import { Cores } from "../../shared/constants/Cores";

import { AlternadorTipo } from "@/features/menuMais/components/AlternadorTipo";
import { CATEGORIAS_POR_ID } from "@/features/menuMais/constants";
import { formatarMoeda } from "@/features/menuMais/utils";
import { useFinanceiro } from "@/features/financeiroContext";
import {
  calcularRotas,
  linhasResumo,
  type ResumoRotas,
  type StatusRota,
} from "@/features/rotasDatas";
import { styles } from "../../styles/rotasGastos";

const GRADIENTE_CARD: [string, string] = [
  Cores.fundo.cardAlt,
  Cores.fundo.navBarra,
];
// Mesmo roxo dos cards de destaque da tela Metas
const GRADIENTE_DESTAQUE: [string, string] = [Cores.fundo.destaque, "#5a2dc7"];

// Cores do gráfico: gasto atual em laranja (igual ao Sumário) e ideal em roxo
const COR_ATUAL = Cores.estado.perigo;
const COR_IDEAL = Cores.fundo.destaque;

// Usado pra mostrar quanto reduzir por dia
const DIAS_NO_MES = 30;

type Versao = "atuais" | "recomendado";

const OPCOES_VERSAO: { id: Versao; rotulo: string }[] = [
  { id: "atuais", rotulo: "Gastos atuais" },
  { id: "recomendado", rotulo: "Recomendado" },
];

// Mesmo nome e ícone da categoria usados no Novo gasto
function dadosCategoria(categoriaId: string) {
  return CATEGORIAS_POR_ID[categoriaId] ?? CATEGORIAS_POR_ID.outros;
}

// Vermelho = passou do ideal | verde-limão = abaixo do ideal | lilás = no limite
function corDoStatus(status: StatusRota): string {
  if (status === "acima") return Cores.estado.erro;
  if (status === "dentro") return Cores.destaque.limao;
  return Cores.texto.claro;
}

// Tela "Rotas de gastos": aberta ao tocar nos cards "Gastos atuais" e
// "Recomendado" da seção Rotas do Plano-B. Tem as duas versões na mesma
// tela, com um alternador no topo pra trocar entre elas.
// Os valores vêm das transações registradas no Novo gasto.
export default function RotasGastos() {
  const { versao: versaoParam } = useLocalSearchParams<{ versao?: string }>();

  // Abre já na versão do card que foi tocado
  const [versao, setVersao] = useState<Versao>(
    versaoParam === "recomendado" ? "recomendado" : "atuais"
  );

  // Gastos e entradas registrados no Novo gasto (FinanceiroProvider)
  const { transacoes, salario } = useFinanceiro();
  const dados = calcularRotas(transacoes, salario);

  return (
    <View style={styles.container}>
      <BackgroundGradient variante="funcional" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conteudo}
      >
        {/* Cabeçalho: seta de voltar, título e mês, igual ao protótipo */}
        <HeaderInterno
          titulo="Rotas de gastos"
          subtitulo={`${dados.nomeMes} ${dados.ano}`}
        />

        {/* Conteúdo (logo abaixo do cabeçalho) */}
        <View style={styles.conteudoSobreHeader}>
          <AlternadorTipo
            valor={versao}
            aoMudar={setVersao}
            opcoes={OPCOES_VERSAO}
          />

          {!dados.temGastos ? (
            <CardVazio
              titulo="Nenhum gasto neste mês"
              texto="Registre seus gastos em + > Novo gasto para ver suas rotas aqui."
            />
          ) : versao === "atuais" ? (
            <GastosAtuais dados={dados} />
          ) : dados.semRenda ? (
            <CardVazio
              titulo="Falta sua renda"
              texto="Registre uma entrada em + > Novo gasto para calcularmos quanto você deve gastar em cada categoria."
            />
          ) : (
            <Recomendado dados={dados} />
          )}

          {/* Resumo: sempre no final da tela */}
          {dados.temGastos && !(versao === "recomendado" && dados.semRenda) ? (
            <CardResumo linhas={linhasResumo(dados, versao)} />
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

// Aviso quando não há dados pra mostrar
function CardVazio({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <Card gradiente={GRADIENTE_CARD} style={styles.cardVazio}>
      <Text style={styles.tituloVazio}>{titulo}</Text>
      <Text style={styles.textoVazio}>{texto}</Text>
    </Card>
  );
}

// Resumo no final da tela (antes ficava dentro dos cards do Plano-B)
function CardResumo({ linhas }: { linhas: string[] }) {
  return (
    <Card gradiente={GRADIENTE_CARD}>
      <Text style={styles.tituloSecao}>Resumo</Text>

      {linhas.map((linha) => (
        <Text key={linha} style={styles.textoResumo}>
          {linha}
        </Text>
      ))}
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Versão 1: gastos atuais (gráfico + um card por categoria, igual ao protótipo)
// ---------------------------------------------------------------------------
function GastosAtuais({ dados }: { dados: ResumoRotas }) {
  const { rotas, semRenda } = dados;

  // Maior valor entre gasto atual e ideal = comprimento total das barras
  const maior = Math.max(
    ...rotas.flatMap((rota) => (semRenda ? [rota.atual] : [rota.atual, rota.ideal])),
    1
  );

  return (
    <>
      {/* Gráfico: barra do gasto atual e, quando há renda, a do ideal */}
      <Card gradiente={GRADIENTE_CARD}>
        {rotas.map((rota) => (
          <View key={rota.categoriaId} style={styles.linhaGrafico}>
            <Text numberOfLines={1} style={styles.rotuloGrafico}>
              {dadosCategoria(rota.categoriaId).rotulo}
            </Text>

            <View style={styles.barrasGrafico}>
              <Progress
                value={rota.atual}
                max={maior}
                height={10}
                color={COR_ATUAL}
                backgroundColor="transparent"
              />

              {!semRenda && (
                <Progress
                  value={rota.ideal}
                  max={maior}
                  height={10}
                  color={COR_IDEAL}
                  backgroundColor="transparent"
                />
              )}
            </View>
          </View>
        ))}

        <View style={styles.legenda}>
          <View style={styles.itemLegenda}>
            <View
              style={[styles.bolinhaLegenda, { backgroundColor: COR_ATUAL }]}
            />
            <Text style={styles.textoLegenda}>Atual</Text>
          </View>

          {!semRenda && (
            <View style={styles.itemLegenda}>
              <View
                style={[styles.bolinhaLegenda, { backgroundColor: COR_IDEAL }]}
              />
              <Text style={styles.textoLegenda}>Ideal</Text>
            </View>
          )}
        </View>
      </Card>

      {/* Um card por categoria: gasto vs ideal e quanto passou (ou sobrou) */}
      {rotas.map((rota) => {
        const cor = corDoStatus(rota.status);
        const Seta =
          rota.status === "acima"
            ? TrendingUp
            : rota.status === "dentro"
              ? TrendingDown
              : Minus;

        return (
          <Card
            key={rota.categoriaId}
            gradiente={GRADIENTE_CARD}
            style={styles.cardCategoria}
          >
            <View style={styles.textosCategoria}>
              <Text style={styles.categoriaNome}>
                {dadosCategoria(rota.categoriaId).rotulo}
              </Text>

              <Text style={styles.categoriaDetalhe}>
                {semRenda
                  ? formatarMoeda(rota.atual)
                  : `${formatarMoeda(rota.atual)} vs ${formatarMoeda(rota.ideal)} ideal`}
              </Text>
            </View>

            {/* Sem renda não há ideal, então não há variação pra mostrar */}
            {!semRenda && (
              <View style={styles.variacao}>
                <Seta size={16} color={cor} />

                <Text style={[styles.variacaoTexto, { color: cor }]}>
                  {rota.variacao > 0 ? "+" : ""}
                  {rota.variacao}%
                </Text>
              </View>
            )}
          </Card>
        );
      })}
    </>
  );
}

// ---------------------------------------------------------------------------
// Versão 2: recomendado (quanto dá pra economizar e o que ajustar em cada
// categoria, da que mais passou do ideal pra que menos passou)
// ---------------------------------------------------------------------------
function Recomendado({ dados }: { dados: ResumoRotas }) {
  // Quem mais passou do ideal vem primeiro
  const ordenadas = [...dados.rotas].sort((a, b) => b.diferenca - a.diferenca);

  // Categoria onde mais dá pra economizar (usada na dica final)
  const maiorCorte = ordenadas[0];
  const temCorte = dados.economia > 0;

  return (
    <>
      {/* Destaque: quanto dá pra economizar seguindo o plano */}
      <Card gradiente={GRADIENTE_DESTAQUE} style={styles.cardHero}>
        {temCorte ? (
          <>
            <Text style={styles.heroRotulo}>Você pode economizar</Text>

            <Text style={styles.heroValor}>
              {formatarMoeda(dados.economia)}
            </Text>

            <Text style={styles.heroDescricao}>
              {dados.percentual}% a menos que hoje, reduzindo só onde você
              passou do ideal.
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.heroRotulo}>Tudo dentro do ideal</Text>

            <Text style={styles.heroDescricao}>
              Nenhuma categoria passou do valor recomendado. Continue assim!
            </Text>
          </>
        )}

        <View style={styles.heroLinha}>
          <View style={styles.heroColuna}>
            <Text style={styles.heroColunaRotulo}>Hoje</Text>
            <Text style={styles.heroColunaValor}>
              {formatarMoeda(dados.totalAtual)}
            </Text>
          </View>

          <ArrowRight size={20} color={Cores.texto.claro} />

          <View style={styles.heroColuna}>
            <Text style={styles.heroColunaRotulo}>Com o plano</Text>
            <Text
              style={[styles.heroColunaValor, { color: Cores.destaque.limao }]}
            >
              {formatarMoeda(dados.totalComPlano)}
            </Text>
          </View>
        </View>
      </Card>

      {/* O que ajustar em cada categoria */}
      <Text style={styles.tituloSecao}>O que ajustar</Text>

      <View style={[styles.legenda, { marginBottom: 12 }]}>
        <View style={styles.itemLegenda}>
          <View
            style={[
              styles.bolinhaLegenda,
              { backgroundColor: Cores.destaque.limao },
            ]}
          />
          <Text style={styles.textoLegenda}>Pode manter</Text>
        </View>

        <View style={styles.itemLegenda}>
          <View
            style={[
              styles.bolinhaLegenda,
              { backgroundColor: Cores.estado.perigo },
            ]}
          />
          <Text style={styles.textoLegenda}>Reduzir</Text>
        </View>
      </View>

      {ordenadas.map((rota) => {
        const categoria = dadosCategoria(rota.categoriaId);
        const Icone = categoria.icone;
        const reduzir = rota.status === "acima";

        // Passou do ideal: a parte verde é o que fica (ideal) e a laranja é o
        // que precisa cortar. Dentro do ideal: a barra mostra quanto do valor
        // ideal já foi usado.
        const valorBarra = reduzir ? rota.ideal : rota.atual;
        const maximoBarra = reduzir ? rota.atual : rota.ideal;

        return (
          <Card key={rota.categoriaId} gradiente={GRADIENTE_CARD}>
            <View style={styles.topoRota}>
              <View style={styles.nomeRota}>
                <Icone size={20} color={Cores.destaque.limao} />
                <Text numberOfLines={1} style={styles.categoriaNome}>
                  {categoria.rotulo}
                </Text>
              </View>

              <View
                style={[
                  styles.selo,
                  {
                    backgroundColor: reduzir
                      ? "rgba(255,136,0,0.18)"
                      : "rgba(183,255,0,0.14)",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.seloTexto,
                    {
                      color: reduzir
                        ? Cores.estado.perigo
                        : Cores.destaque.limao,
                    },
                  ]}
                >
                  {reduzir
                    ? `Reduzir ${formatarMoeda(rota.diferenca)}`
                    : rota.status === "limite"
                      ? "No limite"
                      : "Dentro do ideal"}
                </Text>
              </View>
            </View>

            <Progress
              value={valorBarra}
              max={maximoBarra}
              height={8}
              color={Cores.destaque.limao}
              backgroundColor={
                reduzir ? Cores.estado.perigo : Cores.fundo.navBarra
              }
            />

            <View style={styles.valoresRota}>
              <Text style={styles.valorRotaTexto}>
                Hoje{" "}
                <Text style={styles.valorRotaDestaque}>
                  {formatarMoeda(rota.atual)}
                </Text>
              </Text>

              {/* Passou do ideal: o valor é o recomendado. Abaixo do ideal: é o
                  limite que ainda pode gastar. */}
              <Text style={styles.valorRotaTexto}>
                {reduzir ? "Recomendado" : "Limite"}{" "}
                <Text style={styles.valorRotaDestaque}>
                  {formatarMoeda(rota.ideal)}
                </Text>
              </Text>
            </View>

            {/* Quanto reduzir por dia (ou quanto sobrou no mês) */}
            {reduzir ? (
              <Text
                style={[styles.resultadoRota, { color: Cores.estado.perigo }]}
              >
                ≈ {formatarMoeda(rota.diferenca / DIAS_NO_MES)} a menos por dia
              </Text>
            ) : rota.status === "dentro" ? (
              <Text
                style={[styles.resultadoRota, { color: Cores.destaque.limao }]}
              >
                Folga de {formatarMoeda(-rota.diferenca)} no mês
              </Text>
            ) : null}

            {rota.dica ? (
              <Text style={styles.dicaRota}>{rota.dica}</Text>
            ) : null}
          </Card>
        );
      })}

      {/* Dica final: por onde começar */}
      <Card
        gradiente={[Cores.base.cinza, Cores.fundo.principal]}
        style={styles.cardDica}
      >
        <View style={styles.linhaDica}>
          <Lightbulb size={22} color={Cores.estado.alerta} />

          <Text style={styles.textoDica}>
            {temCorte ? (
              <>
                Comece por{" "}
                <Text style={styles.textoDicaDestaque}>
                  {dadosCategoria(maiorCorte.categoriaId).rotulo}
                </Text>
                : é onde você mais pode economizar (
                {formatarMoeda(maiorCorte.diferenca)} no mês).
              </>
            ) : (
              "Você está dentro do ideal em todas as categorias. Continue assim!"
            )}
          </Text>
        </View>
      </Card>
    </>
  );
}