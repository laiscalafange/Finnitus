
import { useState } from "react";

import {
  View,
  ScrollView,
  Text,
  Alert,
} from "react-native";

import {
  Plane,
  Car,
  Home,
  CreditCard,
  Wrench,
  Plus,
} from "lucide-react-native";

import { BackgroundGradient } from "../../shared/components/backgroundGradient";
import { SelectCard } from "../../shared/components/SelectCard";
import { Button } from "../../shared/components/Button";
import { styles } from "../../styles/FutureGoalsStyles";
import { useRouter } from "expo-router";
import { ProgressDots } from "../../shared/components/ProgressDots/ProgressDots";
import { Cores } from "@/shared/constants/Cores";
import { useFinanceiro } from "../../features/financeiroContext";

// Cliente responsável pelas requisições ao backend.
import { api } from "@/services/api";

// Opções de objetivos futuros.
// O fundo de emergência foi removido porque essa informação
// já é registrada na etapa FutureSavings.
const OPTIONS = [
  { id: "viagem", label: "Viagem", icon: Plane },
  { id: "carro", label: "Carro novo", icon: Car },
  { id: "casa", label: "Casa nova", icon: Home },
  { id: "divida", label: "Pagar dívida", icon: CreditCard },
  { id: "reforma", label: "Reforma", icon: Wrench },
];

export default function MetasFuturas() {
  const roteador = useRouter();

  // Recupera as metas selecionadas no contexto financeiro.
 const {
  metasSelecionadas,
  setMetasSelecionadas,
  carregarMetas,
} = useFinanceiro();
  // Controla os objetivos selecionados nesta tela.
  const [selecionados, setSelecionados] =
    useState<string[]>(metasSelecionadas);

  // Controla o envio dos dados para evitar vários envios simultâneos.
  const [salvando, setSalvando] = useState(false);

  // Adiciona ou remove um objetivo da seleção.
  function toggle(id: string) {
    setSelecionados((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  }

  // Salva os objetivos selecionados no backend.
  async function confirmar() {
    // Evita que o usuário envie a mesma requisição várias vezes.
    if (salvando) {
      return;
    }

    try {
      setSalvando(true);

      // Converte os IDs selecionados nos nomes que serão
      // armazenados na tabela Meta.
      const nomes = OPTIONS
        .filter((opcao) =>
          selecionados.includes(opcao.id)
        )
        .map((opcao) => opcao.label);

      // Envia os objetivos para a API.
      // O backend identifica o usuário pelo token de autenticação.
      await api.post("/metas/iniciais", {
        nomes,
      });
      await carregarMetas();

      // Atualiza o contexto somente depois que o backend confirmar.
      setMetasSelecionadas(selecionados);

      // Avança para a próxima etapa do onboarding.
      roteador.push("/configuracaoInicial/FutureVision");
    } catch (erro) {
      console.error(
        "Erro ao salvar objetivos iniciais:",
        erro,
      );

      Alert.alert(
        "Não foi possível salvar",
        "Ocorreu um erro ao registrar seus objetivos. Verifique sua conexão e tente novamente.",
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <BackgroundGradient />

      <View style={styles.container}>

        {/* Cabeçalho da etapa */}
        <View style={styles.header}>
          <ProgressDots total={4} atual={3} />

          <Text
            style={styles.titulo}
            maxFontSizeMultiplier={1.1}
          >
            <Text style={styles.tituloDestaque}>
              Metas
            </Text>
            {" "}futuras
          </Text>

          <Text
            style={styles.subtitulo}
            maxFontSizeMultiplier={1.1}
          >
           O que você deseja conquistar nos próximos anos?           </Text>
        </View>

        <Text style={styles.sectionTitle}>
          Sonhos futuros
        </Text>

        {/* Lista de objetivos disponíveis */}
        <ScrollView
          style={styles.lista}
          showsVerticalScrollIndicator={false}
        >
          {OPTIONS.map(({ id, label, icon: Icon }) => (
            <SelectCard
              key={id}
              label={label}
              icon={
                <Icon
                  size={22}
                  color={
                    selecionados.includes(id)
                      ? Cores.destaque.limao
                      : Cores.roxo.claro
                  }
                />
              }
              selected={selecionados.includes(id)}
              onPress={() => toggle(id)}
            />
          ))}

          {/* Ação para um futuro objetivo personalizado */}
          <SelectCard
            label="Objetivo personalizado"
            icon={
              <Plus
                size={22}
                color={Cores.roxo.claro}
              />
            }
            showCheckbox={false}
            onPress={() => {
              // A criação de objetivos personalizados
              // será implementada posteriormente.
            }}
          />
        </ScrollView>

        {/* Botão de confirmação */}
        <View style={styles.botao}>
          <Button
            variante="primario"
            titulo={
              salvando
                ? "Salvando..."
                : "Confirmar"
            }
            onPress={confirmar}
          />
        </View>

      </View>
    </View>
  );
}
