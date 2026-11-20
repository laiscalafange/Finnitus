import {
  registrarNotificacao,
  type BancoNotificacoes,
} from "./notificacoes.service.js";

// Contratos mínimos baseados nos campos REAIS do schema.prisma enviado.
// Objetos devolvidos pelo Prisma (com campos extras) são compatíveis.
type ValorMonetario = string | number | { toString(): string };

type ReceitaBase = {
  id_Receita: number;
  id_Usuario: number;
  descricao: string;
  valor: ValorMonetario;
};

type DespesaBase = {
  id_Despesa: number;
  id_Usuario: number;
  descricao: string;
  valor: ValorMonetario;
};

type MetaBase = {
  id_Meta: number;
  id_Usuario: number;
  Mnome: string;
  Mvalor_objetivo: ValorMonetario;
};

type MovimentoMetaBase = {
  id_Movimentacao: number;
  tipo: "APORTE" | "RETIRADA";
  valor: ValorMonetario;
};

type EventoBase = {
  id_Evento: number;
  id_Usuario: number;
  Enome: string;
};

const formatarValor = (valor: ValorMonetario): string => {
  const numero = Number(valor.toString());
  return Number.isFinite(numero)
    ? new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(numero)
    : "valor não informado";
};

const nomeCurto = (valor: string): string =>
  (valor.trim() || "Sem descrição").slice(0, 90);

/** Execute estes gatilhos DENTRO da transação que gravou o dado real. */
export function notificarReceitaCriada(banco: BancoNotificacoes, receita: ReceitaBase) {
  return registrarNotificacao(banco, {
    idUsuario: receita.id_Usuario,
    tipo: "RECEITA_CRIADA",
    titulo: "Receita registrada",
    mensagem: `${nomeCurto(receita.descricao)}: ${formatarValor(receita.valor)}.`,
    chaveEvento: `receita:${receita.id_Receita}:criada`,
    relacionadoTipo: "RECEITA",
    relacionadoId: receita.id_Receita,
  });
}

export function notificarDespesaCriada(banco: BancoNotificacoes, despesa: DespesaBase) {
  return registrarNotificacao(banco, {
    idUsuario: despesa.id_Usuario,
    tipo: "DESPESA_CRIADA",
    titulo: "Despesa registrada",
    mensagem: `${nomeCurto(despesa.descricao)}: ${formatarValor(despesa.valor)}.`,
    chaveEvento: `despesa:${despesa.id_Despesa}:criada`,
    relacionadoTipo: "DESPESA",
    relacionadoId: despesa.id_Despesa,
  });
}

/** Chame somente na transição de PENDENTE para RECEBIDA. */
export function notificarReceitaRecebida(banco: BancoNotificacoes, receita: ReceitaBase) {
  return registrarNotificacao(banco, {
    idUsuario: receita.id_Usuario,
    tipo: "RECEITA_RECEBIDA",
    titulo: "Recebimento confirmado",
    mensagem: `${nomeCurto(receita.descricao)} foi recebida (${formatarValor(receita.valor)}).`,
    chaveEvento: `receita:${receita.id_Receita}:recebida`,
    relacionadoTipo: "RECEITA",
    relacionadoId: receita.id_Receita,
  });
}

/** Chame somente na transição de PENDENTE para PAGA. */
export function notificarDespesaPaga(banco: BancoNotificacoes, despesa: DespesaBase) {
  return registrarNotificacao(banco, {
    idUsuario: despesa.id_Usuario,
    tipo: "DESPESA_PAGA",
    titulo: "Pagamento confirmado",
    mensagem: `${nomeCurto(despesa.descricao)} foi paga (${formatarValor(despesa.valor)}).`,
    chaveEvento: `despesa:${despesa.id_Despesa}:paga`,
    relacionadoTipo: "DESPESA",
    relacionadoId: despesa.id_Despesa,
  });
}

export function notificarMetaCriada(banco: BancoNotificacoes, meta: MetaBase) {
  return registrarNotificacao(banco, {
    idUsuario: meta.id_Usuario,
    tipo: "META_CRIADA",
    titulo: "Meta financeira criada",
    mensagem: `${nomeCurto(meta.Mnome)}: objetivo de ${formatarValor(meta.Mvalor_objetivo)}.`,
    chaveEvento: `meta:${meta.id_Meta}:criada`,
    relacionadoTipo: "META",
    relacionadoId: meta.id_Meta,
  });
}

/** A movimentação já deve estar salva com id_Movimentacao verdadeiro. */
export function notificarMovimentoMeta(
  banco: BancoNotificacoes,
  meta: MetaBase,
  movimento: MovimentoMetaBase,
) {
  const aporte = movimento.tipo === "APORTE";
  return registrarNotificacao(banco, {
    idUsuario: meta.id_Usuario,
    tipo: aporte ? "META_APORTE" : "META_RETIRADA",
    titulo: aporte ? "Aporte na meta" : "Retirada da meta",
    mensagem: `${formatarValor(movimento.valor)} ${aporte ? "adicionados à" : "retirados da"} meta ${nomeCurto(meta.Mnome)}.`,
    chaveEvento: `meta:${meta.id_Meta}:movimento:${movimento.id_Movimentacao}`,
    relacionadoTipo: "META",
    relacionadoId: meta.id_Meta,
  });
}

/** Chame somente na transição para CONCLUIDA. */
export function notificarMetaConcluida(banco: BancoNotificacoes, meta: MetaBase) {
  return registrarNotificacao(banco, {
    idUsuario: meta.id_Usuario,
    tipo: "META_CONCLUIDA",
    titulo: "Meta concluída!",
    mensagem: `Você atingiu o objetivo da meta ${nomeCurto(meta.Mnome)}.`,
    chaveEvento: `meta:${meta.id_Meta}:concluida`,
    relacionadoTipo: "META",
    relacionadoId: meta.id_Meta,
  });
}

/** Chame somente na transição de status_financeiro para CONFIRMADO. */
export function notificarEventoConfirmado(banco: BancoNotificacoes, evento: EventoBase) {
  return registrarNotificacao(banco, {
    idUsuario: evento.id_Usuario,
    tipo: "EVENTO_CONFIRMADO",
    titulo: "Evento financeiro confirmado",
    mensagem: `O evento ${nomeCurto(evento.Enome)} foi confirmado no calendário.`,
    chaveEvento: `evento:${evento.id_Evento}:confirmado`,
    relacionadoTipo: "EVENTO",
    relacionadoId: evento.id_Evento,
  });
}

/** Novo evento próprio do Finnitus. A notificação é criada na mesma transação. */
export function notificarEventoCriado(banco: BancoNotificacoes, evento: EventoBase) {
  return registrarNotificacao(banco, {
    idUsuario: evento.id_Usuario,
    tipo: "EVENTO_CRIADO",
    titulo: "Novo evento no calendário",
    mensagem: `O evento ${nomeCurto(evento.Enome)} foi criado com sucesso.`,
    chaveEvento: `evento:${evento.id_Evento}:criado`,
    relacionadoTipo: "EVENTO",
    relacionadoId: evento.id_Evento,
  });
}
