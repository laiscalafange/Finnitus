
import { Platform } from "react-native";
import Constants from "expo-constants";

type DadosLembrete = {
  usuarioId: number;
  eventoId: number;
  nome: string;
  dataInicio: Date;
  diaInteiro: boolean;
  financeiro: boolean;
};

const CANAL = "eventos-finnitus";
let preferencia: { usuarioId?: number; habilitado?: boolean } = {};

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

export async function sincronizarLembretesEventos(usuarioId?: number, habilitado?: boolean) {
  const atual = { usuarioId, habilitado };
  preferencia = atual;
  const Notifications = await carregarNotificacoes();
  if (!Notifications || preferencia !== atual) return;

  Notifications.setNotificationHandler({
    handleNotification: async ({ request }) => {
      const dados = request.content.data;
      const exibir = dados?.tipo !== "EVENTO" || (
        preferencia.habilitado === true && dados.usuarioId === preferencia.usuarioId
      );
      return {
        shouldShowBanner: exibir,
        shouldShowList: exibir,
        shouldPlaySound: exibir,
        shouldSetBadge: false,
      };
    },
  });

  const pendentes = await Notifications.getAllScheduledNotificationsAsync();
  if (preferencia !== atual) return;
  await Promise.all(pendentes
    .filter(({ content: { data } }) =>
      data?.tipo === "EVENTO" && (!usuarioId || data.usuarioId !== usuarioId || habilitado === false)
    )
    .map(({ identifier }) => Notifications.cancelScheduledNotificationAsync(identifier)));
}

export async function cancelarLembretesFinanceiros(usuarioId: number) {
  const Notifications = await carregarNotificacoes();
  if (!Notifications) return;
  const pendentes = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(pendentes
    .filter(({ content: { data } }) =>
      data?.tipo === "EVENTO" && data.usuarioId === usuarioId && data.financeiro === true
    )
    .map(({ identifier }) => Notifications.cancelScheduledNotificationAsync(identifier)));
}

async function pedirPermissao(
  Notifications: NonNullable<Awaited<ReturnType<typeof carregarNotificacoes>>>,
) {
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
  usuarioId,
  eventoId,
  nome,
  dataInicio,
  diaInteiro,
  financeiro,
}: DadosLembrete): Promise<string | null> {
  const habilitado = () => preferencia.usuarioId === usuarioId && preferencia.habilitado === true;
  if (!habilitado()) return null;

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
    return null;
  }

  const Notifications = await carregarNotificacoes();
  if (!Notifications || !await pedirPermissao(Notifications) || !habilitado()) return null;

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
          usuarioId,
          financeiro,
        },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: dataNotificacao,
        channelId: CANAL,
      },
    });

  if (!habilitado()) {
    await Notifications.cancelScheduledNotificationAsync(identificador);
    return null;
  }

  return identificador;
}
