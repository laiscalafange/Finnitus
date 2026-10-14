import { Platform } from "react-native";
import * as Calendar from "expo-calendar/legacy";

export type EventoDispositivo = {
  id: string;
  titulo: string;
  dataInicio: string;
  dataFim?: string;
  diaInteiro: boolean;
  calendarioId: string;
  origem: "DISPOSITIVO";
};

/**
 * Converte a data retornada pelo expo-calendar
 * para uma string que o Finnitus consegue utilizar.
 */
function converterDataEvento(
  data: string | Date
): string {
  if (typeof data === "string") {
    return data;
  }

  return data.toISOString();
}

/**
 * Lista os calendários disponíveis no dispositivo.
 */
export async function listarCalendariosDoDispositivo() {
  // =====================================================
  // WEB
  // =====================================================

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

  // =====================================================
  // ANDROID / IOS
  // =====================================================

  try {
    const disponivel =
      await Calendar.isAvailableAsync();

    console.log(
      "Calendar API disponível:",
      disponivel
    );

    if (!disponivel) {
      console.log(
        "O calendário não está disponível neste dispositivo."
      );

      return [];
    }

    const permissao =
      await Calendar.requestCalendarPermissionsAsync();

    console.log(
      "Permissão do calendário:",
      permissao.status
    );

    if (permissao.status !== "granted") {
      console.log(
        "Permissão para acessar o calendário foi negada."
      );

      return [];
    }

    const calendarios =
      await Calendar.getCalendarsAsync(
        Calendar.EntityTypes.EVENT
      );

    console.log(
      "Calendários encontrados:",
      calendarios
    );

    return calendarios;
  } catch (error) {
    console.error(
      "Erro ao listar calendários do dispositivo:",
      error
    );

    return [];
  }
}

/**
 * Lista todos os eventos existentes nos calendários
 * do dispositivo dentro de um determinado período.
 */
export async function listarEventosDoDispositivo(
  inicio: string,
  fim: string
): Promise<EventoDispositivo[]> {
  // =====================================================
  // WEB
  // =====================================================

  if (Platform.OS === "web") {
    console.log(
      "WEB: simulando eventos do calendário do dispositivo"
    );

    const eventosMock: EventoDispositivo[] = [
      {
        id: "web-evento-1",
        titulo: "Consulta médica",
        dataInicio:
          "2026-10-12T09:00:00",
        dataFim:
          "2026-10-12T10:00:00",
        diaInteiro: false,
        calendarioId: "web-google",
        origem: "DISPOSITIVO",
      },

      {
        id: "web-evento-2",
        titulo:
          "Pagar academia - R$ 100",
        dataInicio:
          "2026-10-18T18:00:00",
        dataFim:
          "2026-10-18T19:00:00",
        diaInteiro: false,
        calendarioId: "web-google",
        origem: "DISPOSITIVO",
      },

      {
        id: "web-evento-3",
        titulo:
          "Aniversário da Julia",
        dataInicio:
          "2026-10-24T00:00:00",
        diaInteiro: true,
        calendarioId: "web-google",
        origem: "DISPOSITIVO",
      },
    ];

    const eventosFiltrados =
      eventosMock.filter((evento) => {
        const diaEvento =
          evento.dataInicio.slice(
            0,
            10
          );

        return (
          diaEvento >= inicio &&
          diaEvento < fim
        );
      });

    console.log(
      "Eventos simulados encontrados:",
      eventosFiltrados
    );

    return eventosFiltrados;
  }

  // =====================================================
  // ANDROID / IOS
  // =====================================================

  try {
    /*
     * Primeiro verifica se o dispositivo
     * possui suporte à API de calendário.
     */
    const disponivel =
      await Calendar.isAvailableAsync();

    console.log(
      "Calendar API disponível:",
      disponivel
    );

    if (!disponivel) {
      console.log(
        "API de calendário indisponível."
      );

      return [];
    }

    /*
     * Solicita permissão de leitura.
     */
    const permissao =
      await Calendar.requestCalendarPermissionsAsync();

    console.log(
      "Permissão para eventos:",
      permissao.status
    );

    if (permissao.status !== "granted") {
      console.log(
        "Permissão negada para acessar eventos."
      );

      return [];
    }

    /*
     * Busca TODOS os calendários de eventos
     * existentes no dispositivo.
     */
    const calendarios =
      await Calendar.getCalendarsAsync(
        Calendar.EntityTypes.EVENT
      );

    console.log(
      "Quantidade de calendários encontrados:",
      calendarios.length
    );

    console.log(
      "Calendários encontrados:",
      calendarios.map(
        (calendario) => ({
          id: calendario.id,
          titulo: calendario.title,
          source:
            calendario.source?.name,
        })
      )
    );

    if (calendarios.length === 0) {
      console.log(
        "Nenhum calendário encontrado no dispositivo."
      );

      return [];
    }

    /*
     * getEventsAsync precisa receber os IDs
     * dos calendários que queremos consultar.
     *
     * Como queremos mostrar todos os eventos,
     * usamos todos os calendários encontrados.
     */
    const idsCalendarios =
      calendarios.map(
        (calendario) =>
          calendario.id
      );

    console.log(
      "IDs dos calendários que serão consultados:",
      idsCalendarios
    );

    /*
     * Período atualmente exibido
     * pelo calendário do Finnitus.
     */
    const dataInicio =
      new Date(
        `${inicio}T00:00:00`
      );

    const dataFim =
      new Date(
        `${fim}T00:00:00`
      );

    console.log(
      "Buscando eventos entre:",
      dataInicio,
      "e",
      dataFim
    );

    /*
     * Busca os eventos reais.
     */
    const eventos =
      await Calendar.getEventsAsync(
        idsCalendarios,
        dataInicio,
        dataFim
      );

    console.log(
      "Quantidade de eventos reais encontrados:",
      eventos.length
    );

    console.log(
      "EVENTOS REAIS DO CELULAR:",
      eventos
    );

    /*
     * Converte os objetos do expo-calendar
     * para o formato utilizado pelo Finnitus.
     */
    const eventosConvertidos: EventoDispositivo[] =
      eventos.map((evento) => {
        const dataInicioEvento =
          converterDataEvento(
            evento.startDate
          );

        const dataFimEvento =
          evento.endDate
            ? converterDataEvento(
                evento.endDate
              )
            : undefined;

        return {
          id: String(
            evento.id
          ),

          titulo:
            evento.title?.trim() ||
            "Evento sem título",

          dataInicio:
            dataInicioEvento,

          dataFim:
            dataFimEvento,

          diaInteiro:
            evento.allDay ??
            false,

          calendarioId:
            String(
              evento.calendarId
            ),

          origem:
            "DISPOSITIVO",
        };
      });

    console.log(
      "EVENTOS CONVERTIDOS PARA O FINNITUS:",
      eventosConvertidos
    );

    return eventosConvertidos;
  } catch (error) {
    console.error(
      "Erro ao listar eventos reais:",
      error
    );

    return [];
  }
}