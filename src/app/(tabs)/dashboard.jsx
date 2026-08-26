import { ScrollView, View, Text, TouchableOpacity, Image } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { BackgroundGradient } from '../../shared/components/backgroundGradient'
import { VictoryBar, VictoryLine, VictoryChart, VictoryAxis } from 'victory-native'
import Svg, { Circle } from 'react-native-svg'
import { useState } from 'react'
import { Cores } from '../../shared/constants/Cores'
import { FONTS } from '../../shared/constants/Tipografia'

import {
  DASHBOARD_MOCK,
  ESTATISTICAS_MOCK,
  SUMARIO_PLANOB_MOCK,
  ATIVIDADE_HEATMAP_MOCK,
  PLANOB_MOCK,
} from '../../shared/components/Mocks'

import { PlanoBCard } from '../../shared/components/PlanoB/PlanoBCard'
import { SumarioCard } from '../../shared/components/PlanoB/SumarioCard'
import { HeatmapCard } from '../../shared/components/PlanoB/AtividadeHeatmap'
import { styles } from '../../styles/dashboardstyle'

import coroaIcon from '../../../assets/icones/coroa.png'
import sinoIcon from '../../../assets/icones/sino.png'

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
          colors={['#A357FF', '#7E3BED', '#8541F6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.headerTitulo}>Dashboard</Text>
              <Text style={styles.headerSubtitulo}>Financeiro</Text>
            </View>

            <View style={styles.headerIcones}>
  <Image source={coroaIcon} style={styles.headerIcone} />
  <Image source={sinoIcon} style={styles.headerIcone} />
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
  <LinearGradient
    colors={['#3c1e75', '#30096e']}
    start={{ x: 0, y: 0 }}
    end={{ x: 0, y: 1 }}
    style={styles.setaCirculo}
  >
    <Text style={styles.setaTexto}>
      ⌄
    </Text>
  </LinearGradient>
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
                    fill: Cores.texto.desabilitado,
                    fontSize: 10,
                    fontFamily: FONTS.quicksand.regular,
                  },
                }}
              />

              <VictoryBar
                data={dadosBarras}
                style={{
                  data: {
                    fill: Cores.destaque.limao,
                    width: 12,
                  },
                }}
                cornerRadius={{ top: 5 }}
              />

              <VictoryBar
                data={dadosBarrasPassadas}
                style={{
                  data: {
                    fill: '#FF8800',
                    width: 11,
                  },
                }}
                cornerRadius={{ top: 5 }}
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
            <SumarioCard
              disponivel={SUMARIO_PLANOB_MOCK.disponivel}
              itens={SUMARIO_PLANOB_MOCK.itens.map(item => ({
                label: item.label,
                valor: item.valor.toFixed(2).replace('.', ','),
                cor: item.cor,
                pct: item.porcentagem,
              }))}
            />

            <HeatmapCard
              mes={ATIVIDADE_HEATMAP_MOCK.mes}
              ano={ATIVIDADE_HEATMAP_MOCK.ano}
              dias={ATIVIDADE_HEATMAP_MOCK.dias}
            />
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
                  Faltam {DASHBOARD_MOCK.planejamentos[0].faltam}$
                </Text>
              </View>

              <Text style={styles.planejamentoValor}>
                ${DASHBOARD_MOCK.planejamentos[0].valorAtual} de $
                {DASHBOARD_MOCK.planejamentos[0].valorTotal}
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
                label={`R$${DASHBOARD_MOCK.gastosSemana.restante}`}
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
                      {item.valor}
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

          {/* =====================================================
              PLANO-B
              COMPONENTE ORIGINAL DO PLANO-B
          ===================================================== */}

          <Text style={styles.secaoTitulo}>Plano-B</Text>

          <PlanoBCard
            limite={PLANOB_MOCK.limite}
            gastoAtual={PLANOB_MOCK.gastoAtual}
            restante={PLANOB_MOCK.restante}
            categorias={PLANOB_MOCK.categorias}
          />
        </View>
      </ScrollView>
  </View>
  )
}

