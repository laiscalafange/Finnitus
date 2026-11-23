import type { Prisma } from "../../generated/prisma/client.js";

export type BancoNotificacoes = Pick<Prisma.TransactionClient, "notificacao" | "configuracaoUsuario">;

export type TipoNotificacao =
  | "RECEITA_CRIADA"
  | "DESPESA_CRIADA"
  | "RECEITA_RECEBIDA"
  | "DESPESA_PAGA"
  | "META_CRIADA"
  | "META_APORTE"
  | "META_RETIRADA"
  | "META_CONCLUIDA"
  | "META_PRAZO"
  | "EVENTO_CONFIRMADO"
  | "EVENTO_CRIADO"
  | "DIVIDA_CRIADA"
  | "DIVIDA_QUITADA"
  | "RESERVA_DEPOSITO"
  | "RESERVA_RETIRADA"
  | "IMPREVISTO_CRIADO"
  | "CONTA_VENCIMENTO"
  | "PLANO_B"
  | "RESUMO_MENSAL";

export type RelacionadoTipo = "RECEITA" | "DESPESA" | "DIVIDA" | "RESERVA" | "IMPREVISTO" | "META" | "EVENTO";

const preferenciaPorTipo = {
  RECEITA_CRIADA: "resumo",
  DESPESA_CRIADA: "gastos",
  RECEITA_RECEBIDA: "resumo",
  DESPESA_PAGA: "gastos",
  META_CRIADA: "metas",
  META_APORTE: "metas",
  META_RETIRADA: "metas",
  META_CONCLUIDA: "metas",
  META_PRAZO: "metas",
  EVENTO_CONFIRMADO: "calendario",
  EVENTO_CRIADO: "calendario",
  DIVIDA_CRIADA: "gastos",
  DIVIDA_QUITADA: "gastos",
  RESERVA_DEPOSITO: "metas",
  RESERVA_RETIRADA: "metas",
  IMPREVISTO_CRIADO: "planoB",
  CONTA_VENCIMENTO: "vencimento",
  PLANO_B: "planoB",
  RESUMO_MENSAL: "resumo",
} as const satisfies Record<TipoNotificacao, string>;

export interface DadosNotificacao {
  idUsuario: number;
  tipo: TipoNotificacao;
  titulo: string;
  mensagem: string;
  /** Estável para o mesmo evento real; UNIQUE junto a id_Usuario. */
  chaveEvento: string;
  relacionadoTipo?: RelacionadoTipo;
  relacionadoId?: number;
}

/** Retorna true apenas se houve inserção; tentativas repetidas não duplicam. */
export async function registrarNotificacao(
  banco: BancoNotificacoes,
  dados: DadosNotificacao,
): Promise<boolean> {
  return (await registrarLoteNotificacoes(banco, dados.idUsuario, [dados])) === 1;
}

export async function registrarLoteNotificacoes(
  banco: BancoNotificacoes,
  idUsuario: number,
  avisos: Omit<DadosNotificacao, "idUsuario">[],
): Promise<number> {
  if (!avisos.length) return 0;
  if (!Number.isSafeInteger(idUsuario) || idUsuario <= 0) {
    throw new Error("O ID do usuário deve ser obtido da operação autenticada.");
  }
  const configuracao = await banco.configuracaoUsuario.findUnique({
    where: { id_Usuario: idUsuario },
    select: { gastos: true, resumo: true, metas: true, calendario: true, vencimento: true, planoB: true },
  });
  const dados = avisos
    .filter(aviso => configuracao?.[preferenciaPorTipo[aviso.tipo]] !== false)
    .map(aviso => {
      if (!aviso.chaveEvento || aviso.chaveEvento.length > 180) {
        throw new Error("A chaveEvento deve conter de 1 a 180 caracteres.");
      }
      if (!aviso.titulo.trim() || !aviso.mensagem.trim()) {
        throw new Error("Título e mensagem são obrigatórios.");
      }
      return {
        id_Usuario: idUsuario,
        tipo: aviso.tipo,
        titulo: aviso.titulo.slice(0, 120),
        mensagem: aviso.mensagem.slice(0, 500),
        chaveEvento: aviso.chaveEvento,
        relacionadoTipo: aviso.relacionadoTipo ?? null,
        relacionadoId: aviso.relacionadoId ?? null,
      };
    });
  if (!dados.length) return 0;
  const resultado = await banco.notificacao.createMany({ data: dados, skipDuplicates: true });
  return resultado.count;
}
