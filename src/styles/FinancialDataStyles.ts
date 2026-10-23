import { StyleSheet } from 'react-native';
import { Cores } from '../shared/constants/Cores';
import { FONTS } from '../shared/constants/Tipografia';
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
    flex: 1,
  },

  titulo: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: RFValue(34),
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
    fontSize: RFValue(34),
    color: Cores.destaque.limao,
    textDecorationColor: Cores.roxo.claro,
  },
  
  subtitulo: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: RFValue(19),
    color: Cores.texto.principal,
    marginBottom: 24,
    lineHeight: 26,
  },
  // Rótulo de grupo (ex.: "Sua renda"), igual ao rótulo dos campos
  rotulo: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 16,
    color: Cores.destaque.limao,
    marginBottom: 8,
  },

  // Texto de apoio curto abaixo do alternador (ex.: sem renda)
  aviso: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 14,
    lineHeight: 20,
    color: Cores.texto.claro,
    marginBottom: 16,
  },

  // Card "Quanto dinheiro você recebe em média?" (tela sem renda)
  cardRenda: {
    padding: 16,
    paddingBottom: 6,
    marginBottom: 16,
  },

  cardTitulo: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 17,
    color: Cores.destaque.limao,
    marginBottom: 4,
  },

  cardAjuda: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 13,
    lineHeight: 18,
    color: Cores.texto.claro,
    marginBottom: 14,
  },

  iconeInput: {
  width: 28,
  height: 28,
  resizeMode: "contain",
  marginLeft: 8,
  marginRight: 8,
},
});