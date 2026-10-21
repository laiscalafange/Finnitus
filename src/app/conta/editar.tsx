import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { useRouter } from "expo-router";

import { HeaderInterno } from "../../shared/components/Header";
import { BackgroundGradient } from "@/shared/components/backgroundGradient";
import { Input } from "../../shared/components/Input";
import { Button } from "../../shared/components/Button";

import { useAuth } from "../../features/authContext";
import { authService } from "../../services/auth";
import { useAction } from "../../shared/hooks/useAction";

import {
  normalizePhone,
  validateProfile,
} from "../../shared/utils/formValidation";

import { styles } from "../../styles/editarConta";

// Tela "Editar conta".
// Ela também é usada como "Complete seu perfil": o app/index.jsx manda pra cá
// quem ainda não completou o cadastro (user.profileComplete === false).
export default function Editar() {
  const router = useRouter();

  const {
    user,
    updateUser,
    logout,
  } = useAuth();

  // true = edição normal (vindo do Perfil) | false = primeiro preenchimento
  const perfilCompleto = Boolean(user?.profileComplete);

  // Campos do formulário, já começam preenchidos com os dados do usuário
  const [name, setName] = useState(
    user?.name ?? ""
  );

  const [phone, setPhone] = useState(
    user?.telefone ?? ""
  );

  // A API devolve a data completa; aqui fica só AAAA-MM-DD (10 primeiros caracteres)
  const [birth, setBirth] = useState(
    user?.data_nasc?.slice(0, 10) ?? ""
  );

  // busy = salvando | error = mensagem de erro | run = executa a ação com trava
  const {
    busy,
    error,
    run,
  } = useAction();

  function save() {
    void run(async () => {
      const telefone = normalizePhone(phone);

      // Lança um erro com mensagem amigável se algum campo for inválido
      validateProfile(
        name,
        telefone,
        birth
      );

      const updated = await authService.update({
        name: name.trim(),
        telefone,
        data_nasc: birth,
      });

      updateUser(updated);

      // Edição normal volta pro Perfil; primeiro preenchimento segue pro onboarding
      if (perfilCompleto) {
        router.dismissTo("/perfil");
      } else {
        router.replace("/onboarding/BemVindo");
      }
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
          {/* Cabeçalho: sem coroa e sem sino, igual ao protótipo.
              No primeiro preenchimento a seta de voltar some, pra pessoa
              não pular o cadastro do perfil */}
          <HeaderInterno
            titulo={
              perfilCompleto
                ? "Editar conta"
                : "Complete seu perfil"
            }
            mostrarVoltar={perfilCompleto}
          />

          {/* Formulário (logo abaixo do cabeçalho) */}
          <View style={styles.formulario}>
            <Input
              label="Nome"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              editable={!busy}
            />

            {/* E-mail só para consulta: a API (PATCH /me) não aceita alterar o e-mail */}
            <Input
              label="E-mail"
              value={user?.email ?? ""}
              keyboardType="email-address"
              editable={false}
            />

            <Input
              label="Telefone"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              editable={!busy}
            />

            {/* Data de nascimento no formato que a validação e a API esperam */}
            <Input
              label="Data de nascimento (AAAA-MM-DD)"
              placeholder="AAAA-MM-DD"
              value={birth}
              onChangeText={setBirth}
              maxLength={10}
              editable={!busy}
            />

            {/* Mensagem de erro (validação ou falha na API) */}
            {error ? (
              <Text
                style={styles.erro}
                accessibilityRole="alert"
              >
                {error}
              </Text>
            ) : null}

            <Button
              titulo={
                busy
                  ? "Salvando..."
                  : "Salvar alterações"
              }
              onPress={save}
              disabled={busy}
            />

            {/* Só no primeiro preenchimento: é a única saída da tela
                (no fluxo normal o "Sair da conta" fica no Perfil) */}
            {!perfilCompleto ? (
              <Button
                titulo="Sair da conta"
                variante="outline"
                onPress={() => void run(logout)}
                disabled={busy}
              />
            ) : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}