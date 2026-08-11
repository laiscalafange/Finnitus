export type TipoNotificacao = "meta" | "alerta" | "concluida";

export interface CardNotificacaoProps {
  tipo: TipoNotificacao;
  mensagem: string;
  tempo: string;
}