import { StyleSheet } from 'react-native';
import { Cores } from '../shared/constants/Cores';
import { FONTS } from '../shared/constants/Tipografia';
import { RFValue } from "react-native-responsive-fontsize";

export const styles = StyleSheet.create({
  // Área do texto: rola se a tela for pequena ou a fonte do celular for grande
  scroll: {
    flex: 1,
  },

  // paddingTop maior: deixa a seta de voltar livre no topo
  content: {
    paddingHorizontal: 24,
    paddingTop: 110,
    paddingBottom: 16,
  },

  // Botões fora da área do texto: nunca ficam cobertos
  conteiner: {
    width: "90%",
    alignSelf: "center",
    paddingTop: 8,
    paddingBottom: 30,
  },

  linha: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-end",
    gap: 8,
  },

  title: {
    fontFamily: FONTS.raleway.bold,
    fontSize: RFValue(40),
    color: Cores.base.branco,
    marginBottom: -10,
  },
  title2: {
    fontFamily: FONTS.raleway.bold,
    fontSize: RFValue(40),
    color: Cores.destaque.limao,
    marginBottom: -10,
  },

  subtitle: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: RFValue(22),
    color: Cores.base.branco,
    marginTop: 18,
    marginBottom: -2,
  },
});