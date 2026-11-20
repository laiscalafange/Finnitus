
import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import { useRouter } from "expo-router";
import {
  ChevronDown,
  ChevronUp,
  HelpCircle,
} from "lucide-react-native";

import { HeaderInterno } from "../../shared/components/Header";
import { BackgroundGradient } from "@/shared/components/backgroundGradient";
import { Card } from "../../shared/components/Cards";
import { Button } from "../../shared/components/Button";

import { Cores } from "../../shared/constants/Cores";
import { styles } from "../../styles/ajuda";

const GRADIENTE_CARD = [
  "rgba(44, 27, 67, 0.83)",
  "rgba(33, 18, 53, 0.8)",
] as const;

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
      "O Plano B ajuda você a organizar seus limites de gastos, acompanhar quanto já utilizou e visualizar o valor restante do orçamento.",
  },
  {
    id: "calendario",
    pergunta: "Como funciona o Calendário Financeiro?",
    resposta:
      "O Calendário Financeiro mostra seus compromissos e movimentações financeiras, ajudando você a planejar as despesas do mês.",
  },
  {
    id: "acompanhar",
    pergunta: "Como acompanhar meus gastos do mês?",
    resposta:
      "No Dashboard, você encontra um resumo da sua situação financeira, incluindo receitas, despesas e saldo.",
  },
  {
    id: "editarTransacao",
    pergunta: "Como editar uma transação?",
    resposta:
      "Toque na transação desejada para visualizar seus detalhes e utilize a opção de edição disponível.",
  },
  {
    id: "receita",
    pergunta: "Como adicionar uma receita?",
    resposta:
      "Toque no “+” e selecione “Nova receita”. Informe o valor, a origem e a data do recebimento.",
  },
  {
    id: "dadosConta",
    pergunta: "Como alterar meus dados da conta?",
    resposta:
      "Acesse Perfil e selecione Editar conta para atualizar suas informações pessoais.",
  },
] as const;

export default function Ajuda() {
  const router = useRouter();

  const [aberta, setAberta] = useState<string | null>(null);

  function alternar(id: string) {
    setAberta((atual) => (atual === id ? null : id));
  }

  return (
    <View style={styles.container}>
      <BackgroundGradient variante="funcional" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conteudo}
      >
        <HeaderInterno titulo="Ajuda" />

        <View style={styles.lista}>
          <Text style={styles.tituloSecao}>
            Perguntas frequentes
          </Text>

          {FAQS.map(({ id, pergunta, resposta }) => {
            const aberto = aberta === id;

            return (
              <Card
                key={id}
                gradiente={[...GRADIENTE_CARD]}
                style={styles.card}
              >
                <TouchableOpacity
                  style={styles.linha}
                  activeOpacity={0.85}
                  onPress={() => alternar(id)}
                  accessibilityRole="button"
                  accessibilityState={{
                    expanded: aberto,
                  }}
                >
                  <View style={styles.iconeCirculo}>
                    <HelpCircle
                      size={20}
                      color={Cores.destaque.limao}
                    />
                  </View>

                  <Text style={styles.perguntaTexto}>
                    {pergunta}
                  </Text>

                  {aberto ? (
                    <ChevronUp
                      size={19}
                      color="#BFA7DD"
                    />
                  ) : (
                    <ChevronDown
                      size={19}
                      color="#BFA7DD"
                    />
                  )}
                </TouchableOpacity>

                {aberto && (
                  <View style={styles.respostaContainer}>
                    <View style={styles.divisor} />

                    <Text style={styles.respostaTexto}>
                      {resposta}
                    </Text>
                  </View>
                )}
              </Card>
            );
          })}

          <View style={styles.suporte}>
            <Text style={styles.suporteTitulo}>
              Ainda precisa de ajuda?
            </Text>

            <Text style={styles.suporteDescricao}>
              Entre em contato com o nosso suporte.
            </Text>

            <Button
              titulo="Falar com o suporte"
              variante="outline"
              onPress={() =>
                router.push("/conta/contato")
              }
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
