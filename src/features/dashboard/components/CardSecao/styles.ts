
import { StyleSheet } from 'react-native'
import { Cores } from '@/shared/constants/Cores'
import { FONTS } from '@/shared/constants/Tipografia'

export const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 19,
  },
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 9,
  },
  titulo: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 22,
    lineHeight: 26,
    color: Cores.destaque.limao,
    flexShrink: 1,
  },
  verTodos: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  verTodosTexto: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 14,
    color: Cores.roxo.claro,
  },
  lista: {
    borderRadius: 18,
    backgroundColor: 'rgba(72, 34, 135, 0.55)',
    borderWidth: 1,
    borderColor: 'rgba(163, 87, 255, 0.22)',
    overflow: 'hidden',
  },
  divisor: {
    height: 1,
    backgroundColor: 'rgba(163, 87, 255, 0.18)',
    marginHorizontal: 14,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 68,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  linhaDestaque: {
    borderLeftWidth: 4,
    borderLeftColor: Cores.destaque.limao,
  },
  bolhaLinha: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(163, 87, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textos: {
    flex: 1,
    minWidth: 0,
  },
  linhaTitulo: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 17,
    lineHeight: 21,
    color: Cores.base.branco,
  },
  linhaSubtitulo: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 14,
    lineHeight: 17,
    color: Cores.texto.claro,
    marginTop: 2,
  },
  pilula: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: 8,
    paddingLeft: 14,
    paddingRight: 10,
    borderRadius: 18,
    backgroundColor: Cores.fundo.destaque,
  },
  pilulaTexto: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 13,
    color: Cores.base.branco,
  },
})
