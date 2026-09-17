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
    fontSize: 25,
    lineHeight: 26,
    color: Cores.destaque.limao,
    marginBottom: 9,
  },
  card: {
    minHeight: 188,
    borderRadius: 18,
    backgroundColor: Cores.fundo.card,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  medidor: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 34,
  },
  medidorInterno: {
    position: 'absolute',
    width:90,
    height:90,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Cores.texto.contraste,
     borderRadius: 41,
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
    fontSize: 14,
    lineHeight: 16,
    color: Cores.texto.principal,
    marginTop: 7,
  },
})