import { Platform } from "react-native";
import * as Calendar from "expo-calendar";

export async function listarCalendariosDoDispositivo() {
  if (Platform.OS === "web") {
    console.log(
      "WEB: simulando calendários do dispositivo"
    );

    return [
      {
        id: "web-google",
        title: "Google Agenda",
        source: {
          name: "Google",
          type: "web",
        },
        color: "#4285F4",
      },
    ];
  }

  try {
    const permissao =
      await Calendar.requestCalendarPermissions();

    console.log(
      "Permissão do calendário:",
      permissao.status
    );

    if (permissao.status !== "granted") {
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
      "Erro ao acessar calendário:",
      error
    );

    return [];
  }
}
export async function listarEventosDoDispositivo(
  inicio: string,
  fim: string
): Promise<EventoDispositivo[]> {
  if (Platform.OS === "web") {
    console.log(
      "WEB: simulando eventos do calendário do dispositivo"
    );

    const eventosMock: EventoDispositivo[] = [
      {
        id: "web-evento-1",
        titulo: "Consulta médica",
        dataInicio: "2026-10-12T09:00:00",
        dataFim: "2026-10-12T10:00:00",
        diaInteiro: false,
        calendarioId: "web-google",
        origem: "DISPOSITIVO",
      },

      {
        id: "web-evento-2",
        titulo: "Pagar academia - R$ 100",
        dataInicio: "2026-10-18T18:00:00",
        dataFim: "2026-10-18T19:00:00",
        diaInteiro: false,
        calendarioId: "web-google",
        origem: "DISPOSITIVO",
      },

      {
        id: "web-evento-3",
        titulo: "Aniversário da Julia",
        dataInicio: "2026-10-24T00:00:00",
        diaInteiro: true,
        calendarioId: "web-google",
        origem: "DISPOSITIVO",
      },
    ];

    return eventosMock.filter((evento) => {
      const diaEvento =
        evento.dataInicio.slice(0, 10);

      return (
        diaEvento >= inicio &&
        diaEvento < fim
      );
    });
  }

  // Por enquanto ainda não vamos fazer a leitura real
  // no Android/iOS.
  return [];
}
export type EventoDispositivo = {
  id: string;
  titulo: string;
  dataInicio: string;
  dataFim?: string;
  diaInteiro: boolean;
  calendarioId: string;
  origem: "DISPOSITIVO";
};