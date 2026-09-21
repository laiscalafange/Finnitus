import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { HeaderInterno } from "../../shared/components/Header";
import { CardNotificacao, TipoNotificacao } from "../../shared/components/CardsNotificacoes";
import { styles } from "../../styles/notificacao";

// Formato de cada notificação exibida na tela
interface Notificacao {
  id: string;
  tipo: TipoNotificacao;
  mensagem: string;
  tempo: string;
  lida: boolean; // controla se a notificação já foi marcada como lida (visual mais apagado, por ex.)
}

// Dados de exemplo — todas começam como "não lidas"
// TODO: quando tiver back-end, isso vem de uma API em vez desse mock
const NOTIFICACOES_MOCK: Notificacao[] = [
  {
    id: "1",
    tipo: "meta",
    mensagem: 'Você está a apenas R$180 de alcançar a meta "viagem"',
    tempo: "Há 1h",
    lida: false,
  },
  {
    id: "2",
    tipo: "alerta",
    mensagem: 'Seus gastos em "lazer" já passaram em 43% do orçamento',
    tempo: "Há 7h",
    lida: false,
  },
  {
    id: "3",
    tipo: "concluida",
    mensagem: 'Parabéns! Meta "tênis novo" foi concluída',
    tempo: "Há 2d",
    lida: false,
  },
];

export default function Notificacoes() {
  // Estado local com a lista de notificações (começa igual ao mock)
  // Guardamos elas no estado (em vez de usar o mock direto) porque
  // precisamos poder alterar o campo "lida" e a tela re-renderizar
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>(NOTIFICACOES_MOCK);

  // Marca UMA notificação específica como lida (ex: ao tocar nela)
  function marcarComoLida(id: string) {
    setNotificacoes((atual) =>
      atual.map((notificacao) =>
        notificacao.id === id
          ? { ...notificacao, lida: true }
          : notificacao
      )
    );
  }

  // Marca TODAS as notificações como lidas de uma vez (botão "Marcar todas")
  function marcarTodasComoLidas() {
    setNotificacoes((atual) =>
      atual.map((notificacao) => ({ ...notificacao, lida: true }))
    );
  }

  return (
    <LinearGradient
      colors={["#3f1e69", "#08070A", "#291444"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conteudo}
      >

        {/* Cabeçalho */}
        <HeaderInterno
          titulo="Notificações"
          subtitulo="Detalhes"
          mostrarNotificacao={false}
        />

        {/* Lista de notificações */}
        <View style={styles.conteudoLista}>

          <View style={styles.linhaMarcarTodas}>
            {/* Marca todas as notificações como lidas de uma vez */}
            <TouchableOpacity onPress={marcarTodasComoLidas}>
              <Text style={styles.marcarTodas}>Marcar todas</Text>
            </TouchableOpacity>
          </View>

          {notificacoes.map((notificacao) => (
            <CardNotificacao
              key={notificacao.id}
              tipo={notificacao.tipo}
              mensagem={notificacao.mensagem}
              tempo={notificacao.tempo}
              // Toca no card individual pra marcar só ela como lida
              // ATENÇÃO: precisa que o CardNotificacao aceite essas 2 props
              // (lida + onPress) — se ele ainda não aceitar, adiciona lá
              lida={notificacao.lida}
              onPress={() => marcarComoLida(notificacao.id)}
            />
          ))}

        </View>

      </ScrollView>
    </LinearGradient>
  );
}