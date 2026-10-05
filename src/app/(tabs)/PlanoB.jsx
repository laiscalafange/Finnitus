import {ScrollView, View, Text, Image, TouchableOpacity} from 'react-native'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { VictoryArea } from 'victory-native'

import { Cores } from '../../shared/constants/Cores'
import { GRADIENTS } from '../../shared/constants/Gradientes'
import { Rotas } from '../../shared/constants/Rotas'
import { BackgroundGradient } from "../../shared/components/backgroundGradient";
import coroaIcon from '../../../assets/icones/coroa.png'
import sinoIcon from '../../../assets/icones/sino.png'
import {
  CATEGORIAS_PLANOB_MOCK,
  DADOS_AREA_MOCK,
  DADOS_AREA_COMPARACAO_MOCK,
  SALDO_MOCK,
  PERFORMANCE_MOCK,
} from '../../shared/components/Mocks'

import { PlanoBCard } from '../../shared/components/PlanoB/PlanoBCard'
import { SumarioCard } from '../../shared/components/PlanoB/SumarioCard'
import { HeatmapCard } from '../../shared/components/PlanoB/AtividadeHeatmap'
import { PerformanceGauge } from '../../shared/components/PlanoB/PerformanceGauge'
import { RotasCard } from '../../shared/components/PlanoB/RotasCard'
import { useFinanceiro } from '../../features/financeiroContext'
import { calcularRotas, montarCardsRotas } from '../../features/rotasDatas'
import { calcularSumario, calcularAtividade } from '../../features/sumarioData'

import { styles } from '../../styles/Planobstyle'

export default function PlanoBScreen() {
  // Hook de navegação do Expo Router
  const router = useRouter()

  const restante =
    SALDO_MOCK.maximoDisponivel - SALDO_MOCK.atual

  // Rotas, Sumário e Atividade calculados com o que a pessoa registrou no
  // Novo gasto e nas Metas
  const { transacoes, salario, metas } = useFinanceiro()
  const cardsRotas = montarCardsRotas(calcularRotas(transacoes, salario))
  const sumario = calcularSumario(transacoes, metas, salario)
  const atividade = calcularAtividade(transacoes, metas)

  return (
    <View style={{ flex: 1 }}>
    <BackgroundGradient />
      <ScrollView style={styles.scroll}>

        {/* ==================================================
            HEADER
        ================================================== */}

        <LinearGradient
          colors={GRADIENTS.header.colors}
          start={GRADIENTS.header.start}
          end={GRADIENTS.header.end}
          style={styles.headerPlanoB}
        >
          <View style={styles.headerPlanoBTopo}>
            <View>
              <Text style={styles.headerPlanoBTitulo}>
                Plano-B
              </Text>

              <Text style={styles.headerPlanoBSubtitulo}>
                Imprevistos
              </Text>
            </View>

            <View style={styles.headerPlanoBIcones}>
              {/* Coroa — leva pra tela Premium */}
              <TouchableOpacity onPress={() => router.push(Rotas.premium)}>
                <Image
                  source={coroaIcon}
                  style={styles.headerPlanoBIconeImagem}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              {/* Sino — leva pra tela de Notificações */}
              <TouchableOpacity onPress={() => router.push(Rotas.notificacao)}>
                <Image
                  source={sinoIcon}
                  style={styles.headerPlanoBIconeImagem}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.headerSaldoCard}>
            <View style={styles.headerSaldoTopo}>
              <Text style={styles.headerSaldoLabel}>
                Gasto atual
              </Text>

              <Text style={styles.headerSaldoData}>
                {SALDO_MOCK.data}
              </Text>
            </View>

            <Text style={styles.headerSaldoValor}>
              R${' '}
              {SALDO_MOCK.atual.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
              })}
            </Text>

            <View style={styles.headerVariacaoLinha}>
              <Text style={styles.headerVariacaoLabel}>
                última semana
              </Text>

              <View style={styles.headerVariacaoBadge}>
                <Text style={styles.headerVariacaoTexto}>
                  ↑ {SALDO_MOCK.variacaoSemana}%
                </Text>
              </View>
            </View>

            <Text style={styles.headerSaldoLabel}>
              Máximo disponível
            </Text>

            <Text style={styles.headerSaldoValor}>
              R${' '}
              {SALDO_MOCK.maximoDisponivel.toLocaleString(
                'pt-BR',
                {
                  minimumFractionDigits: 2,
                },
              )}
            </Text>

            <View style={styles.headerVariacaoLinha}>
              <Text style={styles.headerVariacaoLabel}>
                último mês
              </Text>

              <View style={styles.headerVariacaoBadge}>
                <Text style={styles.headerVariacaoTexto}>
                  ↑ {SALDO_MOCK.variacaoMes}%
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* ==================================================
            SETA
        ================================================== */}

        <View style={styles.headerSetaContainer}>
          <View style={styles.headerSeta}>
            <Text style={styles.headerSetaTexto}>
              ⌄
            </Text>
          </View>
        </View>

        {/* ==================================================
            CONTEÚDO
        ================================================== */}

        <View style={styles.conteudo}>

          {/* ==================================================
              PLANO-B
          ================================================== */}

          <Text style={styles.secaoTitulo}>
            Plano-B
          </Text>

          <PlanoBCard
            limite={SALDO_MOCK.maximoDisponivel}
            gastoAtual={SALDO_MOCK.atual}
            restante={restante}
            categorias={CATEGORIAS_PLANOB_MOCK}
          />

          {/* ==================================================
              MINI GRÁFICOS
          ================================================== */}

          <View style={styles.areaRow}>
            <LinearGradient
              colors={['#3c1e75bd', '#30096e']}
              style={styles.areaCard}
            >
              <Text style={styles.areaValor}>
                Restante:                 R${' '}
                {SALDO_MOCK.maximoDisponivel.toLocaleString(
                  'pt-BR',
                  {
                    minimumFractionDigits: 2,
                  },
                )}
              </Text>

              <VictoryArea
                data={DADOS_AREA_MOCK}
                style={{
                  data: {
                    fill: Cores.destaque.limao,
                    fillOpacity: 0.4,
                    stroke: Cores.destaque.limao,
                    strokeWidth: 2,
                  },
                }}
                height={80}
                width={197}
                padding={0}
              />
            </LinearGradient>

            <LinearGradient
              colors={['#3c1e75bd', '#30096e']}
              style={styles.areaCard}
            >
              <Text style={styles.areaValor}>
                Gastos:                      R${' '}
                {SALDO_MOCK.atual.toLocaleString(
                  'pt-BR',
                  {
                    minimumFractionDigits: 2,
                  },
                )}
              </Text>

              <VictoryArea
                data={DADOS_AREA_COMPARACAO_MOCK}
                style={{
                  data: {
                    fill: '#FF8800',
                    fillOpacity: 0.4,
                    stroke: '#FF8800',
                    strokeWidth: 2,
                  },
                }}
                height={80}
                width={197}
                padding={0}
              />
            </LinearGradient>
          </View>

          {/* ==================================================
              PERFORMANCE
          ================================================== */}

          <Text style={styles.secaoTitulo}>
            Performance
          </Text>

          <LinearGradient
            colors={['#3c1e75bd', '#30096e']}
            style={styles.card}
          >
            <View style={styles.performanceHeader}>

  {/* MÊS ATUAL */}
  <View style={styles.performanceMes}>
    <Text style={styles.performanceSub}>
      {PERFORMANCE_MOCK.atual.label}
    </Text>

    <Text style={styles.performanceData}>
      {PERFORMANCE_MOCK.atual.periodo}
    </Text>
  </View>

  {/* MÊS ANTERIOR */}
  <View style={styles.performanceMes}>
    <Text style={styles.performanceSub}>
      {PERFORMANCE_MOCK.anterior.label}
    </Text>

    <Text style={styles.performanceData}>
      {PERFORMANCE_MOCK.anterior.periodo}
    </Text>
  </View>

</View>
            <View style={styles.performanceInfo}>

              {/* MÊS ATUAL */}

              <View style={styles.performanceItem}>
                <PerformanceGauge
                  label={PERFORMANCE_MOCK.atual.status}
                  percentual={
                    PERFORMANCE_MOCK.atual.percentualGauge
                  }
                  cor={PERFORMANCE_MOCK.atual.cor}
                  variacao={
                    PERFORMANCE_MOCK.atual.variacaoGastos
                  }
                  styles={styles}
                />

                <Text
                  style={[
                    styles.performanceValor,
                    {
                      color: PERFORMANCE_MOCK.atual.cor,
                    },
                  ]}
                >
                  Gastos{' '}
                  :{PERFORMANCE_MOCK.atual.gastos > 0
                    ? '+'
                    : ''}
                  {PERFORMANCE_MOCK.atual.gastos}%
                </Text>

                <Text
                  style={[
                    styles.performanceValor,
                    {
                      color: PERFORMANCE_MOCK.atual.cor,
                    },
                  ]}
                >
                  Economias{' '}
                  : {PERFORMANCE_MOCK.atual.economias > 0
                    ? '+'
                    : ''}
                  {PERFORMANCE_MOCK.atual.economias}%
                </Text>
              </View>

              <View style={styles.divisorVertical} />

              {/* MÊS PASSADO */}

              <View style={styles.performanceItem}>
                <PerformanceGauge
                  label={PERFORMANCE_MOCK.anterior.status}
                  percentual={
                    PERFORMANCE_MOCK.anterior.percentualGauge
                  }
                  cor={PERFORMANCE_MOCK.anterior.cor}
                  variacao={
                    PERFORMANCE_MOCK.anterior.variacaoGastos
                  }
                  styles={styles}
                />

                <Text
                  style={[
                    styles.performanceValor,
                    {
                      color: PERFORMANCE_MOCK.anterior.cor,
                    },
                  ]}
                >
                  Gastos{' '}
                 {PERFORMANCE_MOCK.anterior.gastos > 0
                    ? '+'
                    : ''}
                 :  {PERFORMANCE_MOCK.anterior.gastos}%
                </Text>

                <Text
                  style={[
                    styles.performanceValor,
                    {
                      color: PERFORMANCE_MOCK.anterior.cor,
                    },
                  ]}
                >
                  Economias{' '}
                : {PERFORMANCE_MOCK.anterior.economias > 0
                    ? '+'
                    : ''}
                  {PERFORMANCE_MOCK.anterior.economias}%
                </Text>
              </View>
            </View>
          </LinearGradient>

          {/* ==================================================
              SUMÁRIO + ATIVIDADE
          ================================================== */}

          <View style={styles.rotasRow}>
            {/* Toque no card Sumário abre o Sumário detalhado */}
            <TouchableOpacity
              style={{ flex: 1 }}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Abrir sumário detalhado"
              onPress={() => router.push(Rotas.sumarioDetalhado)}
            >
              <SumarioCard
                disponivel={sumario.disponivel}
                itens={sumario.itens}
              />
            </TouchableOpacity>

            {/* Toque no card Atividade abre a tela de Atividade */}
            <TouchableOpacity
              style={{ flex: 1 }}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Abrir atividade"
              onPress={() => router.push(Rotas.atividade)}
            >
              <HeatmapCard
                mes={atividade.mes}
                ano={atividade.ano}
                dias={atividade.dias}
              />
            </TouchableOpacity>
          </View>

          {/* ==================================================
              ROTAS
          ================================================== */}

          <Text style={styles.secaoTitulo}>
            Rotas
          </Text>

          <View style={styles.duploRow}>
            {/* Toque no card Gastos atuais abre a tela Rotas de gastos
                já na versão "Gastos atuais" */}
            <TouchableOpacity
              style={{ flex: 1 }}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Abrir rotas de gastos atuais"
              onPress={() =>
                router.push({
                  pathname: Rotas.rotasGastos,
                  params: { versao: 'atuais' },
                })
              }
            >
              <RotasCard
                titulo={cardsRotas.atuais.titulo}
                total={cardsRotas.atuais.total}
                categorias={cardsRotas.atuais.categorias}
                sobra={cardsRotas.atuais.sobra}
                sobraTexto={cardsRotas.atuais.sobraTexto}
                vazio={cardsRotas.atuais.vazio}
                styles={styles}
              />
            </TouchableOpacity>

            {/* Toque no card Recomendado abre a tela Rotas de gastos
                já na versão "Recomendado" */}
            <TouchableOpacity
              style={{ flex: 1 }}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Abrir rotas de gastos recomendados"
              onPress={() =>
                router.push({
                  pathname: Rotas.rotasGastos,
                  params: { versao: 'recomendado' },
                })
              }
            >
              <RotasCard
                titulo={cardsRotas.recomendado.titulo}
                total={cardsRotas.recomendado.total}
                categorias={cardsRotas.recomendado.categorias}
                sobra={cardsRotas.recomendado.sobra}
                sobraTexto={cardsRotas.recomendado.sobraTexto}
                vazio={cardsRotas.recomendado.vazio}
                styles={styles}
              />
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
     </View>
  )
}