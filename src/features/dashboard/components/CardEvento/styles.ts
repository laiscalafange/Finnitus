import { StyleSheet } from 'react-native'
import { Cores } from '@/shared/constants/Cores'
import { FONTS } from '@/shared/constants/Tipografia'

export const styles = StyleSheet.create({
  container: { marginHorizontal: 20, marginBottom: 19 },
  tituloLinha: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  titulo: { fontFamily: FONTS.raleway.extrabold, fontSize: 22, lineHeight: 26, color: Cores.destaque.limao },
  icone: { fontFamily: FONTS.raleway.bold, fontSize: 28, lineHeight: 30, color: Cores.roxo.claro },
  evento: {
    minHeight: 70,
    borderRadius: 18,
    backgroundColor: Cores.fundo.card,
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ponto: { width: 9, height: 9, borderRadius: 5, backgroundColor: Cores.destaque.limao, marginRight: 10 },
  textos: { flex: 1 },
  label: { fontFamily: FONTS.quicksand.regular, fontSize: 15, lineHeight: 15, color: Cores.texto.principal },
  nome: { fontFamily: FONTS.quicksand.bold, fontSize: 17, lineHeight: 21, color: Cores.base.branco, marginTop: 2 },
  data: { fontFamily: FONTS.quicksand.bold, fontSize: 15, color: Cores.destaque.limao },
  vazio: { borderRadius: 18, backgroundColor: Cores.fundo.card, padding: 14 },
  vazioTitulo: { fontFamily: FONTS.quicksand.bold, fontSize: 15, color: Cores.base.branco },
  vazioTexto: { fontFamily: FONTS.quicksand.regular, fontSize: 12, lineHeight: 17, color: Cores.texto.principal, marginTop: 4 },
})
