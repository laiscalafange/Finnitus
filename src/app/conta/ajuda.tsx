import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ChevronDown, ChevronUp } from "lucide-react-native";

import { HeaderInterno } from "../../shared/components/Header";
import { Card } from "../../shared/components/Cards";
import { Button } from "../../shared/components/Button";

import { Cores } from "../../shared/constants/Cores";
import { styles } from "../../styles/ajuda";

// Perguntas frequentes: cada uma abre/fecha a própria resposta.
// Pra adicionar uma pergunta nova, é só incluir mais um item aqui.
const FAQS = [
  {
    id: "gasto",
    pergunta: "Como adicionar um gasto?",
    resposta:
      "Toque no “+” na barra inferior e selecione “Novo gasto”. Informe o valor, a categoria e a data da despesa. Depois, confirme para adicionar o gasto ao seu controle financeiro.",
  },
  {
    id: "meta",
    pergunta: "Como criar uma meta?",
    resposta:
      "Acesse Metas e toque no “+” para criar uma nova meta. Defina o valor e o prazo desejado para acompanhar seu progresso ao longo do tempo.",
  },
  {
    id: "planoB",
    pergunta: "Como funciona o Plano B?",
    resposta:
      "O Plano B ajuda você a lidar com imprevistos sem perder o controle do orçamento. Ao registrar uma despesa inesperada, o Finnitus mostra alternativas para reorganizar seus gastos e reduzir o impacto no mês.",
  },
  {
    id: "calendario",
    pergunta: "Como funciona o Calendário Financeiro?",
    resposta:
      "O Calendário Financeiro mostra seus próximos compromissos e gastos previstos, permitindo que você se organize com antecedência e se prepare para as despesas que estão por vir.",
  },
  {
    id: "acompanhar",
    pergunta: "Como acompanhar meus gastos do mês?",
    resposta:
      "No Dashboard, você encontra um resumo da sua situação financeira, podendo acompanhar suas receitas, despesas e o andamento do seu orçamento mensal.",
  },
  {
    id: "editarTransacao",
    pergunta: "Como editar uma transação?",
    resposta:
      "Toque na transação que deseja alterar para abrir seus detalhes. Depois, selecione “Editar”, faça as alterações necessárias e salve.",
  },
  {
    id: "receita",
    pergunta: "Como adicionar uma receita?",
    resposta:
      "Toque no “+” e selecione “Nova receita”. Informe o valor, a origem e a data do recebimento para registrar o dinheiro que entrou no seu orçamento.",
  },
  {
    id: "dadosConta",
    pergunta: "Como alterar meus dados da conta?",
    resposta:
      "Acesse Perfil > Configurações > Editar conta para atualizar seus dados pessoais e outras informações disponíveis da sua conta.",
  },
] as const;

// Tela "Ajuda".
export default function Ajuda() {
  const router = useRouter();

  // id da pergunta aberta no momento (null = todas fechadas)
  const [aberta, setAberta] = useState<string | null>(null);

  function alternar(id: string) {
    setAberta((atual) => (atual === id ? null : id));
  }

  return (
    <LinearGradient
      colors={["#160B24", "#08070A", "#160B24"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conteudo}
      >
        {/* Cabeçalho: só a seta de voltar e o título, igual ao protótipo */}
        <HeaderInterno
          titulo="Ajuda"
          subtitulo="Suporte"
          mostrarPremium={false}
          mostrarNotificacao={false}
        />

        {/* Lista de perguntas (sobe por cima da faixa roxa do header) */}
        <View style={styles.lista}>
          <Text style={styles.tituloSecao}>
            Perguntas frequentes
          </Text>

          {FAQS.map(({ id, pergunta, resposta }) => {
            const aberto = aberta === id;

            return (
              <Card
                key={id}
                gradiente={["rgba(73, 38, 155, 0.71)", "rgba(45, 17, 108, 0.48)"]}
                style={styles.item}
              >
                <TouchableOpacity
                  style={styles.pergunta}
                  activeOpacity={0.85}
                  onPress={() => alternar(id)}
                >
                  <Text style={styles.perguntaTexto}>
                    {pergunta}
                  </Text>

                  {aberto ? (
                    <ChevronUp size={22} color={Cores.base.branco} />
                  ) : (
                    <ChevronDown size={22} color={Cores.texto.claro} />
                  )}
                </TouchableOpacity>

                {aberto ? (
                  <Text style={styles.respostaTexto}>
                    {resposta}
                  </Text>
                ) : null}
              </Card>
            );
          })}

          <Button
            titulo="Falar com o suporte"
            variante="outline"
            onPress={() => router.push("/conta/contato")}
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
}