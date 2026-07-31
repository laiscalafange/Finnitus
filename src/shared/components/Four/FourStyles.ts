import { StyleSheet } from "react-native";
import { Cores } from "../../constants/Cores";

export const styles = StyleSheet.create({
  linha: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  caixa: {
    flex: 1,
    height: 130,
    borderWidth: 1.5,
    borderColor: Cores.roxo.principal,
    borderRadius: 12,
    textAlign: "center",
    fontSize: 28,
    fontWeight: "600",
    color: Cores.base.branco,
  },
  caixaFocada: {
    borderColor: Cores.destaque.limao,
    borderWidth: 2,
  },
  caixaErro: {
    borderColor: Cores.estado.erro,
  },
});