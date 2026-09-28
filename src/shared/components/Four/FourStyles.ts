import { StyleSheet } from "react-native";
import { Cores } from "../../constants/Cores";

export const styles = StyleSheet.create({
  linha: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignSelf: "center",
  width: "100%",
  gap: 12,
  marginTop: 4,
  marginBottom: 24,
},

caixa: {
  flex: 1,
  minWidth: 0,
  height: 130,
  paddingVertical: 0,
  paddingHorizontal: 0,
  borderWidth: 1.5,
  borderColor: Cores.roxo.principal,
  borderRadius: 12,
  textAlign: "center",
  textAlignVertical: "center",
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