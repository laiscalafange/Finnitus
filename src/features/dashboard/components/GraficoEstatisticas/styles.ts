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
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  pontoReceita: { backgroundColor: Cores.destaque.limao },
  pontoDespesa: { backgroundColor: Cores.estado.perigo },
  legendaTexto: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 11,
    lineHeight: 13,
    color: Cores.texto.principal,
  },
  abas: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 11,
    marginBottom: 9,
    padding: 3,
    borderRadius: 16,
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
    fontSize: 11,
    color: Cores.texto.principal,
  },
  abaTextoAtiva: {
    color: Cores.roxo.escuro,
  },
  grafico: {
    marginTop: 2,
    borderRadius: 16,
    backgroundColor: Cores.estado.desabilitado,
    paddingHorizontal: 2,
    paddingTop: 2,
    paddingBottom: 0,
  },
  dias: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    marginTop: 4,
  },
  dia: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 11,
    color: Cores.texto.principal,
  },
  vazio: {
    padding: 18,
  },
  vazioTitulo: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 15,
    color: Cores.base.branco,
  },
  vazioTexto: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 12,
    lineHeight: 18,
    color: Cores.texto.principal,
    marginTop: 6,
  },
})
