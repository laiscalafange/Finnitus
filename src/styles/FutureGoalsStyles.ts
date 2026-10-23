import { StyleSheet } from "react-native";
import { Cores } from "../shared/constants/Cores";
import { FONTS } from "../shared/constants/Tipografia";
import { RFValue } from "react-native-responsive-fontsize";

export const styles = StyleSheet.create({
 container: {
    flex: 1,
    zIndex: 1,
    padding: 24,
    paddingTop: 70,      // was position:"absolute" + top:70
    justifyContent: "space-between", // pushes button toward bottom
  },


  titulo: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: RFValue(34),
    color: Cores.base.branco,
    marginBottom: 8,
  },

  subtitulo: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: RFValue(19),
    color: Cores.texto.principal,
    marginBottom: 10,
    lineHeight: 26,
  },

  tituloDestaque: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: RFValue(34),
    color: Cores.destaque.limao,
    textDecorationColor: Cores.roxo.claro,
  },

  sectionTitle: {
  color: Cores.destaque.limao,
  fontFamily: FONTS.raleway.bold,
  fontSize: RFValue(18),
  marginBottom: 10,
},

  header: {
  marginTop: 5,
  marginBottom: 20,
},

lista: {
  flex: 1,
  minHeight: 0,
},

botao: {
  marginTop: 20,
  marginBottom: 10,
},
});