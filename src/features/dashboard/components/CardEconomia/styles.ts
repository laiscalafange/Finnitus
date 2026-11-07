
import { StyleSheet } from 'react-native'
import { Cores } from '@/shared/constants/Cores'
import { FONTS } from '@/shared/constants/Tipografia'

export const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 10,
  },
  titulo: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 22,
    lineHeight: 26,
    color: Cores.destaque.limao,
    marginBottom: 9,
  },
  card: {
    minHeight: 140,
    borderRadius: 18,
    backgroundColor: 'rgba(72, 34, 135, 0.55)',
    borderWidth: 1,
    borderColor: 'rgba(163, 87, 255, 0.22)',
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  medidor: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  medidorInterno: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentual: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 22,
    color: Cores.destaque.limao,
  },
  textos: {
    flex: 1,
    minWidth: 0,
  },
  rotulo: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 15,
    color: Cores.texto.claro,
  },
  valorLinha: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    flexWrap: 'wrap',
  },
  valor: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 26,
    lineHeight: 32,
    color: Cores.destaque.limao,
  },
  valorSufixo: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 14,
    color: Cores.texto.claro,
  },
  mensagem: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 14,
    lineHeight: 17,
    color: Cores.texto.claro,
    marginTop: 5,
  },
})
