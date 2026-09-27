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

import { authService } from "../../services/auth";
import { useAuth } from "../../features/authContext";
import { useAction } from "../../shared/hooks/useAction";

import {
  normalizeEmail,
  validEmail,
} from "../../shared/utils/formValidation";

import { styles } from "../../styles/trocarSenhaEmail";

// 1ª etapa de "Trocar senha": confirma o e-mail da conta antes de mandar
// o código. Fica dentro de app/conta (grupo só de usuário logado) porque
// a pasta (auth) — onde mora o fluxo "Esqueci minha senha" — só existe
// pra quem está deslogado (guard={!user} no _layout raiz). Navegar pra
// lá com o usuário logado não fazia nada, por isso essa tela própria.
// Reaproveita o mesmo authService (forgot/verify/reset) e o mesmo
// estado de recuperação do AuthContext que aquele fluxo já usa.
export default function TrocarSenhaEmail() {
  const router = useRouter();

  const { user, startRecovery } = useAuth();

  const [email, setEmail] = useState(user?.email ?? "");

  const { busy, error, run } = useAction();

  function enviar() {
    void run(async () => {
      const normalized = normalizeEmail(email);

      if (!validEmail(normalized)) {
        throw new Error("Informe um e-mail válido.");
      }

      await authService.forgot(normalized);

      startRecovery(normalized);

      router.push("/conta/trocarSenhaCodigo");
    });
  }

  return (
    <LinearGradient
      colors={["#160B24", "#08070A", "#160B24"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.conteudo}
        >
          <HeaderInterno
            titulo="Trocar senha"
            subtitulo="Segurança"
            mostrarPremium={false}
            mostrarNotificacao={false}
          />

          <View style={styles.formulario}>
            <Text style={styles.texto}>
              Confirme seu e-mail: vamos enviar um código pra garantir
              que é você antes de trocar a senha.
            </Text>

            <Input
              label="E-mail"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              editable={!busy}
            />

            {error ? (
              <Text style={styles.erro} accessibilityRole="alert">
                {error}
              </Text>
            ) : null}

            <Button
              titulo={busy ? "Enviando..." : "Enviar código"}
              variante="terciario"
              onPress={enviar}
              disabled={busy}
            />

            <Button
              titulo="Cancelar"
              variante="outline"
              disabled={busy}
              onPress={() => router.dismissTo("/conta/seguranca")}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}