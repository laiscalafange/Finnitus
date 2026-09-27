import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import {
  Redirect,
  useRouter,
} from "expo-router";

import { LinearGradient } from "expo-linear-gradient";

import { HeaderInterno } from "../../shared/components/Header";
import { Input } from "../../shared/components/Input";
import { Button } from "../../shared/components/Button";

import { authService } from "../../services/auth";
import { useAuth } from "../../features/authContext";
import { useAction } from "../../shared/hooks/useAction";
import { validatePassword } from "../../shared/utils/formValidation";

import { styles } from "../../styles/redefinirSenha";

// 3ª e última etapa de "Trocar senha": define a nova senha usando o
// token de reset ganho na etapa do código. Ao terminar, volta pra
// Segurança — a sessão atual continua logada, não precisa passar
// pelo login de novo.
export default function RedefinirSenha() {
  const router = useRouter();

  const { resetToken, clearRecovery } = useAuth();

  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");

  const { busy, error, run } = useAction();

  if (!resetToken) {
    return <Redirect href="/conta/trocarSenhaEmail" />;
  }

  function salvar() {
    void run(async () => {
      validatePassword(senha, confirmacao);

      await authService.reset(resetToken as string, senha);

      clearRecovery();

      router.dismissTo("/conta/seguranca");
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
            titulo="Redefinir senha"
            subtitulo="Segurança"
            mostrarPremium={false}
            mostrarNotificacao={false}
          />

          <View style={styles.formulario}>
            <Input
              label="Nova senha"
              placeholder="Mín. 8 caracteres"
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
              editable={!busy}
            />

            <Input
              label="Confirmar nova senha"
              placeholder="Repita a nova senha"
              secureTextEntry
              value={confirmacao}
              onChangeText={setConfirmacao}
              editable={!busy}
            />

            {error ? (
              <Text style={styles.erro} accessibilityRole="alert">
                {error}
              </Text>
            ) : null}

            <Button
              titulo={busy ? "Salvando..." : "Salvar nova senha"}
              variante="terciario"
              onPress={salvar}
              disabled={busy}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}