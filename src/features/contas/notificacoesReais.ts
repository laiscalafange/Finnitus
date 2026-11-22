import type { Notificacao } from "../../services/notificacoes.api";

export type CategoriaNotificacao = "contas" | "metas" | "eventos";
export function categoriaNotificacao(item: Notificacao): CategoriaNotificacao {
  if (item.relacionadoTipo === "META" || item.tipo.startsWith("META_")) return "metas";
  if (item.relacionadoTipo === "EVENTO" || item.tipo.startsWith("EVENTO_")) return "eventos";
  return "contas";
}

export function tipoCardNotificacao(item: Notificacao): "conta" | "meta" | "concluida" | "evento" {
  if (item.tipo === "META_CONCLUIDA") return "concluida";
  if (categoriaNotificacao(item) === "metas") return "meta";
  if (categoriaNotificacao(item) === "eventos") return "evento";
  return "conta";
}

export function dataNotificacao(data: string, idioma = "pt-BR"): string {
  const momento = new Date(data);
  return Number.isNaN(momento.getTime()) ? "—" :
    momento.toLocaleString(idioma, { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function tempoNotificacao(data: string, idioma = "pt-BR"): string {
  const diferenca = Math.max(0, Date.now() - new Date(data).getTime());
  if (!Number.isFinite(diferenca)) return "";
  const minutos = Math.floor(diferenca / 60000);
  if (idioma !== "pt-BR") {
    const relativo = new Intl.RelativeTimeFormat(idioma, { style: "short" });
    if (minutos < 1) return new Intl.RelativeTimeFormat(idioma, { numeric: "auto" }).format(0, "second");
    if (minutos < 60) return relativo.format(-minutos, "minute");
    const horas = Math.floor(minutos / 60);
    if (horas < 24) return relativo.format(-horas, "hour");
    return relativo.format(-Math.floor(horas / 24), "day");
  }
  if (minutos < 1) return "Agora";
  if (minutos < 60) return `Há ${minutos} min`;
  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `Há ${horas} h`;
  const dias = Math.floor(horas / 24);
  return `Há ${dias} dia${dias === 1 ? "" : "s"}`;
}
