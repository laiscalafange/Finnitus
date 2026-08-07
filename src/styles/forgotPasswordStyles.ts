import { StyleSheet } from 'react-native';
import { Cores } from '../shared/constants/Cores';
import { FONTS } from '../shared/constants/Tipografia';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 23,
  },
  
  /*breadcrumb: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 13,
    color: Cores.texto.desabilitado,
    marginBottom: 24,
  },*/
  
  content: {
    flex: 1,
  },

  titulo: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 42,
    color: Cores.base.branco,
    marginBottom: 8,
  },
  
  tituloDestaque: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 42,
    color: Cores.destaque.limao,
    textDecorationColor: Cores.roxo.claro,
  },
  
  subtitulo: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 28,
    color: Cores.texto.principal,
    marginBottom: 32,
    lineHeight: 30,
  },
  iconeInput: {
  width: 35,
  height: 35,
  resizeMode: "contain",
  marginLeft: 12,
  marginRight: 12,
},
});