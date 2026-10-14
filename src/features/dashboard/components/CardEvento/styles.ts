import { StyleSheet } from 'react-native'
import { Cores } from '@/shared/constants/Cores'
import { FONTS } from '@/shared/constants/Tipografia'

export const styles = StyleSheet.create({
  evento: {
    minHeight: 70,
    borderRadius: 14,
    backgroundColor: Cores.overlay.suave,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bolha: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Cores.fundo.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textos: { flex: 1, minWidth: 0 },
  label: { fontFamily: FONTS.quicksand.bold, fontSize: 12, lineHeight: 15, color: Cores.destaque.limao },
  nome: { fontFamily: FONTS.quicksand.bold, fontSize: 18, lineHeight: 22, color: Cores.base.branco },
  data: { fontFamily: FONTS.quicksand.regular, fontSize: 14, lineHeight: 18, color: Cores.texto.principal },
  vazio: { borderRadius: 14, backgroundColor: Cores.overlay.suave, padding: 14 },
  vazioTitulo: { fontFamily: FONTS.quicksand.bold, fontSize: 15, color: Cores.base.branco },
  vazioTexto: { fontFamily: FONTS.quicksand.regular, fontSize: 12, lineHeight: 17, color: Cores.texto.principal, marginTop: 4 },
})