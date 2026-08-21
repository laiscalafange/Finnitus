import { StyleSheet } from 'react-native';
import { Cores } from '../shared/constants/Cores';
import { FONTS } from '../shared/constants/Tipografia';
import { RFValue } from "react-native-responsive-fontsize";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  zIndex: 1,
  padding: 24,
  position: "absolute",
  paddingTop: 70,
  justifyContent: "space-between",
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
    fontSize: RFValue(40),
    color: Cores.base.branco,
    marginBottom: 8,
  },

  conteiner: {
  position: "absolute",
  bottom: 50,
  width: "90%",
  alignSelf: "center",
},
  
  tituloDestaque: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: RFValue(42),
    color: Cores.destaque.limao,
    textDecorationColor: Cores.roxo.claro,
  },
  
  subtitulo: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: RFValue(23),
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