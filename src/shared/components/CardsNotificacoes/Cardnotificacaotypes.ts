export type TipoNotificacao = "meta" | "alerta" | "concluida";

export interface CardNotificacaoProps {
  tipo: TipoNotificacao;
  mensagem: string;
  tempo: string;
  /** Se true, o card aparece com visual de "já lida" (mais apagado, sem bolinha) */
  lida?: boolean;
  /** Função chamada ao tocar no card (ex: marcar essa notificação como lida) */
  onPress?: () => void;
}