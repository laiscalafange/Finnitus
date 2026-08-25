import { StyleSheet } from 'react-native'
import { Cores } from '@/shared/constants/Cores'
import { FONTS } from '@/shared/constants/Tipografia'

export const styles = StyleSheet.create({
  container: { marginHorizontal: 20, marginBottom: 16 },
  tituloLinha: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 },
  titulo: { fontFamily: FONTS.raleway.extrabold, fontSize: 16, color: Cores.destaque.limao },
  corpo: { minHeight: 142, borderRadius: 18, backgroundColor: '#3B1E63', paddingHorizontal: 12, paddingTop: 11, paddingBottom: 12 },
  navegacao: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, minHeight: 20 },
  navegacaoSeta: { fontFamily: FONTS.raleway.bold, fontSize: 15, color: '#C4AFE4', lineHeight: 18 },
  navegacaoTexto: { fontFamily: FONTS.quicksand.bold, fontSize: 12, color: Cores.base.branco, marginHorizontal: 3 },
  statusLabel: { flex: 1, textAlign: 'right', fontFamily: FONTS.quicksand.bold, fontSize: 12, color: Cores.base.branco },
  linha: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  gauge: { width: 92, height: 92, marginRight: 12, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  gaugeTexto: { position: 'absolute', alignItems: 'center', width: 84 },
  gaugeValor: { fontFamily: FONTS.raleway.extrabold, fontSize: 12, color: Cores.destaque.limao, textAlign: 'center' },
  gaugeLabel: { fontFamily: FONTS.quicksand.bold, fontSize: 8, color: '#A88ACF', marginTop: 1 },
  categorias: { flex: 1, gap: 6, minWidth: 0 },
  categoria: { flexDirection: 'row', alignItems: 'center', minHeight: 15 },
  categoriaIcone: { width: 14, height: 14, borderRadius: 4, marginRight: 7, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  categoriaImagem: { width: 10, height: 10, resizeMode: 'contain', tintColor: '#FFFFFF' },
  categoriaTextos: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', minWidth: 0 },
  categoriaNome: { fontFamily: FONTS.quicksand.regular, fontSize: 9, color: '#D6C4ED', flexShrink: 1 },
  categoriaValor: { fontFamily: FONTS.quicksand.bold, fontSize: 9, color: '#FFFFFF', marginLeft: 5 },
})
