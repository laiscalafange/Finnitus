import { StyleSheet } from "react-native";
import { Cores } from "../shared/constants/Cores";
import { FONTS } from "../shared/constants/Tipografia";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Cores.fundo.principal,
    paddingHorizontal: 24,
    paddingTop: 80,
  },

  titulo: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 32,
    color: Cores.base.branco,
    marginBottom: 24,
  },

  tituloDestaque: {
    fontFamily: FONTS.raleway.extrabold,
    color: Cores.destaque.limao,
  },

  subtitulo: {
    fontFamily: FONTS.raleway.regular,
    fontSize: 16,
    color: Cores.base.branco,
    lineHeight: 24,
    marginBottom: 40,
  },

  emailDestaque: {
    fontFamily: FONTS.raleway.medium,
    color: Cores.roxo.claro,
  },

  label: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 18,
    color: Cores.destaque.limao,
    marginBottom: 16,
  },

  rodape: {
    marginTop: "auto",
    marginBottom: 40,
    gap: 20,
  },

  reenviar: {
    fontFamily: FONTS.raleway.regular,
    textAlign: "center",
    color: Cores.roxo.claro,
    fontSize: 15,
  },
});