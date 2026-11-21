import { useState } from "react";
import { useIdioma } from "@/features/idioma";
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
  mascararTelefone,
  normalizePhone,
  validateProfile,
} from "../../shared/utils/formValidation";
import {
  dataValida,
  mascararData,
} from "../../features/menuMais/utils";

import { styles } from "../../styles/editarConta";

// A API trabalha com AAAA-MM-DD; na tela a data aparece como DD/MM/AAAA
function isoParaBr(iso: string) {
  const partes = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);

  return partes ? `${partes[3]}/${partes[2]}/${partes[1]}` : "";
}

function brParaIso(br: string) {
  const [dia, mes, ano] = br.split("/");

  return `${ano}-${mes}-${dia}`;
}

// Tela "Editar conta".
// Ela também é usada como "Complete seu perfil": o app/index.jsx manda pra cá
// quem ainda não completou o cadastro (user.profileComplete === false).
export default function Editar() {
  const { t } = useIdioma();
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
    mascararTelefone(user?.telefone ?? "")
  );

  // A API devolve a data como AAAA-MM-DD; na tela mostramos DD/MM/AAAA
  const [birth, setBirth] = useState(
    isoParaBr(user?.data_nasc ?? "")
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
      // Data inválida vira "" e a validação mostra a mensagem de data
      const dataIso = dataValida(birth) ? brParaIso(birth) : "";

      validateProfile(
        name,
        telefone,
        dataIso
      );

      const updated = await authService.update({
        name: name.trim(),
        telefone,
        data_nasc: dataIso,
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
            titulo={t(perfilCompleto ? "Editar conta" : "Complete seu perfil")}
            mostrarVoltar={perfilCompleto}
          />

          {/* Formulário (logo abaixo do cabeçalho) */}
          <View style={styles.formulario}>
            <Input
              label={t("Nome")}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              editable={!busy}
            />

            {/* E-mail só para consulta: a API (PATCH /me) não aceita alterar o e-mail */}
            <Input
              label={t("E-mail")}
              value={user?.email ?? ""}
              keyboardType="email-address"
              editable={false}
            />

            <Input
              label={t("Telefone")}
              value={phone}
              onChangeText={(texto) => setPhone(mascararTelefone(texto))}
              placeholder="(00) 00000-0000"
              maxLength={15}
              keyboardType="phone-pad"
              editable={!busy}
            />

            {/* Data no formato brasileiro: as barras entram sozinhas enquanto digita */}
            <Input
              label={t("Data de nascimento")}
              placeholder="DD/MM/AAAA"
              value={birth}
              onChangeText={(texto) => setBirth(mascararData(texto))}
              keyboardType="numeric"
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
              titulo={t(busy ? "Salvando..." : "Salvar alterações")}
              onPress={save}
              disabled={busy}
            />

            {/* Só no primeiro preenchimento: é a única saída da tela
                (no fluxo normal o "Sair da conta" fica no Perfil) */}
            {!perfilCompleto ? (
              <Button
                titulo={t("Sair da conta")}
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
