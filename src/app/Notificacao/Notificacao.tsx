import { useState } from "react";
import { ActivityIndicator, RefreshControl, View, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { CalendarDays, Target, Wallet } from "lucide-react-native";

import { HeaderInterno } from "../../shared/components/Header";
import { BackgroundGradient } from "@/shared/components/backgroundGradient";
import { Text } from "@/shared/components/Texto";
import { CardNotificacao } from "../../shared/components/CardsNotificacoes";
import { Button } from "../../shared/components/Button";
import { Cores } from "../../shared/constants/Cores";
import { styles } from "../../styles/notificacao";
import { AlternadorTipo } from "@/features/menuMais/components/AlternadorTipo";
import { styles as modal } from "@/features/menuMais/components/ModalReserva/styles";
import { ModalCartao } from "@/features/contas/components/ContaUI";
import { styles as ui } from "@/features/contas/styles";
import { useNotificacoes } from "@/features/contas/useNotificacoes";
import { useConfiguracoes } from "@/features/configuracoesContext";
import { categoriaNotificacao, dataNotificacao, tempoNotificacao, tipoCardNotificacao, type CategoriaNotificacao } from "@/features/contas/notificacoesReais";
import type { Notificacao } from "@/services/notificacoes.api";

type Filtro = "todas" | CategoriaNotificacao;
const OPCOES: { id: Filtro; rotulo: string }[] = [
  { id: "todas", rotulo: "Todas" },
  { id: "contas", rotulo: "Contas" },
  { id: "metas", rotulo: "Metas" },
  { id: "eventos", rotulo: "Eventos" },
];

export default function Notificacoes() {
  const router = useRouter();
  const { configuracoes } = useConfiguracoes();
  const { notificacoes, carregando, atualizando, erro, carregar, marcarLida, marcarTodasLidas } = useNotificacoes();
  const [filtro, setFiltro] = useState<Filtro>("todas");
  const [aberta, setAberta] = useState<Notificacao | null>(null);
  const lista = notificacoes.filter(item => filtro === "todas" || categoriaNotificacao(item) === filtro);
  const naoLidas = notificacoes.filter(item => !item.lida).length;

  async function abrir(item: Notificacao) {
    setAberta(item);
    if (!item.lida) {
      try {
        await marcarLida(item.id_Notificacao);
        setAberta(prev => prev?.id_Notificacao === item.id_Notificacao ? { ...prev, lida: true } : prev);
      } catch { /* A tela mostra o erro; leitura não é fingida localmente. */ }
    }
  }

  async function lerTodas() {
    try {
      await marcarTodasLidas();
    } catch {
      // A mensagem da API é exibida na tela pelo hook.
    }
  }

  function ir(pathname: string, params?: Record<string, string>) {
    setAberta(null);
    router.push({ pathname, params } as never);
  }

  const categoriaAberta = aberta ? categoriaNotificacao(aberta) : null;
  const Icone = categoriaAberta === "metas" ? Target : categoriaAberta === "eventos" ? CalendarDays : Wallet;

  return (
    <View style={styles.container}>
      <BackgroundGradient variante="funcional" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.conteudo}
        refreshControl={<RefreshControl refreshing={atualizando && !carregando} onRefresh={() => void carregar()} />}>
        <HeaderInterno titulo="Notificações" />
        <View style={styles.conteudoLista}>
          <AlternadorTipo<Filtro> valor={filtro} aoMudar={setFiltro} opcoes={OPCOES} />
          <View style={styles.linhaMarcarTodas}>
            <TouchableOpacity onPress={() => void lerTodas()} disabled={naoLidas === 0} accessibilityRole="button">
              <Text style={styles.marcarTodas}>Marcar todas como lidas ({naoLidas})</Text>
            </TouchableOpacity>
          </View>
          {erro ? <Text style={ui.vazio} accessibilityRole="alert">{erro}</Text> : null}
          {carregando && notificacoes.length === 0 ? <ActivityIndicator color={Cores.destaque.limao} /> : null}
          {!carregando && lista.length === 0 && !erro ? <Text style={ui.vazio}>Nenhuma notificação por aqui.</Text> : null}
          {lista.map(item => (
            <CardNotificacao
              key={item.id_Notificacao}
              tipo={tipoCardNotificacao(item)}
              mensagem={item.titulo}
              tempo={configuracoes?.mostrarValores
                ? `${item.mensagem} · ${tempoNotificacao(item.criadaEm)}`
                : tempoNotificacao(item.criadaEm)}
              lida={item.lida}
              onPress={() => void abrir(item)}
            />
          ))}
        </View>
      </ScrollView>
      <ModalCartao visible={aberta !== null} aoFechar={() => setAberta(null)}>
        {aberta ? <>
          <View style={ui.modalIcone}><Icone size={30} color={Cores.texto.principal} /></View>
          <Text style={[modal.titulo, modal.tituloCentro]}>{aberta.titulo}</Text>
          {configuracoes?.mostrarValores ? <Text style={ui.modalSubtitulo}>{aberta.mensagem}</Text> : null}
          <View style={ui.modalData}>
            <CalendarDays size={20} color={Cores.texto.claro} />
            <Text style={ui.modalDataTexto}>{dataNotificacao(aberta.criadaEm)}</Text>
          </View>
          <View style={ui.modalBotoes}>
            {categoriaAberta === "metas" ? <Button titulo="Ver meta" onPress={() =>
              aberta.relacionadoId ? ir("/MetasDetalhes", { id: String(aberta.relacionadoId) }) : ir("/metas")
            } /> : null}
            {categoriaAberta === "eventos" ? <Button titulo="Abrir calendário" onPress={() => ir("/calendario")} /> : null}
            {categoriaAberta === "contas" ? <Button titulo="Ver movimentações" onPress={() => ir("/Contas/Movimentacoes")} /> : null}
          </View>
        </> : null}
      </ModalCartao>
    </View>
  );
}
