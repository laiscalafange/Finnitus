import { useMemo, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { CalendarDays, Target } from "lucide-react-native";

import { HeaderInterno } from "../../shared/components/Header";
import { BackgroundGradient } from "@/shared/components/backgroundGradient";
import { CardNotificacao } from "../../shared/components/CardsNotificacoes";
import { Button } from "../../shared/components/Button";
import { Cores } from "../../shared/constants/Cores";
import { Rotas } from "../../shared/constants/Rotas";
import { styles } from "../../styles/notificacao";

import { AlternadorTipo } from "@/features/menuMais/components/AlternadorTipo";
import { styles as modal } from "@/features/menuMais/components/ModalReserva/styles";
import { useFinanceiro } from "@/features/financeiroContext";
import {
  gerarNotificacoes,
  type CategoriaNotificacao,
  type Notificacao,
} from "@/features/contas/notificacoesData";
import { ModalCartao } from "@/features/contas/components/ContaUI";
import { ConfirmarContaConteudo } from "@/features/contas/components/ConfirmarConta";
import { styles as ui } from "@/features/contas/styles";

type Filtro = "todas" | CategoriaNotificacao;

const OPCOES: { id: Filtro; rotulo: string }[] = [
  { id: "todas", rotulo: "Todas" },
  { id: "contas", rotulo: "Contas" },
  { id: "metas", rotulo: "Metas" },
  { id: "eventos", rotulo: "Eventos" },
];

// Central de notificações. As notificações são calculadas a partir das contas,
// metas e eventos (não existem mais notificações de exemplo). Contas atrasadas
// ficam no topo até serem resolvidas.
export default function Notificacoes() {
  const router = useRouter();
  const { transacoes, baixas, metas, notificacoesLidas, marcarNotificacoesLidas } = useFinanceiro();

  const [filtro, setFiltro] = useState<Filtro>("todas");
  const [aberta, setAberta] = useState<Notificacao | null>(null);
  // Etapa "Confirmar pagamento/recebimento" dentro do mesmo modal
  const [confirmando, setConfirmando] = useState(false);

  const todas = useMemo(
    () => gerarNotificacoes(transacoes, baixas, metas),
    [transacoes, baixas, metas],
  );

  const lista = todas.filter((item) => filtro === "todas" || item.categoria === filtro);

  // Tocar abre o modal e marca como lida
  function abrir(notificacao: Notificacao) {
    marcarNotificacoesLidas([notificacao.id]);
    setConfirmando(false);
    setAberta(notificacao);
  }

  function fecharModal() {
    setAberta(null);
    setConfirmando(false);
  }

  function marcarTodasComoLidas() {
    marcarNotificacoesLidas(todas.map((item) => item.id));
  }

  // Fecha o modal e abre outra tela (nunca dois modais ao mesmo tempo)
  function ir(pathname: string, params?: Record<string, string>) {
    fecharModal();
    router.push({ pathname, params } as never);
  }

  function renderModal(notificacao: Notificacao) {
    const conta = notificacao.conta;

    // Confirmar pagamento/recebimento: troca o conteúdo do mesmo modal
    if (confirmando && conta) {
      return <ConfirmarContaConteudo conta={conta} aoFechar={fecharModal} />;
    }

    const Icone = conta?.icone ?? (notificacao.categoria === "metas" ? Target : CalendarDays);
    const entrada = conta?.tipo === "entrada";

    const paramsConta = conta
      ? { id: conta.transacaoId, competencia: conta.competencia }
      : undefined;

    return (
      <>
        <View style={ui.modalIcone}>
          <Icone size={30} color={Cores.texto.principal} />
        </View>

        <Text style={[modal.titulo, modal.tituloCentro]}>{notificacao.titulo}</Text>
        <Text style={ui.modalSubtitulo}>{notificacao.subtitulo}</Text>

        <View style={ui.modalData}>
          <CalendarDays size={20} color={Cores.texto.claro} />
          <Text style={ui.modalDataTexto}>{notificacao.dataTexto}</Text>
        </View>

        <Text style={ui.modalTexto}>{notificacao.descricao}</Text>

        <View style={ui.modalBotoes}>
          {conta && notificacao.permiteConfirmar ? (
            <>
              <Button
                titulo={entrada ? "Marcar como recebida" : "Marcar como paga"}
                onPress={() => setConfirmando(true)}
              />
              <View style={ui.espaco} />
              <Button
                titulo={entrada ? "Ver receita" : "Ver despesa"}
                variante="outline"
                onPress={() => ir(Rotas.detalhesConta, paramsConta)}
              />
            </>
          ) : null}

          {conta && !notificacao.permiteConfirmar ? (
            <Button titulo="Ver conta" onPress={() => ir(Rotas.detalhesConta, paramsConta)} />
          ) : null}

          {notificacao.categoria === "metas" ? (
            <Button
              titulo="Ver meta"
              onPress={() =>
                notificacao.metaId ? ir("/MetasDetalhes", { id: notificacao.metaId }) : ir("/metas")
              }
            />
          ) : null}

          {notificacao.categoria === "eventos" ? (
            <Button titulo="Abrir calendário" onPress={() => ir("/calendario")} />
          ) : null}
        </View>
      </>
    );
  }

  return (
    <View style={styles.container}>
      <BackgroundGradient variante="funcional" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.conteudo}>
        {/* Cabeçalho */}
        <HeaderInterno titulo="Notificações" />

        <View style={styles.conteudoLista}>
          <AlternadorTipo<Filtro> valor={filtro} aoMudar={setFiltro} opcoes={OPCOES} />

          <View style={styles.linhaMarcarTodas}>
            {/* Marca todas as notificações como lidas de uma vez */}
            <TouchableOpacity onPress={marcarTodasComoLidas}>
              <Text style={styles.marcarTodas}>Marcar todas como lidas</Text>
            </TouchableOpacity>
          </View>

          {lista.length === 0 ? (
            <Text style={ui.vazio}>
              Nenhuma notificação por aqui. Os avisos de contas, metas e eventos aparecem
              quando estiverem perto de acontecer.
            </Text>
          ) : null}

          {lista.map((notificacao) => (
            <CardNotificacao
              key={notificacao.id}
              tipo={notificacao.tipoCard}
              mensagem={notificacao.titulo}
              // O prazo/atraso aparece escrito (não só pela cor)
              tempo={`${notificacao.subtitulo} · ${notificacao.quando}`}
              lida={notificacoesLidas.includes(notificacao.id)}
              onPress={() => abrir(notificacao)}
            />
          ))}
        </View>
      </ScrollView>

      <ModalCartao visible={aberta !== null} aoFechar={fecharModal}>
        {aberta ? renderModal(aberta) : null}
      </ModalCartao>
    </View>
  );
}