import { useCallback, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native'
import { Text } from '@/shared/components/Texto'
import { useFocusEffect, useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { Check, ChevronRight, Pencil, Sparkles } from 'lucide-react-native'

import { Cores } from '../../shared/constants/Cores'
import { FONTS } from '../../shared/constants/Tipografia'
import { GRADIENTS } from '../../shared/constants/Gradientes'
import { Rotas } from '../../shared/constants/Rotas'
import { BackgroundGradient } from '../../shared/components/backgroundGradient'
import { Progress } from '../../shared/components/Progress'
import {
  BotaoPlano,
  CardVidro,
  EstrategiaCard,
  FormularioImprevisto,
  StatusBadge,
  TextoAnalise,
  camposDoImprevisto,
  camposParaDados,
  camposVazios,
  validarCampos,
} from '../../shared/components/PlanoB/ImprevistoUI'
import coroaIcon from '../../../assets/icones/coroa.png'
import { SinoNotificacoes } from '@/shared/components/SinoNotificacoes'

import { useFinanceiro } from '../../features/financeiroContext'
import { calcularSumario } from '../../features/sumarioData'
import { useMoedaVisivel } from '@/features/configuracoesContext'
import { reservaApi } from '../../services/reserva'
import {
  analisarImprevisto,
  escolherEstrategia,
  listarImprevistos,
  mensagemErroImprevisto,
  rotuloTipoImprevisto,
} from '../../services/imprevistosApi'

import { styles } from '../../styles/Planobstyle'

// Permite animar o recolher/expandir do painel no Android
if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true)
}

// ---------------------------------------------------------------------
// MODO PRÉVIA (só para conferir o design)
// Com PREVIA_ANALISE = true a tela já abre no estado "depois da análise",
// usando os dados de exemplo abaixo, sem chamar a IA nem o backend.
// Deixe SEMPRE false ao entregar o app.
// ---------------------------------------------------------------------
const PREVIA_ANALISE = false

const RESULTADO_PREVIA = {
  imprevisto: {
    id: 'previa',
    nome: 'Concertar o celular',
    tipo: 'DESPESA_INESPERADA',
    valor: 500,
    data: '20/11/2026',
    duracaoMeses: 2,
    descricao: 'O celular caiu no chão e quebrou a tela.',
    status: 'pendente',
  },
  analise: {
    texto:
      'O conserto de R$ 500,00 cabe no seu mês, mas reduz bastante a sua margem livre.\n\nPrioridades:\n1. Resolver o celular, que é uma ferramenta de trabalho.\n2. Evitar mexer na reserva de emergência.',
    situacao: {},
    estrategias: [
      {
        id: 'previa-0',
        titulo: 'Pagar com a margem livre do mês',
        descricao: 'Usa só o que sobrou da renda, sem tocar na reserva.',
        impactos: [
          { rotulo: 'Por que essa opção', valor: 'Mantém a reserva intacta.' },
          { rotulo: 'Vantagem', valor: 'Sem juros e sem dívida.', tom: 'positivo' },
          { rotulo: 'Risco', valor: 'A margem do mês fica apertada.', tom: 'alerta' },
        ],
      },
      {
        id: 'previa-1',
        titulo: 'Parcelar em 2 vezes',
        descricao: 'Divide o valor entre este mês e o próximo.',
        impactos: [
          { rotulo: 'Por que essa opção', valor: 'Alivia o caixa agora.' },
          { rotulo: 'Vantagem', valor: 'Parcelas menores.', tom: 'positivo' },
          { rotulo: 'Risco', valor: 'Compromete parte da renda futura.', tom: 'alerta' },
        ],
      },
    ],
  },
}

// Tela Plano-B. Ordem dos blocos (não mudar):
//  1. Margem livre / Reserva de emergência (dentro do cabeçalho)
//  2. Registrar imprevisto
//  3. Análise da IA (só depois do envio)
//  4. Seus imprevistos (sempre no final)
//
// Os cards antigos desta tela (gráficos, Performance, Sumário, Atividade e
// Rotas) agora ficam no Dashboard.
export default function PlanoBScreen() {
  const moedaVisivel = useMoedaVisivel()
  const router = useRouter()

  // Margem livre = o que sobra da renda depois de gastar e guardar nas metas
  // (mesmo cálculo do card Sumário)
  const { transacoes, salario, metas } = useFinanceiro()
  const sumario = calcularSumario(transacoes, metas, salario)

  // Painel de margem livre/reserva: a seta abaixo do cabeçalho recolhe e abre
  const [painelAberto, setPainelAberto] = useState(true)

  // ----- Reserva de emergência (API real) -----
  const [reserva, setReserva] = useState(null)
  const [carregandoReserva, setCarregandoReserva] = useState(true)
  const [erroReserva, setErroReserva] = useState('')

  // ----- Registro e análise -----
  const [campos, setCampos] = useState(camposVazios)
  const [erroForm, setErroForm] = useState('')
  // Autorização (LGPD) para enviar os dados financeiros resumidos ao Gemini.
  // Volta a ficar desmarcada depois de cada análise.
  const [autorizarEnvioIA, setAutorizarEnvioIA] = useState(false)
  const [analisando, setAnalisando] = useState(false)
  // Depois do envio: { imprevisto, analise }
  const [resultado, setResultado] = useState(
    PREVIA_ANALISE ? RESULTADO_PREVIA : null,
  )
  // true = formulário reaberto para editar e pedir nova análise
  const [editando, setEditando] = useState(false)
  const [estrategiaId, setEstrategiaId] = useState(null)
  const [salvando, setSalvando] = useState(false)
  const [erroEstrategia, setErroEstrategia] = useState('')

  // ----- Histórico (API real) -----
  const [historico, setHistorico] = useState([])
  const [carregandoHistorico, setCarregandoHistorico] = useState(true)
  const [erroHistorico, setErroHistorico] = useState('')

  // Evita toque duplo enquanto uma chamada está em andamento
  const ocupado = useRef(false)

  const carregarReserva = useCallback(async () => {
    try {
      const dados = await reservaApi.buscar()
      setReserva(dados)
      setErroReserva('')
    } catch {
      setErroReserva('Não foi possível carregar a reserva.')
    } finally {
      setCarregandoReserva(false)
    }
  }, [])

  const carregarHistorico = useCallback(async () => {
    try {
      setHistorico(await listarImprevistos())
      setErroHistorico('')
    } catch (erro) {
      setErroHistorico(mensagemErroImprevisto(erro))
    } finally {
      setCarregandoHistorico(false)
    }
  }, [])

  // Recarrega ao voltar pra tela (ex.: depois de criar a reserva, ou de
  // editar/excluir um imprevisto na tela de detalhes)
  useFocusEffect(
    useCallback(() => {
      void carregarReserva()
      void carregarHistorico()
    }, [carregarReserva, carregarHistorico]),
  )

  // ----- Ações -----

  function alternarPainel() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setPainelAberto((aberto) => !aberto)
  }

  async function enviarParaAnalise() {
    if (ocupado.current) return

    const mensagem = validarCampos(campos)

    if (mensagem) {
      setErroForm(mensagem)
      return
    }

    // Sem autorização, a análise da IA não é solicitada
    if (!autorizarEnvioIA) {
      setErroForm(
        'Autorize o envio dos dados financeiros ao Gemini para receber a análise.',
      )
      return
    }

    ocupado.current = true
    setErroForm('')
    setAnalisando(true)

    try {
      const novo = await analisarImprevisto(
        camposParaDados(campos),
        // Nova análise antes de escolher: troca a anterior, sem duplicar
        resultado?.imprevisto.id,
        autorizarEnvioIA,
      )

      // A autorização vale para um envio só
      setAutorizarEnvioIA(false)

      setResultado(novo)
      setEstrategiaId(null)
      setErroEstrategia('')
      setEditando(false)
    } catch (erro) {
      // Os campos continuam preenchidos para a pessoa tentar de novo
      setErroForm(mensagemErroImprevisto(erro))
    } finally {
      ocupado.current = false
      setAnalisando(false)
    }
  }

  function cancelarEdicao() {
    if (resultado) {
      setCampos(camposDoImprevisto(resultado.imprevisto))
    }

    setErroForm('')
    setEditando(false)
  }

  // Escolher a estratégia só salva a escolha no imprevisto. Nenhum dinheiro
  // é movimentado da reserva.
  async function confirmarEstrategia() {
    const estrategia = resultado?.analise.estrategias.find(
      (item) => item.id === estrategiaId,
    )

    if (!resultado || !estrategia || ocupado.current) return

    ocupado.current = true
    setErroEstrategia('')
    setSalvando(true)

    try {
      await escolherEstrategia(resultado.imprevisto.id, estrategia.titulo)

      // A análise some e o formulário fica livre para um novo cadastro
      setResultado(null)
      setEstrategiaId(null)
      setEditando(false)
      setCampos(camposVazios())
      setErroForm('')

      void carregarHistorico()
    } catch (erro) {
      setErroEstrategia(mensagemErroImprevisto(erro))
    } finally {
      ocupado.current = false
      setSalvando(false)
    }
  }

  // ----- Valores de tela -----

  const saldoReserva = reserva?.saldo ?? 0
  const metaReserva = reserva?.meta ?? 0
  const percentualReserva =
    metaReserva > 0
      ? Math.min(100, Math.round((saldoReserva / metaReserva) * 100))
      : 0

  const recolhido = resultado !== null && !editando

  // O imprevisto que está na análise ainda não foi confirmado: não aparece
  // no histórico até a pessoa escolher a estratégia
  const imprevistosSalvos = historico.filter(
    (item) => item.id !== resultado?.imprevisto.id,
  )

  const tituloBotao = analisando
    ? 'Analisando...'
    : resultado
      ? 'Solicitar nova análise'
      : 'Enviar para análise da IA'

  return (
    <View style={{ flex: 1 }}>
      <BackgroundGradient />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {/* ==================================================
              1. HEADER + MARGEM LIVRE / RESERVA DE EMERGÊNCIA
          ================================================== */}

          <LinearGradient
            colors={GRADIENTS.header.colors}
            start={GRADIENTS.header.start}
            end={GRADIENTS.header.end}
            style={[styles.headerPlanoB, local.headerAjuste]}
          >
            <View style={styles.headerPlanoBTopo}>
              <View>
                <Text style={styles.headerPlanoBTitulo}>Plano-B</Text>
                <Text style={styles.headerPlanoBSubtitulo}>Imprevistos</Text>
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

                <SinoNotificacoes estiloIcone={styles.headerPlanoBIconeImagem} />
              </View>
            </View>

            {painelAberto ? (
            <View style={local.painel}>
              {/* Margem livre do mês: o que sobra da renda */}
              <Text style={local.painelRotulo}>Margem livre do mês</Text>

              <Text style={local.painelNota}>
                Quanto sobra da sua renda depois dos gastos e das metas.
              </Text>

              {sumario.semRenda ? (
                <>
                  <Text style={local.margemAviso}>Ainda não dá para calcular</Text>

                  <Text style={local.painelNota}>
                    Registre uma receita ou informe sua renda para ver quanto
                    sobra.
                  </Text>

                  <Pressable
                    accessibilityRole="button"
                    onPress={() =>
                      router.push({
                        pathname: '/mais/novoGasto',
                        params: { tipo: 'entrada' },
                      })
                    }
                  >
                    <Text style={local.painelLink}>Registrar receita</Text>
                  </Pressable>
                </>
              ) : (
                <>
                  <Text
                    style={local.margemValor}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                  >
                    {moedaVisivel(sumario.disponivel)}
                  </Text>

                  {/* Explica por que está zerada (o cálculo nunca passa de
                      zero para baixo) */}
                  {sumario.disponivel <= 0 ? (
                    <Text style={local.margemAlerta}>
                      Seus gastos e metas já usam toda a renda deste mês.
                    </Text>
                  ) : null}
                </>
              )}

              <View style={local.painelDivisor} />

              {/* Reserva de emergência */}
              <View style={local.reservaTopo}>
                <Text
                  style={[local.painelRotulo, { flexShrink: 1 }]}
                  numberOfLines={1}
                >
                  Reserva de emergência
                </Text>

                {reserva && metaReserva > 0 ? (
                  <View style={local.chip}>
                    <Text style={local.chipTexto}>{percentualReserva}%</Text>
                  </View>
                ) : null}
              </View>

              {carregandoReserva ? (
                <ActivityIndicator color={Cores.destaque.limao} />
              ) : erroReserva ? (
                <Pressable onPress={() => void carregarReserva()}>
                  <Text style={local.painelNota}>
                    {erroReserva} Toque para tentar de novo.
                  </Text>
                </Pressable>
              ) : !reserva ? (
                <>
                  <Text style={local.painelNota}>
                    Você ainda não criou sua reserva de emergência.
                  </Text>

                  <Pressable
                    accessibilityRole="button"
                    onPress={() => router.push('/mais/reservaEmergencia')}
                  >
                    <Text style={local.painelLink}>Criar reserva</Text>
                  </Pressable>
                </>
              ) : (
                <>
                  <View style={local.reservaValores}>
                    <Text
                      style={local.reservaSaldo}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                    >
                      {moedaVisivel(saldoReserva)}
                    </Text>

                    {metaReserva > 0 ? (
                      <Text style={local.reservaMeta} numberOfLines={1}>
                        Meta: {moedaVisivel(metaReserva)}
                      </Text>
                    ) : null}
                  </View>

                  {metaReserva > 0 ? (
                    <Progress
                      value={saldoReserva}
                      max={metaReserva}
                      height={8}
                      color={Cores.destaque.limao}
                      backgroundColor="rgba(255, 255, 255, 0.18)"
                    />
                  ) : (
                    <Text style={local.painelNota}>
                      Defina uma meta na tela da reserva para acompanhar o
                      progresso.
                    </Text>
                  )}
                </>
              )}
            </View>
            ) : null}
          </LinearGradient>

          {/* SETA */}
          <View style={styles.headerSetaContainer}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={
                painelAberto
                  ? 'Ocultar margem livre e reserva'
                  : 'Mostrar margem livre e reserva'
              }
              accessibilityState={{ expanded: painelAberto }}
              hitSlop={12}
              onPress={alternarPainel}
            >
              <View style={styles.headerSeta}>
                <Text
                  style={[
                    styles.headerSetaTexto,
                    !painelAberto && local.setaRecolhida,
                  ]}
                >
                  ⌄
                </Text>
              </View>
            </Pressable>
          </View>

          {/* ==================================================
              CONTEÚDO
          ================================================== */}

          <View style={styles.conteudo}>
            {/* ==================================================
                2. REGISTRAR IMPREVISTO
            ================================================== */}

            <Text style={styles.secaoTitulo}>Registrar imprevisto</Text>

            <CardVidro>
              {recolhido ? (
                // Formulário resumido depois do envio
                <View>
                  <View style={local.resumoTopo}>
                    <View style={{ flex: 1 }}>
                      <Text style={local.resumoNome} numberOfLines={2}>
                        {resultado.imprevisto.nome}
                      </Text>

                      <Text style={local.resumoSub}>
                        {rotuloTipoImprevisto(resultado.imprevisto)} ·{' '}
                        {resultado.imprevisto.data}
                      </Text>
                    </View>

                    <Text style={local.resumoValor}>
                      {moedaVisivel(resultado.imprevisto.valor)}
                    </Text>
                  </View>

                  <BotaoPlano
                    titulo="Editar informações"
                    variante="secundario"
                    icone={Pencil}
                    disabled={salvando}
                    onPress={() => setEditando(true)}
                  />
                </View>
              ) : (
                <View>
                  <FormularioImprevisto
                    campos={campos}
                    aoAlterar={setCampos}
                    erro={erroForm}
                    desabilitado={analisando}
                  />

                  {/* Autorização do envio dos dados à IA (mesmo padrão de
                      caixa de marcar do SelectCard) */}
                  <Pressable
                    accessibilityRole="checkbox"
                    accessibilityState={{
                      checked: autorizarEnvioIA,
                      disabled: analisando,
                    }}
                    disabled={analisando}
                    hitSlop={6}
                    onPress={() => setAutorizarEnvioIA((atual) => !atual)}
                    style={[
                      local.autorizacaoLinha,
                      analisando && local.autorizacaoDesabilitada,
                    ]}
                  >
                    <View
                      style={[
                        local.autorizacaoCaixa,
                        autorizarEnvioIA && local.autorizacaoMarcada,
                      ]}
                    >
                      {autorizarEnvioIA ? (
                        <Check
                          size={14}
                          color={Cores.texto.contraste}
                          strokeWidth={3}
                        />
                      ) : null}
                    </View>

                    <Text style={local.autorizacaoTexto}>
                      Autorizo o envio dos meus dados financeiros resumidos e
                      das informações deste imprevisto ao Gemini para gerar uma
                      análise personalizada.
                    </Text>
                  </Pressable>

                  <BotaoPlano
                    titulo={tituloBotao}
                    icone={Sparkles}
                    disabled={analisando}
                    onPress={enviarParaAnalise}
                  />

                  {resultado && editando && !analisando ? (
                    <View style={{ marginTop: 10 }}>
                      <BotaoPlano
                        titulo="Cancelar edição"
                        variante="secundario"
                        onPress={cancelarEdicao}
                      />
                    </View>
                  ) : null}
                </View>
              )}
            </CardVidro>

            {/* Carregamento durante a análise */}
            {analisando ? (
              <CardVidro style={local.cardCarregando}>
                <ActivityIndicator size="large" color={Cores.destaque.limao} />
                <Text style={local.carregandoTitulo}>
                  Analisando seu imprevisto...
                </Text>
                <Text style={local.carregandoTexto}>
                  A IA está avaliando sua renda, despesas e reserva. Isso pode
                  levar alguns segundos.
                </Text>
              </CardVidro>
            ) : null}

            {/* ==================================================
                3. ANÁLISE DA IA (só depois do envio e da conclusão)
            ================================================== */}

            {resultado && !editando && !analisando ? (
              <View>
                <Text style={styles.secaoTitulo}>Análise da IA</Text>

                <CardVidro>
                  <TextoAnalise texto={resultado.analise.texto} />
                </CardVidro>

                {/* Se a IA não achou estratégia viável, o título avisa */}
                <Text style={local.subtitulo}>
                  {resultado.analise.estrategias.length
                    ? 'Escolha uma estratégia'
                    : 'Nenhuma estratégia viável identificada'}
                </Text>

                {resultado.analise.estrategias.map((estrategia) => (
                  <EstrategiaCard
                    key={estrategia.id}
                    estrategia={estrategia}
                    selecionada={estrategia.id === estrategiaId}
                    desabilitado={salvando}
                    aoSelecionar={() => setEstrategiaId(estrategia.id)}
                  />
                ))}

                <Text style={local.aviso}>
                  Recomendações geradas pelo Gemini com base
                  nos dados informados. Escolher uma estratégia
                  não move dinheiro da sua reserva.
                </Text>

                {erroEstrategia ? (
                  <Text style={local.erro} accessibilityRole="alert">
                    {erroEstrategia}
                  </Text>
                ) : null}

                <BotaoPlano
                  titulo={salvando ? 'Salvando...' : 'Confirmar estratégia'}
                  disabled={!estrategiaId || salvando}
                  onPress={confirmarEstrategia}
                />
              </View>
            ) : null}

            {/* ==================================================
                4. SEUS IMPREVISTOS (sempre no final)
            ================================================== */}

            <Text style={[styles.secaoTitulo, { marginTop: 24 }]}>
              Seus imprevistos
            </Text>

            {carregandoHistorico ? (
              <ActivityIndicator color={Cores.destaque.limao} />
            ) : erroHistorico ? (
              <CardVidro>
                <Text style={local.erro}>{erroHistorico}</Text>
                <BotaoPlano
                  titulo="Tentar novamente"
                  variante="secundario"
                  onPress={() => void carregarHistorico()}
                />
              </CardVidro>
            ) : imprevistosSalvos.length === 0 ? (
              <CardVidro>
                <Text style={local.vazio}>
                  Nenhum imprevisto registrado ainda. Quando algo inesperado
                  acontecer, registre aqui e receba uma análise.
                </Text>
              </CardVidro>
            ) : (
              imprevistosSalvos.map((item) => (
                <Pressable
                  key={item.id}
                  accessibilityRole="button"
                  accessibilityLabel={`Abrir detalhes de ${item.nome}`}
                  onPress={() =>
                    router.push({
                      pathname: Rotas.detalheImprevisto,
                      params: { id: item.id },
                    })
                  }
                  style={({ pressed }) => pressed && { opacity: 0.85 }}
                >
                  <CardVidro style={local.cardHistorico}>
                    <View style={local.resumoTopo}>
                      <View style={{ flex: 1 }}>
                        <Text style={local.resumoNome} numberOfLines={1}>
                          {item.nome}
                        </Text>

                        <Text style={local.resumoSub}>
                          {rotuloTipoImprevisto(item)} · {item.data}
                        </Text>
                      </View>

                      <Text style={local.resumoValor}>
                        {moedaVisivel(item.valor)}
                      </Text>
                    </View>

                    <View style={local.rodapeHistorico}>
                      <StatusBadge status={item.status} />

                      <View style={local.verDetalhes}>
                        <Text style={local.verDetalhesTexto} numberOfLines={1}>
                          {item.estrategia ?? 'Sem estratégia'}
                        </Text>
                        <ChevronRight size={18} color={Cores.texto.claro} />
                      </View>
                    </View>
                  </CardVidro>
                </Pressable>
              ))
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}

// Estilos só desta tela (o restante reaproveita src/styles/Planobstyle.ts)
const local = StyleSheet.create({
  // ----- Cabeçalho -----

  // Menos espaço vazio embaixo do painel (o padrão deixava uma faixa grande)
  headerAjuste: {
    paddingBottom: 36,
  },

  // Seta apontando pra cima quando o painel está recolhido
  setaRecolhida: {
    transform: [{ rotate: '180deg' }],
  },

  // ----- Painel de margem livre e reserva -----

  // Painel translúcido com margem livre e reserva
  painel: {
    padding: 18,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    backgroundColor: 'rgba(20, 5, 50, 0.38)',
  },

  painelRotulo: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
  },

  painelNota: {
    marginTop: 4,
    fontFamily: FONTS.quicksand.medium,
    fontSize: 13,
    lineHeight: 18,
    color: 'rgba(255, 255, 255, 0.75)',
  },

  painelLink: {
    marginTop: 8,
    fontFamily: FONTS.quicksand.bold,
    fontSize: 14,
    color: Cores.destaque.limao,
  },

  painelDivisor: {
    height: 1,
    marginVertical: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },

  margemValor: {
    marginTop: 2,
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 30,
    color: Cores.destaque.limao,
  },

  // Mensagem quando ainda não há renda para calcular
  margemAviso: {
    marginTop: 10,
    fontFamily: FONTS.raleway.bold,
    fontSize: 18,
    color: Cores.base.branco,
  },

  // Aviso quando a margem está zerada
  margemAlerta: {
    marginTop: 2,
    fontFamily: FONTS.quicksand.bold,
    fontSize: 13,
    lineHeight: 18,
    color: Cores.estado.alerta,
  },

  reservaTopo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 8,
  },

  chip: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 20,
    backgroundColor: Cores.destaque.limao,
  },

  chipTexto: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 13,
    color: Cores.texto.contraste,
  },

  reservaValores: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 10,
  },

  reservaSaldo: {
    flexShrink: 1,
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 24,
    color: Cores.base.branco,
  },

  reservaMeta: {
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.75)',
  },

  // ----- Registrar imprevisto -----

  // Linha de autorização do envio dos dados à IA (mesmo estilo das linhas
  // de opção dos formulários e da caixa de marcar do SelectCard)
  autorizacaoLinha: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(163, 87, 255, 0.30)',
    borderRadius: 12,
    backgroundColor: 'rgba(29, 19, 44, 0.78)',
  },

  autorizacaoDesabilitada: {
    opacity: 0.6,
  },

  autorizacaoCaixa: {
    width: 22,
    height: 22,
    marginTop: 1,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: Cores.roxo.claro,
    alignItems: 'center',
    justifyContent: 'center',
  },

  autorizacaoMarcada: {
    borderColor: Cores.destaque.limao,
    backgroundColor: Cores.destaque.limao,
  },

  autorizacaoTexto: {
    flex: 1,
    fontFamily: FONTS.quicksand.medium,
    fontSize: 12,
    lineHeight: 18,
    color: Cores.texto.claro,
  },

  // Resumo do formulário e cards do histórico
  resumoTopo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 14,
  },

  resumoNome: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 17,
    color: Cores.base.branco,
  },

  resumoSub: {
    marginTop: 2,
    fontFamily: FONTS.quicksand.medium,
    fontSize: 13,
    color: Cores.texto.claro,
  },

  resumoValor: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 17,
    color: Cores.destaque.limao,
  },

  // ----- Carregamento da análise -----

  cardCarregando: {
    alignItems: 'center',
    gap: 8,
  },

  carregandoTitulo: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 16,
    color: Cores.base.branco,
  },

  carregandoTexto: {
    textAlign: 'center',
    fontFamily: FONTS.quicksand.regular,
    fontSize: 14,
    lineHeight: 20,
    color: Cores.texto.claro,
  },

  // ----- Análise da IA -----

  subtitulo: {
    marginTop: 6,
    marginBottom: 10,
    fontFamily: FONTS.raleway.bold,
    fontSize: 18,
    color: Cores.base.branco,
  },

  aviso: {
    marginBottom: 14,
    fontFamily: FONTS.quicksand.medium,
    fontSize: 12,
    lineHeight: 17,
    color: Cores.texto.claro,
  },

  erro: {
    marginBottom: 12,
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 14,
    color: '#ffb4b4',
  },

  // ----- Seus imprevistos -----

  vazio: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 14,
    lineHeight: 20,
    color: Cores.texto.claro,
  },

  cardHistorico: {
    marginBottom: 10,
  },

  rodapeHistorico: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },

  verDetalhes: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },

  verDetalhesTexto: {
    flexShrink: 1,
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 13,
    color: Cores.texto.claro,
  },
})
