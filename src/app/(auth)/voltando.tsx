import { View, Text, Image, ScrollView } from "react-native";

import { useRouter } from "expo-router";

import { BackgroundGradient } from "../../shared/components/backgroundGradient";
import { Button } from "../../shared/components/Button";
import { BotaoVoltarAuth } from "../../shared/components/BotaoVoltar";

import { styles } from "../../styles/voltandoStyles";

import { useAuth } from "../../features/authContext";
import { googleIdToken } from "../../services/google";
import { useAction } from "../../shared/hooks/useAction";

// Limite do aumento de fonte do sistema (evita o texto estourar a tela)
const LIMITE_FONTE = 1.1;

export default function Voltando() {
  const roteador = useRouter();

  const { googleLogin } = useAuth();
  const { busy, error, run } = useAction();

  function entrarGoogle() {
    void run(async () => {
      const token = await googleIdToken();

      if (token) {
        await googleLogin(token);
      }
    });
  }

  return (
    <View style={{ flex: 1 }}>
      <BackgroundGradient />

      <BotaoVoltarAuth absoluto />

      {/* O texto rola se não couber; os botões ficam sempre livres embaixo */}
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
            style={{
              color: "#ffacb8",
              marginBottom: 12,
            }}
          >
            {error}
          </Text>
        ) : null}

        <Button
          variante="primario"
          titulo="Email"
          disabled={busy}
          onPress={() => roteador.push("/login")}
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
          disabled={busy}
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