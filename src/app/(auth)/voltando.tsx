import {
  View,
  Text,
  Image,
} from "react-native";

import { useRouter } from "expo-router";

import { BackgroundGradient } from "../../shared/components/backgroundGradient";
import { Button } from "../../shared/components/Button";
import { BotaoVoltarAuth } from "../../shared/components/BotaoVoltar";

import { styles } from "../../styles/voltandoStyles";

import { useAuth } from "../../features/authContext";
import { googleIdToken } from "../../services/google";
import { useAction } from "../../shared/hooks/useAction";

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

      <View style={styles.content}>
        <Text style={styles.title}>
          Seja{" "}
          <Text style={styles.title2}>
            bem-
          </Text>
        </Text>

        <Text style={styles.title2}>
          vindo{" "}
          <Text style={styles.title}>
            de volta!
          </Text>
        </Text>

        <Text style={styles.subtitle}>
          Continue com o email ou outros serviços.
        </Text>
      </View>

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
              source={require(
                "../../../assets/icones/email2.png"
              )}
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
              source={require(
                "../../../assets/icones/google.png"
              )}
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