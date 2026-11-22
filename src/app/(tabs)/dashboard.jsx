import { ScrollView, View, TouchableOpacity, Image } from 'react-native'
import { Text } from '@/shared/components/Texto'
import { useExibirValores, useMoedaVisivel } from '@/features/configuracoesContext'
import { LinearGradient } from 'expo-linear-gradient'
import { BackgroundGradient } from '../../shared/components/backgroundGradient'
import { GRADIENTS } from '../../shared/constants/Gradientes'
import { VictoryArea, VictoryBar, VictoryLine, VictoryChart, VictoryAxis } from 'victory-native'
import Svg, { Circle } from 'react-native-svg'
import { useState } from 'react'
import { useRouter } from 'expo-router'
import { Cores } from '../../shared/constants/Cores'
import { FONTS } from '../../shared/constants/Tipografia'
import { Rotas } from '../../shared/constants/Rotas'

import {
  DASHBOARD_MOCK,
  ESTATISTICAS_MOCK,
  PLANOB_MOCK,
  SALDO_MOCK,
  DADOS_AREA_MOCK,
  DADOS_AREA_COMPARACAO_MOCK,
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
import { styles } from '../../styles/dashboardstyle'
// Estilos dos cards que vieram do Plano-B (gráficos, Performance e Rotas)
import { styles as stylesPlanoB } from '../../styles/Planobstyle'

import coroaIcon from '../../../assets/icones/coroa.png'
import { SinoNotificacoes } from '@/shared/components/SinoNotificacoes'

const DIAS_SEMANA = ['seg', 'ter', 'qua', 'qui', 'sex', 'sáb', 'dom']
const LETRAS_DIAS = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D']

function getInicioSemana(data) {
  const novaData = new Date(data)
  const dia = novaData.getDay()
  const diferenca = dia === 0 ? -6 : 1 - dia
  novaData.setDate(novaData.getDate() + diferenca)
  novaData.setHours(0, 0, 0, 0)
  return novaData
}

function getDiasSemana(data) {
  const inicio = getInicioSemana(data)

  return Array.from({ length: 7 }, (_, i) => {
    const dia = new Date(inicio)
    dia.setDate(inicio.getDate() + i)

    return {
      data: dia,
      letra: LETRAS_DIAS[i],
      numero: String(dia.getDate()).padStart(2, '0'),
      chave: dia.toISOString().split('T')[0],
    }
  })
}

function formatarMes(data) {
  return data.toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  })
}

function GaugeCircular({
  label,
  sublabel,
  tamanho = 130,
  segmentos,
}) {
  const r = (tamanho - 18) / 2
  const cx = tamanho / 2
  const cy = tamanho / 2
  const circunferencia = 2 * Math.PI * r

  return (
    <View style={{ width: tamanho, height: tamanho, position: 'relative' }}>
      <Svg
        width={tamanho}
        height={tamanho}
        style={{ transform: [{ rotate: '-90deg' }] }}
      >
        <Circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#ffffff15"
          strokeWidth={15}
        />

        {segmentos?.map((seg, i) => {
          const len = (seg.pct / 100) * circunferencia
          const offset = segmentos
            .slice(0, i)
            .reduce((acc, s) => acc + (s.pct / 100) * circunferencia, 0)

          return (
            <Circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={seg.cor}
              strokeWidth={14}
              strokeDasharray={`${len} ${circunferencia - len}`}
              strokeDashoffset={-offset}
              strokeLinecap="round"
            />
          )
        })}
      </Svg>

      <View
        style={{
          position: 'absolute',
          inset: 0,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {label && <Text style={styles.gaugeLabel}>{label}</Text>}
        {sublabel && <Text style={styles.gaugeSubLabel}>{sublabel}</Text>}
      </View>
    </View>
  )
}

export default function Dashboard() {
  const exibir = useExibirValores()
  const moedaVisivel = useMoedaVisivel()
  // Hook de navegação do Expo Router
  const router = useRouter()

  // Sumário e Atividade calculados com o que a pessoa registrou no Novo gasto
  // e nas Metas
  const { transacoes, salario, metas } = useFinanceiro()
  const sumario = calcularSumario(transacoes, metas, salario)
  const atividade = calcularAtividade(transacoes, metas)

  // Rotas calculadas com o que a pessoa registrou no Novo gasto
  const cardsRotas = montarCardsRotas(calcularRotas(transacoes, salario))

  const [periodo, setPeriodo] = useState('semanal')
  const [diaSelecionado, setDiaSelecionado] = useState(
    new Date(DASHBOARD_MOCK.periodoInicial)
  )
  const [semanaOffset, setSemanaOffset] = useState(0)

  const inicioSemana = getInicioSemana(diaSelecionado)
  inicioSemana.setDate(inicioSemana.getDate() + semanaOffset * 7)

  const diasSemana = getDiasSemana(inicioSemana)
  const mesAtual = formatarMes(diasSemana[3].data)

  const dadosBarras = ESTATISTICAS_MOCK.semanaAtual.map((y, i) => ({
    x: i + 1,
    y,
  }))

  const dadosBarrasPassadas = ESTATISTICAS_MOCK.semanaPassada.map((y, i) => ({
    x: i + 1.15,
    y,
  }))

  const dadosLinha = ESTATISTICAS_MOCK.semanaPassada.map((y, i) => ({
    x: i + 1.10,
    y: y + 7,
  }))

  const dadosLinhaVerde = ESTATISTICAS_MOCK.semanaAtual.map((y, i) => ({
    x: i + 1,
    y: y + 8,
  }))

  function selecionarDia(dia) {
    setDiaSelecionado(dia.data)
    setSemanaOffset(0)
  }

  function semanaAnterior() {
    setSemanaOffset(prev => prev - 1)
  }

  function proximaSemana() {
    setSemanaOffset(prev => prev + 1)
  }

  return (
    <View style={{ flex: 1 }}>
    <BackgroundGradient />

      <ScrollView style={styles.scroll}>
        <LinearGradient
          colors={GRADIENTS.header.colors}
          start={GRADIENTS.header.start}
          end={GRADIENTS.header.end}
          style={styles.header}
        >
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.headerTitulo}>Dashboard</Text>
              <Text style={styles.headerSubtitulo}>Financeiro</Text>
            </View>

            <View style={styles.headerIcones}>
              {/* Coroa — leva pra tela Premium */}
              <TouchableOpacity onPress={() => router.push(Rotas.premium)}>
                <Image source={coroaIcon} style={styles.headerIcone} />
              </TouchableOpacity>

              <SinoNotificacoes estiloIcone={styles.headerIcone} />
            </View>
          </View>

          <View style={styles.toggle}>
            {['semanal', 'mensal'].map(p => (
              <TouchableOpacity
                key={p}
                style={[styles.pill, periodo === p && styles.pillAtivo]}
                onPress={() => setPeriodo(p)}
              >
                <Text
                  style={[
                    styles.pillTexto,
                    periodo === p && styles.pillTextoAtivo,
                  ]}
                >
                  {p === 'semanal' ? 'Semanal' : 'Mensal'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.weekHeader}>
            <TouchableOpacity style={styles.weekArrow} onPress={semanaAnterior}>
              <Text style={styles.weekArrowTexto}>‹</Text>
            </TouchableOpacity>

            <Text style={styles.weekMes}>
              {mesAtual.charAt(0).toUpperCase() + mesAtual.slice(1)}
            </Text>

            <TouchableOpacity style={styles.weekArrow} onPress={proximaSemana}>
              <Text style={styles.weekArrowTexto}>›</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.weekStrip}>
            {diasSemana.map(dia => {
              const selecionado =
                dia.chave === diaSelecionado.toISOString().split('T')[0]

              return (
                <TouchableOpacity
                  key={dia.chave}
                  style={[
                    styles.diaContainer,
                    selecionado && styles.diaContainerAtivo,
                  ]}
                  onPress={() => selecionarDia(dia)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.diaLetra,
                      selecionado && styles.diaLetraAtivo,
                    ]}
                  >
                    {dia.letra}
                  </Text>

                  <Text
                    style={[
                      styles.diaNumero,
                      selecionado && styles.diaNumeroAtivo,
                    ]}
                  >
                    {dia.numero}
                  </Text>

                  <View
                    style={[
                      styles.diaPonto,
                      selecionado && styles.diaPontoAtivo,
                    ]}
                  />
                </TouchableOpacity>
              )
            })}
          </View>
        </LinearGradient>

        <View style={styles.setaContainer}>
  <View style={styles.setaCirculo}>
    <Text style={styles.setaTexto}>
      ⌄
    </Text>
  </View>
</View>

        <View style={styles.conteudo}>
          <Text style={styles.secaoTitulo}>Visão semanal</Text>

          <LinearGradient
            colors={['#3c1e75', '#30096e']}
            style={styles.card}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              }}
            >
              <Text style={styles.cardTitulo}>Estatísticas</Text>

              <View style={styles.legendaRow}>
                <View style={styles.legendaItem}>
                  <View
                    style={[
                      styles.legendaPonto,
                      { backgroundColor: Cores.destaque.limao },
                    ]}
                  />
                  <Text style={styles.legendaTexto}>
                    Gastos dessa semana
                  </Text>
                </View>

                <View style={styles.legendaItem}>
                  <View
                    style={[
                      styles.legendaPonto,
                      { backgroundColor: '#FF8800' },
                    ]}
                  />
                  <Text style={styles.legendaTexto}>
                    Gastos da semana passada
                  </Text>
                </View>
              </View>
            </View>

            <VictoryChart
              height={165}
              padding={{ top: 10, bottom: 30, left: 2, right: 70 }}
              domainPadding={{ x: 12, y: 8 }}
            >
              <VictoryAxis
                tickValues={[1, 2, 3, 4, 5, 6, 7]}
                tickFormat={DIAS_SEMANA}
                style={{
                  axis: { stroke: 'transparent' },
                  grid: { stroke: '#ffffff12' },
                  ticks: { stroke: 'transparent' },
                  tickLabels: {
                    fill: Cores.texto.claro,
                    fontSize: 17,
                    fontFamily: FONTS.quicksand.bold,
                  },
                }}
              />

              <VictoryBar
                data={dadosBarras}
                style={{
                  data: {
                    fill: Cores.destaque.limao,
                    width: 14,
                  },
                }}
                cornerRadius={{ top: 7 }}
              />

              <VictoryBar
                data={dadosBarrasPassadas}
                style={{
                  data: {
                    fill: '#FF8800',
                    width: 12,
                  },
                }}
                cornerRadius={{ top: 6 }}
              />

              <VictoryLine
                data={dadosLinhaVerde}
                interpolation="natural"
                style={{
                  data: {
                    stroke: Cores.destaque.limao,
                    strokeWidth: 3,
                  },
                }}
              />

              <VictoryLine
                data={dadosLinha}
                interpolation="natural"
                style={{
                  data: {
                    stroke: '#FF8800',
                    strokeWidth: 3,
                  },
                }}
              />
            </VictoryChart>
          </LinearGradient>

          {/* =====================================================
              SUMÁRIO + ATIVIDADE
              COMPONENTES ORIGINAIS DO PLANO-B
          ===================================================== */}

          <View style={styles.duploRow}>
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

          <Text style={styles.secaoTitulo}>Planejamentos</Text>

          <LinearGradient
            colors={['#3c1e75', '#30096e']}
            style={styles.card}
          >
            <View style={styles.planejamentoItem}>
              <View style={styles.planejamentoIcone}>
  <Image
    source={DASHBOARD_MOCK.planejamentos[0].icone}
    style={styles.planejamentoIconeImagem}
    resizeMode="contain"
  />
</View>

              <View style={{ flex: 1 }}>
                <Text style={styles.planejamentoNome}>
                  {DASHBOARD_MOCK.planejamentos[0].nome}
                </Text>

                <Text style={styles.planejamentoFaltam}>
                  Faltam {moedaVisivel(DASHBOARD_MOCK.planejamentos[0].faltam)}
                </Text>
              </View>

              <Text style={styles.planejamentoValor}>
                {moedaVisivel(DASHBOARD_MOCK.planejamentos[0].valorAtual)} de{' '}
                {moedaVisivel(DASHBOARD_MOCK.planejamentos[0].valorTotal)}
              </Text>
            </View>

            <View style={styles.barraFundo}>
              <View
                style={[
                  styles.barraPreenchida,
                  {
                    width: `${
                      (DASHBOARD_MOCK.planejamentos[0].valorAtual /
                        DASHBOARD_MOCK.planejamentos[0].valorTotal) *
                      100
                    }%`,
                  },
                ]}
              />
            </View>
          </LinearGradient>

          <Text style={styles.secaoTitulo}>Gastos da semana</Text>

          <LinearGradient
            colors={['#3c1e75', '#30096e']}
            style={styles.card}
          >
            <View style={styles.gastosCorpo}>
              <GaugeCircular
                tamanho={130}
                label={moedaVisivel(DASHBOARD_MOCK.gastosSemana.restante)}
                sublabel="Restante"
                segmentos={DASHBOARD_MOCK.gastosSemana.segmentos.map(
                  segmento => ({
                    cor: segmento.cor,
                    pct: segmento.porcentagem,
                  })
                )}
              />

              <View style={styles.gastosList}>
                {DASHBOARD_MOCK.gastosSemana.indicadores.map(item => (
                  <View key={item.id} style={styles.gastosItem}>
                    <Text style={styles.gastosItemLabel}>
                      {item.label}
                    </Text>

                    <Text
                      style={[
                        styles.gastosItemValor,
                        { color: item.cor },
                      ]}
                    >
                      {exibir(item.valor)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.gastosLegendaRow}>
              {DASHBOARD_MOCK.gastosSemana.legenda.map(l => (
                <View key={l.label} style={styles.legendaItem}>
                  <View
                    style={[
                      styles.legendaPonto,
                      { backgroundColor: l.cor },
                    ]}
                  />

                  <Text style={styles.legendaTexto}>
                    {l.label}
                  </Text>
                </View>
              ))}
            </View>
          </LinearGradient>

          {/* COMPONENTE ORIGINAL DO PLANO-B */}

          <Text style={styles.secaoTitulo}>Plano-B</Text>

          <PlanoBCard
            limite={PLANOB_MOCK.limite}
            gastoAtual={PLANOB_MOCK.gastoAtual}
            restante={PLANOB_MOCK.restante}
            categorias={PLANOB_MOCK.categorias}
          />

          {/* =====================================================
              COMPONENTES QUE ERAM DA TELA PLANO-B ANTIGA
              (Sumário, Atividade e o card Plano-B já existiam aqui,
              por isso não foram repetidos)
          ===================================================== */}

          {/* MINI GRÁFICOS */}

          <View style={stylesPlanoB.areaRow}>
            <LinearGradient
              colors={['#3c1e75bd', '#30096e']}
              style={stylesPlanoB.areaCard}
            >
              <Text style={stylesPlanoB.areaValor}>
                Restante: {moedaVisivel(SALDO_MOCK.maximoDisponivel)}
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
              style={stylesPlanoB.areaCard}
            >
              <Text style={stylesPlanoB.areaValor}>
                Gastos: {moedaVisivel(SALDO_MOCK.atual)}
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

          {/* PERFORMANCE */}

          <Text style={styles.secaoTitulo}>Performance</Text>

          <LinearGradient
            colors={['#3c1e75bd', '#30096e']}
            style={stylesPlanoB.card}
          >
            <View style={stylesPlanoB.performanceHeader}>
              {/* MÊS ATUAL */}
              <View style={stylesPlanoB.performanceMes}>
                <Text style={stylesPlanoB.performanceSub}>
                  {PERFORMANCE_MOCK.atual.label}
                </Text>

                <Text style={stylesPlanoB.performanceData}>
                  {PERFORMANCE_MOCK.atual.periodo}
                </Text>
              </View>

              {/* MÊS ANTERIOR */}
              <View style={stylesPlanoB.performanceMes}>
                <Text style={stylesPlanoB.performanceSub}>
                  {PERFORMANCE_MOCK.anterior.label}
                </Text>

                <Text style={stylesPlanoB.performanceData}>
                  {PERFORMANCE_MOCK.anterior.periodo}
                </Text>
              </View>
            </View>

            <View style={stylesPlanoB.performanceInfo}>
              {/* MÊS ATUAL */}
              <View style={stylesPlanoB.performanceItem}>
                <PerformanceGauge
                  label={PERFORMANCE_MOCK.atual.status}
                  percentual={PERFORMANCE_MOCK.atual.percentualGauge}
                  cor={PERFORMANCE_MOCK.atual.cor}
                  variacao={PERFORMANCE_MOCK.atual.variacaoGastos}
                  styles={stylesPlanoB}
                />

                <Text
                  style={[
                    stylesPlanoB.performanceValor,
                    { color: PERFORMANCE_MOCK.atual.cor },
                  ]}
                >
                  Gastos{' '}
                  :{PERFORMANCE_MOCK.atual.gastos > 0 ? '+' : ''}
                  {PERFORMANCE_MOCK.atual.gastos}%
                </Text>

                <Text
                  style={[
                    stylesPlanoB.performanceValor,
                    { color: PERFORMANCE_MOCK.atual.cor },
                  ]}
                >
                  Economias{' '}
                  : {PERFORMANCE_MOCK.atual.economias > 0 ? '+' : ''}
                  {PERFORMANCE_MOCK.atual.economias}%
                </Text>
              </View>

              <View style={stylesPlanoB.divisorVertical} />

              {/* MÊS PASSADO */}
              <View style={stylesPlanoB.performanceItem}>
                <PerformanceGauge
                  label={PERFORMANCE_MOCK.anterior.status}
                  percentual={PERFORMANCE_MOCK.anterior.percentualGauge}
                  cor={PERFORMANCE_MOCK.anterior.cor}
                  variacao={PERFORMANCE_MOCK.anterior.variacaoGastos}
                  styles={stylesPlanoB}
                />

                <Text
                  style={[
                    stylesPlanoB.performanceValor,
                    { color: PERFORMANCE_MOCK.anterior.cor },
                  ]}
                >
                  Gastos{' '}
                  {PERFORMANCE_MOCK.anterior.gastos > 0 ? '+' : ''}
                  :  {PERFORMANCE_MOCK.anterior.gastos}%
                </Text>

                <Text
                  style={[
                    stylesPlanoB.performanceValor,
                    { color: PERFORMANCE_MOCK.anterior.cor },
                  ]}
                >
                  Economias{' '}
                  : {PERFORMANCE_MOCK.anterior.economias > 0 ? '+' : ''}
                  {PERFORMANCE_MOCK.anterior.economias}%
                </Text>
              </View>
            </View>
          </LinearGradient>

          {/* ROTAS */}

          <Text style={styles.secaoTitulo}>Rotas</Text>

          <View style={stylesPlanoB.duploRow}>
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
                styles={stylesPlanoB}
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
                styles={stylesPlanoB}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
  </View>
  )
}
