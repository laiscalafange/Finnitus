import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

import { HeaderInterno } from "../../shared/components/Header";
import { Input } from "../../shared/components/Input";
import { Button } from "../../shared/components/Button";

import {
  dataEhPassada,
  dataValida,
  mascararData,
  mascararMoeda,
  moedaParaNumero,
} from "@/features/menuMais/utils";
import { styles } from "@/features/menuMais/styles/formulario";

// Tela "Novo evento": registra um compromisso ou gasto planejado pro futuro
// (viagem, aniversário, consulta, compra planejada). Alimenta o Calendário
// Financeiro.
export default function NovoEvento() {
  const router = useRouter();

  // Campos do formulário
  const [nome, setNome] = useState("");
  const [valorDesejado, setValorDesejado] = useState("");
  const [valorInicial, setValorInicial] = useState("");
  const [dataLimite, setDataLimite] = useState("");

  // Mensagem de erro de validação
  const [erro, setErro] = useState("");

  function criar() {
    const desejado = moedaParaNumero(valorDesejado);
    const inicial = moedaParaNumero(valorInicial);

    if (!nome.trim()) {
      setErro("Informe o nome do evento.");
      return;
    }

    if (desejado <= 0) {
      setErro("Informe o valor desejado.");
      return;
    }

    if (inicial > desejado) {
      setErro("O valor inicial não pode ser maior que o valor desejado.");
      return;
    }

    if (!dataValida(dataLimite)) {
      setErro("Informe uma data limite válida (DD/MM/AAAA).");
      return;
    }

    if (dataEhPassada(dataLimite)) {
      setErro("A data limite não pode estar no passado.");
      return;
    }

    setErro("");

    // TODO (backend): ainda não existe endpoint de eventos. Quando existir,
    // enviar { nome, valorDesejado: desejado, valorInicial: inicial,
    // dataLimite } pra API aqui.

    // Leva pro Calendário Financeiro, onde o evento vai aparecer
    router.dismissTo("/calendario");
  }

  return (
    <LinearGradient
      colors={["#160B24", "#08070A", "#160B24"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Empurra o formulário pra cima quando o teclado abre */}
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.conteudo}
        >
          {/* Cabeçalho: só a seta de voltar e o título, igual ao protótipo */}
          <HeaderInterno
            titulo="Novo evento"
            subtitulo="Calendário financeiro"
            mostrarPremium={false}
            mostrarNotificacao={false}
          />

          {/* Formulário (sobe por cima da faixa roxa do header) */}
          <View style={styles.formulario}>
            <Input
              label="Nome do evento"
              placeholder="Ex: Viagem de fim de ano"
              value={nome}
              onChangeText={setNome}
              autoCapitalize="sentences"
              maxLength={60}
            />

            <Input
              label="Valor desejado"
              placeholder="0,00"
              keyboardType="numeric"
              value={valorDesejado}
              onChangeText={(texto) => setValorDesejado(mascararMoeda(texto))}
              icone={<Text style={styles.prefixoMoeda}>R$</Text>}
            />

            <Input
              label="Valor inicial (opcional)"
              placeholder="0"
              keyboardType="numeric"
              value={valorInicial}
              onChangeText={(texto) => setValorInicial(mascararMoeda(texto))}
              icone={<Text style={styles.prefixoMoeda}>R$</Text>}
            />

            <Input
              label="Data limite"
              placeholder="DD/MM/AAAA"
              keyboardType="numeric"
              maxLength={10}
              value={dataLimite}
              onChangeText={(texto) => setDataLimite(mascararData(texto))}
            />

            {/* Mensagem de erro de validação */}
            {erro ? (
              <Text style={styles.erro} accessibilityRole="alert">
                {erro}
              </Text>
            ) : null}

            <Button titulo="Criar evento" onPress={criar} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}