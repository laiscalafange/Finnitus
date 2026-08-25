import { StyleSheet } from 'react-native'
import { Cores } from '@/shared/constants/Cores'
import { FONTS } from '@/shared/constants/Tipografia'

export const styles = StyleSheet.create({
  container: { marginHorizontal: 20, marginBottom: 15 },
  tituloLinha: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  titulo: { fontFamily: FONTS.raleway.extrabold, fontSize: 16, color: Cores.destaque.limao },
  icone: { fontFamily: FONTS.raleway.bold, fontSize: 23, color: '#C6A8E8' },
  evento: {
    minHeight: 52,
    borderRadius: 14,
    backgroundColor: '#4A2480',
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ponto: { width: 7, height: 7, borderRadius: 4, backgroundColor: Cores.destaque.limao, marginRight: 8 },
  textos: { flex: 1 },
  label: { fontFamily: FONTS.quicksand.regular, fontSize: 9, color: '#C9B4E9' },
  nome: { fontFamily: FONTS.quicksand.bold, fontSize: 13, color: Cores.base.branco, marginTop: 1 },
  data: { fontFamily: FONTS.quicksand.bold, fontSize: 10, color: Cores.destaque.limao },
  vazio: { borderRadius: 14, backgroundColor: '#3B1E63', padding: 11 },
  vazioTitulo: { fontFamily: FONTS.quicksand.bold, fontSize: 12, color: Cores.base.branco },
  vazioTexto: { fontFamily: FONTS.quicksand.regular, fontSize: 9, lineHeight: 13, color: '#BDA7E1', marginTop: 3 },
})
