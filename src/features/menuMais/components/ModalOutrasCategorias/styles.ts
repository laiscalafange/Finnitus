
import { StyleSheet } from "react-native";

import { Cores } from "@/shared/constants/Cores";
import { FONTS } from "@/shared/constants/Tipografia";

export const styles = StyleSheet.create({
  card: {
    width: "94%",
    alignSelf: "center",
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(163, 87, 255, 0.25)",
    borderRadius: 22,
  },

  titulo: {
    fontSize: 21,
    marginBottom: 14,
  },

  lista: {
    maxHeight: 250,
    flexGrow: 0,
    marginBottom: 6,
  },

  linha: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(163, 87, 255, 0.35)",
    borderRadius: 13,
    backgroundColor: "rgba(13, 17, 18, 0.65)",
  },

  linhaMarcada: {
    borderColor: Cores.destaque.limao,
    backgroundColor: "rgba(183, 255, 0, 0.08)",
  },

  caixa: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "rgba(163, 87, 255, 0.65)",
    alignItems: "center",
    justifyContent: "center",
  },

  caixaMarcada: {
    borderColor: Cores.destaque.limao,
    backgroundColor: Cores.destaque.limao,
  },

  nome: {
    flex: 1,
    fontFamily: FONTS.quicksand.bold,
    fontSize: 14,
    color: "#C7A9F5",
  },

  nomeMarcado: {
    color: Cores.destaque.limao,
  },

  areaCriar: {
    marginTop: 8,
  },
});
