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
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
    borderBottomLeftRadius: 70,
    borderBottomRightRadius: 70,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
   
  },

  headerAno: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 20,
    color: Cores.destaque.limao,
  },

  headerMes: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 25,
    color: Cores.destaque.limao,
    marginBottom: 5,
  },

  headerIcones: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 12,
},

  headerIcone: {
    width: 30,
    height: 30,
  },

  // ── SETA ────────────────────────────────────────────────
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
  },

  setaTexto: {
    color: Cores.base.branco,
    fontSize: 20,
    paddingLeft:1,
  },

  // ── CONTEÚDO ────────────────────────────────────────────
    conteudo: {
    padding: 20,
    paddingBottom: 120,
  },


  secaoTitulo: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 30,
    color: Cores.destaque.limao,
    marginBottom: 5,
    marginTop: 5,
  },

  card: {
    borderRadius: 7,
    padding: 13,
    marginBottom: 5,
  },

  // ── EVENTOS ─────────────────────────────────────────────
  eventoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },

  eventoTitulo: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 20,
    color: Cores.destaque.limao,
   
  },

  eventoData: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 20,
    color:Cores.texto.claro,
    fontStyle: 'italic',
  },

  eventoItem: {
    marginBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: Cores.overlay.suave,
    paddingBottom: 2,
  },

  eventoNome: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 15,
    color: Cores.destaque.limao,
   
  },

  eventoDescricao: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 15,
    color: Cores.texto.principal,
  },

  eventoHora: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 15,
    color: Cores.base.branco,
    textAlign: 'right',
  
  },

  // ── GASTOS ──────────────────────────────────────────────
  gastoCard: {
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  gastoIcone: {
  width: 50,
  height: 50,
},

  gastoIconeContainer: {
    width: 50,
    height: 50,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },

  gastoIconeTexto: {
    fontSize: 20,
  },

  gastoInfo: {
    flex: 1,
  },

  gastoNome: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 16,
    color: Cores.base.branco,
  },

  gastoHora: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 14,
    color: Cores.texto.principal,
    marginTop: 2,
  },

  gastoValor: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 15,
  },

  // ── GAUGE ───────────────────────────────────────────────
  gastosMesCorpo: {
  marginTop: 10,
  flexDirection: 'row',
  alignItems: 'center',
  gap:12,
},

  gaugeLabel: {
  fontFamily: FONTS.raleway.extrabold,
  fontSize: 20,
  color: Cores.roxo.claro,
  textAlign: 'center',
},

gaugeSublabel: {
  fontFamily: FONTS.quicksand.regular,
  fontSize: 17,
  color: Cores.texto.principal,
  textAlign: 'center',
},

  estatsList: {
  flex: 1,
  gap: 8,
  justifyContent: 'center',
},

  estatsItem: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  marginTop: 8,
},

  estatsLabel: {
  flex: 1,
  fontFamily: FONTS.quicksand.regular,
  fontSize: 17,
  color: Cores.roxo.claro,
  lineHeight: 16,
},
 estatsValor: {
  fontFamily: FONTS.raleway.extrabold,
  fontSize: 19,
  minWidth: 55,
  textAlign: 'right',
},

  legenda: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 14,
    marginTop: 10,
  },

  legendaItem: {
    flexDirection:'row',
    alignItems: 'flex-end',
    gap: 4,
  },

  legendaPonto: {
    width: 7,
    height: 7,
    borderRadius: 4,
    padding:2,
    marginBottom: 2,
  },

  legendaTexto: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 14,
    color: Cores.texto.principal,
    textAlign: 'left',
    marginTop:10,
  },
})