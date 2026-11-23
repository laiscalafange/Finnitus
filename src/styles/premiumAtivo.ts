import { StyleSheet } from "react-native";
import { Cores } from "@/shared/constants/Cores";
import { FONTS } from "@/shared/constants/Tipografia";

export const styles = StyleSheet.create({
  fundo: {
    flex: 1,
  },
  cabecalho: {
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  cabecalhoTexto: {
    flex: 1,
  },
  subtitulo: {
    color: Cores.destaque.limao,
    fontFamily: FONTS.quicksand.bold,
    fontSize: 13,
  },
  titulo: {
    color: Cores.base.branco,
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 24,
  },
  fechar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Cores.overlay.suave,
  },
  conteudo: {
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 20,
    gap: 12,
  },
  plano: {
    borderColor: Cores.overlay.forte,
    borderWidth: 1,
    gap: 12,
    marginBottom: 6,
  },
  identidade: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  emblema: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Cores.overlay.suave,
  },
  planoNome: {
    color: Cores.base.branco,
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 26,
  },
  preco: {
    color: Cores.texto.claro,
    fontFamily: FONTS.quicksand.bold,
    fontSize: 15,
  },
  status: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
  },
  statusTexto: {
    flexShrink: 1,
    color: Cores.destaque.limao,
    fontFamily: FONTS.quicksand.bold,
    fontSize: 15,
  },
  secao: {
    color: Cores.base.branco,
    fontFamily: FONTS.raleway.bold,
    fontSize: 19,
  },
  recurso: {
    padding: 14,
    gap: 4,
    borderRadius: 14,
    borderColor: Cores.overlay.suave,
    borderWidth: 1,
    backgroundColor: Cores.overlay.cardForte,
  },
  recursoNome: {
    color: Cores.base.branco,
    fontFamily: FONTS.raleway.bold,
    fontSize: 15,
  },
  descricao: {
    color: Cores.texto.claro,
    fontFamily: FONTS.quicksand.medium,
    fontSize: 14,
    lineHeight: 20,
  },
  link: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    minHeight: 44,
  },
  linkTexto: {
    flexShrink: 1,
    color: Cores.destaque.limao,
    fontFamily: FONTS.quicksand.bold,
    fontSize: 14,
  },
});
