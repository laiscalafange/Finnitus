import { StyleSheet } from 'react-native';
import { Cores } from '../shared/constants/Cores';
import { FONTS } from '../shared/constants/Tipografia';
import { RFValue } from 'react-native-responsive-fontsize';

export const styles = StyleSheet.create({
  // Área do texto: rola se a tela for pequena ou a fonte do celular for grande
  scroll: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 16,
  },

  // Botões fora da área do texto: nunca ficam cobertos
  conteiner: {
    width: "90%",
    alignSelf: "center",
    paddingTop: 8,
    paddingBottom: 30,
  },

  // flexWrap: se o título não couber na linha, a palavra desce em vez de cortar
  linha: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-end",
    gap: 8,
  },

  title: {
    fontFamily: FONTS.raleway.bold,
    fontSize: RFValue(34),
    color: Cores.base.branco,
    marginBottom: -8,
  },
  title2: {
    fontFamily: FONTS.raleway.bold,
    fontSize: RFValue(34),
    color: Cores.destaque.limao,
    marginBottom: -8,
  },

  // flexShrink: título de item longo quebra em 2 linhas em vez de estourar
  stitulo: {
    flexShrink: 1,
    fontFamily: FONTS.raleway.bold,
    fontSize: RFValue(23),
    color: Cores.destaque.limao,
    marginBottom: -8,
  },

  linhaTexto: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "flex-start",
  },

  iconeInput: {
    width: 30,
    height: 30,
    resizeMode: "contain",
    marginRight: 6,
    top: 6,
  },

  subtitle: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: RFValue(19),
    color: Cores.base.branco,
    marginTop: 15,
    marginBottom: 15,
  },
});