import { StyleSheet } from 'react-native'
import { Cores } from '@/shared/constants/Cores'
import { FONTS } from '@/shared/constants/Tipografia'

export const styles = StyleSheet.create({
  container: { marginHorizontal: 20, marginBottom: 20 },
  titulo: { fontFamily: FONTS.raleway.extrabold, fontSize: 22, lineHeight: 26, color: Cores.destaque.limao, marginBottom: 9 },
  card: { minHeight: 76, borderRadius: 17, backgroundColor: Cores.fundo.card, paddingHorizontal: 13, paddingVertical: 11, flexDirection: 'row', alignItems: 'center' },
  icone: { width: 46, height: 46, borderRadius: 18, backgroundColor: Cores.fundo.card, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  iconeImagem: { width: 49, height: 46, resizeMode: 'contain', opacity: 0.75 },
  textos: { flex: 1, minWidth: 0 },
  nome: { fontFamily: FONTS.quicksand.bold, fontSize: 17, lineHeight: 21, color: Cores.base.branco },
  valor: { fontFamily: FONTS.quicksand.regular, fontSize: 14, lineHeight: 17, color: Cores.texto.principal, marginTop: 3 },
  seta: { fontFamily: FONTS.raleway.bold, fontSize: 25, color: Cores.roxo.claro, marginLeft: 7 },
})
