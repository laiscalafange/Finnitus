import { useMoedaVisivel } from '@/features/configuracoesContext'
import { Text } from '@/shared/components/Texto'
import { LinearGradient } from 'expo-linear-gradient'
import { useFocusEffect, useRouter } from 'expo-router'
import { useCallback, useState } from 'react'
import { Image, ScrollView, TouchableOpacity, View } from 'react-native'
import { VictoryAxis, VictoryBar, VictoryChart } from 'victory-native'
import { buscarDashboardApi } from '../../services/dashboardApi'
import { BackgroundGradient } from '../../shared/components/backgroundGradient'
import { Cores } from '../../shared/constants/Cores'
import { GRADIENTS } from '../../shared/constants/Gradientes'
import { Rotas } from '../../shared/constants/Rotas'
import { useFinanceiro } from '../../features/financeiroContext'
import { calcularAtividade, calcularSumario } from '../../features/sumarioData'
import { HeatmapCard } from '../../shared/components/PlanoB/AtividadeHeatmap'
import { SumarioCard } from '../../shared/components/PlanoB/SumarioCard'
import { styles } from '../../styles/dashboardstyle'
import { SinoNotificacoes } from '@/shared/components/SinoNotificacoes'
import coroaIcon from '../../../assets/icones/coroa.png'

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

// Conversão numérica para os valores monetários das metas.
// Não cria dados fictícios: na ausência de valor, utiliza zero.
function valorNumero(valor) {
  if (typeof valor === 'number') return Number.isFinite(valor) ? valor : 0
  if (typeof valor === 'string') {
    const texto = valor.trim().replace(/R\$\s*/g, '').replace(/\s/g, '')
    const normalizado = texto.includes(',')
      ? texto.replace(/\./g, '').replace(',', '.')
      : texto
    const numero = Number(normalizado)
    return Number.isFinite(numero) ? numero : 0
  }
  return 0
}

// Calcula quantos dias faltam para o vencimento, sem problemas de fuso horário.
// dataVencimento deve ser uma data válida no formato YYYY-MM-DD ou ISO.
function diasAteVencimento(dataVencimento) {
  const match = String(dataVencimento ?? '').match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!match) return null

  const ano = Number(match[1])
  const mes = Number(match[2])
  const dia = Number(match[3])
  const vencimento = Date.UTC(ano, mes - 1, dia)
  const dataValidada = new Date(vencimento)
  if (dataValidada.getUTCFullYear() !== ano ||
      dataValidada.getUTCMonth() !== mes - 1 ||
      dataValidada.getUTCDate() !== dia) return null

  const hoje = new Date()
  const hojeUTC = Date.UTC(hoje.getFullYear(), hoje.getMonth(), hoje.getDate())
  return Math.round((vencimento - hojeUTC) / 86400000)
}

function avisoVencimento(divida) {
  if (divida.status === 'QUITADA') {
    return { texto: 'Dívida quitada', cor: '#96D45A' }
  }

  const dias = diasAteVencimento(divida.dataVencimento)
  if (divida.status === 'ATRASADA' || (dias !== null && dias < 0)) {
    return { texto: dias !== null && dias < 0
      ? `Vencida há ${Math.abs(dias)} dia${Math.abs(dias) === 1 ? '' : 's'}`
      : 'Dívida em atraso', cor: '#FF8888' }
  }
  if (dias === 0) return { texto: 'Vence hoje!', cor: '#FFB366' }
  if (dias === 1) return { texto: 'Vence amanhã!', cor: '#FFB366' }
  if (dias !== null && dias <= 7) {
    return { texto: `Vence em ${dias} dias`, cor: '#FFB366' }
  }
  if (dias !== null) {
    return { texto: `Vence em ${dias} dias`, cor: '#DDD3EF' }
  }
  return { texto: 'Vencimento não informado', cor: '#DDD3EF' }
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

  // O seletor Semanal/Mensal permanece; os totais vêm da API.
  const [periodo, setPeriodo] = useState('semanal')
  const [diaSelecionado, setDiaSelecionado] = useState(new Date())
  const [semanaOffset, setSemanaOffset] = useState(0)
  const [mesOffset, setMesOffset] = useState(0)
  const [dashboard, setDashboard] = useState(null)
  const [carregandoDashboard, setCarregandoDashboard] = useState(false)
  const [erroDashboard, setErroDashboard] = useState(null)

  const dataExibida = new Date(diaSelecionado)
  if (periodo === 'semanal') {
    dataExibida.setDate(dataExibida.getDate() + semanaOffset * 7)
  } else {
    // Fixar no primeiro dia evita saltar meses em datas como 31 de janeiro.
    dataExibida.setDate(1)
    dataExibida.setMonth(dataExibida.getMonth() + mesOffset)
  }
  const periodoApi = periodo === 'semanal' ? 'SEMANAL' : 'MENSAL'
  const dataReferencia = formatarDataApi(dataExibida)
  const diasSemana = getDiasSemana(dataExibida)
  const mesAtual = formatarMes(dataExibida)

  // [DADOS REAIS — COMPARATIVO]
  // O endpoint GET /dashboard retorna os totais de despesas PAGAS
  // do intervalo atual e anterior. Ele NÃO retorna a divisão por dia.
  // Por isso, o gráfico compara dois totais reais, não sete valores inventados.
  const comparativo = dashboard?.comparativo
  const gastosAtual = Number(comparativo?.atual?.despesas?.pagas ?? 0)
  const gastosAnterior = Number(comparativo?.anterior?.despesas?.pagas ?? 0)
  const dadosBarras = [
    { x: 1, y: Number.isFinite(gastosAnterior) ? gastosAnterior : 0 },
    { x: 2, y: Number.isFinite(gastosAtual) ? gastosAtual : 0 },
  ]

  // [DADOS DO APLICATIVO — PLANEJAMENTOS]
  // Usa as metas recebidas do useFinanceiro, sem valores fictícios.
  // Os aliases abaixo aceitam nomes comuns de propriedades. Confira o formato
  // exato no financeiroContext e ajuste os campos quando necessário.
  const listaMetas = Array.isArray(metas)
    ? metas
    : Array.isArray(metas?.metas)
      ? metas.metas
      : Array.isArray(metas?.data)
        ? metas.data
        : []

  const planejamentos = listaMetas
    .filter(meta => meta && typeof meta === 'object')
    .map((meta, indice) => {
      const valorAtual = valorNumero(
        meta.valorAtual ?? meta.valor_atual ?? meta.valorAcumulado ??
        meta.valor_acumulado ?? meta.valorGuardado ?? meta.valor_guardado ??
        meta.saldoAtual ?? meta.saldo_atual ?? meta.saldo ?? 0
      )
      const valorTotal = valorNumero(
        meta.valorTotal ?? meta.valor_total ?? meta.valorObjetivo ??
        meta.valor_objetivo ?? meta.valorMeta ?? meta.valor_meta ??
        meta.valorAlvo ?? meta.valor_alvo ?? meta.valorDesejado ??
        meta.valor_desejado ?? meta.valor ?? 0
      )
      return {
        id: String(meta.id ?? meta.id_meta ?? meta.meta_id ?? indice),
        nome: String(meta.nome ?? meta.titulo ?? meta.descricao ?? 'Meta sem nome'),
        valorAtual,
        valorTotal,
        faltam: Math.max(0, valorTotal - valorAtual),
        progresso: valorTotal > 0
          ? Math.max(0, Math.min(100, (valorAtual / valorTotal) * 100))
          : 0,
      }
    })

  // [API REAL] Dívidas recebidas de GET /dashboard.
  // A API já traz nome, vencimento, parcelas restantes e saldo estimado.
  const controleDividas = dashboard?.controleDividas
  const dividas = Array.isArray(controleDividas?.dividas)
    ? controleDividas.dividas
    : []

  // [API REAL — ECONOMIA]
  // GET /dashboard fornece a evolução da reserva no período selecionado.
  // Não é o mesmo cálculo de obterEconomiaMes da Home: aqui usamos os
  // depósitos e retiradas registrados pelo backend para semana OU mês.
  const economiaPeriodo = dashboard?.evolucaoEconomia
  const valorDepositos = valorNumero(economiaPeriodo?.depositos)
  const valorRetiradas = valorNumero(economiaPeriodo?.retiradas)
  const economiaLiquida = valorDepositos - valorRetiradas
  const valorReserva = valorNumero(economiaPeriodo?.valorAtual)
  const objetivoReserva = valorNumero(economiaPeriodo?.valorDesejado)
  const percentualReserva = objetivoReserva > 0
    ? Math.max(0, Math.min(100, (valorReserva / objetivoReserva) * 100))
    : null

  function selecionarDia(dia) {
    setDiaSelecionado(dia.data)
    setSemanaOffset(0)
    setMesOffset(0)
  }

  function alterarPeriodo(novoPeriodo) {
    setPeriodo(novoPeriodo)
    setSemanaOffset(0)
    setMesOffset(0)
  }

  function semanaAnterior() {
    if (periodo === 'semanal') setSemanaOffset(prev => prev - 1)
    else setMesOffset(prev => prev - 1)
  }

  function proximaSemana() {
    if (periodo === 'semanal') setSemanaOffset(prev => prev + 1)
    else setMesOffset(prev => prev + 1)
  }

  // Refaz a consulta ao entrar na tela e quando o período/data muda.
  // Ao sair da tela, ignora respostas atrasadas para não exibir período incorreto.
  useFocusEffect(
    useCallback(() => {
      let ativo = true

      async function carregarDashboard() {
        try {
          setCarregandoDashboard(true)
          setErroDashboard(null)
          setDashboard(null)
          const dados = await buscarDashboardApi(periodoApi, dataReferencia)
          if (ativo) {
            if (!dados?.comparativo?.atual?.despesas || !dados?.comparativo?.anterior?.despesas) {
              throw new Error('Resposta do dashboard sem comparativo de despesas')
            }
            setDashboard(dados)
          }
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
    }, [periodoApi, dataReferencia])
  )

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

          {/* Seletor Semanal/Mensal preservado do dashboard original. */}
          <View style={styles.toggle}>
            {['semanal', 'mensal'].map(p => (
              <TouchableOpacity
                key={p}
                style={[styles.pill, periodo === p && styles.pillAtivo]}
                onPress={() => alterarPeriodo(p)}
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
          <Text style={styles.secaoTitulo}>{periodo === 'semanal' ? 'Visão semanal' : 'Visão mensal'}</Text>
          {/* [API REAL] Os dois totais vêm de dashboard.comparativo.
              A API não expõe gastos diários, então o eixo compara períodos inteiros. */}
          {carregandoDashboard && (
            <Text style={styles.legendaTexto}>Consultando dados financeiros...</Text>
          )}
          {erroDashboard && (
            <Text style={styles.legendaTexto}>{erroDashboard}</Text>
          )}

          {!carregandoDashboard && !erroDashboard && dashboard != null && (
            <LinearGradient
              colors={['#3c1e75', '#30096e']}
              style={styles.card}
            >
              <Text style={styles.cardTitulo}>
                {periodo === 'semanal' ? 'Comparação semanal' : 'Comparação mensal'}
              </Text>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 14 }}>
                <View style={{ flex: 1, paddingRight: 8 }}>
                  <Text style={styles.legendaTexto}>
                    {periodo === 'semanal' ? 'Semana anterior' : 'Mês anterior'}
                  </Text>
                  <Text style={styles.planejamentoNome}>{moedaVisivel(gastosAnterior)}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.legendaTexto}>
                    {periodo === 'semanal' ? 'Semana selecionada' : 'Mês selecionado'}
                  </Text>
                  <Text style={styles.planejamentoNome}>{moedaVisivel(gastosAtual)}</Text>
                </View>
              </View>

              <VictoryChart
                height={190}
                padding={{ top: 20, bottom: 40, left: 45, right: 22 }}
                domainPadding={{ x: 65, y: 12 }}
              >
                <VictoryAxis
                  tickValues={[1, 2]}
                  tickFormat={['Anterior', 'Selecionado']}
                  style={{
                    axis: { stroke: 'transparent' },
                    ticks: { stroke: 'transparent' },
                    tickLabels: { fill: Cores.texto.claro, fontSize: 13 },
                  }}
                />
                <VictoryAxis
                  dependentAxis
                  tickFormat={valor => `R$ ${Math.round(valor)}`}
                  style={{
                    axis: { stroke: 'transparent' },
                    grid: { stroke: '#ffffff12' },
                    tickLabels: { fill: Cores.texto.claro, fontSize: 10 },
                  }}
                />
                <VictoryBar
                  data={dadosBarras}
                  style={{
                    data: {
                      fill: ({ datum }) => datum.x === 1 ? '#FF8800' : Cores.destaque.limao,
                      width: 42,
                    },
                  }}
                  cornerRadius={{ top: 7 }}
                />
              </VictoryChart>
            </LinearGradient>
          )}

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

          {/* Dados vindos de useFinanceiro().metas. Não utiliza DASHBOARD_MOCK. */}
          {planejamentos.length === 0 ? (
            <LinearGradient
              colors={['#3c1e75', '#30096e']}
              style={styles.card}
            >
              <Text style={styles.planejamentoNome}>
                Nenhum planejamento cadastrado.
              </Text>
              <Text style={styles.planejamentoFaltam}>
                Crie uma meta no aplicativo para acompanhar seu progresso aqui.
              </Text>
            </LinearGradient>
          ) : (
            planejamentos.map(planejamento => (
              <LinearGradient
                key={planejamento.id}
                colors={['#3c1e75', '#30096e']}
                style={styles.card}
              >
                <View style={styles.planejamentoItem}>
                  <View style={styles.planejamentoIcone}>
                    {/* Ícone neutro enquanto o contrato de ícones das metas não é confirmado. */}
                    <Text style={styles.planejamentoNome}>◎</Text>
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={styles.planejamentoNome}>
                      {planejamento.nome}
                    </Text>
                    <Text style={styles.planejamentoFaltam}>
                      Faltam {moedaVisivel(planejamento.faltam)}
                    </Text>
                  </View>

                  <Text style={styles.planejamentoValor}>
                    {moedaVisivel(planejamento.valorAtual)} de{' '}
                    {moedaVisivel(planejamento.valorTotal)}
                  </Text>
                </View>

                <View style={styles.barraFundo}>
                  <View
                    style={[
                      styles.barraPreenchida,
                      { width: `${planejamento.progresso}%` },
                    ]}
                  />
                </View>
              </LinearGradient>
            ))
          )}

          {/* CONTROLE DE DÍVIDAS — MESMO ESTILO DOS PLANEJAMENTOS */}
          <Text style={styles.secaoTitulo}>Controle de Dívidas</Text>

          {carregandoDashboard ? (
            <LinearGradient colors={['#3c1e75', '#30096e']} style={styles.card}>
              <Text style={styles.planejamentoFaltam}>Carregando dívidas...</Text>
            </LinearGradient>
          ) : erroDashboard || !controleDividas ? (
            <LinearGradient colors={['#3c1e75', '#30096e']} style={styles.card}>
              <Text style={styles.planejamentoFaltam}>
                Não foi possível carregar as dívidas.
              </Text>
            </LinearGradient>
          ) : dividas.length === 0 ? (
            <LinearGradient colors={['#3c1e75', '#30096e']} style={styles.card}>
              <Text style={styles.planejamentoNome}>Nenhuma dívida cadastrada.</Text>
              <Text style={styles.planejamentoFaltam}>
                Seus compromissos parcelados aparecerão aqui.
              </Text>
            </LinearGradient>
          ) : (
            dividas.map(divida => {
              const aviso = avisoVencimento(divida)
              const parcelasRestantes = Math.max(0, Number(divida.parcelasRestantes) || 0)
              const saldo = Math.max(0, Number(divida.saldoDevedorEstimado) || 0)
              const total = Number(divida.valorTotal)
              // Proporção estimada do saldo ainda devido em relação ao valor total.
              // Não representa necessariamente o percentual de parcelas pagas (juros etc.).
              const percentualRestante = Number.isFinite(total) && total > 0
                ? Math.min(100, (saldo / total) * 100)
                : null

              return (
                <LinearGradient
                  key={String(divida.id)}
                  colors={['#3c1e75', '#30096e']}
                  style={styles.card}
                >
                  <View style={styles.planejamentoItem}>
                    <View style={styles.planejamentoIcone}>
                      <Text style={styles.planejamentoNome}>◎</Text>
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={styles.planejamentoNome}>{divida.nome}</Text>
                      <Text style={[styles.planejamentoFaltam, { color: aviso.cor }]}>
                        {aviso.texto}
                      </Text>
                      <Text style={styles.planejamentoFaltam}>
                        {parcelasRestantes} {parcelasRestantes === 1 ? 'parcela restante' : 'parcelas restantes'}
                      </Text>
                    </View>

                    <View style={{ alignItems: 'flex-end', maxWidth: '42%' }}>
                      <Text style={styles.planejamentoValor}>
                        {moedaVisivel(saldo)}
                      </Text>
                      <Text style={styles.planejamentoFaltam}>Saldo restante</Text>
                    </View>
                  </View>

                  {percentualRestante !== null && (
                    <>
                      <View style={styles.barraFundo}>
                        <View
                          style={[
                            styles.barraPreenchida,
                            { width: `${percentualRestante}%` },
                          ]}
                        />
                      </View>
                      <Text style={[styles.planejamentoFaltam, { marginTop: 7 }]}>
                        {percentualRestante.toFixed(0)}% do valor original ainda devido (estimado)
                      </Text>
                    </>
                  )}
                </LinearGradient>
              )
            })
          )}

          {/* ECONOMIA — períodos reais calculados pelo backend */}
          <Text style={styles.secaoTitulo}>
            {periodo === 'semanal' ? 'Economia semanal' : 'Economia mensal'}
          </Text>

          <LinearGradient colors={['#3c1e75', '#30096e']} style={styles.card}>
            {carregandoDashboard ? (
              <Text style={styles.planejamentoFaltam}>Carregando economia...</Text>
            ) : erroDashboard || !economiaPeriodo ? (
              <Text style={styles.planejamentoFaltam}>
                Não foi possível carregar os dados de economia.
              </Text>
            ) : !economiaPeriodo.possuiReserva ? (
              <>
                <Text style={styles.planejamentoNome}>Nenhuma reserva cadastrada.</Text>
                <Text style={styles.planejamentoFaltam}>
                  Crie uma reserva financeira para acompanhar sua economia.
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.cardTitulo}>
                  {periodo === 'semanal' ? 'Economizado nesta semana' : 'Economizado neste mês'}
                </Text>
                <Text style={[styles.planejamentoNome, { marginTop: 12, color: economiaLiquida < 0 ? '#FFB366' : Cores.destaque.limao }]}>
                  {economiaLiquida < 0 ? '-' : '+'}{moedaVisivel(Math.abs(economiaLiquida))}
                </Text>
                <Text style={[styles.planejamentoFaltam, { marginTop: 5 }]}>
                  {economiaLiquida < 0
                    ? 'As retiradas superaram os depósitos no período.'
                    : economiaLiquida > 0
                      ? 'Depósitos menos retiradas no período.'
                      : 'Sem variação líquida no período.'}
                </Text>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, gap: 12 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.planejamentoFaltam}>Depósitos</Text>
                    <Text style={styles.planejamentoNome}>{moedaVisivel(valorDepositos)}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.planejamentoFaltam}>Retiradas</Text>
                    <Text style={styles.planejamentoNome}>{moedaVisivel(valorRetiradas)}</Text>
                  </View>
                </View>

                <View style={{ marginTop: 16 }}>
                  <Text style={styles.planejamentoFaltam}>Total acumulado na reserva</Text>
                  <Text style={styles.planejamentoNome}>{moedaVisivel(valorReserva)}</Text>
                  {objetivoReserva > 0 && (
                    <>
                      <Text style={[styles.planejamentoFaltam, { marginTop: 4 }]}>
                        Objetivo: {moedaVisivel(objetivoReserva)}
                      </Text>
                      <View style={[styles.barraFundo, { marginTop: 10 }]}>
                        <View style={[styles.barraPreenchida, { width: `${percentualReserva}%` }]} />
                      </View>
                      <Text style={[styles.planejamentoFaltam, { marginTop: 6 }]}>
                        {percentualReserva.toFixed(1)}% do objetivo alcançado
                      </Text>
                    </>
                  )}
                </View>
              </>
            )}
          </LinearGradient>

        </View>
      </ScrollView>
    </View>
  )
}
