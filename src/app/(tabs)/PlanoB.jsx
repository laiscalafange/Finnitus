import {
  ScrollView,
  View,
  Text,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { VictoryArea } from 'victory-native'

import { Cores } from '../../shared/constants/Cores'
import { BackgroundGradient } from "../../shared/components/backgroundGradient";

import {
  CATEGORIAS_PLANOB_MOCK,
  DADOS_AREA_MOCK,
  DADOS_AREA_COMPARACAO_MOCK,
  SALDO_MOCK,
  PERFORMANCE_MOCK,
  SUMARIO_PLANOB_MOCK,
  ATIVIDADE_HEATMAP_MOCK,
  ROTAS_PLANOB_MOCK,
} from '../../shared/components/Mocks'

import { PlanoBCard } from '../../shared/components/PlanoB/PlanoBCard'
import { SumarioCard } from '../../shared/components/PlanoB/SumarioCard'
import { HeatmapCard } from '../../shared/components/PlanoB/AtividadeHeatmap'
import { PerformanceGauge } from '../../shared/components/PlanoB/PerformanceGauge'
import { RotasCard } from '../../shared/components/PlanoB/RotasCard'

import { styles } from '../../styles/Planobstyle'

export default function PlanoBScreen() {
  const restante =
    SALDO_MOCK.maximoDisponivel - SALDO_MOCK.atual

  return (
    <View style={{ flex: 1 }}>
    <BackgroundGradient />
      <ScrollView style={styles.scroll}>

        {/* ==================================================
            HEADER
        ================================================== */}

        <LinearGradient
          colors={['#7C4DFF', '#6B35E8', '#8B3FEF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
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
              <Text style={styles.headerPlanoBIcone}>
                👑
              </Text>

              <Text style={styles.headerPlanoBIcone}>
                🔔
              </Text>
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

          <View style={styles.duploRow}>
            <SumarioCard
              disponivel={SUMARIO_PLANOB_MOCK.disponivel}
              itens={SUMARIO_PLANOB_MOCK.itens}
            />

            <HeatmapCard
              mes={ATIVIDADE_HEATMAP_MOCK.mes}
              ano={ATIVIDADE_HEATMAP_MOCK.ano}
              dias={ATIVIDADE_HEATMAP_MOCK.dias}
            />
          </View>

          {/* ==================================================
              ROTAS
          ================================================== */}

          <Text style={styles.secaoTitulo}>
            Rotas
          </Text>

          <View style={styles.duploRow}>
            <RotasCard
              titulo={ROTAS_PLANOB_MOCK.gastosAtuais.titulo}
              total={ROTAS_PLANOB_MOCK.gastosAtuais.total}
              categorias={
                ROTAS_PLANOB_MOCK.gastosAtuais.categorias
              }
              resumo={ROTAS_PLANOB_MOCK.gastosAtuais.resumo}
              sobra={ROTAS_PLANOB_MOCK.gastosAtuais.sobra}
              styles={styles}
            />

            <RotasCard
              titulo={ROTAS_PLANOB_MOCK.recomendado.titulo}
              total={ROTAS_PLANOB_MOCK.recomendado.total}
              categorias={
                ROTAS_PLANOB_MOCK.recomendado.categorias
              }
              resumo={ROTAS_PLANOB_MOCK.recomendado.resumo}
              sobra={ROTAS_PLANOB_MOCK.recomendado.sobra}
              styles={styles}
            />
          </View>

        </View>
      </ScrollView>
     </View>
  )
}