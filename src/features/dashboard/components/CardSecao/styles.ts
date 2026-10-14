import { StyleSheet } from 'react-native'
import { Cores } from '@/shared/constants/Cores'
import { FONTS } from '@/shared/constants/Tipografia'

// Mesmo padrão das outras telas (Dashboard, Plano B, Metas): título em verde
// fora do card e card roxo liso (Cores.fundo.card)
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

  // Card com várias linhas (Despesas fixas, Atenção)
  lista: {
    borderRadius: 18,
    backgroundColor: Cores.fundo.card,
    overflow: 'hidden',
  },
  divisor: {
    height: 1,
    backgroundColor: Cores.overlay.suave,
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
  // Faixa verde no começo da linha (usada nos avisos)
  linhaDestaque: {
    borderLeftWidth: 4,
    borderLeftColor: Cores.destaque.limao,
  },
  bolhaLinha: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Cores.fundo.cardAlt,
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
    color: Cores.texto.principal,
    marginTop: 2,
  },

  // Botão arredondado ("Ver evento", "Ver meta")
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