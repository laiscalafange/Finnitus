import { StyleSheet } from 'react-native'
import { Cores } from '../shared/constants/Cores'
import { FONTS } from '../shared/constants/Tipografia'

export const styles = StyleSheet.create({

  // ── CONTAINER PRINCIPAL ──────────────────────────────────
  scroll: {
    flex: 1,
    backgroundColor:'transparent',
  },

  // ── HEADER ───────────────────────────────────────────────

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
    color:Cores.destaque.limao,
    marginTop: -1,
  },

  headerIcones: {
    flexDirection: 'row',
    gap: 18,
    paddingTop: 1,
  },

  headerIcone: {
    fontSize: 23,
  },

  // ── TOGGLE ───────────────────────────────────────────────
  toggle: {
    flexDirection: 'row',
    backgroundColor: '#ffffff20',
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
    color: '#B79AE7',
  },

  pillTextoAtivo: {
    fontFamily: FONTS.quicksand.bold,
    color: '#3B176B',
  },

  // ── WEEK STRIP ───────────────────────────────────────────
  weekStrip: {
    flexDirection: 'row',
    gap: 7,
    marginHorizontal: -3,
  },

  diaContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop:6,
    paddingVertical: 13,
    borderRadius: 40,
    
    backgroundColor: '#53269D',
    minHeight: 100,
  },

  diaContainerAtivo: {
    backgroundColor: '#3A1D6C',

  },

  diaLetra: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 15,
    color: '#D8CDF7',
    marginBottom: 5,
  },

  diaNumero: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 18,
    color: '#B18AEF',
    marginBottom: 7,
  },

  diaPonto: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ffffff35',
  },

  diaPontoAtivo: {
    backgroundColor: Cores.destaque.limao,
  },

  // ── SETA ─────────────────────────────────────────────────
 
  
 setaContainer: {
    alignItems: 'center',
    marginTop: -1,
    marginBottom: 8,
  },

  setaCirculo: {
    width: 105,
    height: 55,
     borderBottomLeftRadius: 70,
      borderBottomRightRadius: 70,
     backgroundColor: '#7E3BED',
    justifyContent: 'center',
    alignItems: 'center',
  },

  setaTexto: {
    color: '#553292',
    fontSize: 35,
    paddingLeft:2,
  },
  // ── CONTEÚDO ─────────────────────────────────────────────
  conteudo: {
    paddingHorizontal: 24,
    paddingBottom: 45,
  },

  secaoTitulo: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 24,
    color: Cores.destaque.limao,
    marginBottom: 12,
    marginTop: 5,
  },

  // ── CARD BASE ────────────────────────────────────────────
  card: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },

  // ── ESTATÍSTICAS ─────────────────────────────────────────
  cardTitulo: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 20,
    color: Cores.destaque.limao,
  },

  legendaRow: {
    flexDirection: 'column',
    gap: 2,
    alignItems: 'flex-end',
    marginTop: -1,
    padding:10,
  },

  legendaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  legendaPonto: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  legendaTexto: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 10,
    color: '#BFA6E8',
  },

  // ── SUMÁRIO + ATIVIDADE ─────────────────────────────────
  duploRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 13,
  },

  duploCard: {
    flex: 1,
    borderRadius: 18,
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
    color: '#BDA7E1',
    marginBottom: 11,
  },

  // ── SUMÁRIO ──────────────────────────────────────────────
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
    fontSize: 13,
    color: '#FFFFFF',
  },

  sumarioValor: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 15,
    color:Cores.destaque.limao,
  },

  sumarioBarra: {
    height: 5,
    borderRadius: 3,
    backgroundColor: '#ffffff18',
    overflow: 'hidden',
  },

  sumarioBarraPreenchida: {
    height: '100%',
    borderRadius: 3,
  },

  // ── HEATMAP ──────────────────────────────────────────────
  heatmapGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 11,
    marginBottom: 7,
  },

  heatmapBolinha: {
    width: 15,
    height: 15,
    borderRadius: 90,
  },

  heatmapLegenda: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 5,
  },

  // ── PLANEJAMENTOS ────────────────────────────────────────
  planejamentoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 9,
  },

  planejamentoIcone: {
    width: 48,
    height: 48,
    borderRadius: 90,
    backgroundColor: '#ffffff16',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth:1,
    borderColor:Cores.roxo.claro
  },
  planejamentoIcone2: {
    width: 40,
    height: 40,
    borderRadius: 7,
    backgroundColor: '#ffffff16',
    justifyContent: 'center',
    alignItems: 'center', 
  },

  planejamentoNome: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 18,
    color: Cores.destaque.limao,
  },

  planejamentoFaltam: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 14,
    color: '#C1A9E5',
    marginTop: 1,
  },

  planejamentoValor: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 14,
    color:'#a063fb',
    marginTop: -30,
  },

  barraFundo: {
    height: 10,
    borderRadius: 8,
    backgroundColor: '#ffffff20',
    overflow: 'hidden',
    marginTop: 5,
  },

  barraPreenchida: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: Cores.roxo.claro,
  },

  // ── GASTOS DA SEMANA ─────────────────────────────────────
  gastosCorpo: {
  flexDirection: 'row',
  alignItems: 'flex-end',
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
  flex: 2,
  gap: 8,
  alignItems: 'flex-start',
},

gastosItem: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 5,
  marginTop: 7,
  paddingLeft: 55,
},

gastosItemLabel: {
  fontFamily: FONTS.quicksand.regular,
  fontSize: 15,
  color: Cores.roxo.claro,

},

gastosItemValor: {
  fontFamily: FONTS.raleway.extrabold,
  fontSize: 15,
},

gastosLegendaRow: {
  flexDirection: 'row',
  justifyContent: 'flex-end',
  gap: 9,
  marginTop: 10,
},


  // ── PLANO B ──────────────────────────────────────────────
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