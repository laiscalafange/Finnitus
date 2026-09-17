import { StyleSheet } from 'react-native'
import { Cores } from '@/shared/constants/Cores'
import { FONTS } from '@/shared/constants/Tipografia'

export const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 14,
    borderRadius: 18,
    backgroundColor: Cores.fundo.card,
  },
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titulo: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 22,
    lineHeight: 26,
    color: Cores.destaque.limao,
  },
  legenda: {
    alignItems: 'flex-end',
    gap: 4,
    paddingTop: 1,
    flexShrink: 1,
  },
  legendaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ponto: {
    width: 10,
    height: 10,
    borderRadius: 40,
    marginRight: 6,
  },
  pontoReceita: { backgroundColor: Cores.destaque.limao },
  pontoDespesa: { backgroundColor: Cores.estado.perigo },
  legendaTexto: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 14,
    lineHeight: 16,
    color: Cores.texto.principal,
  },
  abas: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 11,
    marginBottom: 9,
    padding: 3,
    borderRadius: 26,
    backgroundColor: Cores.estado.desabilitado,
  },
  aba: {
    minWidth: 65,
    paddingHorizontal: 13,
    paddingVertical: 5,
    borderRadius: 13,
    alignItems: 'center',
  },
  abaAtiva: {
    backgroundColor: Cores.destaque.limao,
  },
  abaTexto: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 14,
    color: Cores.texto.principal,
  },
  abaTextoAtiva: {
    color: Cores.roxo.escuro,
  },
  grafico: {
    marginTop: 2,
    borderRadius: 16,
    backgroundColor: Cores.fundo.card,
    paddingHorizontal: 2,
    paddingTop: 2,
 
  },
  dias: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    marginTop: 4,
  },
  dia: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 14,
    color: Cores.texto.principal,
  },
  vazio: {
    padding: 18,
  },
  vazioTitulo: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 20,
    color: Cores.base.branco,
  },
  vazioTexto: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 15,
    lineHeight: 18,
    color: Cores.texto.principal,
    marginTop: 6,
  },
})
