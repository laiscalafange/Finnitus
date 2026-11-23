import { useMoedaVisivel } from '@/features/configuracoesContext'
import { Text } from '@/shared/components/Texto'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { Image, ScrollView, TouchableOpacity, View } from 'react-native'
import { VictoryAxis, VictoryBar, VictoryChart, VictoryLine } from 'victory-native'
import { buscarDashboardApi } from '../../services/dashboardApi'
import { BackgroundGradient } from '../../shared/components/backgroundGradient'
import { Cores } from '../../shared/constants/Cores'
import { GRADIENTS } from '../../shared/constants/Gradientes'
import { Rotas } from '../../shared/constants/Rotas'
import { FONTS } from '../../shared/constants/Tipografia'
import { DASHBOARD_MOCK, ESTATISTICAS_MOCK } from '../../shared/components/Mocks'
import { useFinanceiro } from '../../features/financeiroContext'
import { calcularAtividade, calcularSumario } from '../../features/sumarioData'
import { HeatmapCard } from '../../shared/components/PlanoB/AtividadeHeatmap'
import { SumarioCard } from '../../shared/components/PlanoB/SumarioCard'
import { styles } from '../../styles/dashboardstyle'
import { SinoNotificacoes } from '@/shared/components/SinoNotificacoes'
import coroaIcon from '../../../assets/icones/coroa.png'

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
      chave: formatarDataApi(dia),
    }
  })
}

function formatarMes(data) {
  return data.toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  })
}

function formatarDataApi(data) {
  const ano = data.getFullYear()
  const mes = String(data.getMonth() + 1).padStart(2, '0')
  const dia = String(data.getDate()).padStart(2, '0')

  return `${ano}-${mes}-${dia}`
}

export default function Dashboard() {
  const router = useRouter()
  const moedaVisivel = useMoedaVisivel()

  // [DADOS FINANCEIROS] Preservados conforme a integração existente.
  // As funções recebem transações, metas e salário do contexto financeiro.
  // A persistência/sincronização desses dados é responsabilidade do provider.
  const { transacoes, salario, metas } = useFinanceiro()
  const sumario = calcularSumario(transacoes, metas, salario)
  const atividade = calcularAtividade(transacoes, metas)

  // Somente a visão semanal permanece no dashboard.
  const [diaSelecionado, setDiaSelecionado] = useState(new Date())
  const [semanaOffset, setSemanaOffset] = useState(0)
  const [dashboard, setDashboard] = useState(null)
  const [carregandoDashboard, setCarregandoDashboard] = useState(false)
  const [erroDashboard, setErroDashboard] = useState(null)

  const dataExibida = new Date(diaSelecionado)
  dataExibida.setDate(dataExibida.getDate() + semanaOffset * 7)
  const dataReferencia = formatarDataApi(dataExibida)
  const diasSemana = getDiasSemana(dataExibida)
  const mesAtual = formatarMes(dataExibida)

  // [MOCK — VISÃO SEMANAL]
  // Estas séries AINDA NÃO representam despesas do usuário.
  // Substituição futura: ler o formato real retornado por buscarDashboardApi,
  // calcular os totais diários da semana atual e da semana anterior,
  // e montar arrays [{ x: 1, y: totalSegunda }, ..., { x: 7, y: totalDomingo }].
  // Não somar deslocamentos artificiais aos valores financeiros.
  const dadosBarras = ESTATISTICAS_MOCK.semanaAtual.map((y, i) => ({ x: i + 1, y }))
  const dadosBarrasPassadas = ESTATISTICAS_MOCK.semanaPassada.map((y, i) => ({ x: i + 1.15, y }))
  const dadosLinha = ESTATISTICAS_MOCK.semanaPassada.map((y, i) => ({ x: i + 1.10, y: y + 7 }))
  const dadosLinhaVerde = ESTATISTICAS_MOCK.semanaAtual.map((y, i) => ({ x: i + 1, y: y + 8 }))

  // [MOCK — PLANEJAMENTOS]
  // O primeiro planejamento ainda é demonstrativo, NÃO é uma meta real.
  // Para integrar: identificar no contrato de metas o nome, valor-alvo,
  // valor acumulado e ícone. Calcular faltam = max(0, alvo - acumulado),
  // e progresso = alvo > 0 ? min(100, acumulado / alvo * 100) : 0.
  // Após validar o formato de metas, remover DASHBOARD_MOCK.
  const planejamentoMock = DASHBOARD_MOCK.planejamentos[0]
  const progressoPlanejamento = planejamentoMock.valorTotal > 0
    ? Math.max(0, Math.min(100, (planejamentoMock.valorAtual / planejamentoMock.valorTotal) * 100))
    : 0

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

  // [API REAL — CONSULTA EXISTENTE]
  // Consulta o endpoint semanal, mas a resposta ainda NÃO alimenta o gráfico.
  // A integração visual exige conferir o payload real do dashboardApi.
  useEffect(() => {
    let ativo = true

    async function carregarDashboard() {
      try {
        setCarregandoDashboard(true)
        setErroDashboard(null)
        const dados = await buscarDashboardApi('SEMANAL', dataReferencia)
        if (ativo) setDashboard(dados)
      } catch (error) {
        console.error('Erro ao carregar Dashboard:', error)
        if (ativo) {
          setErroDashboard('Não foi possível carregar os dados financeiros.')
          setDashboard(null)
        }
      } finally {
        if (ativo) setCarregandoDashboard(false)
      }
    }

    carregarDashboard()
    return () => { ativo = false }
  }, [dataReferencia])

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
                dia.chave === formatarDataApi(dataExibida)

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
          {/* A consulta é real, mas os gráficos abaixo continuam simulados. */}
          {carregandoDashboard && (
            <Text style={styles.legendaTexto}>Consultando dados financeiros...</Text>
          )}
          {erroDashboard && (
            <Text style={styles.legendaTexto}>{erroDashboard}</Text>
          )}
          {!carregandoDashboard && !erroDashboard && dashboard != null && (
            <Text style={styles.legendaTexto}>
              API consultada. Gráfico semanal demonstrativo até a integração dos valores reais.
            </Text>
          )}

          {/* [MOCK] Gráfico semanal ainda usa ESTATISTICAS_MOCK. */}
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

          {/* [DADOS DO CONTEXTO] SumarioCard e HeatmapCard recebem sumario/atividade
              calculados com useFinanceiro; não usam valores das constantes MOCK. */}
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
    source={planejamentoMock.icone}
    style={styles.planejamentoIconeImagem}
    resizeMode="contain"
  />
</View>

              <View style={{ flex: 1 }}>
                <Text style={styles.planejamentoNome}>
                  {planejamentoMock.nome}
                </Text>

                <Text style={styles.planejamentoFaltam}>
                  Faltam {moedaVisivel(planejamentoMock.faltam)}
                </Text>
              </View>

              <Text style={styles.planejamentoValor}>
                {moedaVisivel(planejamentoMock.valorAtual)} de{' '}
                {moedaVisivel(planejamentoMock.valorTotal)}
              </Text>
            </View>

            <View style={styles.barraFundo}>
              <View
                style={[
                  styles.barraPreenchida,
                  {
                    width: `${progressoPlanejamento}%`,
                  },
                ]}
              />
            </View>
          </LinearGradient>

        </View>
      </ScrollView>
    </View>
  )
}
