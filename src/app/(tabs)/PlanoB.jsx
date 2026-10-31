import { useCallback, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { useFocusEffect, useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { ChevronRight, Pencil, Sparkles } from 'lucide-react-native'

import { Cores } from '../../shared/constants/Cores'
import { FONTS } from '../../shared/constants/Tipografia'
import { GRADIENTS } from '../../shared/constants/Gradientes'
import { Rotas } from '../../shared/constants/Rotas'
import { BackgroundGradient } from '../../shared/components/backgroundGradient'
import { Button } from '../../shared/components/Button'
import { Card } from '../../shared/components/Cards'
import { Progress } from '../../shared/components/Progress'
import {
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
import sinoIcon from '../../../assets/icones/sino.png'

import { useFinanceiro } from '../../features/financeiroContext'
import { calcularSumario } from '../../features/sumarioData'
import { formatarMoeda } from '../../features/menuMais/utils'
import { reservaApi } from '../../services/reserva'
import {
  ROTULOS_TIPO,
  analisarImprevisto,
  escolherEstrategia,
  listarImprevistos,
  mensagemErroImprevisto,
} from '../../services/imprevistosApi'

import { styles } from '../../styles/Planobstyle'

const GRADIENTE_CARD = [Cores.fundo.cardAlt, Cores.fundo.navBarra]

// Tela Plano-B. Ordem dos blocos (não mudar):
//  1. Margem livre / Reserva de emergência (dentro do cabeçalho)
//  2. Registrar imprevisto
//  3. Análise da IA (só depois do envio)
//  4. Seus imprevistos (sempre no final)
//
// Os cards antigos desta tela (gráficos, Performance, Sumário, Atividade e
// Rotas) agora ficam no Dashboard.
export default function PlanoBScreen() {
  const router = useRouter()

  // Margem livre = o que sobra da renda depois de gastar e guardar nas metas
  // (mesmo cálculo do card Sumário)
  const { transacoes, salario, metas } = useFinanceiro()
  const sumario = calcularSumario(transacoes, metas, salario)

  // ----- Reserva de emergência (API real) -----
  const [reserva, setReserva] = useState(null)
  const [carregandoReserva, setCarregandoReserva] = useState(true)
  const [erroReserva, setErroReserva] = useState('')

  // ----- Registro e análise -----
  const [campos, setCampos] = useState(camposVazios)
  const [erroForm, setErroForm] = useState('')
  const [analisando, setAnalisando] = useState(false)
  // Depois do envio: { imprevisto, analise }
  const [resultado, setResultado] = useState(null)
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

  async function enviarParaAnalise() {
    if (ocupado.current) return

    const mensagem = validarCampos(campos)

    if (mensagem) {
      setErroForm(mensagem)
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
      )

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
            style={styles.headerPlanoB}
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
              {/* Margem livre do mês */}
              <Text style={styles.headerSaldoLabel}>Margem livre do mês</Text>

              <Text style={styles.headerSaldoValor}>
                {sumario.semRenda ? '—' : formatarMoeda(sumario.disponivel)}
              </Text>

              {sumario.semRenda ? (
                <Text style={local.notaCard}>
                  Registre uma entrada ou informe sua renda para calcular.
                </Text>
              ) : null}

              <View style={local.divisorCard} />

              {/* Reserva de emergência */}
              <View style={styles.headerSaldoTopo}>
                <Text style={styles.headerSaldoLabel}>Reserva de emergência</Text>

                {reserva && metaReserva > 0 ? (
                  <Text style={styles.headerSaldoData}>{percentualReserva}%</Text>
                ) : null}
              </View>

              {carregandoReserva ? (
                <ActivityIndicator color={Cores.texto.contraste} />
              ) : erroReserva ? (
                <Pressable onPress={() => void carregarReserva()}>
                  <Text style={local.notaCard}>
                    {erroReserva} Toque para tentar de novo.
                  </Text>
                </Pressable>
              ) : !reserva ? (
                <>
                  <Text style={local.notaCard}>
                    Você ainda não criou sua reserva de emergência.
                  </Text>

                  <Pressable
                    accessibilityRole="button"
                    onPress={() => router.push('/mais/reservaEmergencia')}
                  >
                    <Text style={local.linkCard}>Criar reserva</Text>
                  </Pressable>
                </>
              ) : (
                <>
                  <Text style={styles.headerSaldoValor}>
                    {formatarMoeda(saldoReserva)}
                  </Text>

                  {metaReserva > 0 ? (
                    <>
                      <View style={local.barraReserva}>
                        <Progress
                          value={saldoReserva}
                          max={metaReserva}
                          height={8}
                          color={Cores.texto.contraste}
                          backgroundColor={Cores.overlay.cardSuave}
                        />
                      </View>

                      <Text style={local.notaCard}>
                        Meta: {formatarMoeda(metaReserva)}
                      </Text>
                    </>
                  ) : (
                    <Text style={local.notaCard}>
                      Defina uma meta na tela da reserva para acompanhar o
                      progresso.
                    </Text>
                  )}
                </>
              )}
            </View>
          </LinearGradient>

          {/* SETA */}
          <View style={styles.headerSetaContainer}>
            <View style={styles.headerSeta}>
              <Text style={styles.headerSetaTexto}>⌄</Text>
            </View>
          </View>

          {/* ==================================================
              CONTEÚDO
          ================================================== */}

          <View style={styles.conteudo}>
            {/* ==================================================
                2. REGISTRAR IMPREVISTO
            ================================================== */}

            <Text style={styles.secaoTitulo}>Registrar imprevisto</Text>

            <Card gradiente={GRADIENTE_CARD}>
              {recolhido ? (
                // Formulário resumido depois do envio
                <View>
                  <View style={local.resumoTopo}>
                    <View style={{ flex: 1 }}>
                      <Text style={local.resumoNome} numberOfLines={2}>
                        {resultado.imprevisto.nome}
                      </Text>

                      <Text style={local.resumoSub}>
                        {ROTULOS_TIPO[resultado.imprevisto.tipo]} ·{' '}
                        {resultado.imprevisto.data}
                      </Text>
                    </View>

                    <Text style={local.resumoValor}>
                      {formatarMoeda(resultado.imprevisto.valor)}
                    </Text>
                  </View>

                  <Button
                    titulo="Editar informações"
                    variante="outline"
                    disabled={salvando}
                    icone={<Pencil size={18} color={Cores.destaque.limao} />}
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

                  <Button
                    titulo={tituloBotao}
                    disabled={analisando}
                    icone={<Sparkles size={18} color={Cores.destaque.limao} />}
                    onPress={enviarParaAnalise}
                  />

                  {resultado && editando && !analisando ? (
                    <View style={{ marginTop: 10 }}>
                      <Button
                        titulo="Cancelar edição"
                        variante="outline"
                        onPress={cancelarEdicao}
                      />
                    </View>
                  ) : null}
                </View>
              )}
            </Card>

            {/* Carregamento durante a análise */}
            {analisando ? (
              <Card gradiente={GRADIENTE_CARD} style={local.cardCarregando}>
                <ActivityIndicator size="large" color={Cores.destaque.limao} />
                <Text style={local.carregandoTitulo}>
                  Analisando seu imprevisto...
                </Text>
                <Text style={local.carregandoTexto}>
                  A IA está avaliando sua renda, despesas e reserva. Isso pode
                  levar alguns segundos.
                </Text>
              </Card>
            ) : null}

            {/* ==================================================
                3. ANÁLISE DA IA (só depois do envio e da conclusão)
            ================================================== */}

            {resultado && !editando && !analisando ? (
              <View>
                <Text style={styles.secaoTitulo}>Análise da IA</Text>

                <Card gradiente={GRADIENTE_CARD}>
                  <TextoAnalise texto={resultado.analise.texto} />
                </Card>

                <Text style={local.subtitulo}>Escolha uma estratégia</Text>

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
                  Valores estimados pelo app com base na sua situação financeira.
                  Escolher uma estratégia não move dinheiro da sua reserva.
                </Text>

                {erroEstrategia ? (
                  <Text style={local.erro} accessibilityRole="alert">
                    {erroEstrategia}
                  </Text>
                ) : null}

                <Button
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
              <Card gradiente={GRADIENTE_CARD}>
                <Text style={local.erro}>{erroHistorico}</Text>
                <Button
                  titulo="Tentar novamente"
                  variante="outline"
                  onPress={() => void carregarHistorico()}
                />
              </Card>
            ) : imprevistosSalvos.length === 0 ? (
              <Card gradiente={GRADIENTE_CARD}>
                <Text style={local.vazio}>
                  Nenhum imprevisto registrado ainda. Quando algo inesperado
                  acontecer, registre aqui e receba uma análise.
                </Text>
              </Card>
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
                  <Card gradiente={GRADIENTE_CARD} style={local.cardHistorico}>
                    <View style={local.resumoTopo}>
                      <View style={{ flex: 1 }}>
                        <Text style={local.resumoNome} numberOfLines={1}>
                          {item.nome}
                        </Text>

                        <Text style={local.resumoSub}>
                          {ROTULOS_TIPO[item.tipo]} · {item.data}
                        </Text>
                      </View>

                      <Text style={local.resumoValor}>
                        {formatarMoeda(item.valor)}
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
                  </Card>
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
  // Textos pequenos dentro do card verde-limão do cabeçalho
  notaCard: {
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 14,
    lineHeight: 18,
    color: Cores.texto.contraste,
  },

  linkCard: {
    marginTop: 6,
    fontFamily: FONTS.quicksand.bold,
    fontSize: 15,
    color: Cores.texto.contraste,
    textDecorationLine: 'underline',
  },

  divisorCard: {
    height: 1,
    marginVertical: 14,
    backgroundColor: Cores.overlay.cardSuave,
  },

  barraReserva: {
    marginTop: 6,
    marginBottom: 6,
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

  // Carregamento da análise
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

  // Análise
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

  vazio: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 14,
    lineHeight: 20,
    color: Cores.texto.claro,
  },
})