import { useState } from "react";
import { AceiteCadastroGoogle } from "../../shared/components/AceiteCadastroGoogle";
import { View, Text, Image, ScrollView } from "react-native";

import { useRouter } from "expo-router";

import { AuthBackground } from "../../shared/components/AuthBackground";
import { Button } from "../../shared/components/Button";
import { BotaoVoltarAuth } from "../../shared/components/BotaoVoltar";
import { Underline } from "../../shared/components/underline";
import { styles } from "../../styles/escolhaStyles";

import { useAuth } from "../../features/authContext";
import { googleIdToken } from "../../services/google";
import { useAuthAction } from "../../shared/hooks/useAuthAction";

// Mantido o mesmo limite de fonte do arquivo original.
const LIMITE_FONTE = 1.1;

export default function Escolha() {
  const roteador = useRouter();

  const { googleLogin } = useAuth();
  const [confirmouRequisitos, setConfirmouRequisitos] = useState(false);
  const { busy, error, run, clearError } = useAuthAction();

  function continuarEmail() {
    void run(async () => {
      if (!confirmouRequisitos) {
        throw new Error(
          "Confirme sua maioridade e a leitura dos documentos legais para continuar."
        );
      }
      roteador.push("/cadastro");
    });
  }

  function entrarGoogle() {
    void run(async () => {
      // Exige confirmação antes de iniciar a autenticação Google.
      if (!confirmouRequisitos) {
        throw new Error(
          "Para criar conta pelo Google, confirme sua maioridade e a leitura dos documentos legais."
        );
      }

      const token = await googleIdToken();

      if (token) {
        await googleLogin(token, confirmouRequisitos);
      }
    });
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#09090B" }}>
      <AuthBackground />

      <BotaoVoltarAuth absoluto />

      {/* Layout, tipografia e underline ORIGINAIS preservados. */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.linha}>
          <View>
            <Text style={styles.title2} maxFontSizeMultiplier={LIMITE_FONTE}>
              Escolha
            </Text>
            <Underline width={106} marginLeft={9} />
          </View>
        </View>
        <Text style={styles.title} maxFontSizeMultiplier={LIMITE_FONTE}>
          uma opção
        </Text>
        <Text style={styles.title} maxFontSizeMultiplier={LIMITE_FONTE}>
          para continuar
        </Text>
        <Text style={styles.subtitle} maxFontSizeMultiplier={LIMITE_FONTE}>
          Continue com o email ou outros serviços.
        </Text>
      </ScrollView>

      {/* Somente espaçamento interno reduzido. */}
      <View
        style={[
          styles.conteiner,
          { gap: 9, paddingTop: 8, paddingBottom: 14 },
        ]}
      >
        {error ? (
          <Text
            accessibilityRole="alert"
            style={{
              color: "#ffacb8",
              marginBottom: 6,
            }}
          >
            {error}
          </Text>
        ) : null}

        <AceiteCadastroGoogle
          aceito={confirmouRequisitos}
          onChange={(marcado) => {
            setConfirmouRequisitos(marcado);
            clearError();
          }}
          disabled={busy}
        />

        <Button
          variante="primario"
          titulo="Email"
          disabled={busy || !confirmouRequisitos}
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
          disabled={busy || !confirmouRequisitos}
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
