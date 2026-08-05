import { StyleSheet } from "react-native";
import { Cores } from "../shared/constants/Cores";
import { FONTS } from "../shared/constants/Tipografia";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Cores.fundo.principal,
    justifyContent: 'space-between',
    padding: 23,
  },


  titulo: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 42,
    color: Cores.base.branco,
    marginBottom: 8,
  },

  subtitulo: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 24,
    color: Cores.texto.principal,
    marginBottom: 10,
    lineHeight: 30,
  },

  tituloDestaque: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 42,
    color: Cores.destaque.limao,
    textDecorationColor: Cores.roxo.claro,
  },

  sectionTitle: {
    color: Cores.destaque.limao,
    fontFamily: FONTS.raleway.bold,
    fontSize: 18,
    marginBottom: 10,
  },

  header: {
  marginTop: 20,
  marginBottom: 20,
},

lista: {
  flex: 1,
},

botao: {
  marginTop: 20,
  marginBottom: 10,
},
});