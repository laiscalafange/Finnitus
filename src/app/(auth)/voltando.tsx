import { useState } from "react";
import { AceiteCadastroGoogle } from "../../shared/components/AceiteCadastroGoogle";
import { View, Text, Image, ScrollView } from "react-native";

import { useRouter } from "expo-router";

import { AuthBackground } from "../../shared/components/AuthBackground";
import { Button } from "../../shared/components/Button";
import { BotaoVoltarAuth } from "../../shared/components/BotaoVoltar";

import { styles } from "../../styles/voltandoStyles";

import { useAuth } from "../../features/authContext";
import { googleIdToken } from "../../services/google";

// Mantém as fontes e os estilos da tela original.
const LIMITE_FONTE = 1.1;

export default function Voltando() {
  const roteador = useRouter();

  const { googleLogin } = useAuth();
  const [aceiteGoogle, setAceiteGoogle] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const podeContinuar = aceiteGoogle && !busy;

  async function run(action: () => Promise<void>) {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await action();
    } catch (erro) {
      setError(
        erro instanceof Error ? erro.message : "Ocorreu um erro. Tente novamente."
      );
    } finally {
      setBusy(false);
    }
  }

  function continuarEmail() {
    if (!podeContinuar) return;
    roteador.push("/login");
  }

  function entrarGoogle() {
    if (!podeContinuar) return;
    void run(async () => {
      if (!aceiteGoogle) {
        throw new Error(
          "Confirme sua maioridade e a leitura dos documentos legais para continuar."
        );
      }
      const token = await googleIdToken();
      if (token) {
        await googleLogin(token, aceiteGoogle);
      }
    });
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#09090B" }}>
      <AuthBackground />

      <BotaoVoltarAuth absoluto />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title} maxFontSizeMultiplier={LIMITE_FONTE}>
          Seja{" "}
          <Text style={styles.title2} maxFontSizeMultiplier={LIMITE_FONTE}>
            bem-
          </Text>
        </Text>
        <Text style={styles.title2} maxFontSizeMultiplier={LIMITE_FONTE}>
          vindo{" "}
          <Text style={styles.title} maxFontSizeMultiplier={LIMITE_FONTE}>
            de volta!
          </Text>
        </Text>
        <Text style={styles.subtitle} maxFontSizeMultiplier={LIMITE_FONTE}>
          Continue com o email ou outros serviços.
        </Text>
      </ScrollView>

      <View style={styles.conteiner}>
        {error ? (
          <Text
            accessibilityRole="alert"
            style={{ color: "#ffacb8", marginBottom: 12 }}
          >
            {error}
          </Text>
        ) : null}

        <AceiteCadastroGoogle
          aceito={aceiteGoogle}
          onChange={(marcado) => {
            setAceiteGoogle(marcado);
            setError(null);
          }}
          disabled={busy}
        />

        <Button
          variante="primario"
          titulo="Email"
          disabled={!podeContinuar}
          onPress={continuarEmail}
          icone={
            <Image
              source={require("../../../assets/icones/email2.png")}
              style={{
                width: 20,
                height: 20,
                marginRight: 8,
                resizeMode: "contain",
              }}
            />
          }
        />

        <Button
          variante="outline"
          titulo={busy ? "Aguarde..." : "Google"}
          onPress={entrarGoogle}
          disabled={!podeContinuar}
          icone={
            <Image
              source={require("../../../assets/icones/google.png")}
              style={{
                width: 20,
                height: 20,
                marginRight: 8,
                resizeMode: "contain",
              }}
            />
          }
        />
      </View>
    </View>
  );
}
