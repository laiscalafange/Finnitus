
import { Platform } from "react-native";
import Constants from "expo-constants";

type DadosLembrete = {
  eventoId: number;
  nome: string;
  dataInicio: Date;
  diaInteiro: boolean;
};

const CANAL = "eventos-finnitus";

// Expo Go 57 no Android apresenta um erro conhecido
// ao importar expo-notifications.
function ambienteSemSuporte(): boolean {
  if (Platform.OS === "web") {
    return true;
  }

  if (
    Platform.OS === "android" &&
    Constants.appOwnership === "expo"
  ) {
    return true;
  }

  return false;
}

// Carrega o módulo nativo somente em ambientes
// compatíveis, como uma development build.
async function carregarNotificacoes() {
  if (ambienteSemSuporte()) {
    return null;
  }

  return await import("expo-notifications");
}

export async function inicializarNotificacoesEventos() {
  const Notifications = await carregarNotificacoes();

  if (!Notifications) {
    console.log(
      "Notificações nativas desativadas neste ambiente."
    );
    return false;
  }

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(
      CANAL,
      {
        name: "Eventos do Finnitus",
        importance: Notifications.AndroidImportance.HIGH,
        sound: "default",
      }
    );
  }

  const permissao =
    await Notifications.getPermissionsAsync();

  if (permissao.granted) {
    return true;
  }

  const novaPermissao =
    await Notifications.requestPermissionsAsync();

  return novaPermissao.granted;
}

export async function agendarLembreteEvento({
  eventoId,
  nome,
  dataInicio,
  diaInteiro,
}: DadosLembrete): Promise<string | null> {
  const Notifications = await carregarNotificacoes();

  if (!Notifications) {
    console.log(
      "Evento salvo. Lembrete nativo indisponível no Expo Go/Web."
    );
    return null;
  }

  const permitido =
    await inicializarNotificacoesEventos();

  if (!permitido) {
    console.warn(
      "Permissão de notificações não concedida."
    );
    return null;
  }

  const dataNotificacao = diaInteiro
    ? new Date(
        dataInicio.getFullYear(),
        dataInicio.getMonth(),
        dataInicio.getDate(),
        9,
        0,
        0
      )
    : new Date(
        dataInicio.getTime() - 60 * 60 * 1000
      );

  if (dataNotificacao.getTime() <= Date.now()) {
    console.log(
      "O horário do lembrete já passou."
    );
    return null;
  }

  const identificador =
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Finnitus | Evento chegando",
        body: diaInteiro
          ? `Hoje você tem: ${nome}`
          : `Seu evento "${nome}" começa em 1 hora.`,
        sound: "default",
        data: {
          eventoId,
          tipo: "EVENTO",
        },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: dataNotificacao,
        channelId: CANAL,
      },
    });

  console.log(
    "Lembrete agendado:",
    identificador
  );

  return identificador;
}
