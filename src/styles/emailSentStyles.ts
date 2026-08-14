import { StyleSheet } from 'react-native';
import { Cores } from '../shared/constants/Cores';
import { FONTS } from '../shared/constants/Tipografia';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 23,
  },
  breadcrumb: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 13,
    color: Cores.texto.desabilitado,
    marginBottom: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icone: {
    width: 130,
    height: 130,
    resizeMode: 'contain',
    marginBottom: 2,
  },
  titulo: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 40,
    color: Cores.base.branco,
    marginBottom: 8,
    textAlign: 'center',
  },
  tituloDestaque: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 40,
    color: Cores.destaque.limao,
  },
  subtitulo: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 25,
    color: Cores.texto.principal,
    marginBottom: 32,
    lineHeight: 25,
    textAlign: 'center',
  },
  iconeInput: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
});