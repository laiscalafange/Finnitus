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

  content: {
    gap: 16,
  },
   titulo: {
  fontFamily: FONTS.raleway.extrabold,
  fontSize: RFValue(40), // já sugerido antes
  color: Cores.base.branco,
  marginTop: -20, // reduz a distância só entre dots e título (ajuste o valor)
  marginBottom: 8,
},

  subtitulo: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: RFValue(24),
    color: Cores.texto.principal,
    marginBottom: 10,
    lineHeight: 30,
  },

  tituloDestaque: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: RFValue(42),
    color: Cores.destaque.limao,
    textDecorationColor: Cores.roxo.claro,
  },

   cards: {
    gap: 24,
  },
  iconeInput: {
  width: 35,
  height: 35,
  resizeMode: "contain",
  marginLeft: 12,
  marginRight: 12,
},
});
