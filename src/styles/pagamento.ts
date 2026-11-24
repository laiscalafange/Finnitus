import { StyleSheet } from "react-native";
import { Cores } from "@/shared/constants/Cores";
import { FONTS } from "@/shared/constants/Tipografia";

export const FUNDO_PAGAMENTO = ["#160B24", "#08070A", "#160B24"] as const;

export const styles = StyleSheet.create({
  fundo: {
    flex: 1,
  },
  conteudo: {
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
    padding: 20,
    gap: 14,
  },
  card: {
    borderWidth: 1,
    borderColor: Cores.overlay.forte,
    gap: 8,
  },
  titulo: {
    color: Cores.base.branco,
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 28,
  },
  preco: {
    color: Cores.destaque.limao,
    fontFamily: FONTS.quicksand.bold,
    fontSize: 20,
  },
  texto: {
    color: Cores.texto.claro,
    fontFamily: FONTS.quicksand.medium,
    fontSize: 15,
    lineHeight: 22,
  },
  secao: {
    color: Cores.base.branco,
    fontFamily: FONTS.raleway.bold,
    fontSize: 18,
  },
  metodos: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  metodo: {
    flexGrow: 1,
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Cores.overlay.forte,
    backgroundColor: Cores.overlay.cardForte,
  },
  metodoAtivo: {
    borderColor: Cores.destaque.limao,
  },
  metodoTexto: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 16,
  },
  confirmacao: {
    flexGrow: 1,
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 18,
  },
  emblema: {
    width: 84,
    height: 84,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 42,
    borderWidth: 1,
    borderColor: Cores.destaque.limao,
    backgroundColor: Cores.overlay.cardForte,
  },
  textoCentralizado: {
    textAlign: "center",
  },
});
