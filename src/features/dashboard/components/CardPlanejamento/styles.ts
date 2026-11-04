
import { StyleSheet } from 'react-native'
import { Cores } from '@/shared/constants/Cores'
import { FONTS } from '@/shared/constants/Tipografia'

export const styles = StyleSheet.create({
  meta: {
    minHeight: 84,
    borderRadius: 14,
    backgroundColor: 'rgba(72, 34, 135, 0.55)',
    borderWidth: 1,
    borderColor: 'rgba(163, 87, 255, 0.22)',
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
    backgroundColor: 'rgba(163, 87, 255, 0.20)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconeImagem: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    opacity: 0.85,
  },
  textos: {
    flex: 1,
    minWidth: 0,
  },
  label: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 12,
    lineHeight: 15,
    color: Cores.destaque.limao,
  },
  nome: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 18,
    lineHeight: 22,
    color: Cores.base.branco,
  },
  linhaProgresso: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  barra: {
    flex: 1,
  },
  percentual: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 13,
    color: Cores.texto.claro,
  },
  faltam: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 13,
    lineHeight: 17,
    color: Cores.texto.claro,
    marginTop: 4,
  },
  vazio: {
    borderRadius: 14,
    backgroundColor: 'rgba(72, 34, 135, 0.55)',
    borderWidth: 1,
    borderColor: 'rgba(163, 87, 255, 0.22)',
    padding: 14,
  },
  vazioTexto: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 13,
    lineHeight: 17,
    color: Cores.texto.claro,
  },
})
