import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { Redirect } from "expo-router";


import { HeaderInterno } from "../../shared/components/Header";
import { BackgroundGradient } from "@/shared/components/backgroundGradient";
import { Input } from "../../shared/components/Input";
import { Button } from "../../shared/components/Button";

import { authService } from "../../services/auth";
import { useAuth } from "../../features/authContext";
import { useAction } from "../../shared/hooks/useAction";
import { validatePassword } from "../../shared/utils/formValidation";

import { styles } from "../../styles/redefinirSenha";

export default function RedefinirSenha() {
  const { resetToken, clearSession, senhaRedefinida } = useAuth();

  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");

  const { busy, error, run } = useAction();

  if (senhaRedefinida) {
    return null;
  }

  if (!resetToken) {
    return <Redirect href="/conta/trocarSenhaEmail" />;
  }

  const token = resetToken;
  function salvar() {
    void run(async () => {
      validatePassword(senha, confirmacao);

      await authService.reset(token, senha);
      await clearSession({ senhaRedefinida: true });
    });
  }

  return (
    <View style={styles.container}>
      <BackgroundGradient variante="funcional" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.conteudo}
        >
          <HeaderInterno titulo="Redefinir senha" />

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
    </View>
  );
}
