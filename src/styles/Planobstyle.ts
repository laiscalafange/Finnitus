import { StyleSheet } from 'react-native'

import { Cores } from '../shared/constants/Cores'
import { FONTS } from '../shared/constants/Tipografia'

export const styles = StyleSheet.create({

  scroll: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  // ==================================================
  // HEADER
  // ==================================================

  headerPlanoB: {
    paddingTop: 68,
    paddingBottom: 74,
    paddingHorizontal: 30,
    borderBottomLeftRadius: 48,
    borderBottomRightRadius: 48,
  },

  headerPlanoBTopo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  headerPlanoBTitulo: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 30,
    lineHeight: 28,
    color: Cores.destaque.limao,
  },

  headerPlanoBSubtitulo: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 18,
    paddingBottom: 24,
    color:Cores.destaque.limao,
    marginTop: -1,
  },

  headerPlanoBIconeImagem: {
  width: 30,
  height: 30,
  resizeMode: 'contain',
},

  headerPlanoBIcones: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 12,
},

  headerMesPassado: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 15,
    color: Cores.texto.claro,
    textAlign: 'right',
    marginBottom: 2,
  },

  // ==================================================
  // SALDO
  // ==================================================

  headerSaldoCard: {
    backgroundColor: Cores.destaque.limao,
    borderRadius: 22,
    paddingHorizontal: 20,
    paddingVertical: 30,
    marginBottom: 3,
  },

  headerSaldoTopo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerSaldoLabel: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 16,
    color: Cores.texto.contraste,
  },

  headerSaldoData: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 16,
    color: Cores.texto.contraste,
  },

  headerSaldoValor: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 20,
    lineHeight: 26,
    color: Cores.texto.contraste,
  },

  headerVariacaoLinha: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 4,
    marginTop: -1,
  },

  headerVariacaoLabel: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 12,
    color: Cores.overlay.cardForte,
  },

  headerVariacaoBadge: {
    backgroundColor: Cores.overlay.cardSuave,
    borderRadius: 20,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },

  headerVariacaoTexto: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 12,
    color: Cores.fundo.card,
  },

  // ==================================================
  // SETA
  // ==================================================

  headerSetaContainer: {
    alignItems: 'center',
    marginTop: -1,
    marginBottom: 8,
  },

  headerSeta: {
    width: 79,
    height: 38,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    backgroundColor: Cores.fundo.seta,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerSetaTexto: {
    color: Cores.base.branco,
    fontSize: 20,
    lineHeight: 22,
  },

  // ==================================================
  // CONTEÚDO
  // ==================================================

  conteudo: {
    padding: 20,
    paddingBottom: 30,
  },

  secaoTitulo: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 25,
    color: Cores.destaque.limao,
    marginBottom: 10,
    marginTop: 4,
  },

  card: {
    borderRadius: 7,
    padding: 12,
    marginBottom: 10,
  },

  // ==================================================
  // PLANO-B
  // ==================================================

  planoBHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginHorizontal: 62,
  },

  planoBNav: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 20,
    color: Cores.destaque.limao,
    paddingHorizontal: 1,
  },

  planoBCorpo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 40,
  },

  gaugeLabel: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 25,
    color: Cores.roxo.claro,
    textAlign: 'center',
  },

  gaugeSublabel: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 18,
    color: Cores.texto.principal,
    textAlign: 'center',
  },

  categoriaLista: {
    flex: 1,
    gap: 4,
  },

  categoriaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  categoriaIcone: {
  width: 24,
  height: 24,
  resizeMode: 'contain',
  marginRight: 10,
},

  categoriaNome: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 16,
    color: Cores.texto.principal,
  },

  categoriaValor: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 15,
    color: Cores.destaque.limao,
  },

  planejamentoIcone2: {
    width: 40,
    height: 40,
    borderRadius: 7,
    backgroundColor: Cores.overlay.medio,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ==================================================
  // MINI GRÁFICOS
  // ==================================================

  areaRow: {
    flexDirection: 'row',
    gap: 5,
    marginBottom: 5,
  },

  areaCard: {
    flex: 1,
    borderRadius: 7,
    overflow: 'hidden',
  },

  areaValor: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 20,
    color: Cores.roxo.claro,
    marginBottom: -1,
    paddingLeft: 8,
  },

  // ==================================================
  // PERFORMANCE
  // ==================================================

  performanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    marginBottom: 6,
  },

  performanceMes: {
    flex: 1,
    alignItems: 'center',
  },

  performanceTitulo: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 24,
    color: Cores.destaque.limao,
  },

  performanceSub: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 18,
    color: Cores.texto.principal,
    textAlign: 'center',
  },

  performanceData: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 15,
    color: Cores.destaque.limao,
    textAlign: 'center',
    marginTop: 2,
  },

  performanceGaugeContainertitulo: {
    alignItems: 'center',
    justifyContent: 'space-between',
  
  },

  performanceGaugeContainer: {
    alignItems: 'center',
    marginTop: 5,
    marginBottom: -6,
  },

  performanceGaugeValor: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 22,
    color: Cores.roxo.claro,
  },

  performanceGaugeLabel: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 15,
    color: Cores.texto.desabilitado,
  },

  performanceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 2,
  },

  performanceItem: {
    flex: 1,
    alignItems: 'center',
  },

  performanceValor: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 15,
    marginTop: 2,
  },

  // ==================================================
  // SUMÁRIO
  // ==================================================

  duploRow: {
  flexDirection: 'row',
  gap: 10,
  marginBottom: 12,
},

rotasRow: {
  flexDirection: 'column',
  gap: 12,
  marginBottom: 20,
},

duploCard: {
  flex: 1,
  borderRadius: 14,
  padding: 10,
},

  duploTitulo: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 18,
    color: Cores.destaque.limao,
    marginBottom: 4,
  },

  duploDescricao: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 15,
    color: Cores.texto.principal,
    marginBottom: 10,
  },

  sumarioBarraLinha: {
    marginBottom: 8,
  },

  sumarioBarraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },

  sumarioBarraLabel: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 14,
    color: Cores.base.branco,
  },

  sumarioBarraValor: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 14,
    color: Cores.destaque.limao,
  },

  sumarioBarra: {
    height: 5,
    borderRadius: 4,
    backgroundColor: Cores.overlay.medio,
    overflow: 'hidden',
  },

  sumarioBarraPreenchida: {
    height: '100%',
    borderRadius: 4,
  },

  // ==================================================
// ATIVIDADE
// ==================================================

atividadeHeader: {
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},

atividadeSeta: {
  color: Cores.roxo.claro,
  fontSize: 26,
  lineHeight: 26,
},

atividadeMes: {
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: 2,
},


  // ==================================================
  // HEATMAP
  // ==================================================

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

  heatmapLegenda: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 5,
  },

  legendaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },

  legendaTexto: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 10,
    color: Cores.texto.principal,
  },

  legendaPonto: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },

  // ==================================================
  // GRÁFICO FINAL
  // ==================================================

  graficoFinalCard: {
    borderRadius: 7,
    padding: 10,
    marginBottom: 25,
    overflow: 'hidden',
  },

  graficoFinalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 5,
  },

  graficoFinalTitulo: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 20,
    color: Cores.destaque.limao,
  },

  graficoFinalSubtitulo: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 15,
    color: Cores.texto.principal,
    marginTop: 2,
  },

  graficoFinalValor: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 12,
    color: Cores.roxo.claro,
  },
    // ==================================================
  // ROTAS
  // ==================================================

  rotasGaugeContainer: {
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },

  rotasGaugeValor: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },

  rotasCategorias: {
    gap: 5,
    marginTop: 2,
  },

  rotasCategoriaLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 27,
  },

  rotasIndicador: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },

  rotasCategoriaNome: {
    flex: 1,
    fontFamily: FONTS.quicksand.regular,
    fontSize: 12,
    color: Cores.destaque.limao,
  },

  rotasCategoriaValor: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 12,
    color: Cores.roxo.claro,
    marginLeft: 3,
  },

  rotasCategoriaPercentual: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 12,
    color: Cores.roxo.claro,
    width: 38,
    textAlign: 'right',
  },

  rotasTendencia: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 18,
    color: Cores.destaque.limao,
    width: 18,
    textAlign: 'right',
    marginLeft: 2,
  },

  rotasResumoTitulo: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 18,
    color: Cores.destaque.limao,
    marginTop: 8,
    marginBottom: 3,
  },

  rotasResumo: {
    gap: 0,
  },

  rotasResumoTexto: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 15,
    lineHeight: 18,
    color: Cores.roxo.claro,
  },

  rotasSobra: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 14,
    lineHeight: 18,
    color: Cores.roxo.claro,
    marginTop: 18,
  },

  rotasSobraTexto: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 14,
    lineHeight: 18,
    color: Cores.roxo.claro,
    marginTop: 2,
  },

})