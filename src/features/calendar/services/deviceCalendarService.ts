import { Platform } from "react-native";
import * as Calendar from "expo-calendar";

export async function listarCalendariosDoDispositivo() {
  // O expo-calendar é uma funcionalidade nativa.
  // Não tentamos acessar o calendário pelo navegador.
  if (Platform.OS === "web") {
    console.log(
      "Calendário do dispositivo não disponível na versão web."
    );

    return [];
  }

  try {
    const permissao =
      await Calendar.requestCalendarPermissions();

    console.log(
      "Permissão do calendário:",
      permissao.status
    );

    if (permissao.status !== "granted") {
      console.log(
        "Usuário não permitiu acesso ao calendário."
      );

      return [];
    }

    const calendarios =
      await Calendar.getCalendars(
        Calendar.EntityTypes.EVENT
      );

    console.log(
      "Calendários encontrados:",
      calendarios
    );

    return calendarios;
  } catch (error) {
    console.error(
      "Erro ao acessar calendário do dispositivo:",
      error
    );

    return [];
  }
}