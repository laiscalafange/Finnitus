import { useState } from "react";
import { isAxiosError } from "axios";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";


import { HeaderInterno } from "../../shared/components/Header";
import { BackgroundGradient } from "@/shared/components/backgroundGradient";
import { Input } from "../../shared/components/Input";
import { Button } from "../../shared/components/Button";
import { useIdioma } from "@/features/idioma";
import { api } from "../../services/api";
import { useAction } from "../../shared/hooks/useAction";

import { styles } from "../../styles/contato";

// Tela "Contate-nos".
export default function Contato() {
  const { t } = useIdioma();

  // Campos do formulário
  const [assunto, setAssunto] = useState("");
  const [mensagem, setMensagem] = useState("");

  const [enviado, setEnviado] = useState(false);
  const { busy, error, run } = useAction();

  function enviar() {
    void run(async () => {
      setEnviado(false);
      const assuntoLimpo = assunto.trim();
      const mensagemLimpa = mensagem.trim();
      if (!assuntoLimpo || !mensagemLimpa) {
        throw new Error(t("Preencha o assunto e a mensagem."));
      }

      try {
        await api.post("/me/contato", {
          assunto: assuntoLimpo,
          mensagem: mensagemLimpa,
        });
      } catch (cause) {
        if (isAxiosError<{ code?: string }>(cause) && cause.response?.status === 503) {
          switch (cause.response.data?.code) {
            case "CONTACT_NOT_CONFIGURED":
              throw new Error(t("O formulário de contato ainda não está disponível."));
            case "CONTACT_DELIVERY_FAILED":
              throw new Error(t("O serviço de e-mail está indisponível no momento. Tente enviar novamente mais tarde."));
          }
        }
        throw cause;
      }
      setEnviado(true);
      setAssunto("");
      setMensagem("");
    });
  }

  return (
    <View style={styles.container}>
      <BackgroundGradient variante="funcional" />
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
          <HeaderInterno titulo={t("Contate-nos")} />

          {/* Formulário (logo abaixo do cabeçalho) */}
          <View style={styles.formulario}>
            <Input
              label={t("Assunto")}
              placeholder={t("Do que se trata?")}
              value={assunto}
              onChangeText={setAssunto}
              maxLength={120}
              editable={!busy}
            />

            <Input
              label={t("Mensagem")}
              placeholder={t("Descreva sua dúvida ou problema...")}
              value={mensagem}
              onChangeText={setMensagem}
              multiline
              numberOfLines={5}
              maxLength={2000}
              editable={!busy}
            />

            {error ? (
              <Text
                style={styles.erro}
                accessibilityRole="alert"
              >
                {error}
              </Text>
            ) : null}

            {enviado ? (
              <Text style={styles.confirmacao} accessibilityLiveRegion="polite">
                {t("Mensagem enviada! Nossa equipe vai te responder em breve.")}
              </Text>
            ) : null}

            <Button
              titulo={busy ? t("Enviando...") : t("Enviar mensagem")}
              variante="terciario"
              onPress={enviar}
              disabled={busy}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
