import { StyleSheet } from 'react-native';
import { Cores } from '../shared/constants/Cores';
import { FONTS } from '../shared/constants/Tipografia';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Cores.fundo.principal,
    justifyContent: 'space-between',
    padding: 24,
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
    width: 96,
    height: 96,
    resizeMode: 'contain',
    marginBottom: 24,
  },
  titulo: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 28,
    color: Cores.base.branco,
    marginBottom: 8,
    textAlign: 'center',
  },
  tituloDestaque: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 28,
    color: Cores.destaque.limao,
  },
  subtitulo: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 15,
    color: Cores.texto.principal,
    marginBottom: 32,
    lineHeight: 20,
    textAlign: 'center',
  },
  iconeInput: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
});