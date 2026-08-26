import { StyleSheet } from 'react-native'
import { Cores } from '@/shared/constants/Cores'
import { FONTS } from '@/shared/constants/Tipografia'

export const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  titulo: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 21,
    lineHeight: 26,
    color: Cores.destaque.limao,
    marginBottom: 9,
  },
  card: {
    minHeight: 188,
    borderRadius: 18,
    backgroundColor: Cores.fundo.card,
    paddingHorizontal: 16,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  medidor: {
    width: 118,
    height: 118,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginRight: 14,
  },
  medidorInterno: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Cores.estado.desabilitado,
  },
  percentual: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 22,
    color: Cores.destaque.limao,
  },
  textos: {
    flex: 1,
  },
  destaque: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 20,
    lineHeight: 24,
    color: Cores.destaque.limao,
  },
  destaqueAlerta: {
    color: Cores.destaque.limao,
  },
  descricao: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 11,
    lineHeight: 16,
    color: Cores.texto.principal,
    marginTop: 7,
  },
})
