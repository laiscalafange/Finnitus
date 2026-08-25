import { StyleSheet } from 'react-native'
import { Cores } from '@/shared/constants/Cores'
import { FONTS } from '@/shared/constants/Tipografia'

export const styles = StyleSheet.create({
  container: { marginHorizontal: 20, marginBottom: 16 },
  titulo: { fontFamily: FONTS.raleway.extrabold, fontSize: 16, color: Cores.destaque.limao, marginBottom: 7 },
  card: { minHeight: 58, borderRadius: 18, backgroundColor: '#3B1E63', paddingHorizontal: 10, paddingVertical: 9, flexDirection: 'row', alignItems: 'center' },
  icone: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#4A2480', alignItems: 'center', justifyContent: 'center', marginRight: 9 },
  iconeImagem: { width: 24, height: 24, resizeMode: 'contain' },
  textos: { flex: 1, minWidth: 0 },
  nome: { fontFamily: FONTS.quicksand.bold, fontSize: 13, color: Cores.base.branco },
  valor: { fontFamily: FONTS.quicksand.regular, fontSize: 9.5, color: '#BDA7E1', marginTop: 3 },
  seta: { fontFamily: FONTS.raleway.bold, fontSize: 25, color: '#A57CD6', marginLeft: 5 },
})
