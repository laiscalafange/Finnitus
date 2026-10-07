import { Platform } from "react-native";
import * as Calendar from "expo-calendar/legacy";

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
      await Calendar.requestCalendarPermissionsAsync();

    console.log(
      "Permissão do calendário:",
      permissao.status
    );

    if (permissao.status !== "granted") {
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

    // As datas recebidas da tela estão no formato AAAA-MM-DD.
  // Acrescentamos o horário para interpretar no fuso do celular.
  const dataInicio = new Date(`${inicio}T00:00:00`);
  const dataFim = new Date(`${fim}T00:00:00`);

  if (
    !Number.isFinite(dataInicio.getTime()) ||
    !Number.isFinite(dataFim.getTime()) ||
    dataInicio >= dataFim
  ) {
    throw new Error("Intervalo inválido para consultar o calendário.");
  }

  let permissao = await Calendar.getCalendarPermissionsAsync();

  if (permissao.status !== "granted") {
    permissao = await Calendar.requestCalendarPermissionsAsync();
  }

  if (permissao.status !== "granted") {
    return [];
  }

  const calendarios = await Calendar.getCalendarsAsync(
    Calendar.EntityTypes.EVENT
  );

  // No Android, consulta as agendas visíveis no calendário.
  // No iOS, essa propriedade pode não estar disponível.
  const calendariosVisiveis = calendarios.filter(
    (calendario) => calendario.isVisible !== false
  );

  const ids = calendariosVisiveis.map(
    (calendario) => calendario.id
  );

  if (ids.length === 0) {
    return [];
  }

  const eventos = await Calendar.getEventsAsync(
    ids,
    dataInicio,
    dataFim
  );

  function formatarData(
    valor: string | Date,
    diaInteiro: boolean
  ): string {
    // Preserva a data civil dos eventos de dia inteiro.
    if (diaInteiro) {
      const data =
        typeof valor === "string"
          ? valor.slice(0, 10)
          : valor.toISOString().slice(0, 10);

      return `${data}T00:00:00`;
    }

    // A tela usa slice(0, 10) para descobrir o dia.
    // Por isso, retornamos os componentes no horário local.
    const data = new Date(valor);

    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");
    const hora = String(data.getHours()).padStart(2, "0");
    const minuto = String(data.getMinutes()).padStart(2, "0");
    const segundo = String(data.getSeconds()).padStart(2, "0");

    return `${ano}-${mes}-${dia}T${hora}:${minuto}:${segundo}`;
  }

  const resultado: EventoDispositivo[] = eventos.map(
    (evento) => {
      const diaInteiro = Boolean(evento.allDay);

      const dataInicioEvento = formatarData(
        evento.startDate,
        diaInteiro
      );

      return {
        // Diferencia também as ocorrências de eventos repetidos.
        id: `${evento.calendarId}:${evento.id}:${dataInicioEvento}`,
        titulo: evento.title?.trim() || "Evento sem título",
        dataInicio: dataInicioEvento,
        dataFim: evento.endDate
          ? formatarData(evento.endDate, diaInteiro)
          : undefined,
        diaInteiro,
        calendarioId: evento.calendarId,
        origem: "DISPOSITIVO",
      };
    }
  );

  // O último dia do intervalo é exclusivo.
  return resultado
    .filter((evento) => {
      const dia = evento.dataInicio.slice(0, 10);
      return dia >= inicio && dia < fim;
    })
    .sort((a, b) =>
      a.dataInicio.localeCompare(b.dataInicio)
    );
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