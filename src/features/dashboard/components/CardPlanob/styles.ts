import { StyleSheet } from 'react-native'
import { Cores } from '@/shared/constants/Cores'
import { FONTS } from '@/shared/constants/Tipografia'

export const styles = StyleSheet.create({
  container: { marginHorizontal: 20, marginBottom: 20 },
  tituloLinha: { marginBottom: 9 },
  titulo: { fontFamily: FONTS.raleway.extrabold, fontSize: 22, lineHeight: 26, color: Cores.destaque.limao },
  corpo: {
    minHeight: 154,
    borderRadius: 18,
    backgroundColor: Cores.fundo.card,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 12,
  },
  navegacao: { flexDirection: 'row', alignItems: 'center', marginBottom: 7, minHeight: 22 },
  navegacaoSeta: { fontFamily: FONTS.raleway.bold, fontSize: 20, color: Cores.texto.principal, lineHeight: 23 },
  navegacaoTexto: { fontFamily: FONTS.quicksand.bold, fontSize: 15, color: Cores.base.branco, marginHorizontal: 3 },
  statusLabel: { flex: 1, textAlign: 'right', fontFamily: FONTS.quicksand.bold, fontSize: 15, color: Cores.base.branco },
  linha: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  gauge: { width: 108, height: 108, marginRight: 12, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  gaugeSvg: { position: 'absolute', left: 0, top: 0, transform: [{ rotate: '-90deg' }] },
  gaugeTexto: { position: 'absolute', alignItems: 'center', width: 104 },
  gaugeValor: { fontFamily: FONTS.raleway.extrabold, fontSize: 15, lineHeight: 18, color: Cores.destaque.limao, textAlign: 'center' },
  gaugeLabel: { fontFamily: FONTS.quicksand.bold, fontSize: 10, color: Cores.texto.principal, marginTop: 1 },
  categorias: { flex: 1, gap: 7, minWidth: 0 },
  categoria: { flexDirection: 'row', alignItems: 'center', minHeight: 21 },
  categoriaIcone: {
    width: 24,
    height: 24,
    marginRight: 8,
    resizeMode: 'contain',
  },
  categoriaImagem: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  categoriaTextos: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', minWidth: 0 },
  categoriaNome: { fontFamily: FONTS.quicksand.regular, fontSize: 12, color: Cores.texto.principal, flexShrink: 1 },
  categoriaValor: { fontFamily: FONTS.quicksand.bold, fontSize: 12, color: Cores.base.branco, marginLeft: 5 },
})
