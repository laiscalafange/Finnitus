import { StyleSheet } from 'react-native'
import { Cores } from '../shared/constants/Cores'
import { FONTS } from '../shared/constants/Tipografia'

// ── PALETA DOS CARDS ───────────────────────

export const DASHBOARD_CARD_COLORS = [
  'rgba(49, 26, 87, 0.90)',
  'rgba(42, 23, 72, 0.90)',
] as const

// ── ESTILOS DOS GRÁFICOS ───────────────────

const graficoEixoHorizontal = {
  axis: {
    stroke: 'transparent',
  },
  ticks: {
    stroke: 'transparent',
  },
  tickLabels: {
    fill: '#C7A9F5',
    fontSize: 11,
  },
}

const graficoEixoVertical = {
  axis: {
    stroke: 'transparent',
  },
  grid: {
    stroke: '#FFFFFF12',
  },
  tickLabels: {
    fill: '#C7A9F5',
    fontSize: 10,
  },
}

const graficoBarras = {
  data: {
    fill: ({ datum }: { datum?: { x?: number } }) =>
      datum?.x === 1
        ? '#FF8800'
        : Cores.destaque.limao,
    width: 42,
  },
}

const estilosNativos = StyleSheet.create({

  // ── CONTAINER PRINCIPAL ──────────────────

  container: {
    flex: 1,
  },

  scroll: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  flexItem: {
    flex: 1,
  },

  // ── HEADER ──────────────────────────────

  weekHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    marginTop: 8,
    marginBottom: 4,
  },

  weekMes: {
    color: Cores.base.branco,
    fontFamily: FONTS.quicksand.bold,
    fontSize: 13,
    textAlign: 'center',
  },

  weekArrow: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },

  weekArrowTexto: {
    color: Cores.destaque.limao,
    fontSize: 28,
    lineHeight: 30,
  },

  header: {
    paddingTop: 62,
    paddingHorizontal: 20,
    paddingBottom: 42,
    borderBottomLeftRadius: 38,
    borderBottomRightRadius: 38,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },

  headerTitulo: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 28,
    color: Cores.destaque.limao,
    lineHeight: 30,
  },

  headerSubtitulo: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 20,
    paddingBottom: 24,
    color: Cores.destaque.limao,
    marginTop: -1,
  },

  headerIcones: {
    flexDirection: 'row',
    gap: 18,
    paddingTop: 1,
  },

  headerIcone: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },

  // ── TOGGLE ──────────────────────────────

  toggle: {
    flexDirection: 'row',
    backgroundColor: Cores.overlay.forte,
    borderRadius: 25,
    padding: 4,
    marginBottom: 15,
    height: 47,
  },

  pill: {
    flex: 1,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },

  pillAtivo: {
    backgroundColor: Cores.destaque.limao,
  },

  pillTexto: {
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 17,
    color: Cores.texto.claro,
  },

  pillTextoAtivo: {
    fontFamily: FONTS.quicksand.bold,
    color: Cores.texto.contraste,
  },

  // ── WEEK STRIP ──────────────────────────

  weekStrip: {
    flexDirection: 'row',
    gap: 7,
    marginHorizontal: -3,
  },

  diaContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 6,
    paddingVertical: 13,
    borderRadius: 40,
    backgroundColor: Cores.fundo.cardAlt,
    minHeight: 100,
  },

  diaContainerAtivo: {
    backgroundColor: Cores.fundo.cardAlt,
  },

  diaLetra: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 15,
    color: Cores.texto.claro,
    marginBottom: 5,
  },

  diaLetraAtivo: {
    color: Cores.destaque.limao,
  },

  diaNumero: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 18,
    color: Cores.texto.claro,
    marginBottom: 7,
  },

  diaNumeroAtivo: {
    color: Cores.destaque.limao,
  },

  diaPonto: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Cores.overlay.intenso,
  },

  diaPontoAtivo: {
    backgroundColor: Cores.destaque.limao,
  },

  // ── SETA ────────────────────────────────

  setaContainer: {
    alignItems: 'center',
    marginTop: -1,
    marginBottom: 8,
  },

  setaCirculo: {
    width: 79,
    height: 38,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    backgroundColor: Cores.fundo.seta,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  setaTexto: {
    color: Cores.base.branco,
    fontSize: 20,
    paddingLeft: 1,
  },

  // ── CONTEÚDO ────────────────────────────

  conteudo: {
    padding: 20,
    paddingBottom: 120,
  },

  secaoTitulo: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 24,
    color: Cores.destaque.limao,
    marginBottom: 12,
    marginTop: 5,
  },

  // ── CARD BASE ───────────────────────────

  card: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(163, 87, 255, 0.25)',
  },

  cardTitulo: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 18,
    color: Cores.destaque.limao,
  },

  // ── ESTATÍSTICAS ────────────────────────

  legendaRow: {
    flexDirection: 'column',
    gap: 2,
    alignItems: 'flex-end',
    marginTop: -1,
    padding: 10,
  },

  legendaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    color: Cores.texto.claro,
  },

  legendaPonto: {
    width: 10,
    height: 10,
    borderRadius: 4,
  },

  legendaTexto: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 12,
    color: '#C7A9F5',
  },

  // ── COMPARAÇÃO SEMANAL E MENSAL ──────────

  comparacaoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    marginTop: 12,
    gap: 10,
  },

  comparacaoCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: 'rgba(89, 48, 145, 0.30)',
    borderRadius: 12,
  },

  comparacaoValor: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 17,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 5,
  },

  graficoContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 8,
  },

  // ── SUMÁRIO E ATIVIDADE ──────────────────

  duploRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 13,
  },

  duploCard: {
    flex: 1,
    borderRadius: 14,
    padding: 14,
    minHeight: 170,
  },

  duploTitulo: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 20,
    color: Cores.destaque.limao,
    marginBottom: 5,
  },

  duploDescricao: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 12,
    lineHeight: 15,
    color: Cores.texto.claro,
    marginBottom: 11,
  },

  // ── SUMÁRIO ─────────────────────────────

  sumarioLinha: {
    marginBottom: 10,
  },

  sumarioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },

  sumarioLabel: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 15,
    color: Cores.base.branco,
  },

  sumarioValor: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 15,
    color: Cores.destaque.limao,
  },

  sumarioBarra: {
    height: 5,
    borderRadius: 3,
    backgroundColor: Cores.overlay.medio,
    overflow: 'hidden',
  },

  sumarioBarraPreenchida: {
    height: '100%',
    borderRadius: 3,
  },

  // ── HEATMAP ─────────────────────────────

  heatmapGrid: {
    width: '100%',
    marginTop: 8,
    marginBottom: 10,
  },

  heatmapLinha: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  heatmapBolinha: {
    width: 20,
    height: 20,
    borderRadius: 10,
    flexShrink: 0,
  },

  // ── PLANEJAMENTOS ───────────────────────

  planejamentoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },

  planejamentoIconeImagem: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },

  planejamentoIcone: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(89, 48, 145, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  planejamentoIcone2: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Cores.overlay.medio,
    justifyContent: 'center',
    alignItems: 'center',
  },

  planejamentoIconeTexto: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 23,
    color: Cores.roxo.claro,
  },

  planejamentoInfo: {
    flex: 1,
  },

  planejamentoRotulo: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 11,
    color: Cores.destaque.limao,
    marginBottom: 3,
  },

  planejamentoNome: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 17,
    color: '#FFFFFF',
  },

  planejamentoFaltam: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 13,
    color: '#C7A9F5',
    marginTop: 5,
  },

  planejamentoFaltamValor: {
    fontFamily: FONTS.quicksand.bold,
    color: '#C7A9F5',
  },

  planejamentoValores: {
    alignItems: 'flex-end',
    maxWidth: '42%',
  },

  planejamentoValor: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'right',
    marginTop: 0,
  },

  planejamentoValorTotal: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 11,
    color: '#C7A9F5',
    marginTop: 3,
    textAlign: 'right',
  },

  planejamentoProgresso: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },

  planejamentoPercentual: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 12,
    color: '#C7A9F5',
  },

  barraFundo: {
    height: 7,
    borderRadius: 10,
    backgroundColor: Cores.overlay.medio,
    overflow: 'hidden',
    marginTop: 5,
  },

  barraPreenchida: {
    height: '100%',
    borderRadius: 10,
    backgroundColor: Cores.roxo.claro,
  },

  barraMeta: {
    flex: 1,
    marginTop: 0,
  },

  barraMetaPreenchida: {
    backgroundColor: Cores.destaque.limao,
  },

  // ── CONTROLE DE DÍVIDAS ──────────────────

  dividaPercentual: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 12,
    color: '#C7A9F5',
    marginTop: 7,
  },

  // ── ECONOMIA SEMANAL E MENSAL ────────────

  economiaResumo: {
    alignItems: 'center',
    marginBottom: 14,
  },

  economiaTitulo: {
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 15,
    color: '#C7A9F5',
    textAlign: 'center',
  },

  economiaValorPrincipal: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 25,
    color: Cores.destaque.limao,
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 4,
  },

  economiaValorNegativo: {
    color: '#FF7777',
  },

  economiaDescricao: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 11,
    color: '#C7A9F5',
    textAlign: 'center',
    lineHeight: 15,
  },

  // ── DEPÓSITOS E RETIRADAS ────────────────

  economiaMovimentacoes: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 8,
    marginBottom: 16,
  },

  economiaDepositos: {
    flex: 1,
    minWidth: 0,
    backgroundColor: 'rgba(89, 48, 145, 0.45)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },

  economiaRetiradas: {
    flex: 1,
    minWidth: 0,
    backgroundColor: 'rgba(89, 48, 145, 0.45)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },

  economiaIconeDeposito: {
    fontSize: 21,
    color: Cores.destaque.limao,
    marginBottom: 3,
  },

  economiaIconeRetirada: {
    fontSize: 21,
    color: '#FF7777',
    marginBottom: 3,
  },

  economiaRotulo: {
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 13,
    color: '#C7A9F5',
    textAlign: 'center',
  },

  economiaValorDeposito: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 5,
  },

  economiaValorRetirada: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 5,
  },

  // ── RESERVA DE EMERGÊNCIA ────────────────

  economiaReserva: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(163, 87, 255, 0.22)',
    paddingTop: 12,
  },

  economiaReservaTitulo: {
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 15,
    color: '#C7A9F5',
  },

  economiaReservaValor: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 24,
    color: '#FFFFFF',
    marginTop: 4,
    marginBottom: 12,
  },

  economiaObjetivoLinha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },

  economiaObjetivoRotulo: {
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 14,
    color: '#C7A9F5',
  },

  economiaObjetivoValor: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'right',
    flexShrink: 1,
  },

  economiaProgresso: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },

  economiaBarraFundo: {
    flex: 1,
    height: 8,
    borderRadius: 20,
    backgroundColor: Cores.overlay.medio,
    overflow: 'hidden',
  },

  economiaBarraPreenchida: {
    height: '100%',
    borderRadius: 20,
    backgroundColor: Cores.roxo.claro,
  },

  economiaPercentual: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 13,
    color: '#C7A9F5',
  },

  economiaProgressoDescricao: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 11,
    color: '#C7A9F5',
    textAlign: 'right',
    marginTop: 5,
  },

  // ── GASTOS DA SEMANA ────────────────────

  gastosCorpo: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  gaugeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  gaugeLabel: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 18,
    color: Cores.roxo.claro,
    textAlign: 'left',
  },

  gaugeSubLabel: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 18,
    color: Cores.texto.principal,
    textAlign: 'right',
  },

  gastosList: {
    flex: 1,
    gap: 8,
    marginLeft: 10,
  },

  gastosItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 7,
    paddingLeft: 0,
  },

  gastosItemLabel: {
    flex: 1,
    fontFamily: FONTS.quicksand.regular,
    fontSize: 14,
    color: Cores.roxo.claro,
  },

  gastosItemValor: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 14,
    minWidth: 65,
    textAlign: 'right',
  },

  gastosLegendaRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 9,
    marginTop: 10,
  },

  // ── PLANO B ─────────────────────────────

  planoBHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
    paddingHorizontal: 52,
  },

  planoBNav: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 20,
    color: Cores.destaque.limao,
  },

  planoBCorpo: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
    marginTop: -10,
    marginBottom: 30,
  },

  planoBValor: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 15,
    color: Cores.roxo.claro,
    textAlign: 'left',
  },

  planoBRestantes: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 18,
    color: Cores.texto.principal,
    textAlign: 'right',
  },

  categoriaLista: {
    flex: 2,
    gap: 8,
    alignItems: 'flex-start',
  },

  categoriaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    marginTop: 2,
    paddingLeft: 45,
  },

  categoriaIcone: {
    fontSize: 20,
    width: 20,
    textAlign: 'center',
  },

  categoriaNome: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 16,
    color: Cores.roxo.claro,
    textAlign: 'left',
  },

  categoriaValor: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 14,
    color: Cores.destaque.limao,
  },
})

// ── EXPORTAÇÃO ────────────────────────────

export const styles = {
  ...estilosNativos,
  graficoEixoHorizontal,
  graficoEixoVertical,
  graficoBarras,
}