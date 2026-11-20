/**
 * Aceita tanto o PrismaClient existente quanto o `tx` de `$transaction`.
 * Não abre conexão nova nem cria notificações a partir do frontend.
 */
export type BancoNotificacoes = {
  notificacao: {
    createMany(args: {
      data: {
        id_Usuario: number;
        tipo: TipoNotificacao;
        titulo: string;
        mensagem: string;
        chaveEvento: string;
        relacionadoTipo: RelacionadoTipo | null;
        relacionadoId: number | null;
      }[];
      skipDuplicates: true;
    }): Promise<{ count: number }>;
  };
};

export type TipoNotificacao =
  | "RECEITA_CRIADA"
  | "DESPESA_CRIADA"
  | "RECEITA_RECEBIDA"
  | "DESPESA_PAGA"
  | "META_CRIADA"
  | "META_APORTE"
  | "META_RETIRADA"
  | "META_CONCLUIDA"
  | "EVENTO_CONFIRMADO";

export type RelacionadoTipo = "RECEITA" | "DESPESA" | "META" | "EVENTO";

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
  if (!Number.isSafeInteger(dados.idUsuario) || dados.idUsuario <= 0) {
    throw new Error("O ID do usuário deve ser obtido da operação autenticada.");
  }
  if (!dados.chaveEvento || dados.chaveEvento.length > 180) {
    throw new Error("A chaveEvento deve conter de 1 a 180 caracteres.");
  }
  if (!dados.titulo.trim() || !dados.mensagem.trim()) {
    throw new Error("Título e mensagem são obrigatórios.");
  }

  // PostgreSQL + @@unique([id_Usuario, chaveEvento]): evita mensagens duplicadas.
  const resultado = await banco.notificacao.createMany({
    data: [{
      id_Usuario: dados.idUsuario,
      tipo: dados.tipo,
      titulo: dados.titulo.slice(0, 120),
      mensagem: dados.mensagem.slice(0, 500),
      chaveEvento: dados.chaveEvento,
      relacionadoTipo: dados.relacionadoTipo ?? null,
      relacionadoId: dados.relacionadoId ?? null,
    }],
    skipDuplicates: true,
  });

  return resultado.count === 1;
}
