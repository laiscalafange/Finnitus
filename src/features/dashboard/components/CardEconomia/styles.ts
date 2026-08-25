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
    fontSize: 22,
    lineHeight: 26,
    color: Cores.destaque.limao,
    marginBottom: 10,
  },
  card: {
    minHeight: 145,
    borderRadius: 22,
    backgroundColor: Cores.fundo.card,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  medidor: {
    width: 108,
    height: 108,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginRight: 16,
  },
  medidorInterno: {
    width: 78,
    height: 78,
    borderRadius: 39,
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
    fontSize: 18,
    lineHeight: 22,
    color: Cores.destaque.limao,
  },
  destaqueAlerta: {
    color: Cores.estado.perigo,
  },
  descricao: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 11,
    lineHeight: 17,
    color: Cores.texto.principal,
    marginTop: 7,
  },
})
