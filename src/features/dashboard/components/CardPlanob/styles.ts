import { StyleSheet } from 'react-native'
import { Cores } from '@/shared/constants/Cores'
import { FONTS } from '@/shared/constants/Tipografia'

export const styles = StyleSheet.create({
  container: { marginHorizontal: 20, marginBottom: 20 },
  tituloLinha: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9 },
  titulo: { fontFamily: FONTS.raleway.extrabold, fontSize: 22, lineHeight: 26, color: Cores.destaque.limao },
  corpo: { minHeight: 182, borderRadius: 22, backgroundColor: Cores.fundo.card, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 15 },
  navegacao: { flexDirection: 'row', alignItems: 'center', marginBottom: 14, minHeight: 24 },
  navegacaoSeta: { fontFamily: FONTS.raleway.bold, fontSize: 20, color: Cores.texto.principal, lineHeight: 24 },
  navegacaoTexto: { fontFamily: FONTS.quicksand.bold, fontSize: 16, color: Cores.base.branco, marginHorizontal: 4 },
  statusLabel: { flex: 1, textAlign: 'right', fontFamily: FONTS.quicksand.bold, fontSize: 16, color: Cores.base.branco },
  linha: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  gauge: { width: 116, height: 116, marginRight: 15, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  gaugeTexto: { position: 'absolute', alignItems: 'center', width: 108 },
  gaugeValor: { fontFamily: FONTS.raleway.extrabold, fontSize: 15, lineHeight: 18, color: Cores.destaque.limao, textAlign: 'center' },
  gaugeLabel: { fontFamily: FONTS.quicksand.bold, fontSize: 11, color: Cores.texto.principal, marginTop: 2 },
  categorias: { flex: 1, gap: 9, minWidth: 0 },
  categoria: { flexDirection: 'row', alignItems: 'center', minHeight: 22 },
  categoriaIcone: { width: 22, height: 22, borderRadius: 6, marginRight: 8, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  categoriaImagem: { width: 14, height: 14, resizeMode: 'contain', tintColor: Cores.base.branco },
  categoriaTextos: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', minWidth: 0 },
  categoriaNome: { fontFamily: FONTS.quicksand.regular, fontSize: 13, color: Cores.texto.principal, flexShrink: 1 },
  categoriaValor: { fontFamily: FONTS.quicksand.bold, fontSize: 13, color: Cores.base.branco, marginLeft: 6 },
})
