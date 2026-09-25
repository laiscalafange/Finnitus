import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import { HeaderInterno } from "../../shared/components/Header";
import { Input } from "../../shared/components/Input";
import { Button } from "../../shared/components/Button";

import { styles } from "../../styles/contato";

// Tela "Contate-nos".
export default function Contato() {
  // Campos do formulário
  const [assunto, setAssunto] = useState("");
  const [mensagem, setMensagem] = useState("");

  // Mensagem de erro de validação | true = mensagem enviada
  const [erro, setErro] = useState("");
  const [enviado, setEnviado] = useState(false);

  function enviar() {
    if (!assunto.trim() || !mensagem.trim()) {
      setErro("Preencha o assunto e a mensagem.");
      return;
    }

    setErro("");

    // TODO (backend): enviar { assunto, mensagem } pra API.
    // Hoje ainda não existe rota de contato, então por enquanto
    // a tela só valida e mostra a confirmação abaixo.

    setEnviado(true);
    setAssunto("");
    setMensagem("");
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
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : "height"
        }
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.conteudo}
        >
          {/* Cabeçalho: só a seta de voltar e o título, igual ao protótipo */}
          <HeaderInterno
            titulo="Contate-nos"
            subtitulo="Suporte"
            mostrarPremium={false}
            mostrarNotificacao={false}
          />

          {/* Formulário (sobe por cima da faixa roxa do header) */}
          <View style={styles.formulario}>
            <Input
              label="Assunto"
              placeholder="Do que se trata?"
              value={assunto}
              onChangeText={setAssunto}
            />

            <Input
              label="Mensagem"
              placeholder="Descreva sua dúvida ou problema..."
              value={mensagem}
              onChangeText={setMensagem}
              multiline
              numberOfLines={5}
            />

            {/* Mensagem de erro de validação */}
            {erro ? (
              <Text
                style={styles.erro}
                accessibilityRole="alert"
              >
                {erro}
              </Text>
            ) : null}

            {/* Confirmação depois de "enviar" (ainda sem backend) */}
            {enviado ? (
              <Text style={styles.confirmacao}>
                Mensagem enviada! Nossa equipe vai te responder em breve.
              </Text>
            ) : null}

            <Button
              titulo="Enviar mensagem"
              variante="terciario"
              onPress={enviar}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}